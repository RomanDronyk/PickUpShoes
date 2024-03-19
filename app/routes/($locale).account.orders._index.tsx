import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  Money,
  Pagination,
  Image,
  getPaginationVariables,
} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'storefrontapi.generated';

export const handle = {
  breadcrumb: 'orders',
};

export const meta: MetaFunction = () => {
  return [{title: 'Історія замовлень'}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {session, storefront} = context;

  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken?.accessToken) {
    return redirect('/account/login');
  }

  try {
    const paginationVariables = getPaginationVariables(request, {
      pageBy: 20,
    });

    const {customer} = await storefront.query(CUSTOMER_ORDERS_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
        ...paginationVariables,
      },
      cache: storefront.CacheNone(),
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return json({customer});
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Orders() {
  const {customer} = useLoaderData<{customer: CustomerOrdersFragment}>();
  const {orders, numberOfOrders} = customer;
  return (
    <div className="rounded-[20px] border border-black/10 p-6 mb-10">
      <div className="grid grid-cols-5 text-xl font-semibold border-b border-b-black/10 pb-[15px]">
        <div>Товар(и)</div>
        <div>Ціна</div>
        <div>Статус замовлення</div>
        <div>Дата купівлі</div>
        <div>№ замовлення</div>
      </div>
      {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
    </div>
  );
}

function OrdersTable({orders}: Pick<CustomerOrdersFragment, 'orders'>) {
  return (
    <div className="acccount-orders">
      {orders?.nodes.length ? (
        <Pagination connection={orders}>
          {({nodes, isLoading, PreviousLink, NextLink}) => {
            return (
              <>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
                {nodes.map((order) => {
                  return <OrderItem key={order.id} order={order} />;
                })}
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </>
            );
          }}
        </Pagination>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-[20px] border border-black/10 p-6 mb-10">
      <p>Ви не зробили ще жодного замовлення </p>
      <p>
        <Link to="/collections/catalog">Почати покупки →</Link>
      </p>
    </div>
  );
}
function OrderItem({order}: {order: OrderItemFragment}) {
  console.log(order);
  return (
    <>
      <div className="grid grid-cols-5 items-center mt-5 pb-5 border-b border-b-black/10">
        <div className="flex gap-[10px]">
          <div>
            <Image
              data={order.lineItems.nodes[0].variant?.image}
              aspectRatio="1/1"
              width={70}
              height={70}
              className="rounded-[15px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {order.lineItems.nodes[0].title}
            </span>
            <span className="text-black/60">
              Артикул: {order.lineItems.nodes[0].variant?.sku}
            </span>
          </div>
        </div>
        <div>
          <span className="font-semibold text-lg">
            <Money
              as="span"
              withoutCurrency
              withoutTrailingZeros
              data={order.currentTotalPrice}
            />
            грн
          </span>
        </div>
        <p>{order.financialStatus}</p>
        <p>
          {new Date(order.processedAt).toLocaleString('uk', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          })}
        </p>
        <Link
          className="underline cursor-pointer"
          to={`/account/orders/${btoa(order.id)}`}
        >
          <strong>#{order.orderNumber}</strong>
        </Link>
      </div>
    </>
  );
}

const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    currentTotalPrice {
      amount
      currencyCode
    }
    financialStatus
    fulfillmentStatus
    id
    lineItems(first: 1) {
      nodes {
        title
        variant {
          sku
          image {
            url
            altText
            height
            width
          }
        }
      }
    }
    orderNumber
    customerUrl
    statusUrl
    processedAt
  }
` as const;

export const CUSTOMER_FRAGMENT = `#graphql
  fragment CustomerOrders on Customer {
    numberOfOrders
    orders(
      sortKey: PROCESSED_AT,
      reverse: true,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...OrderItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/customer
const CUSTOMER_ORDERS_QUERY = `#graphql
  ${CUSTOMER_FRAGMENT}
  query CustomerOrders(
    $country: CountryCode
    $customerAccessToken: String!
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerOrders
    }
  }
` as const;
