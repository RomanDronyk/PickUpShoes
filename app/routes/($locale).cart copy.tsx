import {
  Await,
  FetcherWithComponents,
  type MetaFunction,
} from '@remix-run/react';
import {Suspense} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {CartMain} from '~/components/Cart';
import {useRootLoaderData} from '~/root';
import {cn} from '~/lib/utils';
import {syncUserCart} from '~/utils/syncUserCart';

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export async function action({request, context}: ActionFunctionArgs) {
  const {session, cart} = context;

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('customerAccessToken'),
  ]);

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    return json({error: 'No action provided'});
  }

  let status = 200;
  let result;

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
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
        customerAccessToken: inputs.buyerIdentity.customerAccessToken
          ? inputs.buyerIdentity.customerAccessToken
          : customerAccessToken?.accessToken,
      });
      break;
    }
    default:
      return json({error: `${action} cart action is not defined`});
  }

  const cartId = result.cart.id;
  if (customerAccessToken?.accessToken) {
    await syncUserCart(customerAccessToken.accessToken, cartId, context);
  }

  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

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
        cartId: cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const rootData = useRootLoaderData();
  const cartPromise = rootData.cart;

  return (
    <div className="cart">
      <h1>Cart</h1>
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await
          resolve={cartPromise}
          errorElement={<div>An error occurred</div>}
        >
          {(cart) => {
            console.log(cart);
            return <CartMain layout="page" cart={cart} />;
          }}
        </Await>
      </Suspense>
      <div>
        <CartForm route="/cart" action={CartForm.ACTIONS.BuyerIdentityUpdate}>
          {(fetcher: FetcherWithComponents<any>) => (
            <>
              <button
                type="submit"
                disabled={fetcher.state !== 'idle'}
                className={cn(
                  'bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px] cursor-pointer',
                  fetcher.state !== 'idle' &&
                    'bg-white text-black border border-black',
                )}
              >
                {fetcher.state == 'idle' ? 'Обновить' : 'Загрузка'}
              </button>
            </>
          )}
        </CartForm>
      </div>
    </div>
  );
}
