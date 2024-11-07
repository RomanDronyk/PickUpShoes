import { useMatches, Link } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';
import { z } from 'zod';

const PoliciesTitle: { [key: string]: string } = {
  'refund-policy': 'Обмін та повернення',
  'privacy-policy': 'Політика конфіденційності',
  'terms-of-service': 'Угода користувача',
  'shipping-policy': 'Умови доставки',
};

export const breadcrumbsSchema = z.enum([
  'collections',
  'collection',
  'product',
  'policies',
  'login',
  'orders',
  'profile',
  "liked",
  "likes",
  "likedsd",
  "checkout"
]);
export type TBreadcrumbsType = z.infer<typeof breadcrumbsSchema>;

export function Breadcrumbs() {
  const matches = useMatches();
  const deepsRoute: any = matches.at(-1);

  const pages: { href: string; name: string }[] = [{ href: '/', name: 'Головна' }];

  const parsedBreadcrumbType = breadcrumbsSchema.safeParse(
    deepsRoute?.handle?.breadcrumb,
  );
  const isValidBreadcrumb = parsedBreadcrumbType.success;
  if (isValidBreadcrumb) {
    switch (parsedBreadcrumbType.data) {
      case 'collection':
        pages.push({
          href: `/collections/${deepsRoute?.data?.collection?.handle}`,
          name: `${deepsRoute?.data?.collection?.title ? deepsRoute?.data?.collection?.title : "sladkjf"}`,
        });
        break;
      case 'product':
        const collection = deepsRoute?.data?.product?.collections?.nodes.at(0);

        pages.push({
          href: `/collections/${collection?.handle || ""}`,
          name: `${collection?.title || ""}`,
        });

        pages.push({
          href: `/products/${deepsRoute?.data?.product?.handle || ""}`,
          name: `${deepsRoute?.data?.product?.title || ""}`,
        });

        break;
      case 'policies':
        if (deepsRoute?.params?.handle !== 'contact-information') {
          pages.push({
            href: `/policies/${deepsRoute?.data?.policy?.handle}`,
            name: `${PoliciesTitle[deepsRoute?.data?.policy?.handle]}`,
          });
        } else {
          pages.push({
            href: 'policies/contact-information',
            name: 'Про магазин',
          });
        }
        break;
      case 'login':
        pages.push({
          href: '/account/login',
          name: 'Вхід до особистого кабінету',
        });

        break;
      case 'profile':
        pages.push({
          href: `${deepsRoute?.pathname}`,
          name: 'Особистиа інформація',
        });
        break;
      case 'orders':
        pages.push({
          href: `/account/orders`,
          name: 'Особистий кабінет',
        });
        pages.push({
          href: `${deepsRoute?.pathname}`,
          name: 'Історія замовлень',
        });
        break;
      case 'liked':
        pages.push({
          href: `${deepsRoute?.pathname}`,
          name: 'Вподобані',
        });

        break;
      case 'likes':
        pages.push({
          href: `/account/liked`,
          name: 'Особистий кабінет',
        });
        pages.push({
          href: `/account/liked`,
          name: 'Вподобані',
        });
        break;
      case "checkout":
        pages.push({
          href: `/checkout`,
          name: 'Кошик',
        });
        pages.push({
          href: `/checkout`,
          name: 'Оформити замовлення',
        });
        break
      default:
        break;
    }

  } else {
    return null;
  }

  return (
    <nav aria-label="Breadcrumbs" className="my-5 lg:px-24 md:px-10 px-[10px]">
      <ol role="list" className="gap-[10px] flex items-center sm:text-base text-[12px]">
        {pages.map((page, index) => {
          const currentPage = index === pages.length - 1;
          const homePage = page.href === '/';
          const separator = index !== 0 && (
            <ChevronRight
              aria-hidden="true"
              size={16}
              className="text-black/60"
            />
          );

          return (
            <li key={page.name}>
              <div className="flex items-center">
                {separator}
                <span className="text-black font-medium">
                  {currentPage ? (
                    page.name
                  ) : (
                    <Link
                      to={page.href}
                      className="text-black/60 hover:text-black"
                    >
                      {page.name}
                    </Link>
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
