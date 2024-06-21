import React, { useState, useEffect, useContext, useCallback } from 'react';
import { CartForm, Image, Money } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useVariantUrl } from '~/utils';
import { ArrowRight, X, Plus, Minus } from 'lucide-react';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { Variants } from 'framer-motion';
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import EmptyCart from './ui/emptyCart';
import { HeaderBasketContext, HeaderContextInterface } from '~/context/HeaderCarts';

type DropDownCartLine = CartApiQueryFragment['lines']['nodes'][0];
type DropdownCartProps = {
  cart: CartApiQueryFragment | null;
};

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

const cartVariants = {
  closed: {
    top: '-550%',
    opacity: 0,
    transition: {
      type: 'spring',
      opacity: 1,
      scale: 1,
      duration: 0.7,
    },
  },
  open: {
    top: '100.9%',
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 0.7,
      scale: 1,
    },
  },
} satisfies Variants;

export const DropDownCart = React.memo(({ cart }: DropdownCartProps) => {
  const { cartShow } = useContext(HeaderBasketContext) as HeaderContextInterface;
  const lines = Boolean(cart?.lines?.nodes?.length || 0);

  return (
    <motion.div
      initial={true}
      variants={cartVariants}
      animate={cartShow ? 'open' : 'closed'}
      exit="closed"
      className={cartShow
        ? "top-[101%] opacity-[1]  duration-[400] transition-all ease-out absolute z-20 w-full flex-col d-flex  bg-white/95 backdrop-blur-lg drop-shadow-cart rounded-b-[30px]  p-[30px] text-black"
        : "top-[-600%] opacity-0  duration-[400] transition-all ease-out absolute z-20 w-full flex-col d-flex  bg-white/95 backdrop-blur-lg drop-shadow-cart rounded-b-[30px]  p-[30px] text-black"
      }
    >
      {!lines && <EmptyCart />}
      {lines && <DropDownCartDetail cart={cart} />}
    </motion.div>
  );
});

const DropDownCartDetail = React.memo(({ cart }: { cart: CartApiQueryFragment | null }) => {
  const cost = cart?.cost;
  return (
    <div className="dropdown-detail">
      <div className="dropdown-table">
        <div className="dropdown-header grid grid-cols-12">
          <div className="dropdown-title  2xl:col-span-9 lg:col-span-4">
            <span className="font-semibold text-[26px] col-span-6">
              Корзина
            </span>
          </div>
          <div className="text-xl text-center w-[130px] xl:block hidden">
            Кількість
          </div>
          <div className="text-xl text-center w-[130px] xl:block hidden">
            Вартість
          </div>
        </div>
        <ul className="flex flex-col gap-4">
          {cart?.lines?.nodes.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </ul>
      </div>
      <div className="dropdown-bottom mt-12 flex flex-col gap-4">
        <div className="flex items-center justify-end font-bold text-black text-[22px]">
          <span className="mr-4">Підсумок: </span>
          <Money
            as="span"
            withoutCurrency
            withoutTrailingZeros
            data={cost?.totalAmount}
          />
          &nbsp;грн
        </div>
        <div className="dropdown-checkout flex items-center justify-end">
          <Button className="rounded-[60px] px-[55px]">
            <Link to={cart?.checkoutUrl || ""} className="flex gap-5">
              <span className="font-medium text-2xl">Оформити замовлення</span>
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 11.5C0 13.7745 0.674463 15.9979 1.9381 17.8891C3.20174 19.7802 4.99779 21.2542 7.09914 22.1246C9.20049 22.995 11.5128 23.2228 13.7435 22.779C15.9743 22.3353 18.0234 21.24 19.6317 19.6317C21.24 18.0234 22.3353 15.9743 22.779 13.7435C23.2228 11.5128 22.995 9.20049 22.1246 7.09914C21.2542 4.99779 19.7802 3.20174 17.8891 1.9381C15.9979 0.674463 13.7745 0 11.5 0C8.45001 0 5.52494 1.2116 3.36827 3.36827C1.2116 5.52494 0 8.45001 0 11.5ZM4.92857 10.6786H14.9089L10.3254 6.07282L11.5 4.92857L18.0714 11.5L11.5 18.0714L10.3254 16.8992L14.9089 12.3214H4.92857V10.6786Z"
                  fill="white"
                />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
});

const CartLineItem = React.memo(({ line }: { line: DropDownCartLine }) => {
  const { setCartShow } = useContext(HeaderBasketContext) as HeaderContextInterface;
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  const [isLoading, setIsLoading]=useState(false)
  const [newQuantity, setNewQuantity]=useState(line.quantity)
  const updateQuantity =(value:any)=>{
    setIsLoading(true)
  }
  useEffect((()=>{
    setIsLoading(false)
  }),[line])

  return (
    <li key={id} className="xl:grid xl:grid-cols-12 flex justify-between">
      <div className="grid grid-cols-[70px_250px_110px] items-center gap-[14px] 2xl:col-span-9 xl:col-span-8 col-span-7">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={70}
            loading="lazy"
            width={70}
            className="rounded-[15px] mr-[14px]"
          />
        )}
        <Link onClick={() => setCartShow(false)} prefetch="intent" to={lineItemUrl}>
          <span className="font-semibold lg:text-[22px] text-lg">
            {product.title}
          </span>
        </Link>
        <div className="">
          <ul>
            {selectedOptions.map((option) => (
              <li key={option.name}>
                <span>{option.name}: </span>
                <span className="opacity-60">{option.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="xl:grid xl:grid-cols-[130px_130px_130px] xl:col-span-3 flex  gap-x-3">
        <CartLineQuantity
setNewQuantity={updateQuantity}  line={line} />
        <CartLinePrice isLoading = {isLoading} line={line} as="span" />
        <div className="flex items-center justify-center">
          <CartLineRemoveButton setNewQuantity={updateQuantity} lineIds={[line.id]} />
        </div>
      </div>
    </li>
  );
});

const CartLineQuantity = React.memo(({ setNewQuantity, line }: { setNewQuantity:any, line: CartLine }) => {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex self-center items-center justify-center lg:gap-5 gap-3 text-lg text-black bg-input rounded-[62px] lg:px-5 px-2 py-1">
      <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
        <button
          onClick={()=>setNewQuantity()}
          aria-label="Зменшити кількість"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
          className="flex flex-col items-center cursor-pointer"
        >
          <Minus />
        </button>
      </CartLineUpdateButton>
      <span>{quantity}</span>
      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <button
          onClick={()=>setNewQuantity()}

          className="flex flex-col items-center cursor-pointer"
          aria-label="Збільшити кількість"
          name="increase-quantity"
          value={nextQuantity}
        >
          <Plus />
        </button>
      </CartLineUpdateButton>
    </div>
  );
});

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

  const moneyV2 =priceType === 'regular'
    ? line.cost.totalAmount
    : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className="self-center text-center font-semibold lg:text-[22px] text-lg">
      {isLoading? "Загрузка": <><Money
        withoutTrailingZeros
        withoutCurrency
        {...passthroughProps}
        data={moneyV2}
      />
      грн</>}
    </div>
  );
});

const CartLineUpdateButton = React.memo(({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
});

const CartLineRemoveButton = React.memo(({setNewQuantity, lineIds }: {setNewQuantity:any; lineIds: string[] }) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <Button
      onClick={setNewQuantity}
        type="submit"
        className="self-center w-[25px] h-[25px] p-[6px] rounded-full"
      >
        <X size={16} />
      </Button>
    </CartForm>
  );
});
