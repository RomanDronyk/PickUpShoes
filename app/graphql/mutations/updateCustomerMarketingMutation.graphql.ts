import { CUSTOMER_FRAGMENT } from "../fragments";

export const UPDATE_CUSTOMER_MARKETING_CONSENT = `#graphql
${CUSTOMER_FRAGMENT}
mutation ($input: CustomerEmailMarketingConsentUpdateInput!) {
  customerEmailMarketingConsentUpdate(input: $input) {
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