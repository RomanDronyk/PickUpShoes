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
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import {
  SearchForm,
  PredictiveSearchForm,
  PredictiveSearchResults,
} from './Search';
import {SearchIcon} from './Search';
import {Input} from './ui/input';

type HeaderProps = Pick<
  LayoutProps,
  'header' | 'cart' | 'isLoggedIn' | 'favorites'
>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className=" pt-[18px] pb-[25px] flex justify-between">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <img src={shop.brand?.logo?.image?.url} alt="" />
      </NavLink>
      <HeaderMenu
        menu={menu}
        primaryDomainUrl={header.shop.primaryDomain.url}
      />
      <div className="relative">
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div className="flex border border-input rounded-[62px] bg-input items-center px-4 py-[3px]">
              <SearchIcon />
              <Input
                name="q"
                placeholder="Що ти шукаєш?"
                ref={inputRef}
                onChange={fetchResults}
                onFocus={fetchResults}
                type="search"
              />
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
      {/* <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} /> */}
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
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function CartBadge({count}: {count: number}) {
  return <a href="#cart-aside">Cart {count}</a>;
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
