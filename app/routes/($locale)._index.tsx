import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import BlockNewsletter from '~/components/BlockNewsletter';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
  BestSellersQuery,
} from 'storefrontapi.generated';

import {Hero} from '~/components/Hero';
import {MainCollections} from '~/components/MainCollections';
import BestSellers from '~/components/BestSellers';
import NewProducts from '~/components/NewProducts';

export const handle: {breadcrumb: string} = {
  breadcrumb: 'home',
};

export const meta: MetaFunction = () => {
  return [{title: 'PickupShoes | Головна'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  const heroCollection = await storefront.query(HERO_QUERY);
  const mainCollections = await storefront.query(MAIN_COOLLECTIONS, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const bestSellers = await storefront.query(BEST_SELLERS, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });
  const newProducts = await storefront.query(NEW_PRODUCTS, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return defer({
    featuredCollection,
    recommendedProducts,
    heroCollection,
    mainCollections,
    bestSellers,
    newProducts,
  });
}

export default function Homepage() {
  const {heroCollection, mainCollections, bestSellers, newProducts} =
    useLoaderData<typeof loader>();
  return (
    <div className="home w-full flex flex-col items-center justify-center gap-y-[45px]">
      <Hero heroData={heroCollection} />
      <MainCollections collection={mainCollections} />
      <BestSellers items={bestSellers} />
      <NewProducts items={newProducts} />
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
      <BlockNewsletter/>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
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
    variants(first: 1) {
      nodes {
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
query BestSellers($country: CountryCode, $language: LanguageCode) 
@inContext(country: $country, language: $language){
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

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
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
