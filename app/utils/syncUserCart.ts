import { UPDATE_CUSTOMER_METAFIELDS_MUTATION } from "~/graphql/mutations";
import { CUSTOMER_DATA_BY_ACCESS_TOKEN_QUERY } from "~/graphql/queries";

export const syncUserCart = async (accessToken: string, cartId: string, context: any) => {
  if (cartId === undefined || cartId === "" || accessToken === undefined || accessToken === "") {
    throw Error("Options not correct")
  }
  const { storefront, admin } = context;

  const { customer } = await storefront.query(CUSTOMER_DATA_BY_ACCESS_TOKEN_QUERY, {
    variables: {
      customerAccessToken: accessToken,
    },
  })
  const updateUserMetaField = await admin(UPDATE_CUSTOMER_METAFIELDS_MUTATION, {
    variables: {
      "input": {
        "metafields": [
          {
            "namespace": "cartId",
            "key": "nickname",
            "type": "single_line_text_field",
            "value": cartId
          },
        ],
        "id": customer?.id
      }
    }
  })
  return updateUserMetaField
}