import {ScrollArea, ScrollBar} from '~/components/ui/scroll-area';
import {Form, Link, NavLink, Outlet, useLoaderData} from '@remix-run/react';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Scroll} from 'lucide-react';
import type {CustomerFragment} from 'storefrontapi.generated';
import {Button} from '~/components/ui/button';
import {cn} from '~/lib/utils';

export function shouldRevalidate() {
  return true;
}
export const handle = {
  breadcrumb: () => <Link to="/account">Особистий кабінет</Link>,
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {session, storefront} = context;
  const {pathname} = new URL(request.url);
  const customerAccessToken = await session.get('customerAccessToken');
  const isLoggedIn = !!customerAccessToken?.accessToken;
  const isAccountHome = pathname === '/account' || pathname === '/account/';
  const isPrivateRoute =
    /^\/account\/(orders|orders\/.*|profile|addresses|addresses\/.*)$/.test(
      pathname,
    );

  if (!isLoggedIn) {
    if (isPrivateRoute || isAccountHome) {
      session.unset('customerAccessToken');
      return redirect('/account/login', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    } else {
      // public subroute such as /account/login...
      return json({
        isLoggedIn: false,
        isAccountHome,
        isPrivateRoute,
        customer: null,
      });
    }
  } else {
    // loggedIn, default redirect to the orders page
    if (isAccountHome) {
      return redirect('/account/orders');
    }
  }

  try {
    const {customer} = await storefront.query(CUSTOMER_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(),
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return json(
      {isLoggedIn, isPrivateRoute, isAccountHome, customer},
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('There was a problem loading account', error);
    session.unset('customerAccessToken');
    return redirect('/account/login', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  }
}

export default function Acccount() {
  const {customer, isPrivateRoute, isAccountHome} =
    useLoaderData<typeof loader>();

  if (!isPrivateRoute && !isAccountHome) {
    return <Outlet context={{customer}} />;
  }

  return (
    <AccountLayout customer={customer as CustomerFragment}>
      <br />
      <br />
      <Outlet context={{customer}} />
    </AccountLayout>
  );
}

function AccountLayout({
  customer,
  children,
}: {
  customer: CustomerFragment;
  children: React.ReactNode;
}) {
  const heading = customer
    ? customer.firstName
      ? `Вітаю, ${customer.firstName}!`
      : `Вітаю в особистому кабінеті.`
    : 'Інформація про обліковий запис';

  return (
    <div className="account lg:px-24 sm:px-10 px-[10px] pt-10 w-full overflow-x-hidden">
      <h1 className="md:text-[32px] sm:text-[28px] text-[22px] font-medium px-[10px] sm:px-0">
        Особистий кабінет
      </h1>
      <div className="flex justify-between items-center flex-wrap my-11 sm:px-0 px-[10px] gap-[10px]">
        <div>
          <h2 className="md:text-[32px] sm:text-[28px] text-[20px] font-semibold">
            {heading}
          </h2>
          <span className="font-medium sm:text-2xl text-lg">
            Оберіть потрібний вам розділ
          </span>
        </div>
        <Logout />
      </div>
      <AccountMenu />
      {children}
    </div>
  );
}

function AccountMenu() {
  function isActiveStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    const active = isActive
      ? 'bg-black text-white hover:bg-black hover:cursor-default'
      : '';
    return cn(
      'text-xl shrink-0 text-black  px-[30px] text-center  w-3/4 sm:w-auto  rounded-t-[30px] py-4 transition-all ease hover:bg-input',
      active,
    );
  }

  return (
    <ScrollArea>
      <nav
        role="navigation"
        className="flex flex-row justify-between min-w-0 shrink-0 gap-2"
      >
        <NavLink to="/account/profile" className={isActiveStyle}>
          Особиста інформація
        </NavLink>
        <NavLink to="/account/orders" className={isActiveStyle}>
          Історія замовлень
        </NavLink>
        {/* <NavLink to="/account/addresses" style={isActiveStyle}>
        Addresses
      </NavLink> */}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      <Button
        type="submit"
        variant="secondary"
        className="flex gap-4 hover:bg-black hover:text-white"
      >
        <span className="sm:text-xl text-base font-medium">
          Вийти з кабінету
        </span>
        <svg
          width="44"
          height="45"
          viewBox="0 0 44 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-current"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.7962 4.91651C16.5 6.06601 16.5 8.16885 16.5 12.3727V32.6273C16.5 36.8312 16.5 38.934 17.7962 40.0835C19.0923 41.233 21.0742 40.8883 25.0378 40.1972L29.3095 39.4528C33.6985 38.6865 35.893 38.3033 37.1965 36.6937C38.5 35.0822 38.5 32.7538 38.5 28.0953V16.9047C38.5 12.248 38.5 9.91968 37.1983 8.30818C35.893 6.69851 33.6967 6.31535 29.3077 5.55085L25.0397 4.80468C21.076 4.11351 19.0942 3.76885 17.798 4.91835M22 19.1432C22.759 19.1432 23.375 19.7867 23.375 20.5805V24.4195C23.375 25.2133 22.759 25.8568 22 25.8568C21.241 25.8568 20.625 25.2133 20.625 24.4195V20.5805C20.625 19.7867 21.241 19.1432 22 19.1432Z"
          />
          <path d="M13.8362 8.75C10.0632 8.7555 8.096 8.838 6.842 10.092C5.5 11.434 5.5 13.5937 5.5 17.9167V27.0833C5.5 31.4045 5.5 33.5642 6.842 34.908C8.096 36.1602 10.0632 36.2445 13.8362 36.25C13.75 35.106 13.75 33.786 13.75 32.3578V12.6422C13.75 11.2122 13.75 9.89217 13.8362 8.75Z" />
        </svg>
      </Button>
    </Form>
  );
}

export const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    acceptsMarketing
    addresses(first: 6) {
      nodes {
        ...Address
      }
    }
    defaultAddress {
      ...Address
    }
    email
    firstName
    lastName
    numberOfOrders
    phone
  }
  fragment Address on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    country
    province
    city
    zip
    phone
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/customer
const CUSTOMER_QUERY = `#graphql
  query Customer(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;
