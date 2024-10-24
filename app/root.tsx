
import { useNonce } from '@shopify/hydrogen';
import {
  defer,
  type SerializeFrom,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useMatches,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import favicon from '../public/favicon.ico';
import { Layout } from '~/components/Layout';
import styles from 'app/styles/tailwind.css';
import { google } from 'worker-auth-providers';
import HeaderContext from '~/context/HeaderCarts';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import NotFoundScreen from './screens/NotFoundScreen';
import { likedProductsCookie } from './cookies.server';
import { getUserCartId, getUserLikedCartIds, validateCustomerAccessToken } from './utils';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    // {rel: 'stylesheet', href: vaulStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
  ];
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader({ context, request }: any) {
  const { storefront, session, cart } = context;
  const customerAccessToken = await session.get('customerAccessToken');
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  // validate the customer access token is valid
  const { isLoggedIn, headers } = await validateCustomerAccessToken(
    session,
    customerAccessToken,
  );
  const cookieHeader = request.headers.get('Cookie');
  let likedCookes = (await likedProductsCookie.parse(cookieHeader)) || [];

  if (isLoggedIn && customerAccessToken?.accessToken) {
    likedCookes = await getUserLikedCartIds(customerAccessToken.accessToken, context)

  } else {
    likedCookes = (await likedProductsCookie.parse(cookieHeader)) || [];
  }
  


  // let cartPromise = await getUserCart(customerAccessToken?.accessToken, isLoggedIn, context);
  let cartPromise = cart.get()

  // defer the footer query (below the fold)
  const footerPromise = await storefront.query(FOOTER_QUERY, {
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
      secondMenuHandle: 'footer-info',
    },
  });

  // await the header query (above the fold)
  const headerPromise = await storefront.query(HEADER_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  return defer(
    {
      likeProductIds: likedCookes,
      cart: cartPromise,
      footer: footerPromise,
      header: headerPromise,
      isLoggedIn,
      publicStoreDomain,
    },
    {
      headers: {
        ...headers,
      }
    },
  );
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();
  const cache = createCache({ key: 'css', prepend: true });


  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <CacheProvider value={cache}>
        <HeaderContext>
          <body className="font-sans">
            <Layout {...data}>
              <Outlet />
            </Layout>
            <ScrollRestoration nonce={nonce} />
            <Scripts nonce={nonce} />
            <LiveReload nonce={nonce} />
          </body>
        </HeaderContext>
      </CacheProvider>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRootLoaderData();
  const nonce = useNonce();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
        <Layout {...rootData}>
          <NotFoundScreen />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```js
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 * );
 * ```
 */


const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $secondMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
    title
      ...Menu
    }
    secondMenu: menu(handle: $secondMenuHandle) {
    title
    ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
