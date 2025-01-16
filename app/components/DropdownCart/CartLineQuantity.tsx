import {Plus, Minus} from 'lucide-react';
import CartLineUpdateButton from './CartLineUpdateButton';
import {CartApiQueryFragment} from 'storefrontapi.generated';
const CartLineQuantity = ({
  isAbsolute,
  line,
}: {
  isAbsolute?: any;
  line: CartLine;
}) => {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div
      className={
        isAbsolute
          ? 'flex self-center absolute bottom-0 right-0 items-center justify-center lg:gap-5 gap-3 text-lg text-black bg-input rounded-[62px] lg:px-5 px-2 py-1'
          : 'flex self-center items-center justify-center lg:gap-5 gap-3 text-lg text-black bg-input rounded-[62px] lg:px-5 px-2 py-1'
      }
    >
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
};
export default CartLineQuantity;

type CartLine = CartApiQueryFragment['lines']['nodes'][0];
