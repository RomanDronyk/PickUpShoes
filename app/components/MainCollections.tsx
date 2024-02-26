import type {MainCollectionsQuery} from 'storefrontapi.generated';
import {Link} from '@remix-run/react';

export function MainCollections({
  collection,
}: {
  collection: MainCollectionsQuery;
}) {
  const {men, women, clothes} = collection;
  return (
    <div className="grid grid-cols-[minmax(150px,_610px)_minmax(150px,_540px)] gap-x-3 sm:gap-x-[32px] gap-y-5 pb-7 sm:px-10 px-[10px]">
      <div className="relative col-span-1 sm:row-span-2 ">
        <img
          alt={men?.image?.altText ? men.image.altText : men?.title}
          src={men?.image?.url}
          className="rounded-[30px] h-full"
        />
        <div className="absolute top-0 lef-0 w-full h-full flex items-center justify-center hover:underline text-white font-medium lg:text-[42px] text-[28px] max-[450px]:text-base">
          <Link to={`/collections/${men?.handle}`}>
            <span>{men?.title}</span>
          </Link>
        </div>
      </div>
      <div className="relative rounded-[30px] col-span-1 row-span-1">
        <img
          src={women?.image?.url}
          alt={women?.image?.altText ? women.image.altText : women?.title}
          className=" h-full flex rounded-[30px]"
        />
        <div className="absolute top-0 lef-0 w-full h-full flex items-center justify-center hover:underline text-white font-medium lg:text-[42px] text-[28px] max-[450px]:text-base">
          <Link to={`/collections/${women?.handle}`}>
            <span>{women?.title}</span>
          </Link>
        </div>
      </div>
      <div className="relative rounded-[30px] max-sm:col-span-2 row-span-1 ">
        <img
          src={clothes?.image?.url}
          alt={clothes?.image?.altText ? clothes.image.altText : clothes?.title}
          className=" h-full flex rounded-[30px]"
        />
        <div className="absolute top-0 lef-0 w-full h-full flex items-center justify-center hover:underline text-white font-medium lg:text-[42px] text-[28px] max-[450px]:text-base">
          <Link to={`/collections/${clothes?.handle}`}>
            <span>{clothes?.title}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
