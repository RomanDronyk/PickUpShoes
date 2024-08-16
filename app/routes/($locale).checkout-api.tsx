import { useLoaderData, json, MetaFunction, Form, Link, FetcherWithComponents } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { ProductLabel } from '~/components/ProductCard';
import { LoaderFunction, ActionFunction } from '@remix-run/node';
import {
    Image,
    Money,
    type VariantOption,
    VariantSelector,
    CartForm,
} from '@shopify/hydrogen';
import { ISelectedOptions } from '~/components/LikedCart/LikedCart';

import CREATE_CHEKOUT_URL from '~/graphqlRequests/CREATE_CHEKOUT_URL';
// GraphQL запит для отримання даних чекауту



// // Loader function to get checkout data
export const loader = async ({ context, request }: { context: any, request: Request }) => {
    const { storefront } = context;

    return json({"data":"data"});
};

// Meta function for the page
export const meta: MetaFunction = () => {
    return [{ title: `Hydrogen | Checkout` }];
};




export const action: ActionFunction = async ({ request, context }) => {

    const { session, storefront } = context;
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 });
    }
    const formData = await request.formData();

    const actionType = formData.get('action');
    const lineItems:any = formData.get('lineItems') ? JSON.parse(formData.get('lineItems') as string) : [];

    switch (actionType) {
        case 'create url':
            return createUrl(lineItems, storefront);

        case 'generate order':
            return generateOrder(lineItems);
        default:
            return json({ error: "Invalid action" }, { status: 400 });
    }
};

async function createUrl(lineItems: any[], storefront: any) {
    // Логіка створення URL на основі lineItems
    console.log("creating urlr", lineItems)
    try{
        const data = await storefront.mutate(
            CREATE_CHEKOUT_URL,
            {
                variables: {
                    input: { lineItems },
                },
            },
        );  
    return json({ response: data });

    }catch(e){
        console.log(e)
        return json({ response: "data" });

    }

}

async function generateOrder(lineItems: any[]) {
    // Логіка генерації замовлення на основі lineItems
    const orderId = "12345";
    return json({ message: "Order generated successfully", orderId });
}