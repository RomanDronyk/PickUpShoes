import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData, type MetaFunction} from '@remix-run/react';
import {Input} from '~/components/ui/input';
import {Button} from '~/components/ui/button';

enum FormNames {
  LOGIN_FORM = 'loginForm',
  REGISTER_FORM = 'registerForm',
}
export const handle = {
  breadcrumbType: 'login',
};
type ActionResponse = {
  error: string | null;
  loginError: string | null;
};

export const meta: MetaFunction = () => {
  return [
    {title: 'Особистий кабінет'},
    {
      name: 'description',
      content: 'Сторінка входу та реєстрації',
    },
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account/profile');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }
  const form = await request.formData();
  const formName = form.get('formName');
  switch (formName) {
    case FormNames.LOGIN_FORM: {
      try {
        const email = String(form.has('email') ? form.get('email') : '');
        const password = String(
          form.has('password') ? form.get('password') : '',
        );
        const validInputs = Boolean(email && password);

        if (!validInputs) {
          throw new Error('Будь ласка введіть email та пароль.');
        }

        const {customerAccessTokenCreate} = await storefront.mutate(
          LOGIN_MUTATION,
          {
            variables: {
              input: {email, password},
            },
          },
        );

        if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
          throw new Error(
            customerAccessTokenCreate?.customerUserErrors[0].message,
          );
        }

        const {customerAccessToken} = customerAccessTokenCreate;
        session.set('customerAccessToken', customerAccessToken);

        return redirect('/account/profile', {
          headers: {
            'Set-Cookie': await session.commit(),
          },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          return json({loginError: error.message}, {status: 400});
        }
        return json({loginError: error}, {status: 400});
      }
    }
    case FormNames.REGISTER_FORM: {
      const email = String(form.has('email') ? form.get('email') : '');
      const password = form.has('password')
        ? String(form.get('password'))
        : null;
      const passwordConfirm = form.has('passwordConfirm')
        ? String(form.get('passwordConfirm'))
        : null;

      const validPasswords =
        password && passwordConfirm && password === passwordConfirm;

      const validInputs = Boolean(email && password);
      try {
        if (!validPasswords) {
          throw new Error('Паролі не співпадають');
        }

        if (!validInputs) {
          throw new Error('Будь ласка введіть email та пароль.');
        }

        const {customerCreate} = await storefront.mutate(
          CUSTOMER_CREATE_MUTATION,
          {
            variables: {
              input: {email, password},
            },
          },
        );

        if (customerCreate?.customerUserErrors?.length) {
          throw new Error(customerCreate?.customerUserErrors[0].message);
        }

        const newCustomer = customerCreate?.customer;
        if (!newCustomer?.id) {
          throw new Error('Не можилво створити користувача');
        }

        // get an access token for the new customer
        const {customerAccessTokenCreate} = await storefront.mutate(
          REGISTER_LOGIN_MUTATION,
          {
            variables: {
              input: {
                email,
                password,
              },
            },
          },
        );

        if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
          throw new Error('Missing access token');
        }
        session.set(
          'customerAccessToken',
          customerAccessTokenCreate?.customerAccessToken,
        );

        return json(
          {error: null, newCustomer},
          {
            status: 302,
            headers: {
              'Set-Cookie': await session.commit(),
              Location: '/account/profile',
            },
          },
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          return json({error: error.message}, {status: 400});
        }
        return json({error}, {status: 400});
      }
    }
  }
}

export default function Login() {
  const data = useActionData<ActionResponse>();
  const error = data?.error || null;
  const loginError = data?.loginError || null;
  return (
    <div className="contaier grid lg:grid-cols-2 grid-cols-1 gap-y-10 gap-x-10 sm:px-24 px-[10px] my-10 w-full">
      <div className="register rounded-[20px] border border-black/10 p-6 ">
        <h2 className="xl:text-[32px] text-[24px] md:text-left text-center  font-medium mb-[25px]">
          Реєстрація
        </h2>
        <Form method="POST">
          <fieldset className="flex flex-col gap-[10px]">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              aria-label="Email address"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              required
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px]"
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Пароль"
              aria-label="Password"
              minLength={8}
              required
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px]"
            />
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autoComplete="current-password"
              placeholder="Підтвердити пароль"
              aria-label="Re-enter password"
              minLength={8}
              required
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px]"
            />
          </fieldset>
          {error ? (
            <p>
              <mark>
                <small>{error}</small>
              </mark>
            </p>
          ) : (
            <br />
          )}
          <Button
            name="formName"
            value={FormNames.REGISTER_FORM}
            className="flex items-center justify-center gap-5 py-[14px] font-medium sm:text-xl text-lg w-full rounded-[36px]"
          >
            Зареєструватись
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.5 22.9166C18.2532 22.9166 22.9167 18.2531 22.9167 12.5C22.9167 6.74686 18.2532 2.08331 12.5 2.08331C6.74692 2.08331 2.08337 6.74686 2.08337 12.5C2.08337 18.2531 6.74692 22.9166 12.5 22.9166ZM18.0948 9.20311C18.1436 9.1529 18.1817 9.0934 18.2069 9.02814C18.2321 8.96288 18.244 8.89321 18.2417 8.82329C18.2394 8.75336 18.223 8.68461 18.1936 8.62114C18.1641 8.55768 18.1222 8.50079 18.0703 8.45389C18.0184 8.40698 17.9576 8.37102 17.8914 8.34814C17.8253 8.32526 17.7553 8.31593 17.6855 8.32072C17.6157 8.32551 17.5476 8.34431 17.4852 8.376C17.4228 8.4077 17.3675 8.45163 17.3224 8.50519L11.0834 15.3995L7.65108 12.1229C7.55121 12.0274 7.41751 11.9756 7.2794 11.9787C7.14129 11.9818 7.01007 12.0397 6.91462 12.1396C6.81917 12.2394 6.76731 12.3731 6.77043 12.5112C6.77356 12.6494 6.83142 12.7806 6.93129 12.876L10.7511 16.5219L11.1381 16.8916L11.4969 16.4948L18.0948 9.20311Z"
                fill="white"
              />
            </svg>
          </Button>
        </Form>
      </div>
      <div className="login rounded-[20px] border border-black/10 p-6 ">
        <h2 className="font-medium xl:text-[32px] text-[24px] mb-[25px] md:text-left text-center">
          Вхід для зареєстрованих користувачів
        </h2>
        <Form method="POST">
          <fieldset className="flex flex-col gap-[10px]">
            <Input
              id="enter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              aria-label="Email address"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              error={loginError ? true : false}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px]"
            />
            <Input
              id="enter-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Пароль"
              aria-label="Password"
              minLength={8}
              required
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px]"
              error={loginError ? true : false}
            />
          </fieldset>
          {loginError ? (
            <p className="inline-flex mt-4">
              <small>Невірні ім`я користувача або пароль </small>
            </p>
          ) : (
            ''
          )}
          <div className="mt-3">
            <p>
              <Link to="/account/recover" className="underline">
                Втратили свій пароль ?
              </Link>
            </p>
          </div>
          <Button
            name="formName"
            value={FormNames.LOGIN_FORM}
            className="flex items-center justify-center gap-5 py-[14px] font-medium xl:text-xl sm:text-lg text-base w-full rounded-[36px] mt-6"
          >
            Ввійти до особистого кабінету
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="23" height="23" rx="11.5" fill="white" />
              <path
                d="M11.5 10C12.6046 10 13.5 9.10457 13.5 8C13.5 6.89543 12.6046 6 11.5 6C10.3954 6 9.5 6.89543 9.5 8C9.5 9.10457 10.3954 10 11.5 10Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.5 17V15.6667C15.5 14.9594 15.2752 14.2811 14.8752 13.781C14.4751 13.281 13.9325 13 13.3667 13H9.63333C9.06754 13 8.52492 13.281 8.12484 13.781C7.72476 14.2811 7.5 14.9594 7.5 15.6667V17"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </Form>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerCreate
const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate(
    $input: CustomerCreateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate

const REGISTER_LOGIN_MUTATION = `#graphql
  mutation registerLogin(
    $input: CustomerAccessTokenCreateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;
