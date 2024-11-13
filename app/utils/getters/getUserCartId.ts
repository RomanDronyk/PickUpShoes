import { USER_CART_ID_QUERY, USER_ID_BY_ACCESS_TOKEN_QUERY } from "~/graphql/queries";

export const getUserCartId = async (accessToken: string, context: any) => {
  const { storefront, admin, } = context;
  if (accessToken) {
    const { customer } = await storefront.query(USER_ID_BY_ACCESS_TOKEN_QUERY, {
      variables: {
        customerAccessToken: accessToken,
      },
    })
    if (!customer) return "";
    const getCustomerWithCartId = await admin(USER_CART_ID_QUERY, {
      variables: {
        id: customer?.id
      }
    })

    const userCartId = getCustomerWithCartId?.customer?.metafield?.value
    return userCartId;
  } else {
    return ""
  }
}
