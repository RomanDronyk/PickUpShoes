import { useLoaderData, json, MetaFunction, Form, Link, FetcherWithComponents } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { ProductLabel } from '~/components/ProductCard';

import {
    Image,
    Money,
    type VariantOption,
    VariantSelector,
    CartForm,
} from '@shopify/hydrogen';
import { ISelectedOptions } from '~/components/LikedCart/LikedCart';

// GraphQL запит для отримання даних чекауту
const GET_CHECKOUT_QUERY = `#graphql
  query GetCheckout($checkoutId: ID!) {
    node(id: $checkoutId) {
      ... on Checkout {
        id
        webUrl
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
              variant {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                image {
                  src
                  altText
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
        shippingAddress {
          address1
          city
          country
          firstName
          lastName
          zip
        }
        email
      }
    }
  }
`;



// // Loader function to get checkout data
export const loader = async ({ context, request }: { context: any, request: Request }) => {
    const { storefront } = context;

    const url = new URL(request.url);
    const checkoutId = url.searchParams.get('checkoutId');

    if (!checkoutId) {
        throw new Error('Missing checkout ID');
    }

    const data:any = await storefront.query(GET_CHECKOUT_QUERY, {
        variables: { checkoutId: `gid://shopify/Checkout/${checkoutId}` },
    });
    console.log(data)

    return json(data);
};

// Meta function for the page
export const meta: MetaFunction = () => {
    return [{ title: `Hydrogen | Checkout` }];
};

// Checkout component
export default function Checkout() {
    const data:any = useLoaderData();
    //   const error = false;
    console.log(data, "data")

    const removeLikeCart = (data: any) => {

    }
    return (

        <div className="contaier gap-[40px] grid grid-cols-2 grid lg:grid-cols-[1fr_1fr] grid-cols-2 gap-y-10 gap-x-10 sm:px-24 px-[10px] my-10 w-full mt-[1rem]">

            <div className=''>
                <Form method="POST">

                    <div className="register rounded-[20px] border border-black/10 p-[20px_24px] ">
                        <h2 className="xl:text-[32px] text-[24px] md:text-left text-center  font-medium mb-[20px]">
                            Дані для доставки
                        </h2>
                        <fieldset className="flex flex-col gap-[15px]">
                            <div className='pb-[15px] border-b border-black/20'>

                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="firstName"
                                    autoComplete="firstName"
                                    placeholder="Ім’я отримувача"
                                    aria-label="First Name"
                                    // eslint-disable-next-line jsx-a11y/no-autofocus
                                    autoFocus
                                    // value={data?.node?.shippingAddress?.firstName}
                                    required
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                            </div>

                            <div className='pb-[15px] border-b border-black/20'>

                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="lastName"
                                    autoComplete="lastName"
                                    placeholder="Прізвище"
                                    aria-label="Last Name"
                                    // eslint-disable-next-line jsx-a11y/no-autofocus
                                    autoFocus
                                    // value={data?.node?.shippingAddress?.lastName}
                                    required
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                            </div>

                            <div className='pb-[15px] border-b border-black/20'>

                                <Input
                                    id="phone"
                                    name="phone"
                                    type="phone"
                                    autoComplete="phone"
                                    placeholder="+ 38 (098) 999 99-99"
                                    aria-label="Password"
                                    minLength={8}
                                    required
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                            </div>

                            <div className='pb-[15px] border-b border-black/20'>

                                <Input
                                    id="contactType"
                                    name="contactType"
                                    type="contactType"
                                    autoComplete="contactType"
                                    placeholder="Спосіб зв’язку"
                                    aria-label="Re-enter password"
                                    minLength={8}
                                    required
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                            </div>

                            <div className='pb-[15px] border-b border-black/20'>

                                <Input
                                    id="city"
                                    name="city"
                                    type="city"
                                    autoComplete="city"
                                    placeholder="Місто"
                                    aria-label="Re-enter password"
                                    minLength={8}
                                    required
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                            </div>

                            <div className='pb-[15px] border-b border-black/20'>

                                <Input
                                    id="postalOfice"
                                    name="postalOfice"
                                    type="postalOfice"
                                    autoComplete="postalOfice"
                                    placeholder="Відділення"
                                    aria-label="Re-enter password"
                                    minLength={8}
                                    required
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                            </div>

                            <div className=''>

                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="E-mail"
                                    aria-label="Re-enter E-mail"
                                    minLength={8}
                                    required
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                            </div>

                        </fieldset>


                    </div>
                    <div className="register rounded-[20px] border border-black/10 p-[20px_24px] ">
                        <div>
                            <h2 className="xl:text-[32px] text-[24px] md:text-left text-center  font-medium mb-[20px]">
                                Спосіб доставки
                            </h2>
                        </div>
                    </div>
                </Form>

            </div>
            <div>
                <h1>Ви обрали:</h1>
                <div className="register rounded-[20px] border border-black/10 p-[20px_24px] ">
                    {data?.node?.lineItems?.edges&& data?.node?.lineItems?.edges?.map((product: any, index: number) => {
                        console.log(product?.node?.variant.id + index, "links")
                        return (
                            <div key={product?.node?.variant?.id} className='flex flex-col min-h-[100px] relative  justify-center  register rounded-[20px] border border-black/10 p-6 my-[10px] mb-[30px] lg:mb-0'>
                                <div className='grid' style={{ minWidth: "100%", gridTemplateColumns: "1fr", position: "relative", justifyContent: 'space-between', alignItems: "center", gap: 10, }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                                                    
                                                {/* <Image
                                                    alt={product?.node?.variant?.image.altText || product?.node?.title}
                                                    aspectRatio="1/1"
                                                    data={product?.node?.variant?.image}
    
                                                    className="rounded-[20px] object-cover relative overflow-hidden"
                                                    crop="bottom"
                                                /> */}
                                                <img src={product?.node?.variant?.image.src} alt="" />
                                                {/* <ProductLabel /> */}
                                            </div>

                                        </div>
                                        <div>
                                            <div style={{ maxWidth: 160, display: "block" }}>
                                                <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                                                    {product.title}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {product?.node?.variant?.selectedOptions.map((option: any) => {
                                            return <>
                                                <h4 key={option.name}>
                                                    {option.name}: {option.value}
                                                </h4>
                                            </>
                                        })}
                                    </div>
                                    <div>
                                        <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
                                            {product?.node?.variant?.priceV2.amount} грн
                                        </h4>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "20px", width: "100%" }}>
                                        <button onClick={() => removeLikeCart(product)} style={{ top: 0, right: 0, position: "absolute", borderRadius: "50%", background: "#B3B3B3", padding: 5, height: 25, cursor: "pointer" }}>
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.30301 7.49677L14.333 1.46087C14.4394 1.35397 14.4991 1.20926 14.499 1.05844C14.4989 0.907626 14.439 0.762997 14.3325 0.656232C14.1193 0.444089 13.7437 0.443017 13.5284 0.657303L7.49997 6.6932L1.46944 0.655696C1.25515 0.444089 0.879617 0.44516 0.666403 0.656767C0.613481 0.709478 0.571587 0.772202 0.543166 0.841277C0.514744 0.910352 0.500365 0.984397 0.500867 1.05909C0.500867 1.21123 0.559796 1.35373 0.666403 1.45927L6.6964 7.49623L0.666939 13.5337C0.560538 13.6408 0.500952 13.7857 0.501254 13.9367C0.501555 14.0876 0.561719 14.2323 0.668546 14.3389C0.771939 14.4412 0.918188 14.5002 1.06926 14.5002H1.07247C1.22408 14.4996 1.37033 14.4402 1.47158 14.3368L7.49997 8.30087L13.5305 14.3384C13.6371 14.4444 13.7796 14.5034 13.9307 14.5034C14.0054 14.5036 14.0794 14.489 14.1485 14.4605C14.2175 14.4321 14.2803 14.3902 14.3331 14.3374C14.3859 14.2845 14.4278 14.2218 14.4562 14.1527C14.4847 14.0837 14.4993 14.0097 14.4991 13.935C14.4991 13.7834 14.4402 13.6403 14.333 13.5348L8.30301 7.49677Z" fill="white" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}


                </div>
            </div>
            <h1>Checkout Page</h1>

        </div>
    );
}

// const enw = ()=>{
//     return (
//         <>
//                             {data.node.lineItems.edges.map((product: any, index: number) => (
//                             <div key={index} className='flex flex-col min-h-[100px] relative  justify-center  register rounded-[20px] border border-black/10 p-6 my-[10px] mb-[30px] lg:mb-0'>
//                             <div className='grid' style={{ minWidth: "100%", gridTemplateColumns: "1fr", position: "relative", justifyContent: 'space-between', alignItems: "center", gap: 10, }}>
//                                 <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                                     <Link
//                                         style={{
//                                             maxWidth: 70
//                                         }}
//                                         to={"variantUrl"}
//                                         className="relative block rounded-[20px] overflow-hidden group-hover/card:h-[calc(var(--image-height)-var(--options-height)+10px)] w-full h-full transition-all duration-100 ease-in-out"
//                                     >
//                                         <div
//                                             className="relative overflow-hidden"
//                                             style={{
//                                                 height: 'var(--image-height)',
//                                                 maxWidth: 70
//                                             }}
//                                             ref={"imageRef"}>
//                                             <Image
//                                                 alt={product?.selectedVariant?.image?.altText || product.title}
//                                                 aspectRatio="1/1"
//                                                 data={product?.selectedVariant?.image}

//                                                 className="rounded-[20px] object-cover relative overflow-hidden"
//                                                 crop="bottom"
//                                             />
//                                             <ProductLabel />
//                                         </div>

//                                     </Link>
//                                     <div>
//                                         <Link to={"variantUrl"} style={{ maxWidth: 160, display: "block" }}>
//                                             <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
//                                                 {product.title}
//                                             </h4>
//                                         </Link>
//                                         {/* <h5>Артикул: {product.id.split("/")[product.id.split("/").length - 1]}</h5> */}
//                                     </div>
//                                 </div>
//                                 <div>
//                                 {/* {product.selectedVariant.selectedOptions.map((option:ISelectedOptions) => {
//                                         return <>
//                                             <h4 >
//                                                 {option.name}: {option.value}
//                                             </h4>
//                                         </>
//                                     })} */}
//                                 </div>
//                                 <div>
//                                     <h4 className="md:text-xl text-lg font-semibold line-clamp-1 pr-[10px] mb-[7px]">
//                                         {/* {product.variants.nodes[0]?.price.amount} грн */}
//                                     </h4>
//                                 </div>

//                                 <div style={{ display: "flex", alignItems: "center", gap: "20px", width: "100%" }}>
//                                     <button onClick={() => removeLikeCart(product)} style={{ top: 0, right: 0, position: "absolute", borderRadius: "50%", background: "#B3B3B3", padding: 5, height: 25, cursor: "pointer" }}>
//                                         <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path d="M8.30301 7.49677L14.333 1.46087C14.4394 1.35397 14.4991 1.20926 14.499 1.05844C14.4989 0.907626 14.439 0.762997 14.3325 0.656232C14.1193 0.444089 13.7437 0.443017 13.5284 0.657303L7.49997 6.6932L1.46944 0.655696C1.25515 0.444089 0.879617 0.44516 0.666403 0.656767C0.613481 0.709478 0.571587 0.772202 0.543166 0.841277C0.514744 0.910352 0.500365 0.984397 0.500867 1.05909C0.500867 1.21123 0.559796 1.35373 0.666403 1.45927L6.6964 7.49623L0.666939 13.5337C0.560538 13.6408 0.500952 13.7857 0.501254 13.9367C0.501555 14.0876 0.561719 14.2323 0.668546 14.3389C0.771939 14.4412 0.918188 14.5002 1.06926 14.5002H1.07247C1.22408 14.4996 1.37033 14.4402 1.47158 14.3368L7.49997 8.30087L13.5305 14.3384C13.6371 14.4444 13.7796 14.5034 13.9307 14.5034C14.0054 14.5036 14.0794 14.489 14.1485 14.4605C14.2175 14.4321 14.2803 14.3902 14.3331 14.3374C14.3859 14.2845 14.4278 14.2218 14.4562 14.1527C14.4847 14.0837 14.4993 14.0097 14.4991 13.935C14.4991 13.7834 14.4402 13.6403 14.333 13.5348L8.30301 7.49677Z" fill="white" />
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                         <h1></h1>
//                     ))}
//                     {data.node && (
//                 <>
//                     <h2>Products</h2>
//                     <ul>
//                         {data.node.lineItems.edges.map((item: any) => (
//                             <li key={item.node.variant.id}>
//                                 <h3>{item.node.title}</h3>
//                                 <p>Quantity: {item.node.quantity}</p>
//                                 <p>Price: {item.node.variant.priceV2.amount} {item.node.variant.priceV2.currencyCode}</p>
//                             </li>
//                         ))}
//                     </ul>

//                     <h2>Shipping Address</h2>
//                     <p>{data.node.shippingAddress.firstName} {data.node.shippingAddress.lastName}</p>
//                     <p>{data.node.shippingAddress.address1}</p>
//                     <p>{data.node.shippingAddress.city}, {data.node.shippingAddress.country}</p>
//                     <p>{data.node.shippingAddress.zip}</p>

//                     <h2>Contact Information</h2>
//                     <p>Email: {data.node.email}</p>

//                     <h2>Checkout URL</h2>
//                     <a href={data.node.webUrl} target="_blank" rel="noopener noreferrer">Proceed to Checkout</a>
//                 </>
//             )}
//         </>
//     )
// }