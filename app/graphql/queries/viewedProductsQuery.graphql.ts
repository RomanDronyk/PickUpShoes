import { PRODUCT_VARIANT_FRAGMENT } from '../fragments/productVariantFragment.graphql';

export const VIEWED_PRODUCT_QUERY = `#graphql
  query ViewedProducts(
    $ids: [ID!]!
  ) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
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
            amount
            currencyCode
          }
        }
        variants(first: 20) {
          nodes {
            ...ProductVariant
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;
