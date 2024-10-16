import { AppLoadContext } from "@remix-run/server-runtime";
import { RECOMENDED_PRODUCT_QUERY } from "~/graphql/queries";

 const getRecommendationsById = async (id: string,cache:any,context:AppLoadContext) => {
  if (cache.has(id)) {
      return cache.get(id)
  }
  const response = await context.storefront.query(RECOMENDED_PRODUCT_QUERY, {
      variables: { id, country: context.storefront.i18n.country, language: context.storefront.i18n.language }
  });
  cache.set(id, response);
  return response;
}
export default getRecommendationsById;