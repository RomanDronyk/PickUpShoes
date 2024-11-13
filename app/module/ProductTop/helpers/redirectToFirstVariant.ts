import { redirect } from "@remix-run/server-runtime";
import { ProductFragment } from "storefrontapi.generated";
import { getVariantUrl } from "~/utils";

const redirectToFirstVariant = ({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) => {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes.filter(element => element.availableForSale)[0];
  let selectedOptions = firstVariant?.selectedOptions || product.variants.nodes[0].selectedOptions

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}
export default redirectToFirstVariant;