import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { VARIANTS_QUERY } from "~/graphql/queries";

const loadDeferredData = ({ context, params }: LoaderFunctionArgs) => {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: { 
        handle: 
        params.handle!,
       },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    variants,
  };
}
export default loadDeferredData;