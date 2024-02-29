import {
  Drawer,
  DrawerClose,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
} from './ui/drawer';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '@remix-run/react';
import {Button} from './ui/button';
import {ArrowRight, Minus, Plus, X} from 'lucide-react';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {useState} from 'react';
import {useVariantUrl} from '~/utils';

type DropDownCartLine = CartApiQueryFragment['lines']['nodes'][0];

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

export function MobileCart({
  cart,
  empty,
}: {
  cart: CartApiQueryFragment | null;
  empty?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button variant="ghost" className="relative px-2 py-2">
          <svg
            className="max-sm:w-5 max-sm:h-5"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 27C11.5523 27 12 26.5523 12 26C12 25.4477 11.5523 25 11 25C10.4477 25 10 25.4477 10 26C10 26.5523 10.4477 27 11 27Z"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M25 27C25.5523 27 26 26.5523 26 26C26 25.4477 25.5523 25 25 25C24.4477 25 24 25.4477 24 26C24 26.5523 24.4477 27 25 27Z"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 5H7L10 22H26"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 16.6666H25.59C25.7056 16.6667 25.8177 16.6267 25.9072 16.5534C25.9966 16.4802 26.0579 16.3781 26.0806 16.2648L27.8806 7.26475C27.8951 7.19218 27.8934 7.11729 27.8755 7.04548C27.8575 6.97368 27.8239 6.90675 27.7769 6.84952C27.73 6.7923 27.6709 6.74621 27.604 6.71458C27.5371 6.68295 27.464 6.66657 27.39 6.66663H8"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="inline-flex rounded-full bg-bageRed text-white text-xs text-center px-[5px] py-[1px] absolute right-0 bottom-0">
            {cart?.totalQuantity || 0}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90%] px-5">
        <div className="overflow-y-auto overflow-x-hidden">
          {!cart && <EmptyCart />}
          {cart && <MobileCartDetail cart={cart} />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function MobileCartDetail({cart}: {cart: CartApiQueryFragment | null}) {
  const cost = cart?.cost;
  return (
    <>
      <DrawerHeader className="flex flex-row justify-between items-center px-0">
        <span className="font-semibold text-[22px]">Корзина</span>
        <DrawerClose asChild>
          <Button className="rounded-full bg-[#535353] p-0 w-[28px] h-[28px]">
            <X size={18} />
          </Button>
        </DrawerClose>
      </DrawerHeader>
      <div className="flex flex-col gap-y-5">
        {cart?.lines?.nodes?.map((line: CartLine) => (
          <MobileCartLine key={line.id} line={line} />
        ))}
      </div>
      <DrawerFooter className="px-0">
        <div className="flex items-center justify-end font-bold text-black text-[22px]">
          <span className="mr-4">Підсумок: </span>
          <Money
            as="span"
            withoutCurrency
            withoutTrailingZeros
            data={cost?.totalAmount}
          />
          &nbsp;грн
        </div>
        <Button asChild className="rounded-[60px] px-[55px]">
          <Link to={cart?.checkoutUrl} className="flex gap-5">
            <span className="font-medium text-2xl">Оформити замовлення</span>
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 11.5C0 13.7745 0.674463 15.9979 1.9381 17.8891C3.20174 19.7802 4.99779 21.2542 7.09914 22.1246C9.20049 22.995 11.5128 23.2228 13.7435 22.779C15.9743 22.3353 18.0234 21.24 19.6317 19.6317C21.24 18.0234 22.3353 15.9743 22.779 13.7435C23.2228 11.5128 22.995 9.20049 22.1246 7.09914C21.2542 4.99779 19.7802 3.20174 17.8891 1.9381C15.9979 0.674463 13.7745 0 11.5 0C8.45001 0 5.52494 1.2116 3.36827 3.36827C1.2116 5.52494 0 8.45001 0 11.5ZM4.92857 10.6786H14.9089L10.3254 6.07282L11.5 4.92857L18.0714 11.5L11.5 18.0714L10.3254 16.8992L14.9089 12.3214H4.92857V10.6786Z"
                fill="white"
              />
            </svg>
          </Link>
        </Button>
      </DrawerFooter>
    </>
  );
}

function MobileCartLine({line}: {line: DropDownCartLine}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const priceType = line.cost.compareAtAmountPerQuantity
    ? 'compareAt'
    : 'regular';
  return (
    <div className="border rounded-[20px] border-black/10 p-[15px]">
      <div className="flex justify-between flex-wrap">
        <div className="flex gap-x-[13px] max-w-[80%]">
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
            <span className="font-semibold min-[385px]:text-[20px] text-base">
              {product.title}
            </span>
          </Link>
        </div>
        <CartLineRemoveButton lineIds={[line.id]} />
      </div>
      <div>
        <div className="text-base">
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
      <div className="flex items-center justify-between max-[385px]:flex-col-reverse">
        <CartLinePrice line={line} as="span" />
        <CartLineQuantity line={line} />
      </div>
    </div>
  );
}
function EmptyCart() {
  return (
    <div className="flex flex-col gap-5 min-h-52 h-full items-center justify-center">
      <h3 className="font-semibold text-center text-[26px]">
        Схоже твоя корзина порожня
      </h3>
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
    <div className="flex self-center items-center justify-center gap-5 text-lg text-black bg-input rounded-[62px] px-5 py-2 max-[385px]:self-end max-[385px]:mb-3">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Зменшити кількість"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
          className="flex flex-col items-center cursor-pointer"
        >
          <Minus size={16} />
        </button>
      </CartLineUpdateButton>
      <span className="text-sm">{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          className="flex flex-col items-center cursor-pointer"
          aria-label="Збільшити кількість"
          name="increase-quantity"
          value={nextQuantity}
        >
          <Plus size={16} />
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

  const oldTotalPrice = line.cost.compareAtAmountPerQuantity
    ? parseInt(line.cost.compareAtAmountPerQuantity?.amount) * line.quantity
    : '';

  const showDiscount = line.cost.compareAtAmountPerQuantity || false;
  function percentageDiscount(line: CartLine) {
    const {
      quantity,
      cost: {amountPerQuantity, totalAmount, compareAtAmountPerQuantity},
    } = line;

    if (compareAtAmountPerQuantity) {
      const oldCost = quantity * parseInt(compareAtAmountPerQuantity.amount);
      return ((1 - parseInt(totalAmount.amount) / oldCost) * 100).toFixed();
    }
    return true;
  }
  return (
    <div className=" font-semibold max-[385px]:self-start">
      {!showDiscount ? (
        <>
          <Money
            withoutTrailingZeros
            withoutCurrency
            {...passthroughProps}
            data={moneyV2}
          />
          грн
        </>
      ) : (
        <div className="flex items-center gap-x-[10px]">
          <div>
            <Money
              withoutTrailingZeros
              withoutCurrency
              {...passthroughProps}
              data={moneyV2}
            />
            грн
          </div>
          <div className="line-through text-[#B3B3B3]">
            {oldTotalPrice}
            грн
          </div>
          <div className="text-destructive bg-destructive/10 font-medium rounded-xl px-[9px]">
            <span>-{percentageDiscount(line)}%</span>
          </div>
        </div>
      )}
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
        className="bg-[#B3B3B3] self-center w-[25px] h-[25px] p-[6px] rounded-full"
      >
        <X size={16} />
      </Button>
    </CartForm>
  );
}
