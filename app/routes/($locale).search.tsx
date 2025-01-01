import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { getPaginationVariables } from '@shopify/hydrogen';
import { SearchForm } from '~/components/Search';
import { SEARCH_QUERY } from '~/graphql/queries';
import { SearchResults } from '~/components/Search/SearchResults';
import { NoSearchResults } from '~/components/NoSearchResults';

export const meta: MetaFunction = () => {
  return [{ title: `PickUp - Shoes | Search` }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const variables = getPaginationVariables(request, { pageBy: 8 });
  const searchTerm = String(searchParams.get('q') || '');

  if (!searchTerm) {
    return {
      searchResults: { results: null, totalResults: 0 },
      searchTerm,
    };
  }

  const data = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query: searchTerm,
      ...variables,
    },
  });

  if (!data) {
    throw new Error('No search data returned from Shopify API');
  }

  const totalResults = Object.values(data).reduce((total, value) => {
    return total + value?.nodes?.length;
  }, 0);

  const searchResults = {
    results: data,
    totalResults,
  };

  return defer({ searchTerm, searchResults });
}

export default function SearchPage() {
  const { searchTerm, searchResults }: any = useLoaderData<typeof loader>();
  return (
    // <div className="search w-full">
    <div className="pt-10 grid grid-cols-1 gap-x-5 w-full min-w-full lg:px-24 md:px-12 px-[10px]  mb-8">
      <SearchForm searchTerm={searchTerm} />
      {!searchTerm || !searchResults.totalResults ? (
        <NoSearchResults />
      ) : (
        <SearchResults results={searchResults.results} />
      )}
    </div>
    // </div>
  );
}
