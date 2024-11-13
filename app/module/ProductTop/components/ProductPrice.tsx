import { ProductFragment } from "storefrontapi.generated";

const ProductPrice = ({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) => {
  const percentageAmount = selectedVariant?.compareAtPrice
    ? (
      (1 -
        parseInt(selectedVariant?.price?.amount) /
        parseInt(selectedVariant?.compareAtPrice?.amount)) *
      100
    ).toFixed()
    : null;
  return (
    <div className="product-price price flex gap-x-[10px] md:font-medium md:text-2xl text-lg">
      <div className="price flex gap-x-[10px] md:font-medium md:text-[32px] text-lg">
        <span className="font-extrabold text-[32px]">
          {selectedVariant?.price?.amount} грн
        </span>
        {selectedVariant?.compareAtPrice && (
          <>
            <span className="line-through text-[#B3B3B3]">
              {selectedVariant?.compareAtPrice?.amount}
            </span>
            <span className="flex self-center py-1 items-center justify-center rounded-xl px-3 bg-darkRed/10 font-medium text-[16px] text-destructive">
              {percentageAmount}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductPrice;