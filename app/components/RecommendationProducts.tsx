import { ProductCard } from './ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';

export default function RecommendationProducts({
  recommended,
}: {
  recommended:any;
}) {
  return (
    <div className="flex flex-col w-full gap-[30px]  pb-[35px] px-5 md:px-0">
      {recommended && (
        <>
          <div className="flex md:justify-between justify-center">
            <div className="font-semibold mb-[30px] text-black text-[28px]">
              <h3>Вам може сподобатись</h3>
            </div>
          </div>
          <Carousel>
            <CarouselContent>
              {recommended &&
                recommended.map((item:any) => (
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
