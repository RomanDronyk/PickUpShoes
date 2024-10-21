import { type MetaFunction } from '@remix-run/react';
import { CartForm } from '@shopify/hydrogen';
import { json, type ActionFunctionArgs } from '@shopify/remix-oxygen';
import { useRootLoaderData } from '~/root';

export const meta: MetaFunction = () => {
  return [{ title: `Hydrogen | Cart` }];
};

export async function action({ request, context }: ActionFunctionArgs) {
  const { session, cart } = context;

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('customerAccessToken'),
  ]);

  const { action, inputs } = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;


  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);
  const { cart: cartResult, errors } = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    { status, headers },
  );
}

export default function User() {
  const rootData = useRootLoaderData();
  const cartPromise = rootData.cart;

  return (
    <div className="cart my-[300px]">
      asdlkfjasdf
      asd;klfjasd
      a;lksdfj
      hello
    </div>
  );
}
