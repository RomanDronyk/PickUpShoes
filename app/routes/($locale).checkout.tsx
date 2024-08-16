import { useLoaderData, json, MetaFunction, Form, Link, FetcherWithComponents, useActionData } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { ActionFunction } from '@remix-run/node';
import GET_CHECKOUT_QUERY from '~/graphqlRequests/GET_CHECKOUT_QUERY';
import CREATE_CHEKOUT_URL from '~/graphqlRequests/CREATE_CHEKOUT_URL';
import {  useState } from 'react';
import CheckoutCart from '~/components/CheckoutCart';
import { Button } from '~/components/ui/button';



// Meta function for the page
export const meta: MetaFunction = () => {
    return [{ title: `Hydrogen | Checkout` }];
};

// Checkout component
export default function Checkout() {
    const data: any = useLoaderData();
    const [products, setProducts] = useState(data?.data?.node?.lineItems?.edges || [])
    const response: any = useActionData();
    const amount = products.reduce((acc, element)=> +element.node.variant?.priceV2?.amount+ acc, 0)

    if(response?.url){
        window.location.href = response?.url;

    }
    console.log(products, "products se")
    return (
        <div className="contaier gap-[40px] grid grid-cols-2 grid lg:grid-cols-[1fr_1fr] grid-cols-2 gap-y-10 gap-x-10 sm:px-24 px-[10px] my-10 w-full mt-[1rem]">
            <div className=''>
                <Form method="POST" className='grid gap-[35px]'>
                    <input type="hidden" name="products" value={JSON.stringify(products)} />
                    <input type="hidden" name="action" value="create order" />
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
                                    minLength={4}
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
                                    minLength={4}
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
                                    minLength={4}
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
                                    minLength={4}
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
                                    minLength={4}
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
                            <div className="delivery-options">

                                <div className="flex items-center mb-4">
                                    <input defaultChecked style={{ accentColor: "black", cursor: "pointer" }} type="radio" id="delivery1" name="delivery" value="novaposhta" className="mr-2" />
                                    <label style={{ cursor: "pointer" }} htmlFor="delivery1" className="text-lg">Доставка Новою Поштою</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input style={{ accentColor: "black", cursor: "pointer" }} type="radio" id="delivery2" name="delivery" value="ukrposhta" className="mr-2" />
                                    <label style={{ cursor: "pointer" }} htmlFor="delivery2" className="text-lg">Доставка Укрпоштою</label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="xl:text-[32px] text-[24px] md:text-left text-center  font-medium mb-[20px]">
                                Спосіб оплати
                            </h2>
                            <div className="payment-options">
                                <div className="flex items-center mb-4">
                                    <input defaultChecked style={{ accentColor: "black", cursor: "pointer" }} type="radio" id="payment1" name="payment" value="card" className="mr-2" />
                                    <label htmlFor="payment1" className="text-lg">Оплата карткою онлайн</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input style={{ accentColor: "black", cursor: "pointer" }} type="radio" id="payment2" name="payment" value="cash" className="mr-2" />
                                    <label htmlFor="payment2" className="text-lg">Оплата готівкою при отриманні</label>
                                </div>
                            </div>
                        </div>
                        <div >
                            <div className=' justify-between flex font-bold'>
                                <h2 className="xl:text-[32px] text-[24px] md:text-left text-center   mb-[20px]">
                                    До сплати:
                                </h2>
                                <input name="amount" disabled value={`${amount} грн.`} className='xl:text-[32px] text-right text-[24px] bg-transparent text-center   mb-[20px]' />
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
                                <Button className='rounded-[64px]'>Додати</Button>
                            </div>
                            <div>

                                {response?.error && (
                                    <>
                                        {response?.error}
                                    </>

                                )}
                            </div>
                            <Button className='rounded-[64px] w-[100%] text-semibold text-[18px] text-white py-[20px]'>Оформити замовлення</Button>
                        </div>
                    </div>
                </Form>
            </div>
            <div>
                <h1 class="xl:text-[32px] text-[24px] md:text-left text-center  font-medium mb-[20px]">Ви обрали:</h1>
                <div className="register rounded-[20px] border border-black/10 p-[0px_24px] ">
                    {products.length > 0 && products.map((product: any, index: number) => {
                        return <>
                            <CheckoutCart key={product.node.variant?.id} product={product.node} />
                            {products.length - 1 !== index && <div key={products.length - 1 + index} className='border border-black/10'></div>}
                        </>
                    }
                    )}
                </div>
            </div>

        </div>
    );
}


// // Loader function to get checkout data
export const loader = async ({ context, request }: { context: any, request: Request }) => {
    const { storefront } = context;

    const url = new URL(request.url);
    const checkoutId = url.searchParams.get('checkoutId');

    if (!checkoutId) {
        throw new Error('Missing checkout ID');
    }

    try {
        const data: any = await storefront.query(GET_CHECKOUT_QUERY, {
            variables: { checkoutId: `${checkoutId}` },
        });
        return json({ data });

    } catch (e) {
        return json({ data: [] });

    }

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

            case 'generate order':
                return generateOrder(lineItems);

            case 'create order':
                return createOrder(formData);

            default:
                return json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (e) {
        console.error('Error handling action:', e);
        return json({ error: "Internal server error" }, { status: 500 });
    }
};
async function createOrder(data: FormData) {
    const paymentMethod = data.get("payment");
    const deliveryMethod = data.get("delivery")
    if (!paymentMethod) {
        return json({ error: 'Виберіть спосіб оплатии' }, { status: 405 });
    }
    if (!deliveryMethod) {
        return json({ error: 'Виберіть спосіб доставки' }, { status: 405 });
    }

    return await generateOrderInKeycrm(data)
}
async function createUrl(lineItems: any[], storefront: any) {
    // Логіка створення URL на основі lineItems
    console.log("creating urlr", lineItems)
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

async function generateOrder(lineItems: any[]) {
    // Логіка генерації замовлення на основі lineItems
    const orderId = "12345";
    return json({ message: "Order generated successfully", orderId });
}

async function generateOrderInKeycrm(formData: FormData) {

    const productsString:any = formData.get('products') || '[]';
    const products = JSON.parse(productsString);
    const paymentMethod = formData.get("payment");
    const firstName = formData.get('firstName') || "null"
    const lastName = formData.get('lastName') || "null"
    let paymentLink = ''

    const orderData = {
        source_id: 1,
        // source_uuid: formData.get('source_uuid') || '115',
        // buyer_comment: formData.get('buyer_comment') || '',
        manager_id: 1,
        // manager_comment: formData.get('manager_comment') || '',
        promocode: formData.get('promo') || '',
        // discount_percent: parseFloat(formData.get('discount_percent') || '0'),
        // discount_amount: parseFloat(formData.get('discount_amount') || '0'),
        // shipping_price: parseFloat(formData.get('shipping_price') || '0'),
        // wrap_price: parseFloat(formData.get('wrap_price') || '0'),
        // gift_message: formData.get('gift_message') || '',
        // is_gift: formData.get('is_gift') === 'on',
        // gift_wrap: formData.get('gift_wrap') === 'on',
        // taxes: parseFloat(formData.get('taxes') || '0'),
        // ordered_at: new Date().toISOString(),
        buyer: {
            full_name: firstName +" " + lastName || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || ''
        },
        shipping: {
            // delivery_service_id: 1,
            tracking_code: formData.get('tracking_code') || '',
            shipping_service: formData.get('delivery') || '',
            shipping_address_city: formData.get('city') || '',
            shipping_address_country: "Ukraine",
            shipping_address_region: formData.get('region') || '',
            shipping_address_zip: formData.get('zip') || '',
            shipping_secondary_line: formData.get('address2') || '',
            shipping_receive_point: formData.get('receive_point') || '',
            recipient_full_name: formData.get('recipient_full_name') || '',
            recipient_phone: formData.get('recipient_phone') || '',
            warehouse_ref: formData.get('warehouse_ref') || '',
            shipping_date: formData.get('shipping_date') || ""
        },
        marketing: {
            utm_source: formData.get('utm_source') || '',
            utm_medium: formData.get('utm_medium') || '',
            utm_campaign: formData.get('utm_campaign') || '',
            utm_term: formData.get('utm_term') || '',
            utm_content: formData.get('utm_content') || ''
        },
        products: generateProductForKeycrm(products),
        // payments: [
        //     {
        //         payment_method_id: 2,
        //         payment_method: formData.get('payment') || '',
        //         amount: parseFloat(formData.get('amount') || '0'),
        //         description: formData.get('description') || '',
        //         payment_date: new Date().toISOString(),
        //         status: 'not_paid'
        //     }
        // ],
        // custom_fields: [
        //     {
        //         uuid: 'OR_1037',
        //         value: 'Lord'
        //     }
        // ]
    };
    const response = await fetch(`${KEYCRM_URL}/order`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Authorization': `Bearer ${KEYCRM_API_KEY}`,
        },
        body: JSON.stringify(orderData),
    })

    const result:any = await response.json();
    if (!response.ok) { 
        return json({ error: "error" + result.message || 'Failed to create order' });
    }
    console.log(result)
    
    if (paymentMethod === "card") {
        paymentLink =await generageMonoUrl(products, result.id)

    }
    return json({ message: "order success created", url: paymentLink});

}
const generateProductForKeycrm = (products: any) => {
    return products.map((product: any) => {
        const { quantity, title, variant } = product.node
        const splitVariant = variant.id.split('/')
        const variantId = splitVariant[splitVariant.length - 1]
        return {
            "sku": variantId,
            "price": variant?.priceV2?.amount,
            // "purchased_price": 100,
            // "discount_percent": 11.5,
            // "discount_amount": 9.99,
            "quantity": quantity,
            "unit_type": "шт",
            "name": title,
            // "comment": "Наклеїти плівку",
            "picture": variant?.image?.url,
            "properties": [
                {
                    "name": "Color",
                    "value": "Gold"
                }
            ]
        }

    })
}

const generageMonoUrl = async (products:any,id:any)=>{
    const productsForMono = getDataFromMonoUser(products);
    const amount = productsForMono.reduce(
        (accumulator:number, currentValue:any) =>{
            console.log( accumulator , currentValue.sum,'sdklfjlk')
            return  accumulator + currentValue?.sum
        },
        0,
      )

    return await fetch("https://api.monobank.ua/api/merchant/invoice/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Token": MONO_TOKEN,
        },
        body: JSON.stringify({
          amount: +amount,
          ccy: 980,
          redirectUrl: "https://737c-88-155-72-240.ngrok-free.app",
          webHookUrl: `https://737c-88-155-72-240.ngrok-free.app/checkout-webhook`,
          merchantPaymInfo: {
            reference: `${id}`,
            destination: "Подарунок від MISTER GIFTER",
            comment: "Подарунок від MISTER GIFTER",
            basketOrder: productsForMono,
          },
          paymentType: "debit",
          validity: 3600,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data:any) => {
          return data.pageUrl;
        })
        .catch((response) => console.log(response));
}

const getDataFromMonoUser = (products: any) => {
    return products.map(
      (product: any, index: number) => {
        const { quantity, title, variant } = product.node
        const splitVariant = variant.id.split('/')
        const variantId = splitVariant[splitVariant.length - 1]
        return {
          name: title,
          qty: quantity,
          sum: variant?.priceV2?.amount * 100,
          icon: variant?.image?.url,
          unit: "шт.",
          barcode: variantId,
          header: "header",
          code: variantId,
          footer: "footer",
          tax: [0],
          uktzed: "uktzedcode",
        };
      }
    );
  };
const MONO_TOKEN = "utR_bnF6LUzdc4pr3yFNFF2kKEPk75xeIlItZx9QfaxY"
const KEYCRM_URL = "https://openapi.keycrm.app/v1"
const KEYCRM_API_KEY = "Mjg3ZTM0OGJlMWRiYjQxZmU2MmM1MWY4MTgxNmNjNjc4MWRjYWFlYg"