import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { getSelectedProductOptions } from "@shopify/hydrogen";
import { SelectedOption } from "@shopify/hydrogen-react/storefront-api-types";
import { Metafield } from "@shopify/hydrogen/storefront-api-types";
import { viewedProductsCookie } from "~/cookies.server";
import { PRODUCT_QUERY, RECOMENDED_PRODUCT_QUERY, VIEWED_PRODUCT_QUERY } from "~/graphql/queries";
import { QUERY_RELATED_PRODUCT_BY_ID } from "~/routes/($locale).products.$handle";
import redirectToFirstVariant from "../helpers/redirectToFirstVariant";
import { filterAvailablesProductOptions } from "~/utils";

const loadCriticalData = async ({
  context,
  params,
  request,
}: LoaderFunctionArgs) => {
  const { handle } = params;
  const { storefront } = context;
  const url = new URL(request.url);
  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }
  const selectedOptions = getSelectedProductOptions(request)
  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        language: 'UK',
        country: 'UA',
        selectedOptions: selectedOptions,
        identifiers: [
          {
            "namespace": "shopify--discovery--product_recommendation",
            "key": "related_products"
          }
        ],
      },
    }),
  ]);


  const metafields = product.metafields;
  let relatedProducts = [];
  if (metafields.length !== 0 && metafields[0]) {
    const findRelatedProducts = metafields.find((element: Metafield) => element?.key == "related_products") || { value: "" }
    const parseMetaValue: any = JSON.parse(findRelatedProducts?.value) || []
    relatedProducts = await Promise.all(parseMetaValue.map((id: string) => {
      return storefront.query(QUERY_RELATED_PRODUCT_BY_ID, {
        variables: {
          id
        }
      })
    }))
  }

  ///відображенн availableForSale прикріпленого продукту, відповідно до розміру який вибраний
  relatedProducts = relatedProducts.map(element => {
    if (!element?.product?.availableForSale) return element;
    const selectedVariantSize = selectedOptions.find(element => element.name === 'Size' || element.name === 'Розмір')?.value
    if (!selectedVariantSize) return element
    const productVariants = element.product.variants.edges;
    const filteredVariants = productVariants.find(({ node }: any) => {
      return node.selectedOptions.some((selectedOption: any) =>
        selectedOption.value === selectedVariantSize
      )
    });
    return {
      product: {
        ...element.product,
        availableForSale: typeof (filteredVariants?.node?.availableForSale) == "boolean" ? filteredVariants?.node?.availableForSale : element?.product?.availableForSale

      }
    }
  })

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }


  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await viewedProductsCookie.parse(cookieHeader)) || [];

  if (!cookie.includes(product.id)) {
    cookie.push(product.id);
  }

  const viewed = await storefront.query(VIEWED_PRODUCT_QUERY, {
    variables: {
      ids: cookie,
    },
  });

  const [{ productRecommendations }] = await Promise.all([
    storefront.query(
      RECOMENDED_PRODUCT_QUERY,
      {
        variables: {
          id: product?.id || "0"
        },
      })],
  );


  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({ product, request });
    }
  }

  return {
    handle: product.handle,
    relatedProducts,
    cookie,
    product,
    viewedProducts: filterAvailablesProductOptions(viewed.nodes) || [],
    recommendations: filterAvailablesProductOptions(productRecommendations) || [],
  };
}

export default loadCriticalData;