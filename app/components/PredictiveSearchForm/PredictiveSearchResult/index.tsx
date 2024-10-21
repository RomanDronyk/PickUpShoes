import { NormalizedPredictiveSearch, NormalizedPredictiveSearchResultItem, NormalizedPredictiveSearchResults } from "~/components/Search";
import { SearchResultItem } from "../SearchResultItem";

type SearchResultTypeProps = {
  goToSearchResult: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  items: NormalizedPredictiveSearchResultItem[];
  searchTerm: UseSearchReturn['searchTerm'];
  type: NormalizedPredictiveSearchResults[number]['type'];
};


type UseSearchReturn = NormalizedPredictiveSearch & {
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchTerm: React.MutableRefObject<string>;
};


export function PredictiveSearchResult({
  goToSearchResult,
  items,
  searchTerm,
  type,
}: SearchResultTypeProps) {
  const isSuggestions = type === 'queries';
  const categoryUrl = `/search?q=${searchTerm.current
    }&type=${pluralToSingularSearchType(type)}`;
  console.log(categoryUrl, isSuggestions)

  return (
    <div
      className="predictive-search-result px-4 py-3 overflow-y-auto"
      key={type}
    >
      <ul className="flex flex-col gap-5">
        {items.map((item: NormalizedPredictiveSearchResultItem) => (
          <SearchResultItem
            goToSearchResult={goToSearchResult}
            item={item}
            key={item.id}
          />
        ))}
      </ul>
    </div>
  );
}

function pluralToSingularSearchType(
  type:
    | NormalizedPredictiveSearchResults[number]['type']
    | Array<NormalizedPredictiveSearchResults[number]['type']>,
) {
  const plural = {
    products: 'PRODUCT',
    queries: 'QUERY',
  };

  if (typeof type === 'string') {
    return plural[type];
  }

  return type.map((t) => plural[t]).join(',');
}
