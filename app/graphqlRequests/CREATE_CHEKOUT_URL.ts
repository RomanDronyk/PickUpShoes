const CREATE_CHEKOUT_URL = `#graphql
mutation createCheckout($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout {
      webUrl
      id
      subtotalPriceV2 {
        amount
        currencyCode
      }
      totalPriceV2 {
        amount
        currencyCode
      }
      lineItems(first: 5) {
        edges {
          node {
            title
            quantity
            variant {
              priceV2 {
                amount
                currencyCode
              }
              image {
                src
                altText
              }
            }
          }
        }
      }
    }
    checkoutUserErrors {
      code
      field
      message
    }
  }
}
`
export default CREATE_CHEKOUT_URL