import { DRAFT_ORDER_COMPLETE_MUTATION, DRAFT_ORDER_CREATE_MUTATION } from "~/graphql/mutations"

export const generateOrderInShopifyAdmin = async (context: any, orderData: any) => {
  const {email, note,lineItems,phone, shippingAddress} = orderData;
  const createDraftOrder = await context.admin(DRAFT_ORDER_CREATE_MUTATION, {
    variables: {
      input: {
        email,
        note,
        lineItems,
        paymentTerms: {
          paymentTermsTemplateId: "gid://shopify/PaymentTermsTemplate/9",
        },
        sourceName: "Hydrogen",
        visibleToCustomer: true,
        phone,
        shippingAddress,
      }
    }
  })
  const completeOrder = await context.admin(DRAFT_ORDER_COMPLETE_MUTATION, {
    variables: {
      id: createDraftOrder?.draftOrderCreate?.draftOrder?.id,
    }
  })
  return completeOrder;
}