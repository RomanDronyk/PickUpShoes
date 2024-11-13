export const getUserLikedCartIds = async (accessToken: string, context: any) => {
  const { storefront, admin } = context;
  const { customer } = await storefront.query(GET_USER_DATA_BY_ACCESS_TOKEN, {
    variables: {
      customerAccessToken: accessToken,
    },
  })
  if(!customer){
    return []
  }
  const getCustomer = await context.admin(GET_ALL_CUSTOMER_FIELDS, {
    variables: {
      id: customer?.id
    }
  })
  const customerLikedCart = getCustomer?.customer?.metafield?.value || "[]"
  console.log(customerLikedCart, "dlskfjslkdj")
  const parseCustomerLikedCart = customerLikedCart? JSON.parse(customerLikedCart): [];
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
