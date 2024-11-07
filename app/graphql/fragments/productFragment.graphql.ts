import { PRODUCT_VARIANT_FRAGMENT } from './productVariantFragment.graphql';

export const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
    descriptionHtml
    description
    metafields(identifiers: $identifiers) {
      namespace
      id
      value
      description
      key
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 10) {
      nodes {
        ...ProductVariant
      }
    }
    media(first: 10) {
      nodes {
        ... on MediaImage {
          __typename
          id
          previewImage {
            url
            id
            height
            width
          }
          image {
            url
          }
        }
      }
    }
    seo {
      description
      title
    }
    collections(first: 1) {
      nodes {
        title
        handle
      }
    }
    tags
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;
