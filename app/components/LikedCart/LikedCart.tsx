// @ts-nocheck
import {
    Image,
    Money,
    type VariantOption,
    VariantSelector,
    CartForm,
} from '@shopify/hydrogen';
import { FetcherWithComponents, Link, NavLink, useActionData, useFetcher } from '@remix-run/react';
import type { CartApiQueryFragment, ProductItemFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/utils';
import { useContext, useEffect, useRef, useState } from 'react';
import { ProductLabel } from '../ProductCard';
import { cn } from '~/lib/utils';
import { HeaderBasketContext, HeaderContextInterface } from '~/context/HeaderCarts';
import { useMedia } from 'react-use';

interface IProductVariantPrice {
    amount: string,
    currencyCode: string
}
interface IProductVariantProduct {
    handle: string,
    title: string
}
interface ISelectedOptions {
    name: string,
    value: string
}

interface IProductVariantImage {
    altText: null | any,
    height: number | null,
    id: string,
    url: string,
    width: number | null,
    __typename: string
}

interface IVariant {
    availableForSale: boolean,
    compareAtPrice: number | null,
    currentlyNotInStock: boolean,
    id: string,
    image: IProductVariantImage,
    price: IProductVariantPrice,
    product: IProductVariantProduct,
    quantityAvailable: string,
    selectedOptions: ISelectedOptions[],
    sku: string,
    title: string,
    unitPrice: null | any
}
interface IVariants {
    nodes: IVariant[]
}


// product?.selectedVariant?.image
interface ILikedNewCart {
    variants: IVariants;
    handle: string;
    selectedVariant: IVariant;
    title: string;
    id: string,
}
interface ILikedCart {
    product: ILikedNewCart
}


export function LikedCart({ product }: ILikedCart) {
    const {
        removeLikeCart
    } = useContext(HeaderBasketContext) as HeaderContextInterface
    const imageRef = useRef<HTMLDivElement>(null);

    const firstVariant = product.variants.nodes?.find(variant => variant.availableForSale) || product.variants.nodes[0];
    const variantUrl = useVariantUrl(product.handle, firstVariant.selectedOptions);

    const [disabled, setDisable] = useState(false)

    const isMobile = useMedia('(max-width: 1024px)', false);

    useEffect(()=>{
        console.log(product, "liked cart")
    },[])
    if (isMobile) {
        return (
            <div className='flex flex-col min-h-[100px] relative  justify-center  register rounded-[20px] border border-black/10 p-6 my-[10px] mb-[30px] lg:mb-0'>
                <div className='grid' style={{ minWidth: "100%", gridTemplateColumns: "1fr", position: "relative", justifyContent: 'space-between', alignItems: "center", gap: 10, }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Link
                            style={{
                                maxWidth: 70
                            }}
                            to={variantUrl}
                            className="relative block rounded-[20px] overflow-hidden group-hover/card:h-[calc(var(--image-height)-var(--options-height)+10px)] w-full h-full transition-all duration-100 ease-in-out"
                        >
                            <div
                                className="relative overflow-hidden"
                                style={{
                                    height: 'var(--image-height)',
                                    maxWidth: 70
                                }}
                                ref={imageRef}>
                                <Image
                                    alt={product?.selectedVariant?.image?.altText || product.title}
                                    aspectRatio="1/1"
                                    data={product?.selectedVariant?.image}

                                    className="rounded-[20px] object-cover relative overflow-hidden"
                                    crop="bottom"
                                />
                                <ProductLabel />
                            </div>

                        </Link>
                        <div>
                            <Link to={variantUrl} style={{ maxWidth: 160, display: "block" }}>
                                <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                                    {product.title}
                                </h4>
                            </Link>
                            <h5>Артикул: {product.id.split("/")[product.id.split("/").length - 1]}</h5>
                        </div>
                    </div>
                    <div>
                    {product.selectedVariant.selectedOptions.map((option:ISelectedOptions) => {
                            return <>
                                <h4 >
                                    {option.name}: {option.value}
                                </h4>
                            </>
                        })}
                    </div>
                    <div>
                        <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                            {product.variants.nodes[0]?.price.amount} грн
                        </h4>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "20px", width: "100%" }}>
                        <CartForm
                            route="/cart"
                            inputs={
                                {
                                    lines: [
                                        {
                                            merchandiseId: product.selectedVariant.id,
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
                                        disabled={ fetcher.state !== 'idle'}
                                        className={cn(
                                            'bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[10px] px-[37px] cursor-pointer',
                                            false && 'bg-white text-black border border-black',
                                        )}
                                    >
                                        {fetcher.state == 'idle' ? "Додати в корзину" : "Загрузка"}


                                    </button>
                                </>
                            )}
                        </CartForm>
                        <button onClick={() => removeLikeCart(product)} style={{ top: 0, right: 0, position: "absolute", borderRadius: "50%", background: "#B3B3B3", padding: 5, height: 25, cursor: "pointer" }}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.30301 7.49677L14.333 1.46087C14.4394 1.35397 14.4991 1.20926 14.499 1.05844C14.4989 0.907626 14.439 0.762997 14.3325 0.656232C14.1193 0.444089 13.7437 0.443017 13.5284 0.657303L7.49997 6.6932L1.46944 0.655696C1.25515 0.444089 0.879617 0.44516 0.666403 0.656767C0.613481 0.709478 0.571587 0.772202 0.543166 0.841277C0.514744 0.910352 0.500365 0.984397 0.500867 1.05909C0.500867 1.21123 0.559796 1.35373 0.666403 1.45927L6.6964 7.49623L0.666939 13.5337C0.560538 13.6408 0.500952 13.7857 0.501254 13.9367C0.501555 14.0876 0.561719 14.2323 0.668546 14.3389C0.771939 14.4412 0.918188 14.5002 1.06926 14.5002H1.07247C1.22408 14.4996 1.37033 14.4402 1.47158 14.3368L7.49997 8.30087L13.5305 14.3384C13.6371 14.4444 13.7796 14.5034 13.9307 14.5034C14.0054 14.5036 14.0794 14.489 14.1485 14.4605C14.2175 14.4321 14.2803 14.3902 14.3331 14.3374C14.3859 14.2845 14.4278 14.2218 14.4562 14.1527C14.4847 14.0837 14.4993 14.0097 14.4991 13.935C14.4991 13.7834 14.4402 13.6403 14.333 13.5348L8.30301 7.49677Z" fill="white" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return <div className='lg:flex' style={{ justifyContent: 'space-between', alignItems: "center", gap: 20, maxHeight: 70 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                <Link
                    style={{
                        maxWidth: 70
                    }}
                    to={variantUrl}
                    className="relative block rounded-[20px] overflow-hidden group-hover/card:h-[calc(var(--image-height)-var(--options-height)+10px)] w-full h-full transition-all duration-100 ease-in-out"
                >
                    <div
                        className="relative overflow-hidden"
                        style={{
                            height: 'var(--image-height)',
                            maxWidth: 70
                        }}
                        ref={imageRef}>
                        <Image
                            alt={product?.selectedVariant?.image?.altText || product.title}
                            aspectRatio="1/1"
                            data={product?.selectedVariant?.image}
                            className="rounded-[20px] object-cover relative overflow-hidden"
                            crop="bottom"
                        />
                        <ProductLabel />
                    </div>

                </Link>
                <div>
                    <Link to={variantUrl} style={{ maxWidth: 160, display: "block" }}>
                        <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                            {product.title}
                        </h4>
                    </Link>
                    <h5>Артикул: {product.id.split("/")[product.id.split("/").length - 1]}</h5>
                </div>
                <div>

                    {product.selectedVariant.selectedOptions.map((option:ISelectedOptions) => {
                        return <>
                            <h4 >
                                {option.name}: {option.value}
                            </h4>
                        </>
                    })}
                </div>
            </div>
            <div>
                <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                    {product.variants.nodes[0]?.price.amount} грн
                </h4>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <CartForm
                    route="/cart"

                    inputs={
                        {
                            lines: [
                                {
                                    merchandiseId: product.selectedVariant.id,
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
                                value={JSON.stringify(null)}
                            />
                            <button
                                type="submit"
                                disabled={disabled ?? fetcher.state !== 'idle'}
                                className={cn(
                                    'bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[10px] px-[37px] cursor-pointer',
                                    false && 'bg-white text-black border border-black',
                                )}

                            >
                                {fetcher.state == 'idle' ? "Додати в корзину" : "Загрузка"}

                            </button>
                        </>
                    )}
                </CartForm>

                <button onClick={() => removeLikeCart(product)} style={{ borderRadius: "50%", background: "#B3B3B3", padding: 5, height: 25, cursor: "pointer" }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.30301 7.49677L14.333 1.46087C14.4394 1.35397 14.4991 1.20926 14.499 1.05844C14.4989 0.907626 14.439 0.762997 14.3325 0.656232C14.1193 0.444089 13.7437 0.443017 13.5284 0.657303L7.49997 6.6932L1.46944 0.655696C1.25515 0.444089 0.879617 0.44516 0.666403 0.656767C0.613481 0.709478 0.571587 0.772202 0.543166 0.841277C0.514744 0.910352 0.500365 0.984397 0.500867 1.05909C0.500867 1.21123 0.559796 1.35373 0.666403 1.45927L6.6964 7.49623L0.666939 13.5337C0.560538 13.6408 0.500952 13.7857 0.501254 13.9367C0.501555 14.0876 0.561719 14.2323 0.668546 14.3389C0.771939 14.4412 0.918188 14.5002 1.06926 14.5002H1.07247C1.22408 14.4996 1.37033 14.4402 1.47158 14.3368L7.49997 8.30087L13.5305 14.3384C13.6371 14.4444 13.7796 14.5034 13.9307 14.5034C14.0054 14.5036 14.0794 14.489 14.1485 14.4605C14.2175 14.4321 14.2803 14.3902 14.3331 14.3374C14.3859 14.2845 14.4278 14.2218 14.4562 14.1527C14.4847 14.0837 14.4993 14.0097 14.4991 13.935C14.4991 13.7834 14.4402 13.6403 14.333 13.5348L8.30301 7.49677Z" fill="white" />
                    </svg>
                </button>


            </div>
        </div >
    }
}
