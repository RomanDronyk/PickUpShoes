import type {CustomerFragment} from 'storefrontapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';
import {Button} from '~/components/ui/button';
import {Input} from '~/components/ui/input';

enum FormNames {
  INFO_FORM = 'infoForm',
  PASS_FROM = 'passForm',
}

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'PUT') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();
  const formName = form.get('formName');
  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken) {
    return json({error: 'Unauthorized'}, {status: 401});
  }

  try {
    const password = getPassword(form);
    const customer: CustomerUpdateInput = {};
    const validInputKeys = [
      'firstName',
      'lastName',
      'email',
      'password',
      'phone',
    ] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (key === 'acceptsMarketing') {
        customer.acceptsMarketing = value === 'on';
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    if (password && FormNames.PASS_FROM) {
      customer.password = password;
    }

    // update customer and possibly password
    const updated = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        customer,
      },
    });

    // check for mutation errors
    if (updated.customerUpdate?.customerUserErrors?.length) {
      return json(
        {error: updated.customerUpdate?.customerUserErrors[0]},
        {status: 400},
      );
    }

    // update session with the updated access token
    if (updated.customerUpdate?.customerAccessToken?.accessToken) {
      session.set(
        'customerAccessToken',
        updated.customerUpdate?.customerAccessToken,
      );
    }

    return json(
      {error: null, customer: updated.customerUpdate?.customer},
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  } catch (error: any) {
    return json({error: error.message, customer: null}, {status: 400});
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="contaier grid md:grid-cols-2 grid-cols-1 gap-y-10 gap-x-10 my-10 w-full">
      <div className="account-profile rounded-[20px] border border-black/10 p-6">
        <h2 className="md:text-[32px] text-xl font-medium mb-[25px]">
          Особиста інформація
        </h2>
        <Form method="PUT">
          <fieldset>
            <label
              className="md:text-xl text-lg pl-5 md:mb-[10px] mb-1 inline-flex"
              htmlFor="firstName"
            >
              Ім`я
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Ім`я"
              aria-label="Ім`я"
              defaultValue={customer.firstName ?? ''}
              minLength={2}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mb-[25px]"
            />
            <label
              className="md:text-xl text-lg pl-5 md:mb-[10px] mb-1 inline-flex"
              htmlFor="lastName"
            >
              Прізвище
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Прізвище"
              aria-label="Прізвище"
              defaultValue={customer.lastName ?? ''}
              minLength={2}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mb-[25px]"
            />
            <label
              className="md:text-xl text-lg pl-5 md:mb-[10px] mb-1 inline-flex"
              htmlFor="phone"
            >
              Мобільний телефон
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+38(000)00-00-000"
              aria-label="Mobile"
              defaultValue={customer.phone ?? ''}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mb-[25px]"
            />
            <label
              className="text-lg md:text-xl pl-5 md:mb-[10px] mb-1 inline-flex"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              aria-label="Email"
              defaultValue={customer.email ?? ''}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mb-[25px]"
            />
            <div className="account-profile-marketing flex justify-start items-center gap-3">
              <Input
                id="acceptsMarketing"
                name="acceptsMarketing"
                type="checkbox"
                aria-label="Accept marketing"
                defaultChecked={customer.acceptsMarketing}
                className="w-5"
              />
              <label htmlFor="acceptsMarketing">
                Підписка на email розсилку
              </label>
            </div>
          </fieldset>

          {action?.error ? (
            <p>
              <mark>
                <small>{action.error}</small>
              </mark>
            </p>
          ) : (
            <br />
          )}
          <Button
            name="formName"
            value={FormNames.INFO_FORM}
            disabled={state !== 'idle'}
            className="flex items-center justify-center gap-5 py-[14px] font-medium md:text-xl text-base w-full rounded-[36px] [&>svg]:w-[19px] md:[&>svg]:w-auto"
          >
            {state !== 'idle' ? 'Оновлення' : 'Підтвердити зміни'}

            <svg
              width="26"
              height="25"
              viewBox="0 0 26 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 22.9167C18.7531 22.9167 23.4167 18.2532 23.4167 12.5C23.4167 6.74692 18.7531 2.08337 13 2.08337C7.24689 2.08337 2.58334 6.74692 2.58334 12.5C2.58334 18.2532 7.24689 22.9167 13 22.9167ZM18.5948 9.20317C18.6435 9.15296 18.6817 9.09346 18.7069 9.0282C18.7321 8.96294 18.7439 8.89327 18.7416 8.82335C18.7394 8.75342 18.723 8.68467 18.6936 8.62121C18.6641 8.55774 18.6222 8.50085 18.5703 8.45395C18.5184 8.40704 18.4575 8.37108 18.3914 8.3482C18.3253 8.32532 18.2552 8.31599 18.1854 8.32078C18.1156 8.32557 18.0475 8.34437 17.9851 8.37607C17.9228 8.40776 17.8674 8.45169 17.8224 8.50525L11.5833 15.3995L8.15105 12.123C8.05118 12.0275 7.91748 11.9756 7.77937 11.9788C7.64126 11.9819 7.51004 12.0398 7.41459 12.1396C7.31914 12.2395 7.26728 12.3732 7.2704 12.5113C7.27353 12.6494 7.33139 12.7806 7.43126 12.8761L11.2511 16.5219L11.638 16.8917L11.9969 16.4948L18.5948 9.20317Z"
                fill="white"
              />
            </svg>
          </Button>
        </Form>
      </div>
      <div className="account-password rounded-[20px] border border-black/10 p-6">
        <h2 className="md:text-[32px] text-xl  font-medium ">Зміна паролю</h2>

        <span className="mb-[25px] inline-flex">
          Паролі мають бути не менше 8 символів.
        </span>
        <Form method="PUT">
          <fieldset>
            <label
              className="text-lg md:text-xl pl-5 md:mb-[10px] mb-1 inline-flex"
              htmlFor="currentPassword"
            >
              Поточний пароль
            </label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="********"
              aria-label="Current password"
              minLength={8}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mb-[25px]"
            />

            <label
              className="text-lg md:text-xl pl-5 md:mb-[10px] mb-1 inline-flex"
              htmlFor="newPassword"
            >
              Новий пароль
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Введіть новий пароль"
              aria-label="New password"
              minLength={8}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mb-[25px]"
            />

            <label
              className="text-lg md:text-xl pl-5 md:mb-[10px] mb-1 inline-flex"
              htmlFor="newPasswordConfirm"
            >
              Повторіть новий пароль
            </label>
            <Input
              id="newPasswordConfirm"
              name="newPasswordConfirm"
              type="password"
              placeholder="Введіть новий пароль"
              aria-label="New password confirm"
              minLength={8}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mb-[25px]"
            />
          </fieldset>
          <Button
            name="formName"
            value={FormNames.PASS_FROM}
            disabled={state !== 'idle'}
            className="flex items-center justify-center gap-5 mt-51 py-[14px] font-medium md:text-xl text-base w-full rounded-[36px] [&>svg]:w-[19px] md:[&>svg]:w-auto"
          >
            {state !== 'idle' ? 'Оновлення' : 'Підтвердити зміни'}

            <svg
              width="26"
              height="25"
              viewBox="0 0 26 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 22.9167C18.7531 22.9167 23.4167 18.2532 23.4167 12.5C23.4167 6.74692 18.7531 2.08337 13 2.08337C7.24689 2.08337 2.58334 6.74692 2.58334 12.5C2.58334 18.2532 7.24689 22.9167 13 22.9167ZM18.5948 9.20317C18.6435 9.15296 18.6817 9.09346 18.7069 9.0282C18.7321 8.96294 18.7439 8.89327 18.7416 8.82335C18.7394 8.75342 18.723 8.68467 18.6936 8.62121C18.6641 8.55774 18.6222 8.50085 18.5703 8.45395C18.5184 8.40704 18.4575 8.37108 18.3914 8.3482C18.3253 8.32532 18.2552 8.31599 18.1854 8.32078C18.1156 8.32557 18.0475 8.34437 17.9851 8.37607C17.9228 8.40776 17.8674 8.45169 17.8224 8.50525L11.5833 15.3995L8.15105 12.123C8.05118 12.0275 7.91748 11.9756 7.77937 11.9788C7.64126 11.9819 7.51004 12.0398 7.41459 12.1396C7.31914 12.2395 7.26728 12.3732 7.2704 12.5113C7.27353 12.6494 7.33139 12.7806 7.43126 12.8761L11.2511 16.5219L11.638 16.8917L11.9969 16.4948L18.5948 9.20317Z"
                fill="white"
              />
            </svg>
          </Button>
        </Form>
      </div>
    </div>
  );
}

function getPassword(form: FormData): string | undefined {
  let password;
  const currentPassword = form.get('currentPassword');
  const newPassword = form.get('newPassword');
  const newPasswordConfirm = form.get('newPasswordConfirm');

  let passwordError;
  if (newPassword && !currentPassword) {
    passwordError = new Error('Поточний пароль обов`язковий.');
  }

  if (newPassword && newPassword !== newPasswordConfirm) {
    passwordError = new Error('Не вірн овведено новий пароль.');
  }

  if (newPassword && currentPassword && newPassword === currentPassword) {
    passwordError = new Error('Новий пароль має відрізнятись від старого.');
  }

  if (passwordError) {
    throw passwordError;
  }

  if (currentPassword && newPassword) {
    password = newPassword;
  } else {
    password = currentPassword;
  }

  return String(password);
}

const CUSTOMER_UPDATE_MUTATION = `#graphql
  # https://shopify.dev/docs/api/storefront/latest/mutations/customerUpdate
  mutation customerUpdate(
    $customerAccessToken: String!,
    $customer: CustomerUpdateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        acceptsMarketing
        email
        firstName
        id
        lastName
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
