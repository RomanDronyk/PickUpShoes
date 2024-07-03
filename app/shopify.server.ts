// // app/shopify.server.js
// // Note that you don't need to import the node adapter if you're running on a different runtime.
// import '@shopify/shopify-app-remix/server/adapters/node';
// // Memory storage makes it easy to set an app up, but should never be used in production.
// import {MemorySessionStorage} from '@shopify/shopify-app-session-storage-memory';
// import {LATEST_API_VERSION} from  "@shopify/shopify-api"
// import {shopifyApp} from "@shopify/shopify-app-remix/server"

// const shopify = shopifyApp({
//   apiKey: process.env.PUBLIC_STOREFRONT_API_TOKEN,
//   apiSecretKey: process.env.PRIVATE_STOREFRONT_API_TOKEN,
//   appUrl: process.env.PUBLIC_CHECKOUT_DOMAIN,
//   scopes: ['read_products'],
//   apiVersion: LATEST_API_VERSION,
//   sessionStorage: new MemorySessionStorage(),
// });
// export default shopify;