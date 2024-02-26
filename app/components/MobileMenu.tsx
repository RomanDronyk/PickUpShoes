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

export function MobileMenu({
  menu,
  logo,
}: {
  menu: HeaderProps['header']['menu'];
  logo: string | undefined;
}) {
  const [open, setOpen] = useState(false);
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
      <SheetContent side="left" className="sm:max-w-full w-full px-5">
        <SheetHeader>
          {logo && (
            <Link to="/" className="mb-10">
              <img src={logo} alt="Pick Up Shoes" />
            </Link>
          )}
        </SheetHeader>
        <Accordion type="single" collapsible className="w-full">
          {menu?.items.map((menuItem) => (
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
                    {menuItem.items.map((subMenuItem) => (
                      <li key={subMenuItem.id}>
                        <Link
                          className="sm:text-lg text-base hover:underline"
                          to={subMenuItem.url}
                        >
                          {subMenuItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
