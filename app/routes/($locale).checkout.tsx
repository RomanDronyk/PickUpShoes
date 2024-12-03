import { useLoaderData, json, MetaFunction, useActionData, useNavigate } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';
import { generageMonoUrl, generateOrderInShopifyAdmin, getRecommendationsById } from '~/utils';
import { AppLoadContext, redirect } from '@shopify/remix-oxygen';
import CheckoutScreen, { IInputState } from '~/screens/CheckoutScreen';
import { ICheckoutInputErrors, checkoutInputErrors } from '~/mockMessages';
import { useEffect, useState } from 'react';
import { COLLECTION_QUERY } from '~/graphql/queries';
import { CollectionQuery } from 'storefrontapi.generated';
import { getPaginationVariables } from '@shopify/hydrogen';


export const handle: { breadcrumb: string } = {
    breadcrumb: 'checkout',
};

export const meta: MetaFunction = () => {
    return [{
        title: `Оформити замовлення | Pick Up Shoes`,
        'http-equiv': {
            'Content-Security-Policy': "connect-src 'self' https://api.novaposhta.ua https://api.monobank.ua;"
        }
    }];
};


export const loader = async ({ context, request }: { context: AppLoadContext, request: Request }) => {
    const { cart, storefront } = context;
    const cartData = await cart.get();
    const cartNodes: any = cartData?.lines?.nodes;

    if (cartNodes?.length == 0 || !cartNodes?.length) {
        return redirect("/", 302)
    }
    const productIds = cartNodes?.map((product: any) => product?.merchandise?.product?.id);

    const cache = new Map();
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 8,
    });
    const { collection } = await storefront.query<CollectionQuery>(
        COLLECTION_QUERY,
        {
            variables: {
                ...paginationVariables,
                handle: "upsalecheckout",
                filters: [],
                sortKey: "BEST_SELLING",
                reverse: false,
            },
        },
    );
    const recommendedProduct = collection?.products.nodes
    const getRandomProducts = (products: any, count: number) => {
        const shuffled = products.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };


    return json({ recommendedCarts: getRandomProducts(recommendedProduct, productIds.length), cartData, collection, recommendedProduct });



};


export const action: ActionFunction = async ({ request, context }) => {
    const formData = await request.formData();
    const actionType = formData.get('action');

    //базові провірки данних
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 });
    if (!actionType) return json({ error: 'actionType не вказаний' }, { status: 400 });
    if (!formData.get('inputState')) return json({ error: "Не правильні данні", data: { input: formData.get("inputState") } }, { status: 400 });

    const inputState: IInputState = JSON.parse(formData.get('inputState') as string) as IInputState;

    //провірка на валідність основних полів(iputState) по полю errorMessage
    const hasErrors = (inputState: IInputState,): string | null => {
        for (const Key in inputState) {
            const key = Key as keyof IInputState as keyof ICheckoutInputErrors;
            const field = inputState[key];
            if (
                field &&
                typeof field === 'object' &&
                'errorMessage' in field &&
                'isBlur' in field
            ) {
                if (field.errorMessage) {
                    return checkoutInputErrors[key];
                };
            }
        }
        return null;
    };
    if (hasErrors(inputState)) return json({ error: hasErrors(inputState) }, { status: 400 });

    try {
        switch (actionType) {
            case 'create order':
                const result: any = await createOrder(formData, context);
                return json(result);
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
    const { recommendedCarts, cartData, collection } = useLoaderData<typeof loader>();
    const response: any = useActionData<typeof action>();
    console.log(collection)
    const [cartsFromCart, setCartsFromCart] = useState<any>([])

    const amount = cartData?.cost?.subtotalAmount?.amount || "0"

    const urlFromAction = response?.pageUrl;
    const navigate = useNavigate()

    if (urlFromAction == "/thanks") {
        urlFromAction ? navigate(urlFromAction) : null;
    } else if (urlFromAction !== null && urlFromAction) {
        window.location.href = urlFromAction;
    }
    useEffect(() => {
        const carts = cartData?.lines?.nodes?.map((element: any) => element) || [];
        setCartsFromCart(carts)
    }, [cartData?.lines?.nodes])

    return (
        <>
            <CheckoutScreen actionErrorMessage={response?.error} recommendedCarts={recommendedCarts} cartsFromCart={cartsFromCart} amount={amount} />
        </>
    );
}




async function createOrder(data: FormData, context: any) {
    const paymentMethod = data.get("payment");
    const deliveryMethod = data.get("delivery");
    const productsString: any = data.get('products') || '[]';
    const amount = data.get('amount') || 0
    const products: any = JSON.parse(productsString);
    const { cart } = context;
    const productIds = products.map((product: any) => product.id);
    const lineItems = products.map((element: any) => {
        return {
            variantId: element.merchandise.id,
            quantity: element.quantity
        }
    })

    const orderData = {
        email: data.get('email') || '',
        note: data.get('note') || '',
        phone: data.get('phone') || '',
        lineItems,
        shippingAddress: {
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

    if (!paymentMethod) return json({ error: 'Виберіть спосіб оплатии' }, { status: 405 });
    if (!deliveryMethod) return json({ error: 'Виберіть спосіб доставки' }, { status: 405 });

    let paymentLink={pageUrl: "/thanks"}
    const generateOrderInShopifyAdminPromise = await generateOrderInShopifyAdmin(context, orderData)

    if (paymentMethod == "card") {
        paymentLink = await generageMonoUrl(amount, products,
            `${generateOrderInShopifyAdminPromise.draftOrderComplete.draftOrder.order.id}`,
            "https://pick-up-shoes.com.ua")
    }

    try {
        if (cart) {
            await cart.removeLines(productIds);
        }
    } catch (error) {
        console.error('Failed to clear cart:', error);
    }
    return paymentLink
}
