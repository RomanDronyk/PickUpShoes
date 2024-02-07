import {NavLink, Link} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import footerLogo from '../assets/images/footer-logo.svg';
import {SubscribeFooter} from './SubscribeFooter';

type Footer = {
  menu: FooterQuery;
  shop: HeaderQuery['shop'];
};

export function Footer({menu: footerMenu, shop}: Footer) {
  const {menu, secondMenu} = footerMenu;
  return (
    <footer className="bg-black pt-[81px] text-placeholderText">
      <div className="flex justify-between px-24">
        <div className="flex flex-col gap-4">
          <img src={footerLogo} alt="PickUp shoes" className="w-60" />
          <SubscribeFooter />
        </div>
        <div className="contacts flex flex-col gap-6">
          <h3 className="font-semibold text-[22px]">Контакти</h3>
          <ul className="flex flex-col gap-4 text-lg">
            <li>
              <span>
                м. Коломия вул. Чорновола <br /> 28 | Водолій 3 поверх
              </span>
            </li>
            <li>
              <a href="mailto:picupshoes@gmail.com">picupshoes@gmail.com</a>
            </li>
            <li>
              <a href="tel:+38 (098) 209 99-91">+38 (098) 209 99-91</a>
            </li>
          </ul>
        </div>
        {menu && shop?.primaryDomain?.url && (
          <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
        )}
        {secondMenu && shop?.primaryDomain?.url && (
          <FooterMenu
            menu={secondMenu}
            primaryDomainUrl={shop.primaryDomain.url}
          />
        )}
      </div>
      <div className="mt-[71px] pt-4 pb-6 border-t  flex justify-center opacity-40">
        <span className="inline-flex items-center gap-[6px]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99984 18.3334C14.6022 18.3334 18.3332 14.6025 18.3332 10.0001C18.3332 5.39771 14.6022 1.66675 9.99984 1.66675C5.39746 1.66675 1.6665 5.39771 1.6665 10.0001C1.6665 14.6025 5.39746 18.3334 9.99984 18.3334Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.4998 8.14823C12.4998 8.14823 11.4704 6.66675 9.75474 6.66675C8.03905 6.66675 6.6665 8.14823 6.6665 10.0001C6.6665 11.8519 8.03905 13.3334 9.75474 13.3334C11.4704 13.3334 12.4998 11.8519 12.4998 11.8519"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copyright 2024. All right reserved
        </span>
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const {publicStoreDomain} = useRootLoaderData();
  return (
    <div>
      <h3 className="font-semibold text-[22px]">{menu?.title}</h3>
      <nav className="flex flex-col gap-4 mt-6" role="navigation">
        {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
          if (!item.url) return null;
          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return isExternal ? (
            <a
              href={url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.title}
            </a>
          ) : (
            <NavLink
              end
              key={item.id}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
