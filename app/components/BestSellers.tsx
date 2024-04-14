import {Link} from '@remix-run/react';
import type {BestSellersQuery} from 'storefrontapi.generated';
import {ProductCard} from './ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

export default function BestSellers({items}: {items: BestSellersQuery}) {
  const {
    collection: {
      products: {nodes: bestsellers},
    },
  } = items;
  console.log(items);
  return (
    <div className="flex flex-col w-full gap-[30px] max-w-[1240px] pb-[35px]">
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
            {bestsellers &&
              bestsellers.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="md:basis-1/4 basis-3/4 ml-1 md:px-0 px-3"
                >
                  <ProductCard product={item} />
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="flex items-center justify-center mt-5">
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
