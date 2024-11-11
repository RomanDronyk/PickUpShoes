
const API_URL = "https://73dd57-2.myshopify.com/apps/easyreviews-proxy/online_store/product_reviews/listing"
const fetchProductReviewsEasy = async (productId: string) => {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    }
  })
  if (!response.ok) {
    throw Error("Failed to fech product reviews")
  }
  const result: any = await response.json()
  return result?.data

}
export default fetchProductReviewsEasy;
