export const DRAFT_ORDER_CREATE_MUTATION = `#graphql
mutation draftOrderCreate($input: DraftOrderInput!) {
  draftOrderCreate(input: $input) {
    draftOrder {
      id
    }
  }
}`

export const DRAFT_ORDER_COMPLETE_MUTATION = `#graphql
mutation draftOrderComplete($id: ID!) {
    draftOrderComplete(id: $id) {
      draftOrder {
        id
        order {
          id
        }
      }
    }
  }`
export const MARK_AS_PAID_MUTATION = `#graphql
mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
    orderMarkAsPaid(input: $input) {
      order {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`
