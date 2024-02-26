import {Await, useLocation} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {AnimatePresence, motion} from 'framer-motion';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import {Breadcrumbs} from './Breadcrumbs';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
  favorites?: boolean;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  return (
    <div className="min-h-full flex flex-col">
      {header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />}
      {/* <Breadcrumbs /> */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.main
          key={useLocation().pathname}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{type: 'spring'}}
          className="flex-auto items-start flex"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer} shop={header?.shop} />}
        </Await>
      </Suspense>
    </div>
  );
}

function CartAside({cart}: {cart: LayoutProps['cart']}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}
