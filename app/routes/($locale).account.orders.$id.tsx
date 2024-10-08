import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Money, Image, flattenConnection} from '@shopify/hydrogen';
import type {OrderLineItemFullFragment} from 'storefrontapi.generated';
import { CUSTOMER_ORDER_QUERY } from '~/graphql/queries';

export const handle = {
  breadcrumb: 'order',
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {session, storefront} = context;

  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const customerAccessToken = await session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  const {order} = await storefront.query(CUSTOMER_ORDER_QUERY, {
    variables: {orderId},
  });

  if (!order || !('lineItems' in order)) {
    throw new Response('Order not found', {status: 404});
  }

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return json({
    order,
    lineItems,
    discountValue,
    discountPercentage,
  });
}

const fulfillmentStatusTranslations = {
  FULFILLED: 'Виконано',
  UNFULFILLED: 'Не виконано',
  PARTIALLY_FULFILLED: 'Частково виконано',
  // Додайте інші статуси тут
};

export default function OrderRoute() {
  const {order, lineItems, discountValue, discountPercentage} =
    useLoaderData<typeof loader>();
  return (
    <div className="account-order ">
      <div className="flex gap-[20px] flex-col">
        <h2 className="font-semibold text-xl">Замовлення {order.name}</h2>
        <p className="font-semibold">
          Дата:
          {new Date(order.processedAt!).toLocaleString('uk', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
      <br />
      <div className="rounded-[20px] border border-black/10 p-6 mb-10">
        <div>
          <div className="grid grid-cols-4">
            <div>Товар</div>
            <div>Ціна</div>
            <div>Кількість</div>
            <div>Всього</div>
          </div>
          <div>
            {lineItems.map((lineItem, lineItemIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
            ))}
          </div>
          <div>
            <div className="flex font-semibold gap-[10px] text-xl">
              <div>
                <p>Всього: </p>
              </div>
              <div>
                <Money
                  as="span"
                  withoutCurrency
                  withoutTrailingZeros
                  data={order.subtotalPriceV2!}
                />
                <span className="ml-1">грн</span>
              </div>
            </div>
          </div>
          <div>
            <h3>Адреса доставки </h3>
            {order?.shippingAddress ? (
              <address>
                <p>
                  {order.shippingAddress.firstName &&
                    order.shippingAddress.firstName + ' '}
                  {order.shippingAddress.lastName}
                </p>
                {order?.shippingAddress?.formatted ? (
                  order.shippingAddress.formatted.map((line: string) => (
                    <p key={line}>{line}</p>
                  ))
                ) : (
                  <></>
                )}
              </address>
            ) : (
              <p>Адресу доставку не знайдено</p>
            )}
            <h3>Статус</h3>
            <div>
              <p>{fulfillmentStatusTranslations[order?.fulfillmentStatus] || order.fulfillmentStatus}</p>
            </div>
          </div>
        </div>
        <br />
        <p>
          <a target="_blank" href={order.statusUrl} rel="noreferrer">
            View Order Status →
          </a>
        </p>
      </div>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <div
      className="grid grid-cols-4 mt-5 pb-5 border-b border-b-black/10"
      key={lineItem.variant!.id}
    >
      <div>
        <div className="flex gap-[10px] ">
          <Link to={`/products/${lineItem.variant!.product!.handle}`}>
            {lineItem?.variant?.image && (
              <div>
                <Image data={lineItem.variant.image} width={96} height={96} />
              </div>
            )}
          </Link>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{lineItem.title}</span>
            <span className="text-black/60 text-lg">
              Артикул:
              {lineItem.variant!.sku}
            </span>
          </div>
        </div>
      </div>
      <div>
        <Money data={lineItem.variant!.price!} />
      </div>
      <div>{lineItem.quantity}</div>
      <div>
        <Money data={lineItem.discountedTotalPrice!} />
      </div>
    </div>
  );
}
