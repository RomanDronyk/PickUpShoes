import { PRODUCT_ITEM_FRAGMENT_WITHOUT_VARIANT_FRAGMENT } from '../fragments';

export const SEARCH_QUERY = `#graphql

  query search(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $query: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query,
      unavailableProducts: HIDE,
      types: [PRODUCT],
      first: $first,
      sortKey: RELEVANCE,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
          ...ProductItem
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    
  }
  ${PRODUCT_ITEM_FRAGMENT_WITHOUT_VARIANT_FRAGMENT}
` as const;
