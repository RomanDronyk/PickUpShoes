import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData} from '@remix-run/react';
import {Input} from '~/components/ui/input';
import {Button} from '~/components/ui/button';

type ActionResponse = {
  error?: string;
  resetRequested?: boolean;
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/account');
  }

  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const form = await request.formData();
  const email = form.has('email') ? String(form.get('email')) : null;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    if (!email) {
      throw new Error('Please provide an email.');
    }
    await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error: unknown) {
    const resetRequested = false;
    if (error instanceof Error) {
      return json({error: error.message, resetRequested}, {status: 400});
    }
    return json({error, resetRequested}, {status: 400});
  }
}

export default function Recover() {
  const action = useActionData<ActionResponse>();

  return (
    <div className="account-recover flex items-center justify-center self-stretch flex-col w-full">
      <div className="w-2/4 rounded-[20px] border border-black/10 p-6">
        {action?.resetRequested ? (
          <>
            <h1 className="font-medium text-[32px]">Запит на відновлення</h1>
            <p className="text-lg">
              Якщо ця електронна адреса є в нашій системі, ви отримаєте
              електронний лист з інструкціями щодо скидання пароля за кілька
              хвилин.
            </p>
            <br />
            <Link to="/account/login">Назад на сторінку входу</Link>
          </>
        ) : (
          <>
            <h1 className="font-medium text-[32px]">Забули пароль?</h1>
            <p className="text-lg">
              Введіть поштову адресу вашого облікового запису щоб отримати
              посилання для відновлення паролю.
            </p>
            <br />
            <Form method="POST">
              <fieldset>
                <Input
                  aria-label="Email address"
                  autoComplete="email"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  type="email"
                  className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px]"
                />
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
              <Button className="flex items-center justify-center gap-5 py-[14px] font-medium text-xl w-full rounded-[36px]">
                Відновити
              </Button>
            </Form>
            <div>
              <br />
              <p>
                <Link to="/account/login">На сторінку входу →</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerrecover
const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover(
    $email: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
