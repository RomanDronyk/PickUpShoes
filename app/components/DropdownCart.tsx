import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];
type DropdownCartProps = {
  cart: Promise<CartApiQueryFragment | null>;
};

type DropdownCartBody = {
  data: CartApiQueryFragment | null;
};

export function DropdownCart({cart}: DropdownCartProps) {
  return (
    <div className="absolute top-full z-20 w-full opacity-95 bg-white drop-shadow-cart rounded-b-[30px] px-[30px] text-black">
      <Suspense>
        <Await resolve={cart}>
          {(cart) => <DropDownCartBody data={cart} />}
        </Await>
      </Suspense>
    </div>
  );
}

function DropDownCartBody({data}: DropdownCartBody) {
  console.log(data);
  return <div>adsfadfasfasf</div>;
}

function CartLine() {
  return <div>item</div>;
}
