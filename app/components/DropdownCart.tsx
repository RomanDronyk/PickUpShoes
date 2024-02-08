import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {Button} from './ui/button';
import {useVariantUrl} from '~/utils';
import {ArrowRight, X, Plus, Minus} from 'lucide-react';
import {useClickAway} from '@uidotdev/usehooks';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {Variants} from 'framer-motion';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';

type DropDownCartLine = CartApiQueryFragment['lines']['nodes'][0];
type DropdownCartProps = {
  cart: CartApiQueryFragment | null;
  active: boolean;
  handleShow: (arg0: boolean) => void;
};

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

const cartVariants = {
  closed: {
    top: '0%',
    opacity: 0,
    display: 'none',
    transition: {
      opacity: 0,
      scale: 0,
      delay: 0.1,
      duration: 0.6,
    },
  },
  open: {
    top: '100.9%',
    display: 'flex',
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 1,
      scale: 1,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
} satisfies Variants;

export function DropDownCart({cart, active, handleShow}: DropdownCartProps) {
  const lines = Boolean(cart?.lines?.nodes?.length || 0);
  const ref = useClickAway(() => {
    handleShow(false);
  }) as React.RefObject<HTMLDivElement>;
  return (
    <motion.div
      ref={ref}
      initial={false}
      variants={cartVariants}
      animate={active ? 'open' : 'closed'}
      exit="closed"
      className="absolute z-20 w-full flex-col  bg-white/95 backdrop-blur-lg drop-shadow-cart rounded-b-[30px]  p-[30px] text-black"
    >
      {!lines && <EmptyCart />}
      <DropDownCartDetail lines={cart?.lines} />
    </motion.div>
  );
}
function DropDownCartDetail({
  lines,
}: {
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  return (
    <div className="dropdown-detail">
      <div className="dropdown-table">
        <div className="dropdown-header grid grid-cols-12">
          <div className="dropdown-title col-span-9">
            <span className="font-semibold text-[26px] col-span-6">
              Корзина
            </span>
          </div>
          <div className="text-xl text-center">Кількість</div>
          <div className="text-xl text-center">Вартість</div>
        </div>
        <ul>
          {lines?.nodes.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function CartLineItem({line}: {line: DropDownCartLine}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  return (
    <li key={id} className="grid grid-cols-12">
      <div className="flex items-center col-span-9">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={70}
            loading="lazy"
            width={70}
            className="rounded-[15px] mr-[14px]"
          />
        )}
        <Link prefetch="intent" to={lineItemUrl}>
          <span className="font-semibold text-[22px]">{product.title}</span>
        </Link>
        <div className="ml-10">
          <ul>
            {selectedOptions.map((option) => (
              <li key={option.name}>
                <span>{option.name}: </span>
                <span className="opacity-60">{option.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-3 col-span-3 gap-x-3">
        <CartLineQuantity line={line} />
        <CartLinePrice line={line} as="span" />
        <div className="flex items-center justify-center">
          <CartLineRemoveButton lineIds={[line.id]} />
        </div>
      </div>
    </li>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col gap-5 min-h-52 h-full items-center justify-center">
      <h3 className="font-semibold text-[26px]">Схоже твоя корзина порожня</h3>
      <Button asChild className="bg-red font-medium hover:bg-darkRed text-xl">
        <Link to="/collections">
          До каталогу <ArrowRight size={20} className="ml-2" />
        </Link>
      </Button>
    </div>
  );
}
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex self-center items-center justify-center gap-5 text-lg text-black bg-input rounded-[62px] px-5 py-2">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Зменшити кількість"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
          className="flex flex-col items-center cursor-pointer"
        >
          <Minus />
        </button>
      </CartLineUpdateButton>
      <span>{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          className="flex flex-col items-center cursor-pointer"
          aria-label="Збільшити кількість"
          name="increase-quantity"
          value={nextQuantity}
        >
          <Plus />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}
function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className="self-center text-center font-semibold text-[22px]">
      <Money
        withoutTrailingZeros
        withoutCurrency
        {...passthroughProps}
        data={moneyV2}
      />
      грн
    </div>
  );
}
function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <Button
        type="submit"
        className="self-center w-[25px] h-[25px] p-[6px] rounded-full"
      >
        <X size={16} />
      </Button>
    </CartForm>
  );
}
