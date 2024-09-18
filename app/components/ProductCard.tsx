import {
  Image,
  Money,
  type VariantOption,
  VariantSelector,
} from '@shopify/hydrogen';
import { cn } from '~/lib/utils';

import { Link, NavLink, redirect, useNavigate } from '@remix-run/react';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/utils';
import { useMedia } from 'react-use';
import { useRef, useReducer, useEffect, useState, useContext } from 'react';
import HeaderContext, { HeaderBasketContext, HeaderContextInterface } from '~/context/HeaderCarts';

export enum Label {
  bestseller = 'Хіт продажу',
  new = 'Новинка',
}

export function ProductCard({
  product,
  label,
}: {
  product: ProductItemFragment;
  label?: Label;
}) {
  const firstVariant = product.variants.nodes.find(variant => variant.availableForSale) || product.variants.nodes[0];

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const optionsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  const isMobile = useMedia('(max-width: 767px)', false);
  const navigate = useNavigate()
  const [dataForLike, setDataForLike] = useState({
    variants: {
      nodes: [...product.variants.nodes]
    },
    handle: product.handle,
    id: product.id,
    selectedVariant: { selectedOptions: [...firstVariant.selectedOptions], id: firstVariant.id, image: { ...product.featuredImage } },
    title: product.title,
    isLiked: false
  });

  const {
    likedCart,
    removeLikeCart,
    addLikedCart
  } = useContext(HeaderBasketContext) as HeaderContextInterface;




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
    if (dataForLike.isLiked) {
      setDataForLike({ ...dataForLike, isLiked: false })
      removeLikeCart(dataForLike)
    } else {
      addLikedCart(dataForLike)
      setDataForLike({ ...dataForLike, isLiked: true })
      navigate("/liked")
    }
  }

  useEffect(() => {
    forceUpdate();
  }, []);

  useEffect(() => {
    const productIndex = likedCart.findIndex((item: any) => item.id === dataForLike.id);
    if (productIndex === -1) {
      setDataForLike({ ...dataForLike, isLiked: false });
    }
    likedCart.map((element: any, index: number) => {
      if (element.id == dataForLike.id) {
        setDataForLike({ ...element, isLiked: true })
      }
    })
  }, [likedCart])

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
          <HeartIcon isFavorited={dataForLike.isLiked} />
        </button>
        {product.featuredImage && (
          <Link
            ref={linkRef}
            to={variantUrl}
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
        {!isMobile &&<div
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
        </div> }
        
      </div>
      <div className="flex flex-col mt-3">
        <Link to={variantUrl}>
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
  const colorOption = options?.find((opt: any) => opt.name === "Колір");

  return (
    <div className="product-options" key={option.name}>
      <div className="grid grid-cols-6 gap-x-[5px] gap-y-[10px] items-center place-content-center py-[10px]">
        {option.values.map(({ value, isAvailable, isActive, to }) => {
          let newLink = to;
          if (colorOption) {
            // Parse the URL and append the color parameter
            const [baseUrl, queryParams] = to.split('?');
            const searchParams = new URLSearchParams(queryParams);
            searchParams.set("Колір", colorOption.values[0]);
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

const HeartIcon = ({ isFavorited }: { isFavorited: boolean }) => {

  if (isFavorited) {
    return (
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="15px" height="15px" viewBox="0 0 15 15" xmlSpace="preserve">
        <path d="M13.91,6.75c-1.17,2.25-4.3,5.31-6.07,6.94c-0.1903,0.1718-0.4797,0.1718-0.67,0C5.39,12.06,2.26,9,1.09,6.75
       C-1.48,1.8,5-1.5,7.5,3.45C10-1.5,16.48,1.8,13.91,6.75z"/>
      </svg>
    )
  } else {
    return <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 1C2.7912 1 1 2.73964 1 4.88594C1 6.61852 1.7 10.7305 8.5904 14.8873C8.71383 14.961 8.85552 15 9 15C9.14448 15 9.28617 14.961 9.4096 14.8873C16.3 10.7305 17 6.61852 17 4.88594C17 2.73964 15.2088 1 13 1C10.7912 1 9 3.35511 9 3.35511C9 3.35511 7.2088 1 5 1Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  }
};