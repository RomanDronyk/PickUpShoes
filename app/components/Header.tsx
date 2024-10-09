import { Await, Link, NavLink, useLocation } from '@remix-run/react';
import { Suspense, useContext, useEffect, useState } from 'react';
import type { HeaderQuery } from 'storefrontapi.generated';
import { useRootLoaderData } from '~/root';
import { DropDownCart } from './DropdownCart/DropdownCart';
import type { LayoutProps } from './Layout';
import { MobileCart } from './MobileCart';
import { MobileMenu } from './MobileMenu';
import { PredictiveSearchForm } from './Search';
import { Button } from './ui/button';
import HeaderContext, { HeaderContextInterface } from '~/context/HeaderCarts';
import { HeaderBasketContext } from '~/context/HeaderCarts';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { useMedia } from 'react-use';

export type HeaderProps = Pick<
  LayoutProps,
  'header' | 'cart' | 'isLoggedIn' | 'favorites'
>;

export function Header({ header, isLoggedIn, cart }: HeaderProps) {
  const { shop, menu } = header;
  const {
    cartShow,
    count,
    setCartShow
  } = useContext(HeaderBasketContext) as HeaderContextInterface

  const { key } = useLocation();
  const isMobile = useMedia('(max-width: 767px)', false);

  useEffect(() => {
    if (cartShow) setCartShow(false);
  }, [key]);
  return (

    <header className="lg:px-24 px-5">
      <div className=" flex justify-between pt-[18px] pb-[25px] border-b border-black/20 relative">
        <div className="flex items-center gap-x-[10px] md:gap-x-[35px] md:max-w-[156px]">
          {isMobile && (
            <MobileMenu
              menu={menu}
              logo={shop?.brand?.logo?.image?.url}
              primaryDomainUrl={header.shop.primaryDomain.url}
            />
          )}
          <NavLink
            prefetch="intent"
            to="/"
            className="flex items-center md:w-auto w-[130px]"
          >
            <img src={shop.brand?.logo?.image?.url} alt="PickUpShoes" />
          </NavLink>
        </div>
        {!isMobile && (
          <HeaderMenu
            menu={menu}
            primaryDomainUrl={header.shop.primaryDomain.url}
          />
        )}

        <nav className="header-ctas  flex md:gap-x-[0px] gap-x-2">
          <PredictiveSearchForm
            isMobile={isMobile}
            brandLogo={shop?.brand?.logo?.image}
          />
          <Button
            asChild
            className="relative px-2 py-2 max-sm:w-[23px] max-sm:h-[18px]"
            style={{minWidth:20,height: "100%"}}
            variant="ghost">

            <NavLink  prefetch="intent" to="/liked" style={activeLinkStyle}>

              <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                {isMobile?
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.25 1C2.17925 1 0.5 2.73964 0.5 4.88594C0.5 6.61852 1.15625 10.7305 7.616 14.8873C7.73171 14.961 7.86455 15 8 15C8.13545 15 8.26829 14.961 8.384 14.8873C14.8438 10.7305 15.5 6.61852 15.5 4.88594C15.5 2.73964 13.8207 1 11.75 1C9.67925 1 8 3.35511 8 3.35511C8 3.35511 6.32075 1 4.25 1Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>:
              <svg width="22" height="22" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 1C2.7912 1 1 2.73964 1 4.88594C1 6.61852 1.7 10.7305 8.5904 14.8873C8.71383 14.961 8.85552 15 9 15C9.14448 15 9.28617 14.961 9.4096 14.8873C16.3 10.7305 17 6.61852 17 4.88594C17 2.73964 15.2088 1 13 1C10.7912 1 9 3.35511 9 3.35511C9 3.35511 7.2088 1 5 1Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
                }

              <span className="inline-flex rounded-full bg-bageRed min-w-[16px] min-h-[16px] text-white text-xs text-center px-[5px] py-[1px] absolute right-[-4px] sm:right-[-0] bottom-1 leading-none items-center justify-center">
                <span>{count}</span>
              </span>
              </div>
            </NavLink>
          </Button>

          {!isMobile && (
            <>
              <Suspense>
                <Await resolve={cart}>
                  {(cart) => (!cart) ? <CartBadge count={0} /> : <CartBadge count={cart.totalQuantity} />}
                </Await>
              </Suspense>
            </>
          )}
          {isMobile && (
            <Suspense>
              <Await resolve={cart}>
                {(cart) => {
                  if (!cart) return <MobileCart cart={cart} />;
                  return <MobileCart cart={cart} />;
                }}
              </Await>
            </Suspense>
          )}

          <Button variant="ghost" asChild className="p-2">
            <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
              <svg
                className="max-sm:w-5 max-sm:h-5"
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
        {!isMobile && (
          <Suspense>
            <Await resolve={cart}>
              {(cart) => (
                <DropDownCart
                  cart={cart}
                />
              )}
            </Await>
          </Suspense>
        )}
      </div>
    </header>

  );
}

function CartBadge({
  count = 0,

}: {
  count: number;

}) {
  const { cartShow, setCartShow } = useContext(HeaderBasketContext) as HeaderContextInterface


  return (

    <Button
      variant="ghost"
      className="relative px-2 py-2 max-sm:w-[23px] max-sm:h-[18px]"
      onClick={() => setCartShow((value) => !value)}
    >
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
      <span className="inline-flex rounded-full bg-bageRed min-w-[16px] min-h-[16px] text-white text-xs text-center px-[5px] py-[1px] absolute right-0 bottom-1 leading-none items-center justify-center">
        <span>{count}</span>
      </span>
    </Button>
  );
}
export function HeaderMenu({
  menu,
  primaryDomainUrl,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const { publicStoreDomain } = useRootLoaderData();
  return (

    <NavigationMenu className="md:flex hidden">
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
                {item.title}
              </NavigationMenuTrigger>
              {item.items.length > 0 && (
                <NavigationMenuContent>
                  <ul className="flex py-[15px] px-[20px]  gap-x-[25px] gap-y-[15px] w-[390px] flex-wrap">
                    {item.items.map((menuItem) => {
                      const url =
                        menuItem.url?.includes('myshopify.com') ||
                          menuItem.url?.includes(publicStoreDomain) ||
                          menuItem.url?.includes(primaryDomainUrl)
                          ? new URL(menuItem.url).pathname
                          : menuItem.url;

                      return (
                        <li key={menuItem.id}>
                          <NavigationMenuLink
                            asChild
                            className="text-base font-normal hover:underline"
                          >
                            <Link to={url || ""}>{menuItem.title}</Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>

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

function SubMenu() { }
