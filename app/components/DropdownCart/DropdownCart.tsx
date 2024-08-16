import React, { useContext} from 'react';
import { defer} from '@remix-run/react';
import { motion } from 'framer-motion';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { Variants } from 'framer-motion';
import EmptyCart from '../ui/emptyCart';
import { HeaderBasketContext, HeaderContextInterface } from '~/context/HeaderCarts';
import DropDownCartDetail from './DropDownCartDetail';
type DropdownCartProps = {
  cart: CartApiQueryFragment | null;
};


const cartVariants = {
  closed: {
    opacity: 0,
    zIndex: 123,
    top: "-750%",
    transition: {
      type: 'spring',
      opacity: 1,
      scale: 1,
      duration: 0.5,
    },
  },
  open: {
    top: '100.9%',
      zIndex: 123,
      opacity: 1,
    transition: {
      type: 'spring',
      duration: 1,
      scale: 1,
    },
  },
} satisfies Variants;

export const loader = async ({context, request }: { context :any,request: Request }) => {
  const { storefront } = context;
  const data  = await storefront.query(CREATE_CHECKOUT_URL, {
    variables: {
      "input": {
        "lineItems": [
          {
            "variantId": "gid://shopify/ProductVariant/47843539878196",
            "quantity": 1
          }
        ],
        "email": "customer@example.com",
        "shippingAddress": {
          "address1": "123 Main Street",
          "city": "Anytown",
          "country": "US",
          "firstName": "John",
          "lastName": "Doe",
          "zip": "12345"
        }
      }
    }
});
return defer({
  data
});

}
export const DropDownCart = React.memo(({ cart }: DropdownCartProps) => {
  const { cartShow } = useContext(HeaderBasketContext) as HeaderContextInterface;
  const lines = Boolean(cart?.lines?.nodes?.length || 0);


  return (
    <motion.div
      style={{top:"-200px"}}
      initial={true}
      variants={cartVariants}
      animate={cartShow ? 'open' : 'closed'}
      exit="closed"
      className={cartShow
        ? " opacity-[1]  transition-all ease-out absolute z-20 w-full flex-col d-flex  bg-white/95 backdrop-blur-lg drop-shadow-cart rounded-b-[30px]  p-[30px] text-black"
        : " opacity-0   transition-all ease-out absolute z-20 w-full flex-col d-flex  bg-white/95 backdrop-blur-lg drop-shadow-cart rounded-b-[30px]  p-[30px] text-black"
      }
    >
      {!lines && <EmptyCart />}
      {lines && <DropDownCartDetail cart={cart} />}
    </motion.div>
  );
});


const CREATE_CHECKOUT_URL = `#graphql
mutation CreateCheckout($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout {
      id
      webUrl
      lineItems(first: 5) {
        edges {
          node {
            title
            quantity
          }
        }
      }
    }
    checkoutUserErrors {
      code
      field
      message
    }
  }
}
`