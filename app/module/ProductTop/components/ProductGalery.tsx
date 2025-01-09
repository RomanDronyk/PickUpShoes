import HeartIcon from '~/ui/heartIcon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';
import {MediaFile} from '@shopify/hydrogen-react';
import {cn} from '~/lib/utils';
import {useContext, useEffect, useState} from 'react';
import {
  HeaderBasketContext,
  HeaderContextInterface,
} from '~/context/HeaderCarts';
import {ProductFragment} from 'storefrontapi.generated';
const ProductGalery = ({
  selectedVariantId,
  product,
  objGalery,
  media,
}: {
  selectedVariantId: any;
  product: any;
  objGalery: any;
  media: ProductFragment['media'];
}) => {
  const {
    selectedIndex,
    api,
    setApi,
    setThumbApi,
    isWide,
    handleThumbClick,
    onSelect,
  } = objGalery;
  useEffect(() => {
    onSelect();
    if (!api) return;
    api.on('select', onSelect);
  }, [api, onSelect]);

  const [isLike, setIsLike] = useState(false);
  const {likedCardId, handleLikeToggle} = useContext(
    HeaderBasketContext,
  ) as HeaderContextInterface;

  useEffect(() => {
    const productIndex = likedCardId.findIndex(
      (item: any) => item === product?.selectedVariant?.id,
    );
    if (productIndex === -1) {
      setIsLike(false);
    } else {
      setIsLike(true);
    }
  }, [likedCardId, product]);

  const toggleLike = () => {
    if (isLike) {
      handleLikeToggle(selectedVariantId, 'delete');
    } else {
      handleLikeToggle(selectedVariantId, 'add');
    }
  };

  return (
    <div className="">
      <div className="sticky top-3  xl:relative flex flex-col-reverse gap-y-5 gap-x-[14px]">
        <Carousel
          setApi={setThumbApi}
          opts={{
            containScroll: 'keepSnaps',
            dragFree: true,
            loop: true,
            duration: 20,
          }}
          orientation={isWide ? 'vertical' : 'horizontal'}
          className="xl:absolute xl:z-10 xl:top-[20px] xl:left-[20px] xl:rigth-[100px] xl:w-[100px]  w-full h-full"
        >
          <CarouselContent className="  gap-y-[14px] mt-0 xl:max-w-[100px] max-w-full">
            {media.nodes.map((item, index: number) => (
              <CarouselItem
                key={item.id}
                className={cn(
                  'xl:max-w-[152px] max-w-[100px] opacity-50 w-full rounded-[20px] pt-0 pl-0 ml-4 xl:ml-0',
                  index === selectedIndex && 'border opacity-100 border-black',
                )}
                onClick={() => handleThumbClick(index)}
              >
                <MediaFile
                  mediaOptions={{
                    image: {
                      aspectRatio: '1/1',
                      crop: 'center',
                    },
                  }}
                  data={item}
                  className="w-full rounded-[20px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              containScroll: 'keepSnaps',
              loop: true,
              duration: 20,
            }}
          >
            <CarouselContent>
              {media.nodes.map((item, index: number) => (
                <CarouselItem key={item.id}>
                  <MediaFile
                    mediaOptions={{
                      image: {
                        aspectRatio: '1/1',
                        crop: 'center',
                      },
                    }}
                    data={item}
                    className="rounded-[20px] aspect-1 image-product-aspect "
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <button
            onClick={toggleLike}
            className=" absolute p-2 rounded-full bg-white shadow-lg  top-[1.35rem] right-5 p-2"
            style={{zIndex: 32}}
            aria-label="Add to wishlist"
          >
            <HeartIcon isFavorited={isLike} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductGalery;
