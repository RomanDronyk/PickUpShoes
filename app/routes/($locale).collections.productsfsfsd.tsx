import { Link, type MetaFunction, useLoaderData } from "@remix-run/react";
import { Image, getPaginationVariables } from "@shopify/hydrogen";
import { json } from "@shopify/remix-oxygen";
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import type { ProductCardFragment } from "storefrontapi.generated";
import invariant from "tiny-invariant";
import { ProductCard } from "~/components/ProductCard";
import { useVariantUrl } from "~/utils";

export const meta: MetaFunction = () => {
	return [
		{
			title: "Pick Up Pickup Shoes | Каталог товарів",
		},
	];
};

export async function loader({
	request,
	context: { storefront },
}: LoaderFunctionArgs) {
	const paginationVariables = getPaginationVariables(request, {
		pageBy: 3,
	});
	const { products } = await storefront.query(ALL_PRODUCTS_QUERY, {
		variables: paginationVariables,
	});
	return json({ products });
}

export default function Catalog() {
	const data = useLoaderData<typeof loader>();
	console.log(data);
	return (
		<div className="grid grid-cols-[1fr_minmax(auto,_1030px)] gap-x-5 w-full px-24 pt-[30px] mb-8">
			<div className="sidebar w-[250px] h-full"></div>
			<div className="items">
				<div className="title">
					<h1 className="font-medium text-[32px]">Каталог</h1>
				</div>
				{/* <div className="product-grid grid grid-cols-3 auto-rows-[minmax(50px,_380px)] gap-x-[10px] gap-y-10 mt-5">
					{products.nodes.map((product) => (
						<ProductCard product={product} key={product.id} />
					))}
				</div> */}
			</div>
		</div>
	);
}

const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    publishedAt
    handle
    vendor
    options {
      name
      values
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    variants(first: 100) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        price {
          amount
        }
        compareAtPrice {
          amount
        }
        selectedOptions {
          name
          value
        }
        product {
          handle
          title
        }
      }
    }
  }
`;
const ALL_PRODUCTS_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
  products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }

    }
    ${PRODUCT_CARD_FRAGMENT}
`;
