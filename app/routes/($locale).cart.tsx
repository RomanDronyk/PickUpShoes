import { Await, type MetaFunction, useLoaderData } from '@remix-run/react';
import type { CartQueryDataReturn } from '@shopify/hydrogen';
import { CartForm } from '@shopify/hydrogen';
import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  defer,
} from '@shopify/remix-oxygen';
import { Suspense } from 'react';
import { Aside } from '~/components/Aside';
import { CartMain } from '~/components/Cart';
import { syncUserCart } from '~/utils/syncUserCart';

export const meta: MetaFunction = () => {
  return [{ title: `Hydrogen | Cart` }];
};

export async function action({ request, context }: ActionFunctionArgs) {
  const { cart, session } = context;

  const formData = await request.formData();
  const customerAccessToken = session.get('customerAccessToken');

  const { action, inputs } = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      // User inputted gift card code
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      // Combine gift card codes already applied on cart
      giftCardCodes.push(...inputs.giftCardCodes);

      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;

  if (customerAccessToken?.accessToken) {
    syncUserCart(customerAccessToken.accessToken, cartId, context);
  }

  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const { cart: cartResult, errors, warnings } = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    { status, headers },
  );
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { cart } = context;
  return defer({
    cart: cart.get()
  });
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();
  console.log(cart)
  return (
    <div className="cart">
      <Aside.Provider>
        <h1>Cart</h1>
        <Suspense fallback={<p>Loading cart ...</p>}>
          <Await resolve={cart?.cart}>
            {(cart) => {
              return <CartMain layout="page" cart={cart} />
            }}
          </Await>
        </Suspense>
      </Aside.Provider>
    </div>
  );
}
