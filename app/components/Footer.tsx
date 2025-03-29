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
  const {menu, secondMenu} = footerMenu || {menu: [], secondMenu: []};
  return (
    <footer className="bg-black pt-[81px] text-placeholderText">
      <div
        style={{gridTemplateColumns: '1.7fr 1fr 1fr 1fr ', gap: '96px'}}
        className="flex md:grid justify-between lg:px-24  px-5 sm:px-12 lg:flex-row flex-col sm:grid sm:grid-cols-2  sm:gap-y-[30px] gap-x-[20px] gap-y-[45px]"
      >
        <div className="flex flex-col gap-4">
          <img
            src={footerLogo}
            alt="PickUp shoes"
            className="lg:w-60 md:w-40 w-52"
          />
          <SubscribeFooter />
          <div className="pl-[13px] pt-[9px] flex gap-[10px]">
            <a
              href="https://www.instagram.com/pick.up.shoes"
              target="blank"
              className="animation-foter-link"
              style={{
                borderRadius: '50%',
                border: '1px solid #fff',
                width: 28,
                height: 28,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span className="animation_show">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="13.5"
                    fill="black"
                    stroke="white"
                  />
                  <path
                    d="M14.0008 8.44721C15.8095 8.44721 16.0237 8.45398 16.7382 8.48656C17.1678 8.49182 17.5933 8.5707 17.9962 8.71979C18.2884 8.83248 18.5538 9.00511 18.7753 9.22656C18.9967 9.44802 19.1694 9.71339 19.282 10.0056C19.4311 10.4085 19.51 10.8341 19.5153 11.2637C19.5475 11.9782 19.5546 12.1924 19.5546 14.0011C19.5546 15.8098 19.5479 16.024 19.5153 16.7385C19.51 17.1681 19.4311 17.5936 19.282 17.9966C19.1694 18.2888 18.9967 18.5541 18.7753 18.7756C18.5538 18.997 18.2884 19.1697 17.9962 19.2824C17.5933 19.4315 17.1678 19.5103 16.7382 19.5156C16.024 19.5479 15.8098 19.5549 14.0008 19.5549C12.1917 19.5549 11.9775 19.5482 11.2633 19.5156C10.8337 19.5103 10.4082 19.4315 10.0053 19.2824C9.71307 19.1697 9.44769 18.997 9.22624 18.7756C9.00479 18.5541 8.83216 18.2888 8.71947 17.9966C8.57038 17.5936 8.4915 17.1681 8.48624 16.7385C8.45398 16.024 8.44689 15.8098 8.44689 14.0011C8.44689 12.1924 8.45366 11.9782 8.48624 11.2637C8.4915 10.8341 8.57038 10.4085 8.71947 10.0056C8.83216 9.71339 9.00479 9.44802 9.22624 9.22656C9.44769 9.00511 9.71307 8.83248 10.0053 8.71979C10.4082 8.5707 10.8337 8.49182 11.2633 8.48656C11.9779 8.4543 12.192 8.44721 14.0008 8.44721V8.44721ZM14.0008 7.22656C12.162 7.22656 11.9304 7.2343 11.2079 7.26721C10.6456 7.27839 10.0893 7.38485 9.56269 7.58205C9.11092 7.75226 8.70172 8.019 8.36366 8.36366C8.01869 8.70184 7.75172 9.11127 7.5814 9.56334C7.3842 10.09 7.27775 10.6463 7.26656 11.2085C7.2343 11.9304 7.22656 12.162 7.22656 14.0008C7.22656 15.8395 7.2343 16.0711 7.26721 16.7937C7.27839 17.3559 7.38485 17.9122 7.58205 18.4388C7.75218 18.8908 8.01892 19.3002 8.36366 19.6385C8.70191 19.9832 9.11133 20.25 9.56334 20.4201C10.09 20.6173 10.6463 20.7238 11.2085 20.7349C11.9311 20.7672 12.1617 20.7756 14.0014 20.7756C15.8411 20.7756 16.0717 20.7679 16.7943 20.7349C17.3565 20.7238 17.9128 20.6173 18.4395 20.4201C18.8893 20.2457 19.2978 19.9794 19.6389 19.6381C19.98 19.2968 20.246 18.8881 20.4201 18.4382C20.6173 17.9115 20.7238 17.3553 20.735 16.793C20.7672 16.0711 20.775 15.8395 20.775 14.0008C20.775 12.162 20.7672 11.9304 20.7343 11.2079C20.7231 10.6456 20.6167 10.0893 20.4195 9.56269C20.2493 9.11068 19.9826 8.70126 19.6379 8.36301C19.2996 8.01828 18.8902 7.75153 18.4382 7.5814C17.9115 7.3842 17.3553 7.27775 16.793 7.26656C16.0711 7.2343 15.8395 7.22656 14.0008 7.22656Z"
                    fill="white"
                  />
                  <path
                    d="M14.0021 10.5234C13.3141 10.5234 12.6416 10.7275 12.0695 11.1097C11.4974 11.492 11.0515 12.0353 10.7882 12.6709C10.5249 13.3066 10.4561 14.006 10.5903 14.6808C10.7245 15.3556 11.0558 15.9755 11.5423 16.462C12.0288 16.9485 12.6487 17.2798 13.3235 17.414C13.9983 17.5482 14.6977 17.4794 15.3334 17.2161C15.969 16.9528 16.5123 16.5069 16.8946 15.9348C17.2768 15.3627 17.4809 14.6902 17.4809 14.0021C17.4809 13.0795 17.1144 12.1947 16.462 11.5423C15.8096 10.8899 14.9248 10.5234 14.0021 10.5234ZM14.0021 16.2602C13.5555 16.2602 13.119 16.1278 12.7476 15.8797C12.3763 15.6315 12.0869 15.2789 11.916 14.8663C11.7451 14.4537 11.7003 13.9996 11.7875 13.5616C11.8746 13.1236 12.0897 12.7213 12.4055 12.4055C12.7213 12.0897 13.1236 11.8746 13.5616 11.7875C13.9996 11.7003 14.4537 11.7451 14.8663 11.916C15.2789 12.0869 15.6315 12.3763 15.8797 12.7476C16.1278 13.119 16.2602 13.5555 16.2602 14.0021C16.2602 14.601 16.0223 15.1754 15.5988 15.5988C15.1754 16.0223 14.601 16.2602 14.0021 16.2602V16.2602Z"
                    fill="white"
                  />
                  <path
                    d="M17.6176 11.1981C18.0665 11.1981 18.4305 10.8341 18.4305 10.3852C18.4305 9.93621 18.0665 9.57227 17.6176 9.57227C17.1686 9.57227 16.8047 9.93621 16.8047 10.3852C16.8047 10.8341 17.1686 11.1981 17.6176 11.1981Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="animation_hide">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="14" cy="14" r="14" fill="white" />
                  <circle
                    cx="14"
                    cy="14"
                    r="13.5"
                    stroke="black"
                    strokeOpacity="0.2"
                  />
                  <path
                    d="M14.0008 8.44721C15.8095 8.44721 16.0237 8.45398 16.7382 8.48656C17.1678 8.49182 17.5933 8.5707 17.9962 8.71979C18.2884 8.83248 18.5538 9.00511 18.7753 9.22656C18.9967 9.44802 19.1694 9.71339 19.282 10.0056C19.4311 10.4085 19.51 10.8341 19.5153 11.2637C19.5475 11.9782 19.5546 12.1924 19.5546 14.0011C19.5546 15.8098 19.5479 16.024 19.5153 16.7385C19.51 17.1681 19.4311 17.5936 19.282 17.9966C19.1694 18.2888 18.9967 18.5541 18.7753 18.7756C18.5538 18.997 18.2884 19.1697 17.9962 19.2824C17.5933 19.4315 17.1678 19.5103 16.7382 19.5156C16.024 19.5479 15.8098 19.5549 14.0008 19.5549C12.1917 19.5549 11.9775 19.5482 11.2633 19.5156C10.8337 19.5103 10.4082 19.4315 10.0053 19.2824C9.71307 19.1697 9.44769 18.997 9.22624 18.7756C9.00479 18.5541 8.83216 18.2888 8.71947 17.9966C8.57038 17.5936 8.4915 17.1681 8.48624 16.7385C8.45398 16.024 8.44689 15.8098 8.44689 14.0011C8.44689 12.1924 8.45366 11.9782 8.48624 11.2637C8.4915 10.8341 8.57038 10.4085 8.71947 10.0056C8.83216 9.71339 9.00479 9.44802 9.22624 9.22656C9.44769 9.00511 9.71307 8.83248 10.0053 8.71979C10.4082 8.5707 10.8337 8.49182 11.2633 8.48656C11.9779 8.4543 12.192 8.44721 14.0008 8.44721V8.44721ZM14.0008 7.22656C12.162 7.22656 11.9304 7.2343 11.2079 7.26721C10.6456 7.27839 10.0893 7.38485 9.56269 7.58205C9.11092 7.75226 8.70172 8.019 8.36366 8.36366C8.01869 8.70184 7.75172 9.11127 7.5814 9.56334C7.3842 10.09 7.27775 10.6463 7.26656 11.2085C7.2343 11.9304 7.22656 12.162 7.22656 14.0008C7.22656 15.8395 7.2343 16.0711 7.26721 16.7937C7.27839 17.3559 7.38485 17.9122 7.58205 18.4388C7.75218 18.8908 8.01892 19.3002 8.36366 19.6385C8.70191 19.9832 9.11133 20.25 9.56334 20.4201C10.09 20.6173 10.6463 20.7238 11.2085 20.7349C11.9311 20.7672 12.1617 20.7756 14.0014 20.7756C15.8411 20.7756 16.0717 20.7679 16.7943 20.7349C17.3565 20.7238 17.9128 20.6173 18.4395 20.4201C18.8893 20.2457 19.2978 19.9794 19.6389 19.6381C19.98 19.2968 20.246 18.8881 20.4201 18.4382C20.6173 17.9115 20.7238 17.3553 20.735 16.793C20.7672 16.0711 20.775 15.8395 20.775 14.0008C20.775 12.162 20.7672 11.9304 20.7343 11.2079C20.7231 10.6456 20.6167 10.0893 20.4195 9.56269C20.2493 9.11068 19.9826 8.70126 19.6379 8.36301C19.2996 8.01828 18.8902 7.75153 18.4382 7.5814C17.9115 7.3842 17.3553 7.27775 16.793 7.26656C16.0711 7.2343 15.8395 7.22656 14.0008 7.22656Z"
                    fill="black"
                  />
                  <path
                    d="M14.0021 10.5234C13.3141 10.5234 12.6416 10.7275 12.0695 11.1097C11.4974 11.492 11.0515 12.0353 10.7882 12.6709C10.5249 13.3066 10.4561 14.006 10.5903 14.6808C10.7245 15.3556 11.0558 15.9755 11.5423 16.462C12.0288 16.9485 12.6487 17.2798 13.3235 17.414C13.9983 17.5482 14.6977 17.4794 15.3334 17.2161C15.969 16.9528 16.5123 16.5069 16.8946 15.9348C17.2768 15.3627 17.4809 14.6902 17.4809 14.0021C17.4809 13.0795 17.1144 12.1947 16.462 11.5423C15.8096 10.8899 14.9248 10.5234 14.0021 10.5234ZM14.0021 16.2602C13.5555 16.2602 13.119 16.1278 12.7476 15.8797C12.3763 15.6315 12.0869 15.2789 11.916 14.8663C11.7451 14.4537 11.7003 13.9996 11.7875 13.5616C11.8746 13.1236 12.0897 12.7213 12.4055 12.4055C12.7213 12.0897 13.1236 11.8746 13.5616 11.7875C13.9996 11.7003 14.4537 11.7451 14.8663 11.916C15.2789 12.0869 15.6315 12.3763 15.8797 12.7476C16.1278 13.119 16.2602 13.5555 16.2602 14.0021C16.2602 14.601 16.0223 15.1754 15.5988 15.5988C15.1754 16.0223 14.601 16.2602 14.0021 16.2602V16.2602Z"
                    fill="black"
                  />
                  <path
                    d="M17.6176 11.1981C18.0665 11.1981 18.4305 10.8341 18.4305 10.3852C18.4305 9.93621 18.0665 9.57227 17.6176 9.57227C17.1686 9.57227 16.8047 9.93621 16.8047 10.3852C16.8047 10.8341 17.1686 11.1981 17.6176 11.1981Z"
                    fill="black"
                  />
                </svg>
              </span>
            </a>
            <a
              href="https://www.facebook.com/pick.up.shoes.ua"
              target="blank"
              className="animation-foter-link"
              style={{
                borderRadius: '50%',
                border: '1px solid #fff',
                width: 28,
                height: 28,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span className="animation_show">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="13.5"
                    fill="black"
                    stroke="white"
                  />
                  <path
                    d="M19.125 10.125L7.25 14.8125L11.625 15.4375M19.125 10.125L17.5625 19.5L11.625 15.4375M19.125 10.125L11.625 15.4375M11.625 15.4375V18.875L13.6556 16.8269"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="animation_hide">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="14" cy="14" r="14" fill="white" />
                  <circle
                    cx="14"
                    cy="14"
                    r="13.5"
                    stroke="black"
                    strokeOpacity="0.2"
                  />
                  <path
                    d="M19.125 10.125L7.25 14.8125L11.625 15.4375M19.125 10.125L17.5625 19.5L11.625 15.4375M19.125 10.125L11.625 15.4375M11.625 15.4375V18.875L13.6556 16.8269"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
            <a
              href="https://www.youtube.com/channel/UCLIOA-vH--WVwd2_ol2usZA/videos"
              target="blank"
              className="animation-foter-link"
              style={{
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span className="animation_show">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="13.5"
                    fill="black"
                    stroke="white"
                  />
                  <mask
                    id="mask0_877_869"
                    style={{maskType: 'luminance'}}
                    maskUnits="userSpaceOnUse"
                    x="8"
                    y="9"
                    width="12"
                    height="10"
                  >
                    <path
                      d="M13.94 10C18.88 10 18.88 10 18.88 13.8422C18.88 17.6844 18.88 17.6844 13.94 17.6844C9 17.6844 9 17.6844 9 13.8422C9 10 9 10 13.94 10Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12.8422 11.9211L16.1355 13.8423L12.8422 15.7634V11.9211Z"
                      fill="black"
                    />
                  </mask>
                  <g mask="url(#mask0_877_869)">
                    <path
                      d="M20.5267 7.25562H7.35333V20.4289H20.5267V7.25562Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </span>
              <span className="animation_hide">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="14" cy="14" r="14" fill="white" />
                  <circle
                    cx="14"
                    cy="14"
                    r="13.5"
                    stroke="black"
                    strokeOpacity="0.2"
                  />
                  <mask
                    id="mask0_877_4922"
                    style={{maskType: 'luminance'}}
                    maskUnits="userSpaceOnUse"
                    x="8"
                    y="9"
                    width="12"
                    height="10"
                  >
                    <path
                      d="M13.94 10C18.88 10 18.88 10 18.88 13.8422C18.88 17.6844 18.88 17.6844 13.94 17.6844C9 17.6844 9 17.6844 9 13.8422C9 10 9 10 13.94 10Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12.8422 11.9211L16.1355 13.8423L12.8422 15.7634V11.9211Z"
                      fill="black"
                    />
                  </mask>
                  <g mask="url(#mask0_877_4922)">
                    <path
                      d="M20.5267 7.25562H7.35333V20.4289H20.5267V7.25562Z"
                      fill="black"
                    />
                  </g>
                </svg>
              </span>
            </a>
          </div>
        </div>
        <div className="contacts flex flex-col gap-6">
          <h3 className="font-semibold text-[22px] sm:text-xl lg:text-[22px]">
            Контакти
          </h3>
          <ul className="flex flex-col gap-4 lg:text-lg sm:text-sm text-lg">
            <li>
              ч
              <span>
                м.Коломия, вулиця Петлюри
                <br />, будинок 42
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
  const {publicStoreDomain} = useRootLoaderData();
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
