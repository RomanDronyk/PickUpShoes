import {Image} from '@shopify/hydrogen';
import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
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
import {DropdownCart} from './DropdownCart';

type HeaderProps = Pick<
  LayoutProps,
  'header' | 'cart' | 'isLoggedIn' | 'favorites'
>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="px-24">
      <div className=" flex justify-between pt-[18px] pb-[25px] border-b border-black relative">
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
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        <DropdownCart cart={cart} />
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

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <CartToggle cart={cart} />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink>
    </nav>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <Button variant="ghost" className="relative">
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

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
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
