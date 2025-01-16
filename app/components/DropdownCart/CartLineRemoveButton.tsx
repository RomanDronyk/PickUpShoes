import {Button} from '../ui/button';
import {X} from 'lucide-react';
import {CartForm} from '@shopify/hydrogen';

export function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <Button
        type="submit"
        disabled={disabled}
        className="self-center w-[25px] h-[25px] p-[6px] rounded-full"
      >
        <X size={16} />
      </Button>
    </CartForm>
  );
}
