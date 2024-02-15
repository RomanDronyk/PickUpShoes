import {Drawer, DrawerClose, DrawerContent, DrawerTrigger} from './ui/drawer';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './ui/accordion';
import {useState} from 'react';
import type {HeaderProps} from './Header';
import {Button} from './ui/button';
import {Link} from '@remix-run/react';

export function MobileMenu({menu}: {menu: HeaderProps['header']['menu']}) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="bottom">
      <DrawerTrigger asChild className="md:hidden">
        <Button variant="link" className="p-0">
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
      </DrawerTrigger>
      <DrawerContent className="h-[90%] px-5">
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
      </DrawerContent>
    </Drawer>
  );
}
