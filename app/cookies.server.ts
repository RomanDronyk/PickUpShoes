import { createCookie } from '@shopify/remix-oxygen';

export const viewedProductsCookie = createCookie('viewed-products', {
  maxAge: 604_800,
});

export const likedProductsCookie = createCookie("liked-products", {
  maxAge: 604_800,
});