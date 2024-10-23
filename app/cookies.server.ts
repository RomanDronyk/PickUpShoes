import {createCookie} from '@shopify/remix-oxygen';

export const viewedProductsCookie = createCookie('viewed-products', {
  maxAge: 604_800,
});

export const userCartId = createCookie('user-cart-id', {
  maxAge: 604_800,
});