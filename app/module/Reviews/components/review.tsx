import { FC } from "react";
import formatDateFromMilliseconds from "../helpers/formatDateFromMilliseconds";
import { IReview, IReviewMedias, IReviewRatings } from "../types/index.types";

const Review: FC<{ review: IReview }> = ({ review }) => {
  return (
    <>
      <div key={review.reviewed_at} className="border py-[28px] px-[32px] rounded-[20px] shadow-lg">
        <div className="mb-[25px]">
          <div style={{ unicodeBidi: "bidi-override" }} className="text-[#cccccc60] text-3xl h-[30px] w-auto relative leading-none inline-block before:content-['★★★★★']">
            <span style={{ width: `${review.rating_percentage}%` }} className='inline-block absolute overflow-hidden w-0 left-0 top-0 before:text-[color:#ffaa00] before:content-["★★★★★"]'></span>
          </div>
          <div>
            <span className="font-bold text-[20px] ">{review.reviewer_name}</span>
            <span className="ml-2 text-green-600">✔</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {review.review_ratings.map((rating: IReviewRatings) => {
            return (
              <span key={rating.reviews_id + rating.rating_title} className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm">{rating.rating_title} — {rating.rating_value}</span>
            )
          })}
        </div>
        <p className="text-gray-700 mb-[15px]">
          {review.content}
        </p>
        <div className="flex space-x-2 mb-[30px]">
          {review.review_medias.map((image: IReviewMedias) => {
            return <div key={image.media_path} className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md">
              <span className="text-gray-500"><img srcSet={`${image.media_path}/w=300,sharpen=1 2x, ${image.media_path}/w=450,sharpen=1 3x`} src={image.media_path + "/w=150,sharpen=1"} /></span>
            </div>
          })}
        </div>
        <div className="text-gray-500 text-sm">
          Опубліковано {formatDateFromMilliseconds(String(review.reviewed_at))}
        </div>
      </div>
    </>
  )
}
export default Review;