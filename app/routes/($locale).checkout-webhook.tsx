
import { json, MetaFunction, redirect } from '@remix-run/react';
import { ActionFunction } from '@remix-run/server-runtime';


export const loader = async () => {
    return redirect('/');
};

export const action: ActionFunction = async ({ request }) => {
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 });
    }
    try {
        const data = await request.json();
        console.log(data)
        await updateStatus(data)
        return json({ error: "Invalid Content-Type" }, { status: 200 });

    } catch (error) {
        console.error("Error processing request:", error);
        return json({ error: "Internal server error" }, { status: 500 });
    }
};

const updateStatus = async (bankData: any) => {
    const Amount = bankData?.amount / 100;
    const orderId = +bankData?.reference;
    console.log(orderId)

    if (bankData?.status === "success") {
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
}

const KEYCRM_URL = "https://openapi.keycrm.app/v1"
const KEYCRM_API_KEY = "Mjg3ZTM0OGJlMWRiYjQxZmU2MmM1MWY4MTgxNmNjNjc4MWRjYWFlYg"