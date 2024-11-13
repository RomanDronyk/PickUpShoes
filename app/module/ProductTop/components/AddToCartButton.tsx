import { FetcherWithComponents } from "@remix-run/react";
import { CartForm } from "@shopify/hydrogen";
import { CartLineInput } from "@shopify/hydrogen-react/storefront-api-types";
import LoaderNew from "~/components/LoaderNew";
import { cn } from "~/lib/utils";

const AddToCartButton = ({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
}) => {
  return (
    <div>
      <CartForm
        route="/cart"
        inputs={{ lines }}
        action={CartForm.ACTIONS.LinesAdd}
      >
        {(fetcher: FetcherWithComponents<any>) => (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? fetcher.state !== 'idle'}
              className={cn(
                'bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px] cursor-pointer',
                disabled && 'bg-white text-black border border-black',
              )}
            >
              {fetcher.state == 'idle' ?
                children
                : <div className='h-[18px]'> <LoaderNew /></div>}
            </button>
          </>
        )}
      </CartForm>
    </div>
  );
}
export default AddToCartButton;