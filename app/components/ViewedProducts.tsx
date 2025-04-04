import {ProductCard} from './ProductCard';
import {Carousel, CarouselContent, CarouselItem} from './ui/carousel';
import type {ViewedProductsQuery} from 'storefrontapi.generated';

export default function ViewedProducts({
  products,
}: {
  products: ViewedProductsQuery['nodes'];
}) {
  return (
    <div className="flex flex-col w-full gap-[30px]  pb-[35px] px-5 md:px-0">
      {products && (
        <>
          <div className="flex md:justify-between justify-center">
            <div className="font-semibold mb-[30px] text-black text-[28px]">
              <h3>Ви переглядали</h3>
            </div>
          </div>
          <Carousel>
            <CarouselContent>
              {products &&
                products.map((item: ViewedProductsQuery['nodes'][0]) => (
                  <CarouselItem
                    key={item?.id}
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
