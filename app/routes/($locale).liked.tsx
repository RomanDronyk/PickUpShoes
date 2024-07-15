import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Pagination, getPaginationVariables } from '@shopify/hydrogen';
import type {
  ProductFilter,
  Collection,
  ProductCollectionSortKeys,
  Filter,
} from '@shopify/hydrogen/storefront-api-types';
import { defer, json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type {
  CollectionQuery,
  ProductItemFragment,
  CollectionFiltersQuery,
} from 'storefrontapi.generated';
import { ProductCard } from '~/components/ProductCard';
import {
  ProductsFilter,
  SortProducts,
  AppliedFilters,
  MobileFilters,
} from '~/components/ProductsFilter';
import { parseAsCurrency } from '~/utils';
import { useMedia } from 'react-use';
import { Button } from '~/components/ui/button';
import { MoveDown, MoveUp } from 'lucide-react';
import Loader from '~/components/Loader';
import RecommendationProducts from '~/components/RecommendationProducts';
import BestSellers from '~/components/BestSellers';
import BlockNewsletter from '~/components/BlockNewsletter';
import { HeaderBasketContext, HeaderContextInterface } from '~/context/HeaderCarts';
import { useContext } from 'react';
import { LikedCart } from '~/components/LikedCart/LikedCart';
import { cn } from '~/lib/utils';


export const handle: { breadcrumb: string } = {
  breadcrumb: 'liked',
};

export default function Liked() {
  const { recommendedProducts, bestSellers } =
    useLoaderData<typeof loader>();

  const {
    likedCart,
  } = useContext(HeaderBasketContext) as HeaderContextInterface
  const isMobile = useMedia('(max-width: 767px)', false);

  return (
    <div className="  flex flex-col  lg:px-24 md:px-12 px-[10px]  mb-8" 
    style={{margin: "0 auto"}}>
      <div className="items relative">
        <h1 className=" pt-[13px] pl-[1.46rem] font-medium lg:text-[32px] text-[22px]">
          Вподобані товари
        </h1>
      </div>
      <div className={isMobile? "flex flex-col min-h-[100px] relative  ":'flex flex-col min-h-[100px] relative  justify-center  register rounded-[20px] border border-black/10 p-6 my-[12px] mb-[34px]'}>
        {likedCart.length > 0 ?
          <div style={{ display: "grid", gap: 18 }}>
            {likedCart.map((product: ProductItemFragment) => <LikedCart key={product.handle} product={product} />)}
          </div>
          :
          <h2 className="text-gray-500 text-2xl  font-semibold left-1/2 opacity-70 absolute text-center top-[50%] transform -translate-x-1/2 -translate-y-1/2">
            На жаль, ви нічого не вподобали
          </h2>
        }
      </div>
      <Link prefetch="intent" to="collections/catalog">
        <button
          type="submit"
          style={{ alignItems: "center" }}
          className={cn(
            'bg-black flex w-full sm:w-auto justify-center  gap-[35px] text-white font-medium text-[16px] sm:text-[18px] mb-[70px] rounded-[62px] py-[11px] sm:py-[14px] px-[58px] cursor-pointer',
            false && 'bg-white text-black border border-black',
          )}
        >
          Продовжити покупки <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5 11.5C0.5 13.7745 1.17446 15.9979 2.4381 17.8891C3.70174 19.7802 5.49779 21.2542 7.59914 22.1246C9.70049 22.995 12.0128 23.2228 14.2435 22.779C16.4743 22.3353 18.5234 21.24 20.1317 19.6317C21.74 18.0234 22.8353 15.9743 23.279 13.7435C23.7228 11.5128 23.495 9.20049 22.6246 7.09914C21.7542 4.99779 20.2802 3.20174 18.3891 1.9381C16.4979 0.674463 14.2745 0 12 0C8.95001 0 6.02494 1.2116 3.86827 3.36827C1.7116 5.52494 0.5 8.45001 0.5 11.5ZM5.42857 10.6786H15.4089L10.8254 6.07282L12 4.92857L18.5714 11.5L12 18.0714L10.8254 16.8992L15.4089 12.3214H5.42857V10.6786Z" fill="white" />
          </svg>
        </button>
      </Link>


      {/* <RecommendationProducts recommended={recommendedProducts}/> */}
      <BestSellers items={bestSellers} />
      <div className='h-[40px]'>

      </div>
      <BlockNewsletter />
    </div>
  );
}


export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const recommendedProducts = await storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const bestSellers = await storefront.query(BEST_SELLERS, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return defer({
    recommendedProducts,
    bestSellers
  });
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
    variants(first: 10) {
      nodes {
        selectedOptions {
          name
          value
        }
        availableForSale
        id
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