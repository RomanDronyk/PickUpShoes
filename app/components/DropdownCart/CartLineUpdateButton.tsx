import { CartForm } from "@shopify/hydrogen";
import { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types";
import React from "react";

const CartLineUpdateButton = React.memo(({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
});

export default CartLineUpdateButton