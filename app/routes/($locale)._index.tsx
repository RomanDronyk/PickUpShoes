import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import BlockNewsletter from '~/components/BlockNewsletter';
import { Hero } from '~/components/Hero';
import { MainCollections } from '~/components/MainCollections';
import BestSellers from '~/components/BestSellers';
import NewProducts from '~/components/NewProducts';
import { filterAvailablesProductOptions } from '~/utils';

export const handle: { breadcrumb: string } = {
  breadcrumb: 'home',
};

export const meta: MetaFunction = () => {
  return [{ title: 'PickupShoes | Головна' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const [FeaturedCollection, heroCollection, mainCollections, bestSellers, newProducts] = await Promise.all([
    storefront.query(FEATURED_COLLECTION_QUERY),
    storefront.query(HERO_QUERY),
    storefront.query(MAIN_COOLLECTIONS, {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
    storefront.query(BEST_SELLERS, {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
    storefront.query(NEW_PRODUCTS, {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    })
  ])
  const { collections } = FeaturedCollection

  const featuredCollection = collections.nodes[0];

  return defer({
    featuredCollection,
    heroCollection,
    mainCollections,
    bestSellers: filterAvailablesProductOptions(bestSellers.collection.products.nodes) || [],
    newProducts: filterAvailablesProductOptions(newProducts.collection.products.nodes) || [],
    storefront
  });
}


export default function Homepage() {
  const { heroCollection, mainCollections, bestSellers, newProducts, storefront } =
    useLoaderData<typeof loader>();

  return (
    <div className="home w-full flex flex-col items-center justify-center gap-y-[58px]">
      <Hero heroData={heroCollection} />
      <MainCollections collection={mainCollections} />
      <BestSellers items={bestSellers} />
      <NewProducts items={newProducts} />
      <BlockNewsletter />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 20) {
      nodes {
        availableForSale
        id
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }

      }
    }
  }
` as const;

const BEST_SELLERS = `#graphql 
${PRODUCT_ITEM_FRAGMENT}
query BestSellers{
  collection(handle: "bestsellers"){
    products(first: 10) {
      nodes {
        ...ProductItem
      }
    }
    
  }
}
`;
const NEW_PRODUCTS = `#graphql 
${PRODUCT_ITEM_FRAGMENT}
query NewProducts($country: CountryCode, $language: LanguageCode) 
@inContext(country: $country, language: $language){
  collection(handle: "new"){
    products(first: 10) {
      nodes {
        ...ProductItem
      }
    }
    
  }
}
`;

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;


const HERO_QUERY = `#graphql
  query HomeHero ($country: CountryCode, $language: LanguageCode)
   @inContext(country: $country, language: $language) {
    collection(handle: "home-page") {
      heading: metafield(namespace: "hero", key: "title") {
        value
      }
      banner: metafield(namespace: "hero", key: "image") {
        value
        reference {
          ... on MediaImage {
            id
            image {
              altText
              width
              height
              url
            }
          }
        }
      }
      motto: metafield(namespace: "hero", key: "motto") {
        value
      }
    }
  }
` as const;

const MAIN_COOLLECTIONS = `#graphql
  query MainCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language){
    men:collection(handle: "mens-shoes") {
      handle
      title
    }
  women:collection(handle: "women-shoes") {
    handle
    title
  }
  clothes:collection(handle: "clothes") {
    handle
    title
  }
}
` as const;


