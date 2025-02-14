import invariant from 'tiny-invariant';
import { ActionFunctionArgs, json, redirect } from '@shopify/remix-oxygen';
import { CUSTOMER_EMAIL_CONSENT_QUERY } from '~/graphql/queries';
import { CREATE_SUBSCRIBER, UPDATE_CUSTOMER_MARKETING_CONSENT } from '~/graphql/mutations';

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

export async function action({ context, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;

  invariant(email, 'Email is required');

  try {
    const existing = await getCustomerConsent({
      email,
      context,
    });

    const alreadySubscribed =
      existing?.customer?.emailMarketingConsent?.marketingState ===
      'SUBSCRIBED';

    // already subscribed?
    if (alreadySubscribed) {
      return await returnSuccess({
        subscriber: existing.customer,
        session: context.session,
      });
    }

    // create or update customer subscriber
    if (!existing.customer) {
      // create
      const created = await createSubscriber({
        email,
        context,
      });

      if (created.error) {
        return returnError({ error: created.error });
      }

      return await returnSuccess({
        subscriber: created.customer,
        session: context.session,
      });
    } else {
      // else, update existing
      const updated = await updateCustomerMarketingConsent({
        customerId: existing.customer?.id,
        context,
      });

      if (updated.error) {
        return returnError({ error: updated.error });
      }

      return await returnSuccess({
        subscriber: updated.customer,
        session: context.session,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return returnError({ error });
    }
    return returnError({ error: { message: JSON.stringify(error) } });
  }
}

export function loader() {
  return redirect('/');
}

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
  session: ActionFunctionArgs['context']['session'];
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
  context: ActionFunctionArgs['context'];
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
  context: ActionFunctionArgs['context'];
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
  context: ActionFunctionArgs['context'];
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
