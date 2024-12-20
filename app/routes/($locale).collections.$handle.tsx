import { useLoaderData, useNavigate, type MetaFunction } from '@remix-run/react';
import {
  getPaginationVariables,
  Pagination,
} from '@shopify/hydrogen';
import type {
  ProductFilter,
  Collection,
  ProductCollectionSortKeys,
  Filter,
} from '@shopify/hydrogen/storefront-api-types';
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
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
import { filterAvailablesProductOptions, parseAsCurrency } from '~/utils';
import { useMedia } from 'react-use';
import { COLLECTION_FILTER_QUERY, COLLECTION_QUERY } from '~/graphql/queries';
import { HEADER_QUERY } from '~/graphql/queries/headerQuery.graphql';
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from 'react';
import { Button } from '~/components/ui/button';

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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `PickUpShoes | ${data?.collection.title ?? ''} Collection` }];
};


export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    return redirect('/collections/catalog');
  }

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
          [filterKey]: JSON.parse(value || `[]`),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );


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

  const headerPromise = await storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        console.error('Could not find filter value for filter', filter);
        return null;
      }
      if (foundValue.id === 'filter.v.price') {
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
  return defer({
    collection: { ...collection, products: { ...collection.products, nodes: filterAvailablesProductOptions(collection.products.nodes) } }, headerPromise, filtersCollection, appliedFilters, handle, params
  });

}


export default function Collection() {
  const { collection, headerPromise, filtersCollection, appliedFilters, handle, params }: any = useLoaderData<typeof loader>();
  const memoizedFilters = useMemo(() => collection.products.filters, [collection.products.filters]);
  const memoizedInitialFilters = useMemo(() => filtersCollection?.products.filters, [filtersCollection?.products.filters]);
  const memoizedAppliedFilters = useMemo(() => appliedFilters, [appliedFilters]);
  const momoizedHeaderPromise = useMemo(() => headerPromise, [headerPromise]);
  const isMobile = useMedia('(max-width: 1024px)', false);
  const { ref, inView, entry } = useInView();
  console.log(collection)

  return (
    <div className="grid lg:grid-cols-[minmax(auto,_300px)_minmax(auto,_1fr)] grid-cols-1 gap-x-5 w-full lg:px-24 md:px-12 px-[10px]  mb-8">
      <div className="sidebar xl:w-[300px] h-full lg:block hidden">
        <ProductsFilter
          filters={memoizedFilters as Filter[]}
          initialFilters={memoizedInitialFilters as Filter[]}
          appliedFilters={memoizedAppliedFilters}
          headerPromise={momoizedHeaderPromise}
        />
      </div>
      <div className="items relative">
        <div className="title flex items-center justify-between mb-[10px]">
          <h1 className="font-medium lg:text-[32px] text-[22px]">
            {collection.title || "sdlfkjs"}
          </h1>

          {!isMobile ? (
            <SortProducts />
          ) : (
            <MobileFilters
              headerPromise={headerPromise}
              filters={collection.products.filters as Filter[]}
              initialFilters={filtersCollection?.products.filters as Filter[]}
            />
          )}
        </div>
        {isMobile && <AppliedFilters filters={appliedFilters} />}
        <Pagination connection={collection.products}>
          {({ nodes, isLoading, PreviousLink, NextLink, hasNextPage, nextPageUrl, state }) => (
            <>
              <PreviousLink>

                <Button className='m-[0_auto]' variant={"outline"}>{isLoading ? 'Загрузка...' : <span>↑ Попередня сторінка</span>}</Button>
              </PreviousLink>
              <ProductsGrid nodes={nodes}
                inView={inView}
                hasNextPage={hasNextPage}
                nextPageUrl={nextPageUrl}
                state={state} />
              <NextLink ref={ref}>
                <Button className='m-[0_auto]' variant={"outline"}>{isLoading ? 'Загрузка...' : <span>↓ Наступна сторінка</span>}</Button>
              </NextLink>

            </>
          )}
        </Pagination>
      </div>
    </div>
  );
}

export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{ node: NodesType; index: number }>;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({ nodes, isLoading, PreviousLink, NextLink }) => {
        const resoucesMarkup = nodes.map((node, index) =>
          children({ node, index }),
        );
        return (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resoucesMarkup}</div>
            ) : (
              resoucesMarkup
            )}
            <NextLink>
              {isLoading ? 'Loading...' : <span>Load more ↓</span>}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}

export function ProductsGrid({ nodes, inView, hasNextPage, nextPageUrl, state }: any) {
  const navigate = useNavigate();

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        replace: true,
        preventScrollReset: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  const availableProducts = nodes.filter((product: any) =>
    product.variants.nodes.some((variant: any) => {
      if (variant.availableForSale) {
        return { ...variant, product }
      }
    })
  );

  return (
    <div className="product-grid grid md:grid-cols-3 xl:grid-cols-3 grid-cols-2  gap-x-[20px] gap-y-10 mt-5">
      {availableProducts.length > 0 ? (
        availableProducts.map((product: any, index: number) => (
          <div key={product.id}><ProductCard product={product} /></div>
        ))
      ) : (
        <h2 className="text-gray-500 text-2xl font-semibold left-1/2 opacity-70 absolute text-center top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Нічого не знайдено
        </h2>
      )}
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





