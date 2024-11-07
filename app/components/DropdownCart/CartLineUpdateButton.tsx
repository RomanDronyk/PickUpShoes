import { FetcherWithComponents } from "@remix-run/react";
import { CartForm } from "@shopify/hydrogen";
import { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types";
import React from "react";
import LoaderNew from "../LoaderNew";

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
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          {fetcher.state == "idle" ?
            children :
            <div className="w-[24px] h-[24px]">
              <LoaderNew color="black" />

            </div>

          }
        </>
      )}
    </CartForm>
  );
});

export default CartLineUpdateButton