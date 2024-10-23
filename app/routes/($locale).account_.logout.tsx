import { json, redirect, type ActionFunctionArgs } from '@shopify/remix-oxygen';
import { type MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Logout' }];
};

export async function loader() {
  return redirect('/account/login');
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { session, cart } = context;

  session.unset('customerAccessToken');

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const cartHeaders = cart.setCartId("");

  // Коммітимо сесію, видаляючи токен
  const sessionCookie = await session.commit();

  // Об'єднуємо заголовки для Cart ID та сесії
  const headers = new Headers(cartHeaders);
  headers.append('Set-Cookie', sessionCookie);

  return redirect('/', {
    headers: headers,
  });
}

export default function Logout() {
  return null;
}
