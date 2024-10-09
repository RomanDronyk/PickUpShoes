import { CUSTOMER_FRAGMENT } from "../fragments";

export const CREATE_SUBSCRIBER = `#graphql
${CUSTOMER_FRAGMENT}
mutation newCustomerLead($input: CustomerInput!) {
  customerCreate(input: $input) {
    customer {
      ...CustomerFragment
    }
    userErrors {
      field
      message
    }
  }
}
`;