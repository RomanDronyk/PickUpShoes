import {
  Link,
  Form,
  useParams,
  useFetcher,
  useFetchers,
  type FormProps,
} from '@remix-run/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import React, {useRef, useEffect, useState} from 'react';
import clsx from 'clsx';
import {motion} from 'framer-motion';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerClose,
} from './ui/drawer';

import type {
  PredictiveProductFragment,
  SearchQuery,
} from 'storefrontapi.generated';
import {Input} from './ui/input';
import {Button} from './ui/button';
import {X} from 'lucide-react';
import {isMobile} from 'react-device-detect';

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
  url: string;
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

type FetchSearchResultsReturn = {
  searchResults: {
    results: SearchQuery | null;
    totalResults: number;
  };
  searchTerm: string;
};

export const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = [
  {type: 'queries', items: []},
  {type: 'products', items: []},
];

export function SearchForm({searchTerm}: {searchTerm: string}) {
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

export function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g opacity="0.5">
        <path
          d="M20 20L16.2223 16.2156M18.3158 11.1579C18.3158 13.0563 17.5617 14.8769 16.2193 16.2193C14.8769 17.5617 13.0563 18.3158 11.1579 18.3158C9.2595 18.3158 7.43886 17.5617 6.0965 16.2193C4.75413 14.8769 4 13.0563 4 11.1579C4 9.2595 4.75413 7.43886 6.0965 6.0965C7.43886 4.75413 9.2595 4 11.1579 4C13.0563 4 14.8769 4.75413 16.2193 6.0965C17.5617 7.43886 18.3158 9.2595 18.3158 11.1579V11.1579Z"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function SearchResults({
  results,
}: Pick<FetchSearchResultsReturn['searchResults'], 'results'>) {
  if (!results) {
    return null;
  }
  const keys = Object.keys(results) as Array<keyof typeof results>;
  return (
    <div>
      {results &&
        keys.map((type) => {
          const resourceResults = results[type];
          if (resourceResults.nodes[0]?.__typename === 'Product') {
            const productResults = resourceResults as SearchQuery['products'];
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

function SearchResultsProductsGrid({products}: Pick<SearchQuery, 'products'>) {
  return (
    <div className="search-result">
      <h2>Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
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

export function NoSearchResults() {
  return <p>Нічого не знайдено</p>;
}

type ChildrenRenderProps = {
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetcher: ReturnType<typeof useFetcher<NormalizedPredictiveSearchResults>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

type SearchFromProps = {
  action?: FormProps['action'];
  method?: FormProps['method'];
  isMobile: boolean;
  brandLogo?: Maybe<Pick<Image, 'url'>> | undefined;
  [key: string]: unknown;
};

/**
 *  Search form component that posts search requests to the `/search` route
 **/
export function PredictiveSearchForm({
  action,
  method = 'POST',
  isMobile = false,
  brandLogo,
  ...props
}: SearchFromProps) {
  const params = useParams();
  const fetcher = useFetcher<NormalizedPredictiveSearchResults>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focusForm, setFocusForm] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState(true);

  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    const searchAction = action ?? '/api/predictive-search';
    const localizedAction = params.locale
      ? `/${params.locale}${searchAction}`
      : searchAction;
    const newSearchTerm = event.target.value || '';
    fetcher.submit(
      {q: newSearchTerm, limit: '6'},
      {method, action: localizedAction},
    );
  }
  const classes = clsx({
    'border border-input rounded-[62px] bg-lightGray px-4 py-[3px] z-20 relative':
      !focusForm,
    'border border-input rounded-t-[21px]   bg-lightGray px-4 py-[3px] z-20  drop-shadow-3xl relative ':
      focusForm,
  });

  const handleStatusInput = (event: any) => {
    if (event.target?.value === '') {
      setFocusForm(false);
    } else {
      setFocusForm(true);
    }
  };
  if (!isMobile) {
    return (
      <fetcher.Form
        {...props}
        className={classes}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!inputRef?.current || inputRef.current.value === '') {
            return;
          }
          inputRef.current.blur();
        }}
        onFocus={(event) => {
          handleStatusInput(event);
        }}
        onBlur={(event) => {
          handleStatusInput(event);
        }}
        onChange={(event) => {
          handleStatusInput(event);
        }}
      >
        <div className="flex items-center">
          <SearchIcon />
          <Input
            name="q"
            placeholder="Що ти шукаєш?"
            ref={inputRef}
            onChange={fetchResults}
            onFocus={fetchResults}
            type="search"
            className="border-none"
          />
        </div>
        <PredictiveSearchResults />
      </fetcher.Form>
    );
  } else {
    return (
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerTrigger asChild>
          <Button variant="link" className="p-0">
            <svg
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5 15L11.1945 11.6886M13.0263 7.26316C13.0263 8.92425 12.3664 10.5173 11.1919 11.6919C10.0173 12.8664 8.42425 13.5263 6.76316 13.5263C5.10207 13.5263 3.50901 12.8664 2.33444 11.6919C1.15987 10.5173 0.5 8.92425 0.5 7.26316C0.5 5.60207 1.15987 4.00901 2.33444 2.83444C3.50901 1.65987 5.10207 1 6.76316 1C8.42425 1 10.0173 1.65987 11.1919 2.83444C12.3664 4.00901 13.0263 5.60207 13.0263 7.26316V7.26316Z"
                stroke="black"
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-5 h-full">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <Image src={brandLogo?.url} className="max-w-[130px]" />
              <DrawerClose asChild>
                <Button className="rounded-full bg-[#535353] p-0 w-[28px] h-[28px]">
                  <X size={18} />
                </Button>
              </DrawerClose>
            </div>
            <div className="search-block mt-6 mb-7">
              <fetcher.Form
                {...props}
                className="border border-input rounded-[62px] bg-lightGray px-4 py-[3px] z-20 relative"
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (!inputRef?.current || inputRef.current.value === '') {
                    return;
                  }
                  inputRef.current.blur();
                }}
                onFocus={(event) => {
                  handleStatusInput(event);
                }}
                onBlur={(event) => {
                  handleStatusInput(event);
                }}
                onChange={(event) => {
                  handleStatusInput(event);
                }}
              >
                <div className="flex items-center">
                  <Input
                    name="q"
                    placeholder="Пошук..."
                    ref={inputRef}
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    type="search"
                    className="border-none placeholder:text-lg text-lg h-[52px]"
                  />
                  <SearchIcon />
                </div>
              </fetcher.Form>
            </div>
          </DrawerHeader>

          <PredictiveSearchResults isMobile={isMobile} />
        </DrawerContent>
      </Drawer>
    );
  }
}

export function PredictiveSearchResults({
  isMobile = false,
}: {
  isMobile: boolean;
}) {
  const {results, totalResults, searchInputRef, searchTerm} =
    usePredictiveSearch();

  function goToSearchResult(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!searchInputRef.current) return;
    searchInputRef.current.blur();
    searchInputRef.current.value = '';
    // close the aside
    window.location.href = event.currentTarget.href;
  }

  if (!totalResults) {
    return <NoPredictiveSearchResults searchTerm={searchTerm} />;
  }
  const variants = {
    open: {top: '100%', opacity: 1},
    closed: {top: '0%', opacity: 0},
  };
  if (!isMobile) {
    return (
      <motion.div
        initial={false}
        variants={variants}
        animate={totalResults ? 'open' : 'closed'}
        transition={{duration: 1}}
        className="absolute left-0 z-20 bg-lightGray w-full rounded-b-[21px]"
      >
        <div>
          {results.map(({type, items}) => (
            <PredictiveSearchResult
              goToSearchResult={goToSearchResult}
              items={items}
              key={type}
              searchTerm={searchTerm}
              type={type}
            />
          ))}
        </div>
        {/* view all results /search?q=term */}
        {searchTerm.current && (
          <Link
            className="flex px-4 py-3 items-center justify-center"
            onClick={goToSearchResult}
            to={`/search?q=${searchTerm.current}`}
          >
            <p>
              До всіх результатів <q>{searchTerm.current}</q>
              &nbsp; →
            </p>
          </Link>
        )}
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={false}
      variants={variants}
      animate={totalResults ? 'open' : 'closed'}
      transition={{duration: 1}}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div>
        {results.map(({type, items}) => (
          <PredictiveSearchResult
            goToSearchResult={goToSearchResult}
            items={items}
            key={type}
            searchTerm={searchTerm}
            type={type}
          />
        ))}
      </div>
      {/* view all results /search?q=term */}
      {searchTerm.current && (
        <Link
          className="flex px-4 py-3 items-center justify-center"
          onClick={goToSearchResult}
          to={`/search?q=${searchTerm.current}`}
        >
          <p>
            До всіх результатів <q>{searchTerm.current}</q>
            &nbsp; →
          </p>
        </Link>
      )}
    </motion.div>
  );
}

function NoPredictiveSearchResults({
  searchTerm,
}: {
  searchTerm: React.MutableRefObject<string>;
}) {
  if (!searchTerm.current) {
    return null;
  }
  if (!isMobile) {
    return (
      <p className="absolute bg-lightGray inline-flex w-full px-4 py-3 left-0 rounded-b-[21px] justify-center">
        За запитом &nbsp; <q>{searchTerm.current}</q> &nbsp; нічого не знайдено
      </p>
    );
  }
  return (
    <p className="inline-flex w-full px-4 py-3 left-0 rounded-b-[21px] justify-center">
      За запитом &nbsp; <q>{searchTerm.current}</q> &nbsp; нічого не знайдено
    </p>
  );
}

type SearchResultTypeProps = {
  goToSearchResult: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  items: NormalizedPredictiveSearchResultItem[];
  searchTerm: UseSearchReturn['searchTerm'];
  type: NormalizedPredictiveSearchResults[number]['type'];
};

function PredictiveSearchResult({
  goToSearchResult,
  items,
  searchTerm,
  type,
}: SearchResultTypeProps) {
  const isSuggestions = type === 'queries';
  const categoryUrl = `/search?q=${
    searchTerm.current
  }&type=${pluralToSingularSearchType(type)}`;

  return (
    <div className="predictive-search-result px-4 py-3" key={type}>
      <ul>
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

type SearchResultItemProps = Pick<SearchResultTypeProps, 'goToSearchResult'> & {
  item: NormalizedPredictiveSearchResultItem;
};

function SearchResultItem({goToSearchResult, item}: SearchResultItemProps) {
  return (
    <li key={item.id}>
      <Link onClick={goToSearchResult} to={item.url} className="flex w-full">
        {item.image?.url && (
          <Image
            alt={item.image.altText ?? ''}
            src={item.image.url}
            width={70}
            height={70}
            className="rounded-[15px]"
          />
        )}
        <div className="flex justify-between ml-[14px] w-full items-center">
          {item.styledTitle ? (
            <div
              dangerouslySetInnerHTML={{
                __html: item.styledTitle,
              }}
            />
          ) : (
            <span className="font-semibold tetx-[22px]">{item.title}</span>
          )}
          <div className="font-semibold tetx-[22px]">
            {item?.price && (
              <span>
                <Money
                  as="span"
                  withoutTrailingZeros={true}
                  withoutCurrency={true}
                  data={item.price}
                />
                грн
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

type UseSearchReturn = NormalizedPredictiveSearch & {
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchTerm: React.MutableRefObject<string>;
};

function usePredictiveSearch(): UseSearchReturn {
  const fetchers = useFetchers();
  const searchTerm = useRef<string>('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchFetcher = fetchers.find((fetcher) => fetcher.data?.searchResults);

  if (searchFetcher?.state === 'loading') {
    searchTerm.current = (searchFetcher.formData?.get('q') || '') as string;
  }

  const search = (searchFetcher?.data?.searchResults || {
    results: NO_PREDICTIVE_SEARCH_RESULTS,
    totalResults: 0,
  }) as NormalizedPredictiveSearch;

  // capture the search input element as a ref
  useEffect(() => {
    if (searchInputRef.current) return;
    searchInputRef.current = document.querySelector('input[type="search"]');
  }, []);

  return {...search, searchInputRef, searchTerm};
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
