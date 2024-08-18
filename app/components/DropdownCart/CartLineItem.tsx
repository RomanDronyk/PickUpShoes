

import React, { useState, useEffect, useContext } from 'react';
import { Image } from '@shopify/hydrogen';
import { Link, } from '@remix-run/react';
import { useVariantUrl } from '~/utils';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLine } from '@shopify/hydrogen/storefront-api-types';
import { HeaderBasketContext, HeaderContextInterface } from '~/context/HeaderCarts';
import CartLineQuantity from './CartLineQuantity';
import CartLinePrice from './CartLinePrice';
import CartLineRemoveButton from './CartLineRemoveButton';

const CartLineItem = React.memo(({ line }: { line: CartLine }) => {
  const { setCartShow } = useContext(HeaderBasketContext) as HeaderContextInterface;
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const [isLoading, setIsLoading] = useState(false)
  const updateQuantity = (value: any) => {
    setIsLoading(true)
  }
  useEffect((() => {
    setIsLoading(false)
  }), [line])


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
          setNewQuantity={updateQuantity} line={line} />
        <CartLinePrice isLoading={isLoading} line={line} as="span" />
        <div className="flex items-center justify-center">
          <CartLineRemoveButton setNewQuantity={updateQuantity} lineIds={[line.id]} />
        </div>
      </div>
    </li>
  );
});


type DropDownCartLine = CartApiQueryFragment['lines']['nodes'][0];

export default CartLineItem