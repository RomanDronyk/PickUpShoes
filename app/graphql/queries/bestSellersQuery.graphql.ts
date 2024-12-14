import { PRODUCT_ITEM_FRAGMENT_WITHOUT_VARIANT_FRAGMENT } from "../fragments";

export const BEST_SELLERS_QUERY = `#graphql 
${PRODUCT_ITEM_FRAGMENT_WITHOUT_VARIANT_FRAGMENT}
query BestSellers {
  collection(handle: "bestsellers"){
    products(first: 10) {
      nodes {
        ...ProductItem
      }
    } 
  }
}
`;