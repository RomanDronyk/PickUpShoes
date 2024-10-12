export const PAYMENT_TERMS_TEMPLATE = `#graphql
query {
  paymentTermsTemplates {
    id
    name
    paymentTermsType
    dueInDays
    description
    translatedName
  }
}`