import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { Pagination, getPaginationVariables } from '@shopify/hydrogen';
import type {
  ProductFilter,
  Collection,
  ProductCollectionSortKeys,
  Filter,
} from '@shopify/hydrogen/storefront-api-types';
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type {
  CollectionQuery,
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
import { COLLECTION_FILTER_QUERY, COLLECTION_QUERY } from '~/graphql/queries';

export type SortParam =
  | 'price-low-high'
  | 'price-high-low'
  | 'best-selling'
  | 'newest'
  | 'featured';

export const FILTER_URL_PREFIX = 'filter.';

export const handle: { breadcrumb: string } = {
  breadcrumb: 'collection',
};

export const meta: MetaFunction<typeof loader> = ({ data }: any) => {
  return [{ title: `PickUpShoes | ${data?.collection.title ?? ''} Collection` }];
};

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const locale = context.storefront.i18n;
  const searchParams = new URL(request.url).searchParams;
  const { sortKey, reverse } = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );

  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  if (!handle) {
    return redirect('/collections/catalog');
  }
  const { collection: filtersCollection } =
    await storefront.query<CollectionFiltersQuery>(COLLECTION_FILTER_QUERY, {
      variables: {
        handle,
        first: 1,
      },
    });
  const { collection } = await storefront.query<CollectionQuery>(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        handle,
        filters,
        sortKey,
        reverse,
      },
    },
  );

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );
  const appliedFilters: any = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }
      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
          name: foundValue.label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return json({ collection, filtersCollection, appliedFilters });
}

export default function Collection() {
  const { collection, filtersCollection, appliedFilters } =
    useLoaderData<typeof loader>();
  const isMobile = useMedia('(max-width: 767px)', false);


  return (
    <div className="grid lg:grid-cols-[minmax(auto,_300px)_minmax(auto,_1fr)] grid-cols-1 gap-x-5 w-full lg:px-24 md:px-12 px-[10px]  mb-8">
      <div className="sidebar xl:w-[300px] h-full lg:block hidden">
        <ProductsFilter
          filters={collection.products.filters as Filter[]}
          initialFilters={filtersCollection?.products.filters as Filter[]}
          appliedFilters={appliedFilters}
        />
      </div>
      <div className="items relative">
        <div className="title flex items-center justify-between mb-[10px]">
          <h1 className="font-medium lg:text-[32px] text-[22px]">
            {collection.title}
          </h1>

          {!isMobile ? (
            <SortProducts />
          ) : (
            <MobileFilters
              appliedFilters={appliedFilters}
              filters={collection.products.filters as Filter[]}
              initialFilters={filtersCollection?.products.filters as Filter[]}
            />
          )}
        </div>
        {isMobile && <AppliedFilters filters={appliedFilters} />}
        <Pagination connection={collection.products}>
          {({ nodes, isLoading, PreviousLink, NextLink }) => (
            <>
              <PreviousLink className="flex w-full justify-center mb-10">
                <Button className="flex gap-3 items-center rounded-[8px] border border-black/10 bg-white text-black hover:bg-black/10">
                  {isLoading ? 'Завантажуємо...' : ' Завантажити попередні'}
                  {isLoading ? <Loader /> : <MoveUp size={16} />}
                </Button>
              </PreviousLink>
              <ProductsGrid products={nodes} />
              <NextLink className="flex w-full justify-center mt-10">
                <Button className="rounded-[8px] flex gap-3 items-center text-xl border border-black/10 bg-white text-black hover:bg-black/10">
                  {isLoading ? 'Завантажуємо...' : ' Завантажити ще'}
                  {isLoading ? <Loader /> : <MoveDown size={16} />}
                </Button>
              </NextLink>
            </>
          )}
        </Pagination>
      </div>
    </div>
  );
}

function ProductsGrid({ products }: { products: any[] }) {
  return (
    <div className="product-grid grid md:grid-cols-3 xl:grid-cols-3 grid-cols-2  gap-x-[20px] gap-y-10 mt-5">
      {(products.length > 0) ?
        products.map((product, index) => {
          return <div key={product.id}><ProductCard product={product} /></div>
        }) : <h2 className="text-gray-500 text-2xl font-semibold left-1/2 opacity-70 absolute text-center top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Нічого не знайдено
        </h2>}
    </div>
  );
}


function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED',
        reverse: true,
      };
    case 'featured':
      return {
        sortKey: 'MANUAL',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}
