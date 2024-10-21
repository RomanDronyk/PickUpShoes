import { Link } from '@remix-run/react';
import { Pagination } from '@shopify/hydrogen';
import type { SearchQuery, } from 'storefrontapi.generated';


const SearchResultsProductsGrid = ({ products }: Pick<SearchQuery, 'products'>) => {
  return (
    <div className="search-result">
      <h2>Products</h2>
      <Pagination connection={products}>
        {({ nodes, isLoading, NextLink, PreviousLink }) => {
          const itemsMarkup = nodes.map((product) => (
            <div className="search-results-item" key={product.id}>
              <Link prefetch="intent" to={`/products/${product.handle}`}>
                <span>{product.title}</span>
              </Link>
            </div>
          ));
          return (
            <div>
              <div>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div>
                {itemsMarkup}
                <br />
              </div>
              <div>
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
      <br />
    </div>
  );
}
export default SearchResultsProductsGrid;