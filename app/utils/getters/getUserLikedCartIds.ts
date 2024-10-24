import { USER_CART_ID_QUERY, USER_ID_BY_ACCESS_TOKEN_QUERY } from "~/graphql/queries";

export const getUserLikedCartIds = async (accessToken: string, context: any) => {
  const { storefront, admin } = context;
  const { customer } = await storefront.query(GET_USER_DATA_BY_ACCESS_TOKEN, {
    variables: {
      customerAccessToken: accessToken,
    },
  })
  const getCustomer = await context.admin(GET_ALL_CUSTOMER_FIELDS, {
    variables: {
      id: customer.id
    }
  })
  const customerLikedCart = getCustomer.customer.metafield.value || ""
  const parseCustomerLikedCart = JSON.parse(customerLikedCart);
  return parseCustomerLikedCart || [];

}

const GET_USER_DATA_BY_ACCESS_TOKEN = `#graphql
query customerGetId (
  $customerAccessToken: String!
) {
  customer(customerAccessToken: $customerAccessToken) {
    id
  }
}`;
const GET_ALL_CUSTOMER_FIELDS = `#graphql 
query getCustomerAllField($id: ID!) {
  customer(id: $id) {
    metafield(key: "nickname", namespace: "likedCart") {
      description
      id
      namespace
      key
      type
      value
    }
  }
}
`
