const GET_CHECKOUT_QUERY = `#graphql
  query GetCheckout($checkoutId: ID!) {
    node(id: $checkoutId) {
      ... on Checkout {
        id
        webUrl
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
              variant {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                image {
                  altText
                  url
                  height
                  width
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
        shippingAddress {
          address1
          city
          country
          firstName
          lastName
          zip
        }
        email
      }
    }
  }
`;
export default GET_CHECKOUT_QUERY
