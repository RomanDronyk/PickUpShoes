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
import {Header} from '~/components/Header';
import {CartMain} from '~/components/Cart';
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
    <div className="min-h-full  flex flex-col">

      {header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />}

      <Breadcrumbs />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.main
          key={useLocation().pathname}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0, transition: {duration: 0.2}}}
          transition={{delay: 0, duration: 0.4}}
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


