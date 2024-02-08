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
type ActionResponse = {
  error: string | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Login'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
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
          throw new Error('Please provide both an email and a password.');
        }
        switch (formName) {
          case FormNames.LOGIN_FORM:
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

        return redirect('/account', {
          headers: {
            'Set-Cookie': await session.commit(),
          },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          return json({error: error.message}, {status: 400});
        }
        return json({error}, {status: 400});
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
          throw new Error('Passwords do not match');
        }

        if (!validInputs) {
          throw new Error('Please provide both an email and a password.');
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
          throw new Error('Could not create customer');
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
              Location: '/account',
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

  return (
    <div className="contaier">
      <div className="register">
        <h2>Реєстрація</h2>
        <Form method="POST">
          <fieldset>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              aria-label="Email address"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              required
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
          <Button name="formName" value={FormNames.REGISTER_FORM}>
            Зареєструватись
          </Button>
        </Form>
      </div>
      <div className="login">
        <h2>Вхід для зарежстрованих користувачів</h2>
        <Form method="POST">
          <fieldset>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              aria-label="Email address"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              minLength={8}
              required
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
          <Button name="formName" value={FormNames.LOGIN_FORM}>
            Ввійти до особистого кабінету
          </Button>
        </Form>
      </div>

      <br />
      <div>
        <p>
          <Link to="/account/recover">Forgot password →</Link>
        </p>
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
