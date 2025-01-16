import {useNonce} from '@shopify/hydrogen';
import {
  LoaderFunctionArgs,
  defer,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useMatches,
  useRouteError,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  useRouteLoaderData,
} from '@remix-run/react';
import favicon from '../public/favicon.ico';
import {Layout} from '~/components/Layout';
import tailwindCss from 'app/styles/tailwind.css';
import HeaderContext from '~/context/HeaderCarts';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import NotFoundScreen from './screens/NotFoundScreen';
import {likedProductsCookie} from './cookies.server';
import {getUserLikedCartIds, validateCustomerAccessToken} from './utils';

export type RootLoader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  return defaultShouldRevalidate;
};

export function links() {
  return [
    {rel: 'stylesheet', href: tailwindCss},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const {context, request} = args;
  const {storefront, session, env} = context;

  const customerAccessToken = session.get('customerAccessToken');

  // validate the customer access token is valid
  const {isLoggedIn, headers} = await validateCustomerAccessToken(
    session,
    customerAccessToken,
  );
  const cookieHeader = request.headers.get('Cookie');
  let likedCookes = (await likedProductsCookie.parse(cookieHeader)) || [];

  if (isLoggedIn && customerAccessToken?.accessToken) {
    likedCookes = await getUserLikedCartIds(
      customerAccessToken?.accessToken,
      context,
    );
  } else {
    likedCookes = (await likedProductsCookie.parse(cookieHeader)) || [];
  }

  // await the header query (above the fold)
  const header = await storefront.query(HEADER_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  return defer(
    {
      ...deferredData,
      likeProductIds: likedCookes,
      header: header,
      isLoggedIn,
      publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    },
    {
      headers: {
        ...headers,
      },
    },
  );
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const {storefront, cart} = context;
  const footer = storefront
    .query(FOOTER_QUERY, {
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
        secondMenuHandle: 'footer-info',
      },
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    cart: cart.get(),
    footer,
  };
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');
  const nonce = useNonce();
  const cache = createCache({key: 'css', prepend: true});

  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
        {data && (
          <CacheProvider value={cache}>
            <HeaderContext>
              <Layout {...data}>
                <Outlet />
              </Layout>
              <ScrollRestoration nonce={nonce} />
              <Scripts nonce={nonce} />
              <LiveReload nonce={nonce} />
            </HeaderContext>
          </CacheProvider>
        )}
      </body>
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
