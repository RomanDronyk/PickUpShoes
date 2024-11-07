
import React, { FC } from "react";
import { useMedia } from "react-use";
import RecommendedCart, { IProduct, RecommendedCartMobile } from "../RecommendedCart";

interface ICheckoutRecommendationList {
  carts: IProduct[];
}

const CheckoutRecommendationList: FC<ICheckoutRecommendationList> = ({ carts }: any) => {
  const isMobile = useMedia('(max-width: 767px)', false);
  return (
    <>
      {carts.length > 0 && carts.map((product: IProduct, index: number) => (
        <React.Fragment key={product.id}>
          {
            isMobile ?
              <RecommendedCartMobile product={product} /> :
              <RecommendedCart product={product} />
          }
          {carts.length - 1 !== index && <div key={carts.length - 1 + index} className='border border-black/10'></div>}
        </React.Fragment>
      ))}
    </>
  )

}
export default CheckoutRecommendationList