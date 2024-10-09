import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData, type MetaFunction} from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { CUSTOMER_ACTIVATE_MUTATION } from '~/graphql/mutations';

type ActionResponse = {
  error: string | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Activate Account'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return json({});
}

export async function action({request, context, params}: ActionFunctionArgs) {
  const {session, storefront} = context;
  const {id, activationToken} = params;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    if (!id || !activationToken) {
      throw new Error('Missing token. The link you followed might be wrong.');
    }

    const form = await request.formData();
    const password = form.has('password') ? String(form.get('password')) : null;
    const passwordConfirm = form.has('passwordConfirm')
      ? String(form.get('passwordConfirm'))
      : null;

    const validPasswords =
      password && passwordConfirm && password === passwordConfirm;

    if (!validPasswords) {
      throw new Error('Passwords do not match');
    }

    const {customerActivate} = await storefront.mutate(
      CUSTOMER_ACTIVATE_MUTATION,
      {
        variables: {
          id: `gid://shopify/Customer/${id}`,
          input: {
            password,
            activationToken,
          },
        },
      },
    );

    if (customerActivate?.customerUserErrors?.length) {
      throw new Error(customerActivate.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerActivate ?? {};
    if (!customerAccessToken) {
      throw new Error('Could not activate account.');
    }
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

export default function Activate() {
  const action = useActionData<ActionResponse>();
  const error = action?.error ?? null;

  return (
    <div className="account-activate flex items-center justify-center self-stretch flex-col w-full">
      <div className="w-2/4 rounded-[20px] border border-black/10 p-6 my-[30px]">
        <h1 className="font-medium text-[32px]">Активація облікового запису</h1>
        <p className="text-lg">
          Створіть свій пароль, щоб активувати обліковий запис.
        </p>
        <br />
        <Form method="POST">
          <fieldset>
            <Input
              aria-label="Password"
              autoComplete="current-password"
              id="password"
              name="password"
              placeholder="Пароль"
              required
              type="password"
              minLength={8}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px]"
            />
            <Input
              aria-label="Re-enter password"
              autoComplete="current-password"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="Повторно введіть пароль"
              required
              type="password"
              minLength={8}
              className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
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
          <Button className="flex items-center justify-center gap-5 py-[14px] font-medium text-xl w-full rounded-[36px]">
            Зберегти
          </Button>
        </Form>
        <div>
          <br />
          <p>
            <Link to="/account/login">На сторінку входу →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}