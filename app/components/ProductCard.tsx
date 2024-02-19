import {
  Image,
  Money,
  type VariantOption,
  VariantSelector,
} from '@shopify/hydrogen';
import {useState} from 'react';
import {cn} from '~/lib/utils';

import {Link} from '@remix-run/react';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';

export function ProductCard({product}: {product: ProductCardFragment}) {
  const [hovered, setHovered] = useState(false);
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  const percentageAmount = variant.compareAtPrice
    ? (
        (1 -
          parseInt(variant.price.amount) /
            parseInt(variant.compareAtPrice.amount)) *
        100
      ).toFixed()
    : null;
  const sizeOptions = [product.options[0]];
  return (
    <Link to={variantUrl} className="group/card">
      <div>
        <div className="relative overflow-hidden max-h-[400px] h-full">
          {product.featuredImage && (
            <Image
              alt={product.featuredImage.altText || product.title}
              aspectRatio="1/1"
              data={product.featuredImage}
              className="rounded-[20px] max-h-[400px] h-full"
              crop="bottom"
            />
          )}
          <div className="absolute w-full top-full bg-white  transition-all ease-in-out  duration-100 group-hover/card:bottom-0 group-hover/card:top-[unset] ">
            <VariantSelector
              handle={product.handle}
              options={sizeOptions}
              variants={product.variants.nodes}
            >
              {({option}) => (
                <ProductOptions key={option.name} option={option} />
              )}
            </VariantSelector>
          </div>
        </div>

        <div className="flex flex-col mt-3">
          <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
            {product.title}
          </h4>
          <div className="price flex gap-x-[10px] md:font-medium md:text-2xl text-lg">
            <span>{variant.price.amount} грн</span>
            {variant.compareAtPrice && (
              <>
                <span className="line-through text-[#B3B3B3]">
                  {variant.compareAtPrice.amount}
                </span>
                <span className="flex self-center py-1 items-center justify-center rounded-xl px-3 bg-darkRed/10 font-medium text-xs text-destructive">
                  {percentageAmount}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <div className="grid grid-cols-6 gap-x-[5px] gap-y-[10px] items-center place-content-center  py-[10px]">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <div key={option.name + value}>
              <Link
                prefetch="intent"
                preventScrollReset
                replace
                to={to}
                className={cn(
                  'border-r border-r-[#AD9F9F] flex text-sm font-medium leading-none items-center justify-center text-black/50',
                  isAvailable && 'text-black',
                )}
              >
                {value}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
