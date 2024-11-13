import { IReview } from "../types/index.types";

const transformReviewsData = (data: any): IReview[] => {
  return data?.reviews?.data.map((review: any) => ({
    rating_percentage: review.rating_percentage,
    reviewer_name: review.reviewer.name,
    review_ratings: review.review_ratings.map((rating: any) => ({
      reviews_id: String(rating.reviews_id),
      rating_title: rating.rating_title,
      rating_value: String(rating.rating_value),
    })),
    content: review.review_content,
    review_medias: review.review_medias.map((media: any) => ({
      media_path: media.media_path,
    })),
    reviewed_at: new Date(review.created_dt).getTime(),
  }))
}
export default transformReviewsData;