import {
  Await,
  Link,
} from '@remix-run/react';
import { FC, Suspense } from 'react';
import type {
  ProductFragment,
  ProductVariantsQuery,
} from 'storefrontapi.generated';
import { Product as ProductType } from '@shopify/hydrogen-react/storefront-api-types';
import ProductPrice from './ProductPrice';
import ProductForm from './ProductForm';

interface IProductMain {
  product: ProductFragment;
  handle: string,
  selectedVariant: any;
  variants: ProductVariantsQuery;
  relatedProducts: { product: ProductType }[]
}
const ProductMain: FC<IProductMain> = ({
  selectedVariant,
  product,
  variants,
  handle,
  relatedProducts,
}) => {
  const { title, vendor, collections } = product || { title: "", vendor: "", collections: [] };
  return (
    <div className="product-main">
      <div className="flex flex-col border-b pb-6 border-b-black/10">
        <h1 className="font-bold lg:text-[40px] md:text-3xl text-2xl">
          {title}
        </h1>
        <div className="flex items-center gap-x-[16px] mb-[30px]">
          <span className="font-semibold text-[20px] text-black/50">
            {product.selectedVariant?.sku ? product.selectedVariant?.sku : "Sku - не вказаний"}
          </span>
          <Link
            to={`/collections/${collections?.nodes[0]?.handle}?filter.productVendor="${vendor}"`}
            className="text-white text-[16px] flex items-center jusity-center px-[14px] py-[5px] bg-black rounded-3xl self-start">
            {product.vendor}
          </Link>
        </div>
        <ProductPrice selectedVariant={selectedVariant} />
      </div>
      <Suspense
        fallback={
          <ProductForm
            relatedProducts={relatedProducts}
            handle={handle}
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="Виникла помилка при завантажені варіантів товару"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              handle={handle}
              relatedProducts={relatedProducts}
              product={product}
              selectedVariant={selectedVariant}
              variants={data?.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}
export default ProductMain 