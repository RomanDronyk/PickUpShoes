import { PRODUCT_FRAGMENT } from '../fragments/productFragment.graphql';

export const PRODUCT_QUERY = `#graphql
  query Product(
    $handle: String!
    $identifiers: [HasMetafieldsIdentifier!]!,
    $selectedOptions: [SelectedOptionInput!]!
  ) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
