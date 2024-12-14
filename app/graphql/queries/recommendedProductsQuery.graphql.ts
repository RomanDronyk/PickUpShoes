import { PRODUCT_VARIANT_FRAGMENT } from '../fragments/productVariantFragment.graphql';

export const RECOMENDED_PRODUCT_QUERY = `#graphql
  query RecommendedProducts($country: CountryCode, $language: LanguageCode, $id: ID!, $intent: ProductRecommendationIntent) 
    @inContext(country: $country, language: $language) {
    
    productRecommendations(productId: $id, intent: $intent) {
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

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;