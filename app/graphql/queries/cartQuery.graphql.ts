const CART_MONEY_FRAGMENT = `#graphql
fragment Money on MoneyV2 {
  currencyCode
  amount
}
`;

const CART_LINE_FRAGMENT = `#graphql
fragment CartLine on CartLine {
  id
  quantity
  attributes {
    key
    value
  }
  cost {
    totalAmount {
      ...Money
    }
    amountPerQuantity {
      ...Money
    }
    compareAtAmountPerQuantity {
      ...Money
    }
  }
  merchandise {
    ... on ProductVariant {
      id
      availableForSale
      sku
      compareAtPrice {
        ...Money
      }
      price {
        ...Money
      }
      requiresShipping
      title
      image {
        id
        url
        altText
        width
        height
      }
      product {
        handle
        title
        id
      }
      selectedOptions {
        name
        value
      }
    }
  }
}
`;
export const GET_CART_DATA_BY_ID = `#graphql
query getCartData($id: ID!) {
  cart(id: $id) {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: 100) {
      nodes {
        ...CartLine
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
}
${CART_MONEY_FRAGMENT}
${CART_LINE_FRAGMENT}
`;