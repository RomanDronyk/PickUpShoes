import { Pagination } from '@shopify/hydrogen';
import { useInView } from 'react-intersection-observer';
import type { SearchQuery } from 'storefrontapi.generated';
import { ProductCard } from '~/components/ProductCard';
import { Button } from '~/components/ui/button';
import { ProductsGrid } from '~/routes/($locale).collections.$handle';

const SearchResultsProductsGrid = ({
  products,
}: Pick<SearchQuery, 'products'>) => {
  const { ref, inView, entry } = useInView();
  return (
    <div className="py-2 items relative grid justify-center">
      <Pagination connection={products}>
        {({
          nodes,
          isLoading,
          PreviousLink,
          NextLink,
          hasNextPage,
          nextPageUrl,
          state,
        }) => {
          return (
            <>
              <PreviousLink className="m-[0_auto]">
                <Button variant={'outline'}>
                  {isLoading ? (
                    'Загрузка...'
                  ) : (
                    <span>↑ Попередня сторінка</span>
                  )}
                </Button>
              </PreviousLink>
              <ProductsGrid
                nodes={nodes}
                inView={inView}
                hasNextPage={hasNextPage}
                nextPageUrl={nextPageUrl}
                state={state}
              />
              <NextLink className="m-[0_auto]" ref={ref}>
                <Button variant={'outline'}>
                  {isLoading ? (
                    'Загрузка...'
                  ) : (
                    <span>↓ Наступна сторінка</span>
                  )}
                </Button>
              </NextLink>
            </>
          );
        }}
      </Pagination>
    </div>
  );
};
export default SearchResultsProductsGrid;
