import {
  Image,
  Money,
  type VariantOption,
  VariantSelector,
} from '@shopify/hydrogen';
import { cn } from '~/lib/utils';

import { Link, NavLink } from '@remix-run/react';
import { useMedia } from 'react-use';
import { useRef, useEffect, useState, useContext } from 'react';
import { HeaderBasketContext, HeaderContextInterface } from '~/context/HeaderCarts';
import { Product, ProductVariant } from '@shopify/hydrogen-react/storefront-api-types';
import HeartIcon from './ui/heartIcon';

export enum Label {
  bestseller = 'Хіт продажу',
  new = 'Новинка',
}

export function ProductCard({
  product,
  label,
}: {
  product: Product;
  label?: Label;
}) {
  const firstVariant: ProductVariant = product.variants.nodes.find((variant: ProductVariant) => variant.availableForSale) || product.variants.nodes[0];
  const optionsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const variant = product.variants.nodes[0];
  const isMobile = useMedia('(max-width: 767px)', false);
  const [isLike, setIsLike] = useState(false)


  const {
    handleLikeToggle,
    likedCardId,
  } = useContext(HeaderBasketContext) as HeaderContextInterface;

  useEffect(() => {
    const productIndex = likedCardId.findIndex((item: any) => item === firstVariant?.id);
    if (productIndex === -1) {
      setIsLike(false)
    } else {
      setIsLike(true)
    }
  }, [likedCardId, product])

  const percentageAmount = variant.compareAtPrice
    ? (
      (1 -
        parseInt(variant.price.amount) /
        parseInt(variant.compareAtPrice.amount)) *
      100
    ).toFixed()
    : null;

  const sizeOptions = product.options.filter((option) => {
    return option.name === 'Size' || option.name === 'Розмір';
  });



  const toggleLike = () => {
    if (isLike) {
      handleLikeToggle(firstVariant.id, "delete")
    } else {
      handleLikeToggle(firstVariant.id, "add")
    }
  }


  return (
    <div className="group/card">
      <div
        className="relative overflow-hidden h-[var(--image-height)]"
        style={
          {
            '--options-height': `${optionsRef.current?.clientHeight}px`,
            '--image-height': `${imageRef.current?.clientHeight}px`,
          } as React.CSSProperties
        }
      >
        <button
          onClick={() => toggleLike()} // Функція для додавання/видалення зі списку бажань
          className=" absolute p-2 rounded-full bg-white shadow-lg  top-3 right-3 p-2"
          style={{ zIndex: 32 }}
          aria-label="Add to wishlist"
        >
          <HeartIcon isFavorited={isLike} />
        </button>
        {product.featuredImage && (
          <Link
            ref={linkRef}
            to={`/products/${product.handle}`}
            className="relative block rounded-[20px] overflow-hidden group-hover/card:h-[calc(var(--image-height)-var(--options-height)+10px)] w-full h-full transition-all duration-100 ease-in-out"
          >
            <div
              className="relative overflow-hidden"
              style={{
                height: 'var(--image-height)',
              }}
              ref={imageRef}>
              <Image
                alt={product.featuredImage.altText || product.title}
                aspectRatio="1/1"
                data={product.featuredImage}
                className="rounded-[20px] object-cover"
                crop="bottom"
              />
              <ProductLabel label={label} />
            </div>

          </Link>
        )}
        {!isMobile && <div
          ref={optionsRef}
          className="w-full top-full bg-white  transition-all ease-in-out  duration-100 group-hover/card:bottom-0 group-hover/card:top-[unset] "
        >

          <VariantSelector
            handle={product.handle}
            options={sizeOptions}
            variants={product.variants.nodes}
          >
            {({ option }) => <ProductOptions key={option.name} option={option} options={product.options} />}

          </VariantSelector>
        </div>}

      </div>
      <div className="flex flex-col mt-3">
        <Link to={`/products/${product.handle}`}>
          <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
            {product.title}
          </h4>
        </Link>
        <div className="price flex gap-x-[10px] md:font-medium md:text-2xl text-lg">
          <span>
            <Money
              data={{
                amount: variant.price.amount,
                currencyCode: variant.price.currencyCode,
              }}
              withoutCurrency
              withoutTrailingZeros
              as="span"
            />
            грн
          </span>
          {variant.compareAtPrice && (
            <>
              <span className="line-through text-[#B3B3B3]">
                <Money
                  data={{
                    amount: variant.compareAtPrice.amount,
                    currencyCode: variant.price.currencyCode,
                  }}
                  withoutCurrency
                  withoutTrailingZeros
                  as="span"
                />
              </span>
              <span className="flex self-center py-1 items-center justify-center rounded-xl px-3 bg-darkRed/10 font-medium text-xs text-destructive">
                {percentageAmount}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
function ProductOptions({ options, option }: { options?: any, option: VariantOption }) {
  const colorOption = options?.find((opt: any) => opt.name === "Колір" || opt.name == "Color");
  const sizeOption = options?.find((opt: any) => opt.name === "Розмір" || opt.name == "Size");

  return (
    <div className="product-options" key={option.name}>
      <div className="grid grid-cols-6 gap-x-[5px] gap-y-[10px] items-center place-content-center py-[10px]">
        {option.values.map(({ value, isAvailable, isActive, to }) => {
          console.log(options, option, 'option value')
          let newLink = to
          if (colorOption || sizeOption) {
            // Parse the URL and append the color parameter
            const [baseUrl, queryParams] = to.split('?');
            const searchParams = new URLSearchParams(queryParams);
            colorOption?.values?.length > 0 && searchParams.set("Color", colorOption.values[0]);
            newLink = `${baseUrl}?${searchParams.toString()}`;
          }

          return (
            <div key={option.name + value}>
              <NavLink
                to={newLink}
                className={cn(
                  'border-r border-r-[#AD9F9F] flex text-sm font-medium leading-none items-center justify-center text-black/50',
                  isAvailable && 'text-black',
                )}
              >
                {value}
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProductLabel({ label }: { label?: Label }) {
  switch (label) {
    case Label.bestseller:
      return (
        <div className="absolute top-3 left-3 bg-red font-semibold text-sm text-white leading-[18px] px-3 py-1 rounded-[10px]">
          <span>{label}</span>
        </div>
      );
    case Label.new:
      return (
        <div className="absolute top-3 left-3 bg-red font-semibold text-sm text-white leading-[18px] px-3 py-1 rounded-[10px]">
          <span>{label}</span>
        </div>
      );
    default:
      return '';
  }
}

