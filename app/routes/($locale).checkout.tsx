import { useLoaderData, json, MetaFunction, Form, useActionData, useNavigate, redirect } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { ActionFunction } from '@remix-run/node';
import React, { useState } from 'react';
import CheckoutCart from '~/components/CheckoutCart';
import { Button } from '~/components/ui/button';
import NovaPoshtaCity from '~/components/Checkout/novaPoshtaCity';
import NovaPoshtaDepartent from '~/components/Checkout/novaPoshtaDepartment';
import ContactType from '~/components/Checkout/contactType';
import { useMedia } from 'react-use';
import CheckoutCartMobile from '~/components/CheckoutCartMobile';
import { CREATE_CHEKOUT_URL } from '~/graphql/mutations';
import { generageMonoUrl, generateOrderInKeycrm, generateOrderInShopifyAdmin, generateProductForKeycrm } from '~/utils';



export const handle: { breadcrumb: string } = {
    breadcrumb: 'checkout',
};

// Meta function for the page
export const meta: MetaFunction = () => {
    return [{
        title: `Оформити замовлення | Pick Up Shoes`, 'http-equiv': {
            'Content-Security-Policy': "connect-src 'self' https://api.novaposhta.ua;"
        }
    }];
};


export const loader = async ({ context, request }: { context: any, request: Request }) => {
    const { storefront, cart } = context;
    const cartPromise = await cart.get();
    if (cartPromise?.lines?.nodes?.length == 0 || !cartPromise?.lines?.nodes?.length) {
        throw redirect("/", 302);
    }
    return json({ cartPromise });

};


export const action: ActionFunction = async ({ request, context }) => {
    const { session, storefront } = context;
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 });
    }
    const formData = await request.formData();

    const actionType = formData.get('action');
    const lineItems: any = formData.get('lineItems') ? JSON.parse(formData.get('lineItems') as string) : [];


    try {
        switch (actionType) {
            case 'create url':
                return createUrl(lineItems, storefront);
            case 'create order':
                const result = await createOrder(formData, context);
                return result;
            default:
                return json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (e) {
        console.error('Error handling action:', e);
        return json({ error: "Internal server error" }, { status: 500 });
    }
};

// Checkout component
export default function Checkout() {
    const data: any = useLoaderData();
    const response: any = useActionData();
    const [city, setCity] = useState<any>({})
    const [options, setOptions] = useState([]);

    console.log(data,"data")
    console.log(response,"response")

    const [userName, setUserName] = useState({ firstName: "", lastName: "" });
    const [userPhone, setUserPhone] = useState("")
    const isMobile = useMedia('(max-width: 767px)', false);

    const [department, setDepartment] = useState({
        CityDescription: "",
        SettlementAreaDescription: "",
        PostalCodeUA: "",
        Description: "",
        Ref: ""
    })

    const cartsFromCart = data?.cartPromise?.lines?.nodes.map((element: any) => element);
    const amount = data?.cartPromise?.cost?.subtotalAmount?.amount || 0
    const urlFromAction = response?.url;
    const navigate = useNavigate()

    if (urlFromAction == "/thanks") {
        urlFromAction ? navigate(urlFromAction) : null;
    } else if (urlFromAction !== null && urlFromAction) {
        window.location.href = urlFromAction;
    }

    return (

        <div className="flex flex-col-reverse contaier gap-[20px] md:gap-[40px] md:grid md:grid-cols-2 lg:grid-cols-[1fr_1fr] md:grid-cols-2 md:gap-y-10 md:gap-x-10 lg:px-24 px-[10px] my-10 w-full mt-[1rem]"
            style={{ maxWidth: "100%", overflow: "hidden" }}>

            <div className=''>
                <Form method="POST" className='grid gap-[35px]'
                    style={{ maxWidth: "100%", overflow: "hidden" }}>
                    <div style={{ position: "absolute", zIndex: -10, opacity: 0 }}>
                        <input style={{ width: "0% !important" }} type="hidden" name="products" value={JSON.stringify(cartsFromCart)} />
                        <input style={{ width: "0% !important" }} type="hidden" name="shipping_address_city" value={department?.CityDescription} />
                        <input style={{ width: "0% !important" }} type="hidden" name="shipping_address_country" value={"Ukraine"} />
                        <input style={{ width: "0% !important" }} type="hidden" name="shipping_address_region" value={department?.SettlementAreaDescription} />
                        <input style={{ width: "0% !important" }} type="hidden" name="shipping_address_zip" value={department?.PostalCodeUA} />
                        <input style={{ width: "0% !important" }} type="hidden" name="shipping_secondary_line" value={"string"} />
                        <input style={{ width: "0% !important" }} type="hidden" name="shipping_receive_point" value={department?.Description} />
                        <input style={{ width: "0% !important" }} type="hidden" name="recipient_full_name" value={`${userName.firstName} ${userName.lastName}`} />
                        <input style={{ width: "0% !important" }} type="hidden" name="recipient_phone" value={userPhone} />
                        <input style={{ width: "0% !important" }} type="hidden" name="warehouse_ref" value={department?.Ref} />
                        <input style={{ width: "0% !important" }} type="hidden" name="amount" value={amount.replace(".0", "")} />
                        <input type="hidden" name="action" value="create order" />
                    </div>
                    <div className="register rounded-[20px] border border-black/10 p-[20px_24px] ">
                        <h2 className="xl:text-[32px] text-[24px] text-left  font-medium mb-[20px]">
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

                                    onChange={(event) => setUserName((prevData) => {
                                        return { ...prevData, firstName: event.target.value }
                                    })}
                                    autoFocus
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
                                    autoFocus
                                    required
                                    onChange={(event) => setUserName((prevData) => {
                                        return { ...prevData, lastName: event.target.value }
                                    })}
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

                                    minLength={4}
                                    required
                                    onChange={(event) => setUserPhone(event.target.value)}
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                            </div>

                            <div className='pb-[15px] border-b border-black/20'>
                                <ContactType />
                            </div>
                            <div className='pb-[15px] border-b border-black/20'>
                                <NovaPoshtaCity setDepartment={setOptions} setCity={setCity} />
                            </div>
                            <div className='pb-[15px] border-b border-black/20'>
                                <NovaPoshtaDepartent options={options} setDepartment={setDepartment}
                                    setOptions={setOptions} city={city?.MainDescription} />

                            </div>

                            <div className=''>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="E-mail"
                                    aria-label="Re-enter E-mail"
                                    minLength={4}
                                    required
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                            </div>
                            <>
                            </>
                        </fieldset>
                    </div>
                    <div className="register rounded-[20px] border border-black/10 p-[20px_24px] ">
                        <div>
                            <h2 className="xl:text-[32px] text-[24px] text-left  font-medium mb-[20px]">
                                Спосіб доставки
                            </h2>
                            <div className="delivery-options">

                                <div className="flex mb-4 items-start">
                                    <input defaultChecked style={{ accentColor: "black", cursor: "pointer", marginTop: 5 }} type="radio" id="delivery1" name="delivery" value="novaposhta" className="mr-2" />
                                    <label style={{ cursor: "pointer" }} htmlFor="delivery1" className="font-normal text-[16px]">Доставка Новою Поштою</label>
                                </div>
                                <div className="flex mb-4 items-start">
                                    <input style={{ accentColor: "black", cursor: "pointer", marginTop: 5 }} type="radio" id="delivery2" name="delivery" value="ukrposhta" className="mr-2" />
                                    <label style={{ cursor: "pointer" }} htmlFor="delivery2" className="font-normal text-[16px]">Самовивіз (м. Коломия вул. Чорновола 28 | ТЦ “Водолій”, 3 поверх)</label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="xl:text-[32px] text-[24px] text-left  font-medium mb-[20px]">
                                Спосіб оплати
                            </h2>
                            <div className="payment-options">
                                <div className="flex mb-4 items-start">
                                    <input defaultChecked style={{ accentColor: "black", cursor: "pointer", marginTop: 5 }} type="radio" id="payment1" name="payment" value="card" className="mr-2" />
                                    <label htmlFor="payment1" className="font-normal text-[16px]">Оплата карткою онлайн</label>
                                </div>
                                <div className="flex mb-4 items-start">
                                    <input style={{ height: "auto", accentColor: "black", cursor: "pointer", marginTop: 5 }} type="radio" id="payment2" name="payment" value="cash" className="mr-2" />
                                    <label htmlFor="payment2" className="font-normal text-[16px]">При отриманні з предоплатою 200 грн
                                        <span className='text-[14px] font-medium' >
                                            *Менеджер зв’яжеться з вами протягом 15 хвилин та надасть реквізити для внесення предоплати
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div >
                            <div className=' justify-between flex font-bold'>
                                <h2 className="xl:text-[32px] text-nowrap sm:text-[24px] text-left  mb-[15px] text-[22px]  sm:mb-[20px]">
                                    До сплати:
                                </h2>
                                <input style={{ maxWidth: 200 }} name="amount" disabled value={`${amount} грн.`} className='xl:text-[32px] text-nowrap sm:text-[24px] text-right  mb-[15px] text-[22px]  sm:mb-[20px]' />
                            </div>
                            <div className='hidden flex justify-between gap-[12px] pb-[24px]'>
                                <Input
                                    id="promo"
                                    name="promo"
                                    type="number"
                                    autoComplete="promo"
                                    placeholder="Ваш промокод"
                                    aria-label="Не правильний промокод"

                                    minLength={4}
                                    className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                                />
                                <Button className='rounded-[64px]'>
                                    Додати
                                </Button>
                            </div>
                            <div>
                                {response?.error && (
                                    <>
                                        {response?.error}
                                    </>
                                )}
                            </div>
                            <Button className='rounded-[64px] w-[100%] text-semibold text-[18px] text-white py-[16px]'>
                                Оформити замовлення
                                <span style={{ marginLeft: 15 }}>
                                    <svg width="16" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.2959 0.454104L19.0459 7.2041C19.1508 7.30862 19.234 7.43281 19.2908 7.56956C19.3476 7.7063 19.3768 7.85291 19.3768 8.00098C19.3768 8.14904 19.3476 8.29565 19.2908 8.4324C19.234 8.56915 19.1508 8.69334 19.0459 8.79785L12.2959 15.5479C12.0846 15.7592 11.7979 15.8779 11.4991 15.8779C11.2002 15.8779 10.9135 15.7592 10.7022 15.5479C10.4908 15.3365 10.3721 15.0499 10.3721 14.751C10.3721 14.4521 10.4908 14.1654 10.7022 13.9541L15.5313 9.12504L1.75 9.12504C1.45163 9.12504 1.16548 9.00651 0.954505 8.79554C0.743527 8.58456 0.625 8.29841 0.625 8.00004C0.625 7.70167 0.743527 7.41552 0.954505 7.20455C1.16548 6.99357 1.45163 6.87504 1.75 6.87504L15.5313 6.87504L10.7013 2.04598C10.4899 1.83463 10.3712 1.54799 10.3712 1.2491C10.3712 0.950218 10.4899 0.663574 10.7013 0.45223C10.9126 0.240885 11.1992 0.122151 11.4981 0.122151C11.797 0.122151 12.0837 0.240885 12.295 0.45223L12.2959 0.454104Z" fill="white" />
                                    </svg>
                                </span>
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
            <div>
                <h1 className="xl:text-[32px] text-[24px] text-left  font-medium mb-[20px]">Ви обрали:</h1>
                <div className="register rounded-[20px] border border-black/10 p-[0px_24px] ">
                    {cartsFromCart.length > 0 && cartsFromCart.map((product: any, index: number) => {
                        return <React.Fragment key={product.id || index} >
                            {
                                isMobile ?
                                    <CheckoutCartMobile key="sfsfssdfsf" cartsFromCart={product} /> :
                                    <CheckoutCart key="3123" cartsFromCart={product} />
                            }
                            {cartsFromCart.length - 1 !== index && <div key={cartsFromCart.length - 1 + index} className='border border-black/10'></div>}
                        </React.Fragment>
                    }
                    )}
                </div>
            </div>

        </div>
    );
}


// // Loader function to get checkout data

async function createOrder(data: FormData, context: any) {
    const paymentMethod = data.get("payment");
    const deliveryMethod = data.get("delivery");
    const productsString: any = data.get('products') || '[]';
    const amount = data.get('amount') || 0
    const products = JSON.parse(productsString);
    const lineItems = products.map((element:any)=>{
        return {
            variantId:element.merchandise.id,
            quantity:element.quantity
        }
    })

    const orderData = {
        email: data.get('email') || '',
        note: data.get('note') || '',
        phone: data.get('phone') || '',
        lineItems,
        shippingAddress:{
            address1: data.get('shipping_receive_point') || '',
            address2: "",
            city: data.get('shipping_address_city') || '',
            country: "UA",
            firstName: data.get('firstName') || "null",
            lastName: data.get('lastName') || "null",
            phone: data.get('phone') || '',
            province: data.get('shipping_address_region') || '',
            zip: data.get('shipping_address_zip') || '',
        }
    }

    let paymentLink = '/thanks'

    if (!paymentMethod) return json({ error: 'Виберіть спосіб оплатии' }, { status: 405 });
    if (!deliveryMethod) return json({ error: 'Виберіть спосіб доставки' }, { status: 405 });

    const generageOrderKeycrm = await generateOrderInKeycrm(data)

    if (!generageOrderKeycrm.id) return json({ generageOrderKeycrm, error: "error" + generageOrderKeycrm.message || 'Failed to create order' });

    console.log("slfajk")
    const generateOrderInShopifyAdminPromise = await generateOrderInShopifyAdmin(context, orderData)
    console.log("complete create")

    if (paymentMethod === "card") {
        console.log(generateOrderInShopifyAdminPromise.draftOrderComplete.draftOrder.order.id,"slkfja;l")
        paymentLink = await generageMonoUrl(amount, products, `${generageOrderKeycrm.id}___${generateOrderInShopifyAdminPromise.draftOrderComplete.draftOrder.order.id}`)
    }
    return redirect(paymentLink, 302);

}
async function createUrl(lineItems: any[], storefront: any) {
    try {
        const data = await storefront.mutate(
            CREATE_CHEKOUT_URL,
            {
                variables: {
                    input: { lineItems },
                },
            },
        );
        return json({ response: data });
    } catch (e) {
        console.log(e)
        return json({ response: "data" });
    }
}






