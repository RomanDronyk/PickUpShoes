import { CartForm } from "@shopify/hydrogen";
import React from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const CartLineRemoveButton = React.memo(({setNewQuantity, lineIds }: {setNewQuantity:any; lineIds: string[] }) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <Button
      onClick={setNewQuantity}
        type="submit"
        className="self-center w-[25px] h-[25px] p-[6px] rounded-full"
      >
        <X size={16} />
      </Button>
    </CartForm>
  );
});
export default CartLineRemoveButton