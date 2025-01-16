import {FC, useCallback, useState} from 'react';
import ProductGalery from './components/ProductGalery';
import ProductMain from './components/ProductMain';
import {type CarouselApi} from '~/components/ui/carousel';
import {useMedia} from 'react-use';

interface IProductPageTopView {
  handle: string;
  variants: any;
  relatedProducts: any;
  product: any;
}

const ProductTop: FC<IProductPageTopView> = ({
  handle,
  variants,
  relatedProducts,
  product,
}) => {
  const {selectedVariant, descriptionHtml} = product;

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(0);
  const [api, setApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();

  const isWide = useMedia('(min-width:1280px)', false);

  const handleThumbClick = useCallback(
    (index: number) => {
      if (!api) return;
      api?.scrollTo(index);
    },
    [api],
  );

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    thumbApi?.scrollTo(api.selectedScrollSnap());
  }, [api, thumbApi, setSelectedIndex]);

  const objGalery = {
    selectedIndex,
    setSelectedIndex,
    api,
    setApi,
    thumbApi,
    setThumbApi,
    isWide,
    handleThumbClick,
    onSelect,
  };

  return (
    <>
      <div className="sm:grid sm:grid-cols-2 flex flex-col gap-y-5 gap-x-10">
        <ProductGalery
          selectedVariantId={selectedVariant.id}
          product={product}
          objGalery={objGalery}
          media={product?.media}
        />
        <ProductMain
          handle={handle}
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
          relatedProducts={relatedProducts}
        />
      </div>
    </>
  );
};
export default ProductTop;
