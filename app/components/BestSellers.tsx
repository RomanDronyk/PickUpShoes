import { Link } from '@remix-run/react';
import { ProductCard, Label } from './ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';

export default function BestSellers({ items }:any) {
  return (
    <div className="flex flex-col w-full gap-[30px] max-w-[1240px] pb-[0px] px-5 md:px-0 ">
      <div className="flex md:justify-between justify-center">
        <div className="font-semibold text-black text-[36px]">
          <h3>Хіти продажів</h3>
        </div>
        <Link
          to="/collections/bestsellers"
          prefetch="viewport"
          className="md:block hidden bg-black text-white font-medium text-base py-4 px-12 rounded-[30px] hover:opacity-75"
        >
          Переглянути більше
        </Link>
      </div>
      <div>
        <Carousel>
          <CarouselContent>
            {items &&
              items.map((item: Product) => (
                <CarouselItem
                  key={item.id}
                  className="md:basis-1/4 basis-3/4 ml-1 px-3"
                >
                  <ProductCard product={item} label={Label.bestseller} />
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="flex items-center justify-center ">
        <Link
          to="/collections/bestsellers"
          prefetch="viewport"
          className="block text-center w-fit md:hidden bg-black text-white font-medium text-base py-4 px-12 rounded-[30px] hover:opacity-75"
        >
          Переглянути більше
        </Link>
      </div>
    </div>
  );
}
