import {  PRODUCT_ITEM_FRAGMENT_WITHOUT_VARIANT_FRAGMENT } from "../fragments";

export const BEST_SELLERS_QUERY = `#graphql 
${PRODUCT_ITEM_FRAGMENT_WITHOUT_VARIANT_FRAGMENT}
query BestSellers($country: CountryCode, $language: LanguageCode) 
@inContext(country: $country, language: $language){
  collection(handle: "bestsellers"){
    products(first: 10) {
      nodes {
        ...ProductItem
      }
    } 
  }
}
`;