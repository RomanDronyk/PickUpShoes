import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen-react';
import {useMedia} from 'react-use';
import {
  NormalizedPredictiveSearch,
  NormalizedPredictiveSearchResultItem,
  NormalizedPredictiveSearchResults,
} from '~/components/Search';
import {useVariantUrl} from '~/utils';

type UseSearchReturn = NormalizedPredictiveSearch & {
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchTerm: React.MutableRefObject<string>;
};

type SearchResultTypeProps = {
  goToSearchResult: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  items: NormalizedPredictiveSearchResultItem[];
  searchTerm: UseSearchReturn['searchTerm'];
  type: NormalizedPredictiveSearchResults[number]['type'];
};

type SearchResultItemProps = Pick<SearchResultTypeProps, 'goToSearchResult'> & {
  item: NormalizedPredictiveSearchResultItem;
};

export function SearchResultItem({
  goToSearchResult,
  item,
}: SearchResultItemProps) {
  const isMobile = useMedia('(max-width: 767px)', false);
  return (
    <li
      key={item.id}
      className="border-b border-b-black/30 pb-5 md:pb-[10px] last-of-type:border-none"
    >
      <Link onClick={goToSearchResult} to={item.url} className="flex w-full">
        {item.image?.url && (
          <Image
            alt={item.image.altText ?? ''}
            src={item.image.url}
            width={isMobile ? 80 : 70}
            height={isMobile ? 80 : 70}
            className="rounded-[15px]"
          />
        )}
        <div className=" flex md:flex-row flex-col md:justify-between gap-y-2 ml-[14px] w-full md:items-center items-start">
          {item.styledTitle ? (
            <div
              dangerouslySetInnerHTML={{
                __html: item.styledTitle,
              }}
            />
          ) : (
            <span className="font-semibold md:text-[22px] md:line-clamp-1 text-xl">
              {item.title}
            </span>
          )}
          <div className="font-semibold md:text-[22px] text-base">
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
