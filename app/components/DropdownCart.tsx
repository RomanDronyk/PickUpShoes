import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {Button} from './ui/button';
import {useVariantUrl} from '~/utils';
import {ArrowRight} from 'lucide-react';
import {useClickAway} from '@uidotdev/usehooks';

import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {Variants} from 'framer-motion';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';

type DropDownCartLine = CartApiQueryFragment['lines']['nodes'][0];
type DropdownCartProps = {
  cart: CartApiQueryFragment | null;
  active: boolean;
  handleShow: (boolean) => void;
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
    top: '100%',
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
      className="absolute z-20 w-full flex-col  bg-white/95 backdrop-blur-lg drop-shadow-cart rounded-b-[30px] px-[30px] text-black"
    >
      {!lines && <EmptyCart />}
      <CartDetail lines={cart?.lines} />
    </motion.div>
  );
}
function CartDetail({
  lines,
}: {
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  return (
    <div aria-labelledby="cart-lines">
      <ul>
        {lines?.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({line}: {line: DropDownCartLine}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  return (
    <li key={id} className="grid grid-cols-12">
      <div className="flex items-center col-span-4">
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
      <div className="flex items-center">
        <CartLineQuantity line={line} />
        <CartLinePrice line={line} as="span" />
        <CartLineRemoveButton lineIds={[line.id]} />
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
    <div className="cart-line-quantiy">
      <small>Quantity: {quantity} &nbsp;&nbsp;</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
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
    <div>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
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
      <button type="submit">Remove</button>
    </CartForm>
  );
}
