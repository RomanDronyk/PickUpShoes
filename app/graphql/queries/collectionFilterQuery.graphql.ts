export const COLLECTION_FILTER_QUERY = `#graphql
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