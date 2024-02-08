import {Await, NavLink, useLocation} from '@remix-run/react';
import {Suspense, useState, useEffect} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import {PredictiveSearchForm} from './Search';
import {Button} from './ui/button';
import {DropDownCart} from './DropdownCart';
import {useToggle} from '@uidotdev/usehooks';

type HeaderProps = Pick<
  LayoutProps,
  'header' | 'cart' | 'isLoggedIn' | 'favorites'
>;

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const [cartShow, setCartShow] = useToggle(false);
  const {shop, menu} = header;
  const {key} = useLocation();
  useEffect(() => {
    if (cartShow) setCartShow(false);
  }, [key]);

  return (
    <header className="px-24">
      <div className=" flex justify-between pt-[18px] pb-[25px] border-b border-black/20 relative">
        <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
          <img src={shop.brand?.logo?.image?.url} alt="PickUpShoes" />
        </NavLink>
        <HeaderMenu
          menu={menu}
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
        <div className="relative w-[427px]">
          <PredictiveSearchForm />
        </div>
        <nav className="header-ctas" role="navigation">
          <Suspense>
            <Await resolve={cart}>
              {(cart) => {
                if (!cart)
                  return <CartBadge count={0} handleShow={setCartShow} />;
                return (
                  <CartBadge
                    count={cart.totalQuantity}
                    handleShow={setCartShow}
                  />
                );
              }}
            </Await>
          </Suspense>
          <Button variant="ghost" asChild>
            <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 27V24.3333C24 22.9188 23.5224 21.5623 22.6722 20.5621C21.8221 19.5619 20.669 19 19.4667 19H11.5333C10.331 19 9.17795 19.5619 8.32778 20.5621C7.47762 21.5623 7 22.9188 7 24.3333V27"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 14C17.9853 14 20 11.9853 20 9.5C20 7.01472 17.9853 5 15.5 5C13.0147 5 11 7.01472 11 9.5C11 11.9853 13.0147 14 15.5 14Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
          </Button>
        </nav>
        <Suspense>
          <Await resolve={cart}>
            {(cart) => (
              <DropDownCart
                cart={cart}
                active={cartShow}
                handleShow={() => setCartShow()}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const {publicStoreDomain} = useRootLoaderData();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menu?.items.map((item) => {
          if (!item.url) return null;

          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuTrigger className="font-normal">
                <NavLink prefetch="intent" to={url}>
                  {item.title}
                </NavLink>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function CartBadge({
  count,
  handleShow,
}: {
  count: number;
  handleShow: (newValue?: boolean | undefined) => void;
}) {
  return (
    <Button variant="ghost" className="relative" onClick={handleShow()}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 27C11.5523 27 12 26.5523 12 26C12 25.4477 11.5523 25 11 25C10.4477 25 10 25.4477 10 26C10 26.5523 10.4477 27 11 27Z"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25 27C25.5523 27 26 26.5523 26 26C26 25.4477 25.5523 25 25 25C24.4477 25 24 25.4477 24 26C24 26.5523 24.4477 27 25 27Z"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 5H7L10 22H26"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 16.6666H25.59C25.7056 16.6667 25.8177 16.6267 25.9072 16.5534C25.9966 16.4802 26.0579 16.3781 26.0806 16.2648L27.8806 7.26475C27.8951 7.19218 27.8934 7.11729 27.8755 7.04548C27.8575 6.97368 27.8239 6.90675 27.7769 6.84952C27.73 6.7923 27.6709 6.74621 27.604 6.71458C27.5371 6.68295 27.464 6.66657 27.39 6.66663H8"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="inline-flex rounded-full bg-bageRed text-white text-xs text-center px-[5px] py-[1px] absolute right-3 bottom-0">
        {count}
      </span>
    </Button>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
