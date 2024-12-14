
import React, { FC } from "react";
import { useMedia } from "react-use";
import { IProduct } from "../RecommendedCart";
import CheckoutCartMobile from "../CheckoutCartMobile";
import CheckoutCart from "../CheckoutCart";

interface ICheckoutCartList {
  carts: IProduct[];
}

const CheckoutCartList: FC<ICheckoutCartList> = ({ carts }: ICheckoutCartList) => {
  const isMobile = useMedia('(max-width: 767px)', false);
  console.log(carts, "carts")
  return (
    <>
      {carts.length > 0 && carts.map((product: IProduct, index: number) => (
        <React.Fragment key={product.id + "12recommendedee"}>
          {
            isMobile ?
              <CheckoutCartMobile key={`sfsfssdfsf${index}`} cartsFromCart={product} /> :
              <CheckoutCart key={`123123123${index}`} cartsFromCart={product} />
          }

          {carts.length - 1 !== index && <div key={carts.length - 1 + index} className='border border-black/10'></div>}
        </React.Fragment>
      ))}
    </>
  )

}
export default CheckoutCartList