import { UPDATE_CUSTOMER_METAFIELDS_MUTATION } from "~/graphql/mutations";
import { CUSTOMER_DATA_BY_ACCESS_TOKEN_QUERY } from "~/graphql/queries";

export const syncUserLikedCart = async (accessToken: string, cartIds: string[], context: any) => {
  if (!isArrayOfStrings(cartIds) || accessToken === undefined || accessToken === "") {
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
            "namespace": "likedCart",
            "key": "nickname",
            "type": "json",
            "value": JSON.stringify(cartIds)
          },
        ],
        "id": customer?.id
      }
    }
  })
  return updateUserMetaField
}
function isArrayOfStrings(arr: any[]): boolean {
  return Array.isArray(arr) && arr.every(item => typeof item === 'string');
}