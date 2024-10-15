import { FetcherWithComponents, Link } from "@remix-run/react";
import { CartForm, Image } from "@shopify/hydrogen";
import { FC, useState } from "react";
import { cn } from "~/lib/utils";
import { useVariantUrl } from "~/utils";

interface IImage {
  altText: string,
  height: number,
  id: string,
  url: string,
  width: number,
}
interface IPrice {
  amount: string,
  currencyCode: string,
}
interface IOption {
  name: string,
  value: string,
}
interface IVariant {
  availableForSale: boolean,
  compareAtPrice: number | null,
  currentlyNotInStock: boolean,
  id: string,
  image: IImage,
  price: IPrice,
  product: {
    handle: string,
    title: string,
  },
  quantityAvailable: string,
  selectedOptions: IOption[],
  sku: string,
  title: string,
  unitPrice: null | any
}
interface IProduct {
  id: string,
  featuredImage: IImage,
  handle: string,
  options: { name: string, values: string[] },
  priceRange: {
    minVariantPrice: IPrice,
  },
  title: string,
  variants: IVariant[]
}
interface IRecommendedCart {
  product: IProduct,
}
interface Options {
  [key: string]: string;
}

const TranslateOptions: Options = {
  Color: "Колір",
  Колір: "Колір",
  Розмір: "Розмір",
  Size: "Розмір"
}


const RecommendedCart: FC<IRecommendedCart> = ({ product }) => {
  const [selectedVariant, setSelectedVarian] = useState<IVariant>(product.variants[0])
  const variantUrl = useVariantUrl(product.handle, selectedVariant.selectedOptions);

  return (
    <div className='flex flex-col min-h-[100px] relative  justify-center  register   py-[24px] mb-[30px] lg:mb-0'>
      <div className='grid' style={{ minWidth: "100%", gridTemplateColumns: "1fr", position: "relative", justifyContent: 'space-between', alignItems: "center", gap: 10, }}>
        <div className="flex gap-[16px] items-center min-h-[100%]">
          <div
            style={{
              maxWidth: 124
            }}
            className="relative block rounded-[20px] overflow-hidden group-hover/card:h-[calc(var(--image-height)-var(--options-height)+10px)] w-full h-full transition-all duration-100 ease-in-out"
          >
            <div
              className="relative overflow-hidden"
              style={{
                height: 'var(--image-height)',
                maxWidth: 124
              }}
            >
              <Image
                alt={product?.featuredImage?.altText || product?.title}
                aspectRatio="1/1"
                data={product?.featuredImage}
                className="rounded-[20px] object-cover relative overflow-hidden"
                crop="bottom"
              />
            </div>

          </div>
          <div className="flex flex-col justify-between min-h-[100%]">
            <div style={{ display: "block" }}>
              <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                <Link to={variantUrl}>

                  {product?.title}
                </Link>
              </h4>
            </div>
            <div>
              {selectedVariant.selectedOptions.map((option) => {
                return <h4 key={option.name}>
                  {TranslateOptions[option.name]}: <span className="text-black/50">{option.value}</span>
                </h4>
              })}
              <h4>
                Артикул: <span className="text-black/50">{selectedVariant.sku}</span>
              </h4>
            </div>
            <div>
              <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                {selectedVariant.price?.amount} грн
              </h4>
            </div>
          </div>
          <div


            className="self-end flex self-center absolute bottom-0 right-0 items-center justify-center"
          >
            <CartForm
              route="/cart"
              inputs={
                {
                  lines: [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1
                    }
                  ]
                }
              }
              action={CartForm.ACTIONS.LinesAdd}
            >
              {(fetcher: FetcherWithComponents<any>) => (
                <>
                  <input
                    name="analytics"
                    type="hidden"
                    value={JSON.stringify([])}
                  />
                  <button
                    type="submit"
                    disabled={fetcher.state !== 'idle'}
                    className={cn(
                      'bg-black  text-white font-medium text-[14px] w-full rounded-[62px] py-[12px] px-[37px] cursor-pointer',
                      false && 'bg-white text-black border border-black',
                    )}
                  >
                    {fetcher.state == 'idle' ? "Додати" : "Загрузка"}


                  </button>
                </>
              )}
            </CartForm>
          </div>

        </div>
      </div>
    </div>
  )
}


export const RecommendedCartMobile: FC<IRecommendedCart> = ({ product }) => {
  const [selectedVariant, setSelectedVarian] = useState<IVariant>(product.variants[0])
  const variantUrl = useVariantUrl(product.handle, selectedVariant.selectedOptions);

  return (
    <div className='flex flex-col  relative  justify-center  register max-h-[250px] overflow-hidden   pt-[24px] mb-[30px] lg:mb-0'>
      <div className='grid' style={{ minWidth: "100%", gridTemplateColumns: "1fr", position: "relative", justifyContent: 'space-between', alignItems: "center", gap: 0, }}>
        <div className="flex gap-[16px]   pb-[7px]">
          <div
            style={{
              maxWidth: 70
            }}
            className="relative block rounded-[20px] overflow-hidden group-hover/card:h-[calc(var(--image-height)-var(--options-height)+10px)] w-full h-full transition-all duration-100 ease-in-out"
          >
            <div
              className="relative overflow-hidden"
              style={{
                height: 'var(--image-height)',
                maxWidth: 70
              }}
            >
              <Image
                alt={product?.featuredImage?.altText || product?.title}
                aspectRatio="1/1"
                data={product?.featuredImage}
                className="rounded-[20px] object-cover relative overflow-hidden"
                crop="bottom"
              />
            </div>

          </div>
          <div className="flex flex-col justify-between min-h-[100%]">
            <div style={{ maxWidth: "100%", display: "block" }}>
              <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                <Link to={variantUrl}>
                  {product?.title}
                </Link>
              </h4>
            </div>

          </div>
        </div>
        <div >
          <div className="pb-[12px]">
            {selectedVariant.selectedOptions.map((option) => {
              return<h4 key={option.name}>
                  {TranslateOptions[option.name]}: <span className="text-black/50">{option.value}</span>
                </h4>
            })}
            <h4>
              Артикул: <span className="text-black/50">{selectedVariant.sku}</span>
            </h4>
          </div>
          <div>
            <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
              {selectedVariant.price?.amount} грн
            </h4>
          </div>
        </div>
        <div
          className="self-end flex self-center absolute bottom-0 right-0 items-center justify-center"
        >
          <CartForm
            route="/cart"
            inputs={
              {
                lines: [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1
                  }
                ]
              }
            }
            action={CartForm.ACTIONS.LinesAdd}
          >
            {(fetcher: FetcherWithComponents<any>) => (
              <>
                <input
                  name="analytics"
                  type="hidden"
                  value={JSON.stringify([])}
                />
                <button
                  type="submit"
                  disabled={fetcher.state !== 'idle'}
                  className={cn(
                    'bg-black  text-white font-medium text-[14px] w-full rounded-[62px] py-[12px] px-[37px] cursor-pointer',
                    false && 'bg-white text-black border border-black',
                  )}
                >
                  {fetcher.state == 'idle' ? "Додати" : "Загрузка"}


                </button>
              </>
            )}
          </CartForm>
        </div>
      </div>
    </div>
  )
}









export default RecommendedCart;