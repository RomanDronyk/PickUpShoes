import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import type {
  ProductFilter,
  Collection,
  ProductCollectionSortKeys,
  Filter,
} from '@shopify/hydrogen/storefront-api-types';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {
  CollectionQuery,
  ProductItemFragment,
  CollectionFiltersQuery,
} from 'storefrontapi.generated';
import {ProductCard} from '~/components/ProductCard';
import {ProductsFilter, SortProducts} from '~/components/ProductsFilter';
import {useVariantUrl} from '~/utils';

export type SortParam =
  | 'price-low-high'
  | 'price-high-low'
  | 'best-selling'
  | 'newest'
  | 'featured';

export const FILTER_URL_PREFIX = 'filter.';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const locale = context.storefront.i18n;
  const searchParams = new URL(request.url).searchParams;

  const {sortKey, reverse} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );

  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  if (!handle) {
    return redirect('/collections');
  }
  const {collection: filtersCollection} =
    await storefront.query<CollectionFiltersQuery>(FILTER_QUERY, {
      variables: {
        handle,
        first: 1,
      },
    });
  const {collection} = await storefront.query<CollectionQuery>(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        handle,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection, filtersCollection});
}

export default function Collection() {
  const {collection, filtersCollection} = useLoaderData<typeof loader>();

  return (
    <div className="grid lg:grid-cols-[minmax(auto,_300px)_minmax(auto,_1fr)] grid-cols-1 gap-x-5 w-full lg:px-24 px-12 pt-[30px] mb-8">
      <div className="sidebar w-[300px] h-full lg:block hidden">
        <ProductsFilter
          initialFilters={filtersCollection?.products.filters as Filter[]}
          filters={collection.products.filters as Filter[]}
        />
      </div>
      <div className="items">
        <div className="title flex items-center justify-between">
          <h1 className="font-medium text-[32px]">{collection.title}</h1>
          <SortProducts />
        </div>

        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <PreviousLink>
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
              <ProductsGrid products={nodes} />
              <br />
              <NextLink>
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </>
          )}
        </Pagination>
      </div>
    </div>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <div className="product-grid grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 md:auto-rows-[minmax(50px,_450px)] gap-x-[20px] gap-y-10 mt-5">
      {products.map((product, index) => {
        return <ProductCard product={product} key={product.id} />;
      })}
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
        price {
          amount
        }
        compareAtPrice {
          amount
        }

      }
    }
  }
` as const;

const FILTER_QUERY = `#graphql
  query CollectionFilters(
    $handle: String! 
    $country: CountryCode 
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language){
    collection(handle: $handle){
      products(first: $first){
        filters {
          id
          label
          type
          values {
            id
            label
            input
            count
          }
        }
      }
    }
}
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            input
            count
          }
        }
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }

` as const;
function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED',
        reverse: true,
      };
    case 'featured':
      return {
        sortKey: 'MANUAL',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}
