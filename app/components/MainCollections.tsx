import type {MainCollectionsQuery} from 'storefrontapi.generated';
import {Link} from '@remix-run/react';

export function MainCollections({
  collection,
}: {
  collection: MainCollectionsQuery;
}) {
  const {men, women, clothes} = collection;
  return (
    <div className="grid grid-cols-[minmax(150px,_610px)_minmax(150px,_540px)] gap-x-3 sm:gap-x-[32px] gap-y-[10px] pb-7 sm:px-10 px-[10px]">
      <div className="relative col-span-1 sm:row-span-2 xl:h-[666px] lg:h-[450px] md:h-[350px]  sm:h-[300px] h-[160px]  rounded-[30px] bg-center bg-cover bg-menCollection">
        <div className="absolute top-0 lef-0 w-full h-full flex items-center justify-center hover:underline text-white font-medium lg:text-[42px] text-[28px] max-[450px]:text-base">
          <Link
            to={`/collections/${men?.handle}`}
            className="flex w-full h-full items-center justify-center"
          >
            <span>{men?.title}</span>
          </Link>
        </div>
      </div>
      <div className="bg-womenCollection bg-center bg-cover relative rounded-[30px] col-span-1 row-span-1 max-h-[170px] sm:max-h-full ">
        <div className="absolute top-0 lef-0 w-full h-full flex items-center justify-center hover:underline text-white font-medium lg:text-[42px] text-[28px] max-[450px]:text-base">
          <Link
            to={`/collections/${women?.handle}`}
            className="flex w-full h-full items-center justify-center"
          >
            <span>{women?.title}</span>
          </Link>
        </div>
      </div>
      <div className="relative rounded-[30px] max-sm:col-span-2 row-span-1  h-[180px] max-[450px]:h-[110px] sm:h-auto sm:max-h-full bg-wearCollection bg-center bg-cover">
        <div className="absolute top-0 lef-0 w-full h-full flex items-center justify-center hover:underline text-white font-medium lg:text-[42px] text-[28px] max-[450px]:text-base">
          <Link
            to={`/collections/${clothes?.handle}`}
            className="flex w-full h-full items-center justify-center"
          >
            <span>{clothes?.title}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
