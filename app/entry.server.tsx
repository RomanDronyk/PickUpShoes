

import type { EntryContext } from '@shopify/remix-oxygen';
import { RemixServer } from '@remix-run/react';
import { isbot } from "isbot";
import { renderToReadableStream } from 'react-dom/server';
import { createContentSecurityPolicy } from '@shopify/hydrogen';
import { AppLoadContext } from '@remix-run/server-runtime';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    imgSrc: [
      "'self'", "https://imagedelivery.net", "https://cdn.shopify.com", 
      "https://pick-up-shoes.com.ua/", "http://localhost:3100", "data:", "blob:"
    ],
    styleSrc: [
      "'self'", "https://api.ipify.org","https://cdn.shopify.com", "https://apps.hiko.link","https://apps.hiko.software", 
      "https://monorail-edge.shopifysvc.com", "https://73dd57-2.myshopify.com", 
      "http://localhost:*"
    ],
    scriptSrc: [
      "'self'","https://api.ipify.org", "https://cdn.shopify.com", "https://apps.hiko.link","https://apps.hiko.software", 
      "https://monorail-edge.shopifysvc.com", "https://73dd57-2.myshopify.com", 
      "http://localhost:*"
    ],
    connectSrc: [
      "'self'", "https://api.ipify.org","https://apps.hiko.link","https://apps.hiko.software", "https://monorail-edge.shopifysvc.com", 
      "https://73dd57-2.myshopify.com", "http://localhost:*"
    ]
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
