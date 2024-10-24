export const LIKED_PRODUCT_QUERY =`#graphql
query getProductById(
  $id: ID!
) {
  productVariant(id: $id) {
    title
    displayName
    createdAt
    price
    compareAtPrice
    inventoryQuantity
    id
    availableForSale
    weight
    weightUnit
    product{
      handle

    }
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    selectedOptions {
      name
      value
    }
    sku
  }
}
`

