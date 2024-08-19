
import React, {  useEffect, useState } from 'react';
import { Money } from '@shopify/hydrogen';
import { Link, } from '@remix-run/react';
import { Button } from '../ui/button';

import type { CartApiQueryFragment } from 'storefrontapi.generated';
import CartLineItem from './CartLineItem';


const DropDownCartDetail = React.memo(({ cart }: { cart: CartApiQueryFragment | null }) => {
  const [shopifyCheckoutId, setShopifyCheckoutId] = useState("")
  useEffect(()=>{
    const lineItems =  cart?.lines?.nodes?.map(element=>{
      return {
        quantity: element?.quantity,
        variantId: element?.merchandise?.id
      }
    }) 
    if (lineItems) {
      const formData = new FormData();
      formData.append('action', 'create url');
      formData.append('lineItems', JSON.stringify(lineItems)); // Передавайте об'єкти як рядок JSON
      
      fetch('/checkout-api', {
        method: 'POST',
        body: formData
      }).then(response => response.json())
        .then((data:any) =>{
          setShopifyCheckoutId( data?.response?.checkoutCreate?.checkout?.id) 
        })
        .catch(error => console.error('Error:', error));
    }
  },[cart])

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
          {cart?.lines?.nodes.map((line:any) => (
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
            data={cost?.totalAmount||{currencyCode: "UAH", amount: "0"}}
          />
          &nbsp;грн
        </div>
        <div className="dropdown-checkout flex items-center justify-end">
            <Link to={`/checkout`|| ""}  onClick={()=>console.log(cart?.checkoutUrl)} className="flex gap-5">
          <Button className="rounded-[60px] px-[55px]">
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
          </Button>
            </Link>
        </div>
      </div>
    </div>
  );
});

export default DropDownCartDetail