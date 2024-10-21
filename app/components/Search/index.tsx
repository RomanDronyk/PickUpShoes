import { Form } from '@remix-run/react';
import { useRef, useEffect } from 'react';

import type { PredictiveProductFragment, ProductVariantsFragment } from 'storefrontapi.generated';
import { Input } from '../ui/input';
import { SearchIcon } from '../SearchIcon';
import { SelectedOption } from '@shopify/hydrogen-react/storefront-api-types';


type PredicticeSearchResultItemImage =
  | PredictiveProductFragment['variants']['nodes'][0]['image'];

type PredictiveSearchResultItemPrice =
  | PredictiveProductFragment['variants']['nodes'][0]['price'];

export type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  image?: PredicticeSearchResultItemImage;
  price?: PredictiveSearchResultItemPrice;
  styledTitle?: string;
  title: string;
  variants: ProductVariantsFragment,
  url: string;
  selectedOptions: SelectedOption[]
};

export type NormalizedPredictiveSearchResults = Array<
  | {
    type: 'queries';
    items: Array<NormalizedPredictiveSearchResultItem>;
  }
  | {
    type: 'products';
    items: Array<NormalizedPredictiveSearchResultItem>;
  }
>;

export type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults;
  totalResults: number;
};



export const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = [
  { type: 'queries', items: [] },
  { type: 'products', items: [] },
];

export function SearchForm({ searchTerm }: { searchTerm: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  // focus the input when cmd+k is pressed
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Form
      method="get"
      className="flex border border-input rounded-[62px] bg-input items-center px-4 py-[3px]"
    >
      <SearchIcon />
      <Input
        name="q"
        placeholder="Що ти шукаєш?"
        ref={inputRef}
        type="search"
        defaultValue={searchTerm}
      />
    </Form>
  );
}



/**
 * Converts a plural search type to a singular search type
 *
 * @example
 * ```js
 * pluralToSingularSearchType('articles'); // => 'ARTICLE'
 * pluralToSingularSearchType(['articles', 'products']); // => 'ARTICLE,PRODUCT'
 * ```
 */
