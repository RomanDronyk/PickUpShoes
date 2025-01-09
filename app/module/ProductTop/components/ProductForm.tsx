import {VariantSelector} from '@shopify/hydrogen';
import {FC, useContext} from 'react';
import {useMedia} from 'react-use';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import SizeGrid from './SizeGrid';
import {
  HeaderBasketContext,
  HeaderContextInterface,
} from '~/context/HeaderCarts';
import {Product as ProductType} from '@shopify/hydrogen-react/storefront-api-types';
import ProductOptions from './ProductOptions';
import AddToCartButton from './AddToCartButton';
import RelatedProducts from './RelatedProducts';

interface IProductForm {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
  handle: string;
  relatedProducts: {product: ProductType}[];
}

const ProductForm: FC<IProductForm> = ({
  product,
  selectedVariant,
  variants,
  relatedProducts,
  handle,
}) => {
  const {setCartShow, setCartShowMobile} = useContext(
    HeaderBasketContext,
  ) as HeaderContextInterface;
  const isMobile = useMedia('(max-width: 767px)', false);

  const valueCheckedAllVarians = variants.every(
    (variant) => variant.availableForSale === false,
  )
    ? 'Немає в наявності'
    : null;
  const valueCheckedVarian = selectedVariant?.availableForSale
    ? 'Додати в корзину'
    : 'Оберіть розмір';
  return (
    <div className=" product-form pt-6">
      <div className="grid gap-[20px] flex-wrap-reverse lg:grid-cols-[1fr_0.3fr]">
        <div>
          <RelatedProducts handle={handle} relatedProducts={relatedProducts} />
          <VariantSelector
            handle={product.handle}
            options={product.options}
            variants={variants}
          >
            {({option}) => <ProductOptions key={option.name} option={option} />}
          </VariantSelector>
        </div>
        {product?.productType == 'Кросівки' && (
          <SizeGrid vendor={product.vendor} />
        )}
      </div>
      {selectedVariant?.quantityAvailable === 1 && (
        <span className="my-5 py-5 w-full inline-flex border-b border-b-black/10">
          - Останні в наявності
        </span>
      )}
      <br />
      <div className="grid md:grid-cols-2 grid-cols-1">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant?.availableForSale}
          onClick={() => {
            isMobile ? setCartShowMobile(true) : setCartShow(true);
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]
              : []
          }
        >
          {valueCheckedAllVarians !== null
            ? valueCheckedAllVarians
            : valueCheckedVarian}
        </AddToCartButton>
      </div>
    </div>
  );
};

export default ProductForm;
