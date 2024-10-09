import { CUSTOMER_FRAGMENT } from "../fragments";


export const CUSTOMER_EMAIL_CONSENT_QUERY = `#graphql
${CUSTOMER_FRAGMENT}
query getCustomerByEmail($query: String!) {
  customers(first: 1, query: $query ) {
    edges {
      node {
        ...CustomerFragment
      }
    }
  }
}
`;