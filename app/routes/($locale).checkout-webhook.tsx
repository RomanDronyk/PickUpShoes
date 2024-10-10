
import { json, MetaFunction, redirect } from '@remix-run/react';
import { ActionFunction } from '@remix-run/server-runtime';
import { MARK_AS_PAID_MUTATION } from '~/graphql/mutations';


export const loader = async () => {
    return redirect('/');
};

export const action: ActionFunction = async ({context, request }) => {
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 });
    }
    try {
        const data: any = await request.json();
        const reference = data.reference.split("___");
        const amount = data.amount / 100;
        console.log(reference, data.reference)
        if (data.status === "success") {
            await updateStatus(amount, reference[0])
            await updateStatusInShopify(context,reference[1])
        }

        return json({ error: "Invalid Content-Type" }, { status: 200 });

    } catch (error) {
        console.error("Error processing request:", error);
        return json({ error: "Internal server error" }, { status: 500 });
    }
};

const updateStatusInShopify = async (context: any, id: string) => {
    console.log("updates status "+id)
    const updateStatus = await context.admin(MARK_AS_PAID_MUTATION, {
        variables: {
            input:{
                id: id
            }
        }
    });
    console.log(updateStatus)
}

const updateStatus = async (Amount: any, orderId: any) => {
    try {
        const response = await fetch(`${KEYCRM_URL}/order/${orderId}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KEYCRM_API_KEY}`,
            },
            body: JSON.stringify({
                "payment_method_id": 2,
                "payment_method": "Credit card",
                "amount": Amount,
                "description": "Mono plata",
                "status": "paid",
            }
            ),
        });

        if (!response.ok) {
            return json({ message: "error" }, { status: 400 });
        }
        return json({ message: "suceess" }, { status: 200 });
    } catch (error: any) {
        console.error('Error:', error?.message);
        return json({ message: "error" }, { status: 500 });
    }
}


const KEYCRM_URL = "https://openapi.keycrm.app/v1"
const KEYCRM_API_KEY = "Mjg3ZTM0OGJlMWRiYjQxZmU2MmM1MWY4MTgxNmNjNjc4MWRjYWFlYg"