// GraphQL API URL
const API_URL = "https://73dd57-2.myshopify.com/apps/doran/api/graphql";

// Запит до Shopify API
const fetchProductReviewsDoran = async (productId: string, filters = [], sort = "Recently", startAfter = null) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify({
      query: PRODUCT_REVIEWS_QUERY,
      variables: {
        shopifyProductId: productId,
        filters,
        sort,
        startAfter,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product reviews");
  }

  const result: any = await response.json();
  return result.data.productWidgetReviews;
};
export default fetchProductReviewsDoran;
export const PRODUCT_REVIEWS_QUERY = `
query productWidgetReviews($startAfter: ID, $shopifyProductId: ID!, $filters: [ReviewFilterOptionEnum], $sort: ReviewSortOptionEnum!) {
  productWidgetReviews(startAfter: $startAfter, shopifyProductId: $shopifyProductId, filters: $filters, sort: $sort) {
    nodes {
      id
      authorName
      title
      content
      isPin
      isVerifiedPurchase
      helpfulCount
      mediaFiles
      stars
      country
      reply
      createdAt
      productHandle
      productImage
      productName
      reviewQuestionFormAnswers
    }
    hasNextPage
    startAfter
  }
}
`;