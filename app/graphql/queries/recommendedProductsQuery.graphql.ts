import { PRODUCT_VARIANT_FRAGMENT } from '../fragments/productVariantFragment.graphql';

export const RECOMENDED_PRODUCT_QUERY = `#graphql
  query RecommendedProducts($id: ID!) {
    productRecommendations(productId: $id) {
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
        variants(first: 10) {
          nodes {
            ...ProductVariant
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;
