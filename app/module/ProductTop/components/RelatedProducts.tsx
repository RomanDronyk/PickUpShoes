import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen-react';
import { Product as ProductType } from '@shopify/hydrogen-react/storefront-api-types';
import { cn } from '~/lib/utils';
import { useVariantUrl } from '~/utils';

const RelatedProducts = ({ relatedProducts, handle }: { handle: string, relatedProducts: { product: ProductType }[] }) => {
  if (relatedProducts.length == 0) return null;
  return (
    <div className="product-options" >
      <h5 className="text-[16px] text-black/60 mb-4">Кольори</h5>
      <div className="product-options-grid grid grid-cols-[repeat(auto-fit,minmax(30px,80px))] gap-y-[10px] gap-x-[10px] items-start">
        {relatedProducts.map((element, index) => (
          <Link
            key={element.product.handle + index + element?.product?.featuredImage?.altText || ""}
            prefetch="intent"
            preventScrollReset
            replace
            to={useVariantUrl(element.product.handle, [])}
            className={cn(
              'text-black text-[16px] px-[2px] py-[2px] rounded-[22px] relative flex max-w-[76px] justify-center self-start bg-[#F0F0F0]',
              handle === element.product.handle && 'text-white bg-black',
            )}
          >
            <Image
              alt={element?.product?.featuredImage?.altText || ""}
              aspectRatio="1/1"
              data={element?.product?.featuredImage || undefined}
              height={100}
              loading="lazy"
              width={100}
              className="w-full rounded-[20px]"
            />
            {!element.product.availableForSale &&
              <span className="transition-opacity duration-[0.3s] ease-[ease-in-out] will-change-[opacity] w-[96%] h-[7px] absolute -translate-y-2/4 -rotate-45 mx-auto top-2/4 inset-x-0;"> <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ top: 0, position: "absolute" }}><rect x="0" y="2" width="100%" transform="" fill="black" stroke="#ECEFF1" strokeWidth="2" height="3"></rect></svg></span>
            }
          </Link>
        ))}
      </div>
    </div>
  )
}
export default RelatedProducts;