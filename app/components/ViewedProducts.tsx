import {Link} from '@remix-run/react';
import {ProductCard} from './ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import type {ViewedProductsQuery} from 'storefrontapi.generated';

export default function ViewedProducts({
  products,
}: {
  products: ViewedProductsQuery;
}) {

  const {nodes: viewed} = products;

  return (
    <div className="flex flex-col w-full gap-[30px]  pb-[35px] px-5 md:px-0">
      {viewed && (
        <>
          <div className="flex md:justify-between justify-center">
            <div className="font-semibold mb-[30px] text-black text-[28px]">
              <h3>Ви переглядали</h3>
            </div>
          </div>
          <Carousel>
            <CarouselContent>
              {viewed &&
                viewed.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="md:basis-1/4 basis-3/4 ml-1 px-3"
                  >
                    <ProductCard product={item} />
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </>
      )}
    </div>
  );
}
