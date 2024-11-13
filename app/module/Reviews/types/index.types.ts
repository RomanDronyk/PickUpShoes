import { CustomerAccessToken } from "@shopify/hydrogen-react/storefront-api-types"

export interface IReviewMedias {
  media_path: string,
}
export interface IReviewRatings {
  reviews_id: string,
  rating_title: string,
  rating_value: string,
}
export interface IReview {
  rating_percentage: number,
  reviewer_name: string,
  review_ratings: IReviewRatings[],
  content: string
  review_medias: IReviewMedias[]
  reviewed_at: number
}
export interface IReviewsList {
  reviews: IReview[],
  errorMessage: string,
  startCursor: string,
  loadMoreReviews: () => Promise<void>
  loading: boolean
}
export interface IReviewsModal {
  customerAccessToken: CustomerAccessToken,
}