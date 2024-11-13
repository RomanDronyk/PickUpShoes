import { json, redirect } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/server-runtime";
export async function action({ request, context }: ActionFunctionArgs) {
  const { session } = context;

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }
  const form = await request.formData();
  const customerAccessToken: any = form.get("accessToken") || ""
  if (!customerAccessToken) {
    return json({ error: 'Token not found' }, { status: 405 });
  }

  const cookieObject = {
    accessToken: customerAccessToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
  session.set('customerAccessToken', cookieObject);

  return redirect('/account/profile', {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}
export const loader = async ({ context }: LoaderFunctionArgs) => {
  return json({
    socialWidgetBaseUrl: context.env.PUBLIC_SOCIAL_WIDGET_BASE_URL,
    publickStoreFront: context.env.PUBLIC_STOREFRONT_API_TOKEN,
    publickStoreDomain: context.env.PUBLIC_STORE_DOMAIN,
  });
};