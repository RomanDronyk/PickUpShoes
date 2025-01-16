import {Link} from '@remix-run/react';
import {Button} from './button';
import {ArrowRight} from 'lucide-react';
import {useContext} from 'react';
import {
  HeaderBasketContext,
  HeaderContextInterface,
} from '~/context/HeaderCarts';

export default function EmptyCart({setOpen}: {setOpen?: any}) {
  const {setCartShow} = useContext(
    HeaderBasketContext,
  ) as HeaderContextInterface;

  return (
    <div className="flex flex-col gap-5 min-h-52 h-full items-center justify-center">
      <h3 className="font-semibold text-[26px]">Схоже твоя корзина порожня</h3>
      <Button
        onClick={setOpen ? () => setOpen(false) : () => setCartShow(false)}
        asChild
        className="bg-red font-medium hover:bg-darkRed text-xl"
      >
        <Link
          onClick={setOpen ? () => setOpen(false) : () => setCartShow(false)}
          to="/collections/catalog"
        >
          До каталогу <ArrowRight size={20} className="ml-2" />
        </Link>
      </Button>
    </div>
  );
}
