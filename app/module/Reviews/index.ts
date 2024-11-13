import fetchProductReviewsEasyByUrl from "./api/fetchProductReviewsEasyByUrl"
import ReviewsList from "./components/reviewsList"
import ReviewsModal from "./components/reviewsModal"
import transformReviewsData from "./helpers/transformReviewsData"
import { IReview } from "./types/index.types"
export {
  type IReview,
  fetchProductReviewsEasyByUrl,
  transformReviewsData,
  ReviewsModal,
  ReviewsList,
}