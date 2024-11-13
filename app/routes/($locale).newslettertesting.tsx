import invariant from 'tiny-invariant';
import { defer, json, redirect, type ActionArgs } from '@shopify/remix-oxygen';
import { CUSTOMER_EMAIL_CONSENT_QUERY, USER_CART_ID_QUERY } from '~/graphql/queries';
import { CREATE_SUBSCRIBER, UPDATE_CUSTOMER_MARKETING_CONSENT } from '~/graphql/mutations';
import { Button } from '~/components/ui/button';
import { Form, useActionData } from '@remix-run/react';
import { syncUserCart } from '~/utils/syncUserCart';

type Subscriber = {
  id: string;
  email: string;
  emailMarketingConsent: {
    consentUpdatedAt: string;
    marketingOptInLevel: string;
    marketingState: string;
  };
};

type CustomerMutationSuccess = {
  customer: Subscriber;
  error: null;
};

type CustomerMutationError = {
  customer: null;
  error: { field: string; message: string };
};

type CustomerMutation = CustomerMutationSuccess | CustomerMutationError;

export async function action({ context, request }: ActionArgs) {
  const { session, storefront, cart, headers } = context;
  const cartData = await cart.get();
  const formData = await request.formData();
  const action = formData.get("action") as string;
  const email = formData.get('email') as string;


  if (action === "get cart id") {
    const updateCartId = await cart.getCartId()
    return json({ id: cartData?.id, cartData, updateCartId })
  }

  if (action === "update cart id") {
    const cartId = formData.get("cartId") as string;

    const updateCartId = await cart.setCartId(cartId)
    return json({ lsdfj: "lsfjka", updateCartId, cartId })

  } else if (action === "checking") {
    return json({ message: "checking" })


  } else if (action === "update user metafield") {
    const { accessToken } = await session.get('customerAccessToken');

    const updateCartIdInUser = await syncUserCart(accessToken, cartData.id, context)

    return json(updateCartIdInUser)
  } else if (action == "get user metafields") {
    const { accessToken } = await session.get('customerAccessToken');
    const GET_USER_DATA_BY_ACCESS_TOKEN = `#graphql
    query customerGetId (
      $customerAccessToken: String!
    ) {
      customer(customerAccessToken: $customerAccessToken) {
        id
      }
    }`;
    const { customer } = await storefront.query(GET_USER_DATA_BY_ACCESS_TOKEN, {
      variables: {
        customerAccessToken: accessToken,
      },
    })
    const getCustomer = await context.admin(GET_ALL_CUSTOMER_FIELDS, {
      variables: {
        id: customer?.id
      }
    })
    return json(getCustomer)
  } else if (action == "get cart by id") {

    const getCart = await storefront.query(GET_CART_DATA_BY_ID, {
      variables: {
        id: formData.get("cartId"),
      }
    })
    return json({ getCart, cartData })
  } else if (action === "get headers") {
    const cookies = request.headers.get('Cookie');
    return json(cookies)
  }


  return json({ data: "dls;kafj" })

}





export function loader() {

  return json({})
}
export default function newslettertesting() {
  const actionData = useActionData();
  console.log(actionData)
  return (
    <>
      <h1>asdfasdf</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 30 }}>ada
        <Form method='POST'>
          <input type='hidden' name='action' value="get headers" />
          <Button variant="outline" size={"lg"} className="bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px] cursor-pointer">
            get headers
          </Button>
        </Form>
        <Form method='POST'>
          <input type='hidden' name='action' value="get cart id" />
          <Button variant="outline" size={"lg"} className="bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px] cursor-pointer">
            get cart id
          </Button>
        </Form>
        <Form method='POST'>
          <input type='hidden' name='action' value={"checking"} />
          <Button variant="outline" size={"lg"} className="bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px] cursor-pointer">
            checking
          </Button>
        </Form>
        <Form method='POST'>
          <input type='hidden' name='action' value={"update cart id"} />
          <input type='hidden' name='cartId' value={"gid://shopify/Cart/Z2NwLWV1cm9wZS13ZXN0MTowMUpBTlZYVks4NE1HU1ZWUDc5TVlHV0FRSw?key=fa0761a468ce3dd4d21eab92f6347247"} />
          <Button variant="outline" size={"lg"} className="bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px] cursor-pointer">
            update cart id
          </Button>
        </Form>
        <Form method='POST'>
          <input type='hidden' name='action' value={"get cart by id"} />
          <input type='hidden' name='cartId' value={"gid://shopify/Cart/Z2NwLWV1cm9wZS13ZXN0MTowMUpBTlZYVks4NE1HU1ZWUDc5TVlHV0FRSw?key=fa0761a468ce3dd4d21eab92f6347247"} />
          <Button variant="outline" size={"lg"} className="bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px] cursor-pointer">
            get cart by id
          </Button>
        </Form>
        <Form method='POST'>
          <input type='hidden' name='action' value={"update user metafield"} />
          <input type='hidden' name='cartId' value={"gid://shopify/Cart/Z2NwLWV1cm9wZS13ZXN0MTowMUpBTlZYVks4NE1HU1ZWUDc5TVlHV0FRSw?key=fa0761a468ce3dd4d21eab92f6347247"} />
          <Button variant="outline" size={"lg"} className="bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px] cursor-pointer">
            update user metafield
          </Button>
        </Form>
        <Form method='POST'>
          <input type='hidden' name='action' value={"get user metafields"} />
          <input type='hidden' name='cartId' value={"gid://shopify/Cart/Z2NwLWV1cm9wZS13ZXN0MTowMUpBTlZYVks4NE1HU1ZWUDc5TVlHV0FRSw?key=fa0761a468ce3dd4d21eab92f6347247"} />
          <Button variant="outline" size={"lg"} className="bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px] cursor-pointer">
            get user metafields
          </Button>
        </Form>
      </div>
    </>
  )
}


export const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation customerUpdate(
    $customerAccessToken: String!,
    $customer: CustomerUpdateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        acceptsMarketing
        email
        firstName
        id
        lastName
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;

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

const GET_CART_DATA_BY_ID = `#graphql
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


const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
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
  fragment CartApiQuery on Cart {
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
    lines(first: $numCartLines) {
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
` as const;




const GET_ALL_CUSTOMER_FIELDS = `#graphql 
query getCustomerAllField($id: ID!) {
    customer(id:$id) {
      metafield(key: "nickname", namespace: "likedCart") {
        description
        id
        namespace
        key
        type
        value
      }
    }
  }
`








/**
 * Returns a success response with a cookie for marketing consent
 * @param subscriber
 * @param session
 */
async function returnSuccess({
  subscriber,
  session,
}: {
  subscriber: Subscriber;
  session: ActionArgs['context']['session'];
}) {
  // persist the marketing consent in a cookie so it can be read in the newsletter form
  // to show if a user is already subscribed without having to make an API call
  session.set(
    'emailMarketingConsent',
    subscriber.emailMarketingConsent.marketingState,
  );
  return json(
    { subscriber, error: null },
    {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    },
  );
}

function returnError({ error }: { error: { message: string } }) {
  console.error(error.message);
  return json({ subscriber: null, error });
}

/**
 * Get a customer marketing consent by email
 * @param email
 * @param context
 */
async function getCustomerConsent({
  email,
  context,
}: {
  email: string;
  context: ActionArgs['context'];
}) {


  const { customers } = await context.admin(CUSTOMER_EMAIL_CONSENT_QUERY, {
    variables: { query: `email:${email}` },
  });

  const customer = customers.edges[0]?.node;

  if (!customer) {
    return { customer: null, error: null };
  }

  return { customer, error: null };
}

/**
 * Update a customer's marketing consent
 * @param customerId
 * @param context
 */
async function updateCustomerMarketingConsent({
  customerId,
  context,
}: {
  customerId: string;
  context: ActionArgs['context'];
}): Promise<CustomerMutation> {
  const consentUpdatedAt = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  ).toISOString();



  const input = {
    customerId,
    emailMarketingConsent: {
      consentUpdatedAt,
      marketingOptInLevel: 'SINGLE_OPT_IN',
      marketingState: 'SUBSCRIBED',
    },
  };

  const { customerEmailMarketingConsentUpdate } = await context.admin(
    UPDATE_CUSTOMER_MARKETING_CONSENT,
    {
      variables: { input },
    },
  );

  if (customerEmailMarketingConsentUpdate.userErrors.length) {
    const [{ field, message }] = customerEmailMarketingConsentUpdate.userErrors;
    return { error: { field, message }, customer: null };
  }

  // success
  return {
    customer: customerEmailMarketingConsentUpdate.customer,
    error: null,
  };
}

async function createSubscriber({
  email,
  context,
}: {
  email: string;
  context: ActionArgs['context'];
}): Promise<CustomerMutation> {

  const consentUpdatedAt = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  ).toISOString();

  const input = {
    email,
    // acceptsMarketing: true,
    // or smsMarketingConsent if subscribing via phone number
    emailMarketingConsent: {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
    },

  };

  const { customerCreate } = await context.admin(CREATE_SUBSCRIBER, {
    variables: { input },
  });

  if (customerCreate.userErrors.length) {
    const [{ field, message }] = customerCreate.userErrors;
    return { error: { field, message }, customer: null };
  }

  // success
  const { customer } = customerCreate;
  return { customer, error: null };
}
