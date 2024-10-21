import { Link, useFetchers } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useMedia } from "react-use";
import { PredictiveSearchResult } from "../PredictiveSearchResult";
import { motion } from 'framer-motion';
import { NoPredictiveSearchResults } from "../NoPredictiveSearchResults";
import { NO_PREDICTIVE_SEARCH_RESULTS, NormalizedPredictiveSearch } from "~/components/Search";

export function PredictiveSearchResults() {
  const { results, totalResults, searchInputRef, searchTerm } = usePredictiveSearch();

  const isMobile = useMedia('(max-width: 767px)', false);

  function goToSearchResult(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!searchInputRef.current) return;
    searchInputRef.current.blur();
    searchInputRef.current.value = '';
    window.location.href = event.currentTarget.href;
  }

  if (!totalResults) {
    return <NoPredictiveSearchResults searchTerm={searchTerm} />;
  }
  const variants = {
    open: { top: '100%', opacity: 1 },
    closed: { top: '0%', opacity: 0 },
  };
  if (!isMobile) {
    return (
      <motion.div
        initial={false}
        variants={variants}
        animate={totalResults ? 'open' : 'closed'}
        transition={{ duration: 1 }}
        className="absolute left-0 z-20 bg-lightGray w-full rounded-b-[21px]"
      >
        <div>
          {results.map(({ type, items }) => (
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
        {/* {searchTerm.current && ( */}
        {/*   <Link */}
        {/*     className="flex px-4 py-3 items-center justify-center" */}
        {/*     onClick={goToSearchResult} */}
        {/*     to={`/search?q=${searchTerm.current}`} */}
        {/*   > */}
        {/*     <p> */}
        {/*       До всіх результатів <q>{searchTerm.current}</q> */}
        {/*       &nbsp; → */}
        {/*     </p> */}
        {/*   </Link> */}
        {/* )} */}
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={false}
      variants={variants}
      animate={totalResults ? 'open' : 'closed'}
      transition={{ duration: 1 }}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div>
        {results.map(({ type, items }) => (
          <PredictiveSearchResult
            goToSearchResult={goToSearchResult}
            items={items}
            key={type}
            searchTerm={searchTerm}
            type={type}
          />
        ))}
      </div>
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

  useEffect(() => {
    if (searchInputRef.current) return;
    searchInputRef.current = document.querySelector('input[type="search"]');
  }, []);

  return { ...search, searchInputRef, searchTerm };
}
type UseSearchReturn = NormalizedPredictiveSearch & {
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchTerm: React.MutableRefObject<string>;
};