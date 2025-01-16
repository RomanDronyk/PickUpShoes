import {Image, OptimisticCartLine} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useVariantUrl} from '~/utils';
import type {CartLine as CartLineBlock} from '@shopify/hydrogen/storefront-api-types';
import CartLineQuantity from './CartLineQuantity';
import CartLinePrice from './CartLinePrice';
import {CartLineRemoveButton} from './CartLineRemoveButton';
import OptionList from '../common/optionList';
type CartLine = OptimisticCartLine<CartLineBlock>;

const CartLineItem = ({
  line,
  onClick,
}: {
  onClick: () => void;
  line: CartLine;
}) => {
  const {id: lineId, merchandise, isOptimistic} = line;
  const {product, title, image, selectedOptions, sku, quantityAvailable} =
    merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={lineId} className="xl:grid xl:grid-cols-12 flex justify-between">
      <div className="grid grid-cols-[70px_250px_160px] items-center gap-[14px] 2xl:col-span-9 xl:col-span-8 col-span-7">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={70}
            loading="lazy"
            width={70}
            className="rounded-[15px] mr-[14px]"
          />
        )}
        <Link onClick={onClick} prefetch="intent" to={lineItemUrl}>
          <span className="font-semibold lg:text-[22px] text-lg">
            {product.title}
          </span>
          {quantityAvailable === 1 && (
            <span className="my-1 py-1 w-full inline-flex border-b border-b-black/10">
              - Останні в наявності
            </span>
          )}
        </Link>
        <div className="">
          <OptionList sku={sku || ''} options={selectedOptions} />
        </div>
      </div>
      <div className="xl:grid xl:grid-cols-[130px_130px_130px] xl:col-span-3 flex  gap-x-3">
        <CartLineQuantity line={line} />
        <CartLinePrice line={line} as="span" />
        <div className="flex items-center justify-center">
          <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
        </div>
      </div>
    </li>
  );
};

export default CartLineItem;
