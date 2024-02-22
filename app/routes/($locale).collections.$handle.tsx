import {Link, type MetaFunction, useLoaderData} from '@remix-run/react';
import {
  Image,
  Money,
  Pagination,
  getPaginationVariables,
} from '@shopify/hydrogen';
import {type LoaderFunctionArgs, json, redirect} from '@shopify/remix-oxygen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {ProductCard} from '~/components/ProductCard';
import {ProductFilter} from '~/components/ProductFilter';
import {useVariantUrl} from '~/utils';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection});
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  console.log(collection);

  return (
    <div className="grid lg:grid-cols-[minmax(auto,_300px)_minmax(auto,_1fr)] grid-cols-1 gap-x-5 w-full lg:px-24 px-12 pt-[30px] mb-8">
      <div className="sidebar w-[300px] h-full lg:block hidden">
        <ProductFilter />
      </div>
      <div className="items">
        <div className="title">
          <h1 className="font-medium text-[32px]">{collection.title}</h1>
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
    <div className="product-grid grid md:grid-cols-3 xl:grid-cols-5 grid-cols-2 md:auto-rows-[minmax(50px,_450px)] gap-x-[20px] gap-y-10 mt-5">
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

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
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
        after: $endCursor
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
