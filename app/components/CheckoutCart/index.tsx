import { CartForm, Image } from "@shopify/hydrogen"
import CartLineQuantity from "../DropdownCart/CartLineQuantity"
import { useState } from "react"
import { useVariantUrl } from "~/utils"
import { Link } from "@remix-run/react"

const CheckoutCart = ({ cartsFromCart }: any) => {

    const [loading, setLoading] = useState(false)
    const updateQuantity = (value: any) => {
        setLoading(true)
    }
    console.log(cartsFromCart)
  const variantUrl = useVariantUrl(cartsFromCart.merchandise.product.handle, cartsFromCart.merchandise.selectedOptions);

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
                                alt={cartsFromCart?.merchandise?.image?.altText || cartsFromCart?.merchandise?.product?.title}
                                aspectRatio="1/1"
                                data={cartsFromCart?.merchandise?.image}
                                className="rounded-[20px] object-cover relative overflow-hidden"
                                crop="bottom"
                            />
                        </div>

                    </div>
                    <div className="flex flex-col justify-between min-h-[100%]">
                        <div style={{  display: "block" }}>
                            <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                                <Link to={variantUrl}>
                                {cartsFromCart?.merchandise?.product?.title}
                                </Link>
                            </h4>
                        </div>
                        <div>
                            {cartsFromCart?.merchandise?.selectedOptions.map((option: any) => {
                                return <>
                                    <h4 key={option.name}>
                                        {option.name}: <span className="text-black/50">{option.value}</span>
                                    </h4>
                                </>
                            })}
                        </div>
                        <div>
                            <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                                {cartsFromCart?.merchandise?.price?.amount} грн
                            </h4>
                        </div>
                    </div>
                    <CartLineQuantity setNewQuantity={updateQuantity} isAbsolute={true} line={cartsFromCart} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", width: "100%" }}>
                    <CartLineRemoveButton lineIds={cartsFromCart.id} />
                </div>
            </div>
        </div>
    )
}



function CartLineRemoveButton({ lineIds }: { lineIds: string[] }) {
    return (
        <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesRemove}
            inputs={{ lineIds }}
        >
            <button type="submit"
                style={{ top: 0, right: 0, position: "absolute", borderRadius: "50%", background: "#B3B3B3", padding: 5, height: 25, cursor: "pointer" }}
            >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.30301 7.49677L14.333 1.46087C14.4394 1.35397 14.4991 1.20926 14.499 1.05844C14.4989 0.907626 14.439 0.762997 14.3325 0.656232C14.1193 0.444089 13.7437 0.443017 13.5284 0.657303L7.49997 6.6932L1.46944 0.655696C1.25515 0.444089 0.879617 0.44516 0.666403 0.656767C0.613481 0.709478 0.571587 0.772202 0.543166 0.841277C0.514744 0.910352 0.500365 0.984397 0.500867 1.05909C0.500867 1.21123 0.559796 1.35373 0.666403 1.45927L6.6964 7.49623L0.666939 13.5337C0.560538 13.6408 0.500952 13.7857 0.501254 13.9367C0.501555 14.0876 0.561719 14.2323 0.668546 14.3389C0.771939 14.4412 0.918188 14.5002 1.06926 14.5002H1.07247C1.22408 14.4996 1.37033 14.4402 1.47158 14.3368L7.49997 8.30087L13.5305 14.3384C13.6371 14.4444 13.7796 14.5034 13.9307 14.5034C14.0054 14.5036 14.0794 14.489 14.1485 14.4605C14.2175 14.4321 14.2803 14.3902 14.3331 14.3374C14.3859 14.2845 14.4278 14.2218 14.4562 14.1527C14.4847 14.0837 14.4993 14.0097 14.4991 13.935C14.4991 13.7834 14.4402 13.6403 14.333 13.5348L8.30301 7.49677Z" fill="white" />
                </svg>
            </button>

        </CartForm>
    );
}
export default CheckoutCart