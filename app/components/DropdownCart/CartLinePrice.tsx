import {Money} from '@shopify/hydrogen';
import {CartLine} from '@shopify/hydrogen/storefront-api-types';

const CartLinePrice = ({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) => {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;
  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;
  if (moneyV2 == null) return null;

  return (
    <div className="self-center text-center font-semibold lg:text-[22px] text-lg">
      {moneyV2 && (
        <>
          <Money
            withoutTrailingZeros
            withoutCurrency
            {...passthroughProps}
            data={moneyV2}
          />
          грн
        </>
      )}
    </div>
  );
};

export default CartLinePrice;
