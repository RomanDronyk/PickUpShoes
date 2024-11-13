import { useActionData } from "@remix-run/react";
import { FC } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { IReviewsModal } from "../types/index.types";
import ReviewThanks from "./reviewThanks";
import ReviewInputs from "./reviewInputs";
import ReviewLogin from "./reviewLogin";
const ReviewsModal: FC<IReviewsModal> = ({ customerAccessToken }) => {
  const actionData: any = useActionData<any>();

  return (
    <Dialog >
      <DialogTrigger className='overflow-hidden' asChild>
        <Button
          type="submit"
          variant="outline"
          className="max-w-[166px] h-[50px] bg-black text-white font-medium text-[18px] px-[23px] w-full rounded-[62px] py-[15px] cursor-pointer"
        >
          Написати відгук
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:rounded-[30px] rounded-[30px] overflow-y-scroll overflow-x-scroll xl:overflow-visible max-h-[90vh]">
        {actionData?.message == "success" ?
          <ReviewThanks /> :
          <>
            {customerAccessToken?.accessToken &&
              <ReviewInputs />
            }
            {!customerAccessToken?.accessToken &&
              <ReviewLogin />
            }
          </>
        }
      </DialogContent>
    </Dialog>
  )
}
export default ReviewsModal;