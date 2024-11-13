import { FC } from "react";
import { IReview, IReviewsList } from "../types/index.types";
import Review from "./review";
import { Button } from "~/components/ui/button";
import LoaderNew from "~/components/LoaderNew";

const ReviewsList: FC<IReviewsList> = ({
  reviews,
  errorMessage,
  startCursor,
  loadMoreReviews,
  loading,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((review: IReview) => {
          return (
            <Review key={review.reviewed_at + review.reviewer_name} review={review}></Review>
          )
        })}
      </div>
      {errorMessage && <p className='text-red text-[14px] text-center'> {errorMessage} </p>}
      {startCursor &&
        <div className='flex justify-center py-[10px]'>
          <Button
            className='bg-black text-white'
            variant="outline"
            onClick={loadMoreReviews}
            type='button' >
            {loading ?
              <div className='h-[16px]'>
                <LoaderNew />
              </div>
              : "Загрузити ще відгуки"}
          </Button>
        </div>}
    </>
  )
}
export default ReviewsList;