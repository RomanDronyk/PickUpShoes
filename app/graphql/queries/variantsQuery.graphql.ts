import { PRODUCT_VARIANTS_FRAGMENT } from '../fragments';

export const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $handle: String!
  ) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
