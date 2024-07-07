import { NavLink, Link } from '@remix-run/react';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { useRootLoaderData } from '~/root';
import footerLogo from '../assets/images/footer-logo.svg';
import { SubscribeFooter } from './SubscribeFooter';

type Footer = {
  menu: FooterQuery;
  shop: HeaderQuery['shop'];
};

export function Footer({ menu: footerMenu, shop }: Footer) {
  const { menu, secondMenu } = footerMenu;
  return (
    <footer className="bg-black pt-[81px] text-placeholderText">
      <div className="flex md:flex justify-between lg:px-24  px-5 sm:px-12 md:flex-row flex-col sm:grid sm:grid-cols-2 sm:gap-x-[20px] sm:gap-y-[30px] gap-x-[20px] gap-y-[45px]">
        <div className="flex flex-col gap-4">
          <img
            src={footerLogo}
            alt="PickUp shoes"
            className="lg:w-60 md:w-40 w-52"
          />
          <SubscribeFooter />
          <div className='flex gap-[10px]'>
            <a href='https://www.instagram.com/pick.up.shoes'  className='animation-foter-link' style={{ borderRadius: "50%", border: "1px solid #fff", width: 28, height: 28, display: "flex", justifyContent: "center", alignItems: "center", }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.00076 1.44721C8.80947 1.44721 9.02366 1.45398 9.73818 1.48656C10.1678 1.49182 10.5933 1.5707 10.9962 1.71979C11.2884 1.83248 11.5538 2.00511 11.7753 2.22656C11.9967 2.44802 12.1694 2.71339 12.282 3.00559C12.4311 3.40853 12.51 3.83406 12.5153 4.26366C12.5475 4.97817 12.5546 5.19237 12.5546 7.00108C12.5546 8.80979 12.5479 9.02398 12.5153 9.7385C12.51 10.1681 12.4311 10.5936 12.282 10.9966C12.1694 11.2888 11.9967 11.5541 11.7753 11.7756C11.5538 11.997 11.2884 12.1697 10.9962 12.2824C10.5933 12.4315 10.1678 12.5103 9.73818 12.5156C9.02398 12.5479 8.80979 12.5549 7.00076 12.5549C5.19172 12.5549 4.97753 12.5482 4.26334 12.5156C3.83373 12.5103 3.40821 12.4315 3.00527 12.2824C2.71307 12.1697 2.44769 11.997 2.22624 11.7756C2.00479 11.5541 1.83216 11.2888 1.71947 10.9966C1.57038 10.5936 1.4915 10.1681 1.48624 9.7385C1.45398 9.02398 1.44689 8.80979 1.44689 7.00108C1.44689 5.19237 1.45366 4.97817 1.48624 4.26366C1.4915 3.83406 1.57038 3.40853 1.71947 3.00559C1.83216 2.71339 2.00479 2.44802 2.22624 2.22656C2.44769 2.00511 2.71307 1.83248 3.00527 1.71979C3.40821 1.5707 3.83373 1.49182 4.26334 1.48656C4.97785 1.4543 5.19205 1.44721 7.00076 1.44721ZM7.00076 0.226562C5.16205 0.226562 4.93043 0.234304 4.20785 0.267208C3.64561 0.278391 3.08934 0.384847 2.56269 0.582046C2.11092 0.752261 1.70172 1.019 1.36366 1.36366C1.01869 1.70184 0.751722 2.11127 0.581401 2.56334C0.384201 3.08998 0.277746 3.64625 0.266563 4.2085C0.234304 4.93043 0.226562 5.16205 0.226562 7.00076C0.226562 8.83946 0.234304 9.07108 0.267208 9.79366C0.278391 10.3559 0.384847 10.9122 0.582046 11.4388C0.752178 11.8908 1.01892 12.3002 1.36366 12.6385C1.70191 12.9832 2.11133 13.25 2.56334 13.4201C3.08998 13.6173 3.64626 13.7238 4.2085 13.7349C4.93108 13.7672 5.16172 13.7756 7.0014 13.7756C8.84108 13.7756 9.07172 13.7679 9.7943 13.7349C10.3565 13.7238 10.9128 13.6173 11.4395 13.4201C11.8893 13.2457 12.2978 12.9794 12.6389 12.6381C12.98 12.2968 13.246 11.8882 13.4201 11.4382C13.6173 10.9115 13.7238 10.3553 13.735 9.79301C13.7672 9.07108 13.775 8.83946 13.775 7.00076C13.775 5.16205 13.7672 4.93043 13.7343 4.20785C13.7231 3.64561 13.6167 3.08934 13.4195 2.56269C13.2493 2.11068 12.9826 1.70126 12.6379 1.36301C12.2996 1.01828 11.8902 0.751533 11.4382 0.581401C10.9115 0.384201 10.3553 0.277746 9.79301 0.266563C9.07108 0.234304 8.83947 0.226562 7.00076 0.226562Z" fill="white" />
                <path d="M7.00215 3.52344C6.31413 3.52344 5.64155 3.72746 5.06948 4.10971C4.49741 4.49195 4.05154 5.03525 3.78824 5.6709C3.52494 6.30655 3.45605 7.00601 3.59028 7.68081C3.72451 8.35561 4.05582 8.97546 4.54233 9.46197C5.02884 9.94847 5.64868 10.2798 6.32349 10.414C6.99829 10.5482 7.69774 10.4794 8.33339 10.2161C8.96904 9.95276 9.51234 9.50689 9.89459 8.93481C10.2768 8.36274 10.4809 7.69017 10.4809 7.00215C10.4809 6.07954 10.1144 5.19471 9.46197 4.54233C8.80958 3.88994 7.92476 3.52344 7.00215 3.52344ZM7.00215 9.26021C6.55555 9.26021 6.11897 9.12778 5.74764 8.87966C5.3763 8.63154 5.08688 8.27888 4.91597 7.86627C4.74506 7.45366 4.70034 6.99964 4.78747 6.56162C4.8746 6.1236 5.08966 5.72125 5.40546 5.40545C5.72125 5.08966 6.1236 4.8746 6.56162 4.78747C6.99964 4.70034 7.45367 4.74506 7.86627 4.91597C8.27888 5.08687 8.63154 5.3763 8.87966 5.74763C9.12778 6.11897 9.26021 6.55554 9.26021 7.00215C9.26021 7.60102 9.02231 8.17537 8.59884 8.59884C8.17537 9.02231 7.60102 9.26021 7.00215 9.26021Z" fill="white" />
                <path d="M10.6176 4.19807C11.0665 4.19807 11.4305 3.83412 11.4305 3.38517C11.4305 2.93621 11.0665 2.57227 10.6176 2.57227C10.1686 2.57227 9.80469 2.93621 9.80469 3.38517C9.80469 3.83412 10.1686 4.19807 10.6176 4.19807Z" fill="white" />
              </svg>


            </a>
            <a href='https://www.facebook.com/pick.up.shoes.ua' className='animation-foter-link' style={{ borderRadius: "50%", border: "1px solid #fff", width: 28, height: 28, display: "flex", justifyContent: "center", alignItems: "center", }}>
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.70873 12.3038V6.75026H0.839844V4.58594H2.70873V2.98981C2.70873 1.13752 3.84005 0.128906 5.49242 0.128906C6.28392 0.128906 6.96418 0.187836 7.16243 0.214175V2.14993L6.01642 2.15045C5.11776 2.15045 4.94376 2.57748 4.94376 3.20411V4.58594H7.08697L6.80791 6.75026H4.94376V12.3038H2.70873Z" fill="white" />
              </svg>


            </a>
            <a href='#' className='animation-foter-link' style={{ borderRadius: "50%", border: "1px solid #fff", width: 28, height: 28, display: "flex", justifyContent: "center", alignItems: "center", }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.125 3.125L1.25 7.8125L5.625 8.4375M13.125 3.125L11.5625 12.5L5.625 8.4375M13.125 3.125L5.625 8.4375M5.625 8.4375V11.875L7.65562 9.82687" stroke="white" strokeLinecap="round" stroke-linejoin="round" />
              </svg>


            </a>

          </div>
        </div>
        <div className="contacts flex flex-col gap-6">
          <h3 className="font-semibold text-[22px] sm:text-xl lg:text-[22px]">
            Контакти
          </h3>
          <ul className="flex flex-col gap-4 lg:text-lg sm:text-sm text-lg">
            <li>
              <span>
                м. Коломия вул. Чорновола <br /> 28 | Водолій 3 поверх
              </span>
            </li>
            <li>
              <a href="mailto:picupshoes@gmail.com">picupshoes@gmail.com</a>
            </li>
            <li>
              <a href="tel:+38 (073) 74-17-510">+38 (073) 74-17-510</a>
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
  const { publicStoreDomain } = useRootLoaderData();
  return (
    <div>
      <h3 className="font-semibold text-[22px] md:text-xl lg:text-[22px]">
        {menu?.title}
      </h3>
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
              className="sm:text-sm lg:text-base text-lg"
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
