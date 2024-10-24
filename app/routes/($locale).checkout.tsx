import { useLoaderData, json, MetaFunction, useActionData, useNavigate } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';
import { CREATE_CHEKOUT_URL } from '~/graphql/mutations';
import { generageMonoUrl, generateOrderInShopifyAdmin, getRecommendationsById } from '~/utils';
import { AppLoadContext } from '@shopify/remix-oxygen';
import CheckoutScreen, { IInputState } from '~/screens/CheckoutScreen';
import { ICheckoutInputErrors, checkoutInputErrors } from '~/mockMessages';


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


export const loader = async ({ context }: { context: AppLoadContext }) => {
    const { cart } = context;
    const cartData = await cart.get();
    const cartNodes: any = cartData?.lines?.nodes;

    if (cartNodes?.length == 0 || !cartNodes?.length) {
        throw new Response("Кошик порожній", { status: 302, headers: { Location: "/" } })
    }
    const productIds = cartNodes?.map((product: any) => product?.merchandise?.product?.id);

    const cache = new Map();

    const recommendedProductPromises = productIds.map((id: any) => getRecommendationsById(id, cache, context));
    const recommendedProductResponce = await Promise.all(recommendedProductPromises)

    const recommendedCarts = recommendedProductResponce.map((responce: any) => {
        const recommendedProduct = responce.productRecommendations;
        const filteredProducts = recommendedProduct.map((product: any) => ({
            ...product,
            variants: product.variants.nodes.filter((variant: any) => variant.availableForSale && variant.quantityAvailable > 0)
        }));

        if (filteredProducts.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredProducts.length);
            return filteredProducts[randomIndex];

        }
    })

    return json({ recommendedCarts: recommendedCarts, cartData });
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
    const { recommendedCarts, cartData } = useLoaderData<typeof loader>();
    const response: any = useActionData<typeof action>();

    const cartsFromCart = cartData?.lines?.nodes.map((element: any) => element) || [];
    const amount = cartData?.cost?.subtotalAmount?.amount || "0"

    const urlFromAction = response?.pageUrl;
    const navigate = useNavigate()

    if (urlFromAction == "/thanks") {
        urlFromAction ? navigate(urlFromAction) : null;
    } else if (urlFromAction !== null && urlFromAction) {
        window.location.href = urlFromAction;
    }

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

    let paymentLink;
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
