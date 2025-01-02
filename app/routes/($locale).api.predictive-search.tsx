import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type {
  NormalizedPredictiveSearch,
  NormalizedPredictiveSearchResults,
} from '~/components/Search';
import { NO_PREDICTIVE_SEARCH_RESULTS } from '~/components/Search';

import type {
  PredictiveProductFragment,
  PredictiveQueryFragment,
  PredictiveSearchQuery,
} from 'storefrontapi.generated';
import { PREDICTIVE_PRODUCT_SEARCH_QUERY } from '~/graphql/queries';

type PredictiveSearchResultItem = PredictiveProductFragment;

type PredictiveSearchTypes = 'PRODUCT' | 'QUERY';

const DEFAULT_SEARCH_TYPES: PredictiveSearchTypes[] = ['PRODUCT', 'QUERY'];

/**
 * Fetches the search results from the predictive search API
 * requested by the SearchForm component
 */
export async function action({ request, params, context }: LoaderFunctionArgs) {
  if (request.method !== 'POST') {
    throw new Error('Invalid request method');
  }

  const search = await fetchPredictiveSearchResults({
    params,
    request,
    context,
  });
  return json(search);
}

async function fetchPredictiveSearchResults({
  params,
  request,
  context,
}: Pick<LoaderFunctionArgs, 'params' | 'context' | 'request'>) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let body;
  try {
    body = await request.formData();
  } catch (error) { }
  const searchTerm = String(body?.get('q') || searchParams.get('q') || '');
  const limit = Number(body?.get('limit') || searchParams.get('limit') || 10);
  const rawTypes = String(
    body?.get('type') || searchParams.get('type') || 'ANY',
  );
  const searchTypes =
    rawTypes === 'ANY'
      ? DEFAULT_SEARCH_TYPES
      : rawTypes
        .split(',')
        .map((t) => t.toUpperCase() as PredictiveSearchTypes)
        .filter((t) => DEFAULT_SEARCH_TYPES.includes(t));

  if (!searchTerm) {
    return {
      searchResults: { results: null, totalResults: 0 },
      searchTerm,
      searchTypes,
    };
  }

  const data = await context.storefront.query(PREDICTIVE_PRODUCT_SEARCH_QUERY, {
    variables: {
      limit,
      limitScope: 'EACH',
      searchTerm,
      unavailableProducts: "HIDE",
      types: searchTypes,
    },
  });


  if (!data) {
    throw new Error('No data returned from Shopify API');
  }
  const searchResults = normalizePredictiveSearchResults(
    data.predictiveSearch,
    params.locale,
  );

  return { searchResults, searchTerm, searchTypes };
}

/**
 * Normalize results and apply tracking qurery parameters to each result url
 */
export function normalizePredictiveSearchResults(
  predictiveSearch: PredictiveSearchQuery['predictiveSearch'],
  locale: LoaderFunctionArgs['params']['locale'],
): NormalizedPredictiveSearch {
  let totalResults = 0;
  if (!predictiveSearch) {
    return {
      results: NO_PREDICTIVE_SEARCH_RESULTS,
      totalResults,
    };
  }

  function applyTrackingParams(
    resource: PredictiveSearchResultItem | PredictiveQueryFragment,
    params?: string,
  ) {
    if (params) {
      return resource.trackingParameters
        ? `?${params}&${resource.trackingParameters}`
        : `?${params}`;
    } else {
      return resource.trackingParameters
        ? `?${resource.trackingParameters}`
        : '';
    }
  }

  const localePrefix = locale ? `/${locale}` : '';
  const results: NormalizedPredictiveSearchResults = [];

  // console.log(predictiveSearch.products[0].variants.nodes[0].selectedOptions[0], "sdl;kfjs;ldfkjs")
  if (predictiveSearch.queries.length) {
    results.push({
      type: 'queries',
      items: predictiveSearch.queries.map((query: PredictiveQueryFragment) => {
        const trackingParams = applyTrackingParams(
          query,
          `q=${query.text}`,
        );

        totalResults++;
        return {
          __typename: query.__typename,
          handle: '',
          id: query.text,
          image: undefined,
          title: query.text,
          styledTitle: query.styledText,
          url: `${localePrefix}/search${trackingParams}`,
        };
      }),
    });
  }

  if (predictiveSearch.products.length) {
    results.push({
      type: 'products',
      items: predictiveSearch.products.map(
        (product: PredictiveProductFragment) => {
          totalResults++;
          const trackingParams = applyTrackingParams(product);
          return {
            __typename: product.__typename,
            handle: product.handle,
            id: product.id,
            image: product.variants?.nodes?.[0]?.image,
            title: product.title,
            url: `${localePrefix}/products/${product.handle}${trackingParams}`,
            price: product.variants.nodes[0].price,
            variants: product.variants
          };
        },
      ),
    });
  }

  return { results, totalResults };
}


