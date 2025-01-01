import { SearchQuery } from "storefrontapi.generated";
import SearchResultsProductsGrid from "../SearchResultsProductsGrid";

type FetchSearchResultsReturn = {
  searchResults: {
    results: SearchQuery | null;
    totalResults: number;
  };
  searchTerm: string;
};


export function SearchResults({
  results,
}: Pick<FetchSearchResultsReturn['searchResults'], 'results'>) {
  if (!results) {
    return null;
  }
  const keys = Object.keys(results) as Array<keyof typeof results>;
  console.log(results, "results")
  return (
    <div>
      {results &&
        keys.map((type) => {
          const resourceResults = results[type];
          if (resourceResults.nodes[0].__typename === 'Product') {
            const productResults = resourceResults as SearchQuery['products'];
            console.log(resourceResults.nodes.length, "resourceResults.nodes.length")
            return resourceResults.nodes.length ? (
              <SearchResultsProductsGrid
                key="products"
                products={productResults}
              />
            ) : null;
          }
          return null;
        })}
    </div>
  );
}
