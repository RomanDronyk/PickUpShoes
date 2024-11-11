import { useActionData } from "@remix-run/react";
import { CustomerAccessToken } from "@shopify/hydrogen-react/storefront-api-types";
import { FC } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';

interface IReviewsModal {
  customerAccessToken: CustomerAccessToken,
}
export const ReviewsModal: FC<IReviewsModal> = ({ customerAccessToken }) => {
  const actionData = useActionData<any>();

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
      {/* <DialogContent className="sm:rounded-[30px] rounded-[30px] overflow-y-scroll overflow-x-scroll xl:overflow-visible max-h-[90vh]">
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


      </DialogContent> */}
    </Dialog>
  )
}