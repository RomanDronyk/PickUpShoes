import {Suspense, useContext} from 'react';
import {motion} from 'framer-motion';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {Variants} from 'framer-motion';
import {
  HeaderBasketContext,
  HeaderContextInterface,
} from '~/context/HeaderCarts';
import DropDownCartDetail from './DropDownCartDetail';
import {Await} from '@remix-run/react';
type DropdownCartProps = {
  cart: CartApiQueryFragment | null;
};

const cartVariants = {
  closed: {
    opacity: 0,
    zIndex: 123,
    top: '-750%',
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
export const DropDownCart = ({cart}: DropdownCartProps) => {
  const {cartShow} = useContext(HeaderBasketContext) as HeaderContextInterface;

  return (
    <motion.div
      style={{top: '-500px'}}
      initial={true}
      variants={cartVariants}
      animate={cartShow ? 'open' : 'closed'}
      exit="closed"
      className={
        cartShow
          ? ' opacity-[1]  transition-all ease-out absolute z-20 w-full flex-col d-flex  bg-white/95 backdrop-blur-lg drop-shadow-cart rounded-b-[30px]  p-[30px] text-black'
          : ' opacity-0   transition-all ease-out absolute z-20 w-full flex-col d-flex  bg-white/95 backdrop-blur-lg drop-shadow-cart rounded-b-[30px]  p-[30px] text-black'
      }
    >
      <Suspense>
        <Await resolve={cart}>
          {(cart) => <DropDownCartDetail cart={cart} />}
        </Await>
      </Suspense>
    </motion.div>
  );
};
