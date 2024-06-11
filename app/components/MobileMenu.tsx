import {Drawer, DrawerClose, DrawerContent, DrawerTrigger} from './ui/drawer';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './ui/accordion';
import {
  Sheet,
  SheetClose,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';
import {useState} from 'react';
import type {HeaderProps} from './Header';
import {Button} from './ui/button';
import {Link} from '@remix-run/react';
import {useRootLoaderData} from '~/root';

export function MobileMenu({
  menu,
  logo,
  primaryDomainUrl,
}: {
  menu: HeaderProps['header']['menu'];
  logo: string | undefined;
  primaryDomainUrl: string;
}) {
  const [open, setOpen] = useState(false);

  const {publicStoreDomain} = useRootLoaderData();
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" className="p-0">
          {/* <Lottie style={style} animationData={burger} loop={true} /> */}
          <svg
            width="35"
            height="21"
            viewBox="0 0 35 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34 1.69995H1M28 10.775H1M34 19.85H1"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        side="left"
        className="sm:max-w-full w-full px-5"
      >
        <SheetHeader className="flex items-center justify-between flex-row mb-10">
          {logo && (
            
            <Link to="/">
              <img src={logo} className='max-w-[200px]' alt="Pick Up Shoes" />
            </Link>

          )}
        </SheetHeader>
        <Accordion type="single" collapsible className="w-full">
          {menu?.items.map((menuItem) => {
            if (!menuItem.url) return null;
            // if the url is internal, we strip the domain
            const url =
              menuItem.url.includes('myshopify.com') ||
              menuItem.url.includes(publicStoreDomain) ||
              menuItem.url.includes(primaryDomainUrl)
                ? new URL(menuItem.url).pathname
                : menuItem.url;

            return (
              <AccordionItem
                key={menuItem.id}
                value={menuItem.title}
                className="border-b-black/30"
              >
                <AccordionTrigger className="sm:text-xl">
                  {menuItem.title}
                </AccordionTrigger>
                {menuItem.items.length > 0 && (
                  <AccordionContent>
                    <ul className="flex flex-col gap-y-4">
                      {menuItem.items.map((subMenuItem) => {
                        const url =
                          subMenuItem.url?.includes('myshopify.com') ||
                          subMenuItem.url?.includes(publicStoreDomain) ||
                          subMenuItem.url?.includes(primaryDomainUrl)
                            ? new URL(subMenuItem.url).pathname
                            : subMenuItem.url;
                        return (
                          <li key={subMenuItem.id}>
                            <Link
                              className="sm:text-lg text-base hover:underline"
                              to={url ||""}
                            >
                              {subMenuItem.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
