import { Link } from "@remix-run/react";
import { VariantOption } from "@shopify/hydrogen";
import { cn } from "~/lib/utils";

const ProductOptions = ({ option }: { option: VariantOption }) => {
  const bannedOptionsName = ["Колір", "Color", "Назва", "Name"]
  if (bannedOptionsName.find(element => element == option.name)) return null
  return (
    <div className="product-options" key={option.name}>
      <h5 className="text-[16px] text-black/60 mb-4">{option.name}</h5>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(30px,80px))] gap-y-[10px] gap-x-[10px] items-start">
        {option.values.map(({ value, isAvailable, isActive, to }) => {
          if (isAvailable) {
            return <Link
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              className={cn(
                'text-black text-[16px] px-[18px] py-[15px] rounded-[22px] flex max-w-[76px] justify-center self-start bg-[#F0F0F0]',
                isActive && 'text-white bg-black',
              )}
            >
              {value}
            </Link>
          }
        })}
      </div>
    </div>
  );
}
export default ProductOptions;