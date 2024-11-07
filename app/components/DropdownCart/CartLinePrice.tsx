import { Money } from "@shopify/hydrogen";
import { CartLine } from "@shopify/hydrogen/storefront-api-types";
import React from "react";
import LoaderNew from "../LoaderNew";

const CartLinePrice = React.memo(({
  isLoading,
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  isLoading:boolean;
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) => {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;
  const moneyV2 =priceType === 'regular'? line.cost.totalAmount: line.cost.compareAtAmountPerQuantity;
  if (moneyV2 == null) return null;

  return (
    <div className="self-center text-center font-semibold lg:text-[22px] text-lg">
      {isLoading? <div className='lg:h-[22px] h-lg'> <LoaderNew /></div>: <><Money
        withoutTrailingZeros
        withoutCurrency
        {...passthroughProps}
        data={moneyV2}
      />
      грн</>}
    </div>
  );
});

export default CartLinePrice