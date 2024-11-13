
const API_URL = "https://73dd57-2.myshopify.com"
const fetchProductReviewsEasyByUrl = async ( url:string) => {
  const response = await fetch(`${API_URL}${url}`, {
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
export default fetchProductReviewsEasyByUrl;
