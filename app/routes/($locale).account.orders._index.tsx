import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import {
  Money,
  Pagination,
  Image,
  getPaginationVariables,
} from '@shopify/hydrogen';
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'storefrontapi.generated';
import { CUSTOMER_ORDERS_QUERY } from '~/graphql/queries';

export const handle = {
  breadcrumb: 'orders',
};

const financialStatusTranslations = {
  PAID: 'Оплачено',
  PENDING: 'Очікується',
  REFUNDED: 'Повернено',
  // Додайте інші статуси тут
};

export const meta: MetaFunction = () => {
  return [{ title: 'Історія замовлень' }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { session, storefront } = context;

  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken?.accessToken) {
    return redirect('/account/login');
  }

  try {
    const paginationVariables = getPaginationVariables(request, {
      pageBy: 20,
    });

    const { customer } = await storefront.query(CUSTOMER_ORDERS_QUERY, {
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

    return json({ customer });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }
    return json({ error }, { status: 400 });
  }
}

export default function Orders() {
  const { customer } = useLoaderData<{ customer: CustomerOrdersFragment }>();
  const { orders, numberOfOrders } = customer;
  return (
    <div className='m-full overflow-scroll'>
      <div className="rounded-[20px] border border-black/10 p-6 mb-10 min-w-[1100px]">
        <div className="grid grid-cols-5 text-xl font-semibold border-b border-b-black/10 pb-[15px]">
          <div className='text-start'>Товар(и)</div>
          <div className='text-center'>Ціна</div>
          <div className='text-center'>Статус замовлення</div>
          <div className='text-center'>Дата купівлі</div>
          <div className='text-end'>№ замовлення</div>
        </div>
        {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
      </div>
    </div>
  );
}

function OrdersTable({ orders }: Pick<CustomerOrdersFragment, 'orders'>) {
  return (
    <div className="acccount-orders">
      {orders?.nodes.length ? (
        <Pagination connection={orders}>
          {({ nodes, isLoading, PreviousLink, NextLink }) => {
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
function OrderItem({ order }: { order: OrderItemFragment }) {
  return (
    <>
      <div className="grid grid-cols-5 items-center mt-5 pb-5 border-b border-b-black/10">
        <div className="flex gap-[10px] relative">
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
            <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
              {order.lineItems.nodes[0].title}
            </h4>
            <span className="text-black/60">
              Артикул: {order.lineItems.nodes[0].variant?.sku}
            </span>
          </div>
          <div className="absolute top-[0px] bottom-[0px] right-[1px] w-[1px] bg-black/10"></div>
        </div>
        <div className="relative h-[100%] flex items-center justify-center">

          <span className="font-semibold text-lg ">
            <Money
              as="span"
              withoutCurrency
              withoutTrailingZeros
              data={order.currentTotalPrice}
            />
            грн
          </span>
          <div className="absolute top-[0px] bottom-[0px] right-[1px] w-[1px] bg-black/10"></div>
        </div>
        <p className="relative h-[100%] flex items-center justify-center ">
          {financialStatusTranslations[order.financialStatus] || order.financialStatus}
          <div className="absolute top-[0px] bottom-[0px] right-[1px] w-[1px] bg-black/10"></div>
        </p>
        <p className="relative h-[100%] flex items-center justify-center ">
          {new Date(order.processedAt).toLocaleString('uk', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          })}
          <div className="absolute top-[0px] bottom-[0px] right-[1px] w-[1px] bg-black/10"></div>
        </p>
        <Link
          className=" cursor-pointer font-normal flex justify-end"
          to={`/account/orders/${btoa(order.id)}`}
        >
          #{order.orderNumber}
        </Link>
      </div>
    </>
  );
}





