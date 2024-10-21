import {type ActionFunctionArgs, json, redirect} from '@shopify/remix-oxygen';
import {Form, Link, useActionData, type MetaFunction} from '@remix-run/react';
import {Input} from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { CUSTOMER_RESET_MUTATION } from '~/graphql/mutations';

type ActionResponse = {
  error: string | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Reset Password'}];
};

export async function action({request, context, params}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }
  const {id, resetToken} = params;
  const {session, storefront} = context;

  try {
    if (!id || !resetToken) {
      throw new Error('customer token or id not found');
    }

    const form = await request.formData();
    const password = form.has('password') ? String(form.get('password')) : '';
    const passwordConfirm = form.has('passwordConfirm')
      ? String(form.get('passwordConfirm'))
      : '';
    const validInputs = Boolean(password && passwordConfirm);
    if (validInputs && password !== passwordConfirm) {
      throw new Error('Please provide matching passwords');
    }

    const {customerReset} = await storefront.mutate(CUSTOMER_RESET_MUTATION, {
      variables: {
        id: `gid://shopify/Customer/${id}`,
        input: {password, resetToken},
      },
    });

    if (customerReset?.customerUserErrors?.length) {
      throw new Error(customerReset?.customerUserErrors[0].message);
    }

    if (!customerReset?.customerAccessToken) {
      throw new Error('Access token not found. Please try again.');
    }
    session.set('customerAccessToken', customerReset.customerAccessToken);

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

export default function Reset() {
  const action = useActionData<ActionResponse>();

  return (
    <div className="my-[20px] account-recover flex items-center justify-center self-stretch flex-col w-full">
      <div className="w-2/4 rounded-[20px] border border-black/10 p-6">

<h1 className="font-medium text-[32px]">Скинути пароль.</h1>
      <p className='text-lg'>Введіть новий пароль для свого облікового запису.</p>

      <Form method="POST">
        <fieldset>
          <Input
            aria-label="Password"
            autoComplete="current-password"
            autoFocus
            id="password"
            minLength={8}
            name="password"
            placeholder="Пароль"
            required
            type="password"
            className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px]"

          />
          <br />
          <p className='text-lg'>Повторно введіть пароль</p>
          <Input
            aria-label="Re-enter password"
            autoComplete="current-password"
            id="passwordConfirm"
            minLength={8}
            name="passwordConfirm"
            placeholder="Повторно введіть пароль"
            required
            type="password"
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
         <Button type="submit" className="flex items-center justify-center gap-5 py-[14px] font-medium text-xl w-full rounded-[36px]">
         Змінити
              </Button>
      </Form>
      <br />
      <p>
        <Link to="/account/login">Повернутися до входу →</Link>
      </p>
      </div>
    </div>
  );
}
