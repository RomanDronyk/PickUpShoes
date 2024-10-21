import { json, MetaFunction } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';
import { CREATE_CHEKOUT_URL } from '~/graphql/mutations';

// GraphQL запит для отримання даних чекауту



// // Loader function to get checkout data
export const loader = async ({ context, request }: { context: any, request: Request }) => {
    const { storefront } = context;
    return json({ "data": "data" });
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
    const lineItems: any = formData.get('lineItems') ? JSON.parse(formData.get('lineItems') as string) : [];
    const inputCity: any = formData.get('city') || "";
    const inputDepartment: any = formData.get('department') || "";
    switch (actionType) {
        // case 'create url':
        //     return createUrl(lineItems, storefront);
        case 'generate order':
            return generateOrder(lineItems);
        case 'get city':
            return fetchCity(inputCity);
        case 'get department':
            return fetchDepartment(inputCity, inputDepartment); 
        default:
            return json({ error: "Invalid action" }, { status: 400 });
    }
};

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
        return json({ response: "data" });

    }

}

async function generateOrder(lineItems: any[]) {
    // Логіка генерації замовлення на основі lineItems
    const orderId = "12345";
    return json({ message: "Order generated successfully", orderId });
}



const fetchCity = async (cityName: string) => {
    const response: any = await fetch(API_POSHTA_URL, {
        method: "POST",
        body: JSON.stringify({
            apiKey: API_POSHTA_KEY,
            modelName: "Address",
            calledMethod: "searchSettlements",
            methodProperties: {
                CityName: cityName,
                Limit: "10",
                Page: "1",
            },
        }),
    });
    const { data, success } = await response.json();
    let city: any = []
    let department: any = []

    const getDepartment: any = await fetch(API_POSHTA_URL, {
        method: "POST",
        body: JSON.stringify({
            apiKey: API_POSHTA_KEY,
            modelName: "Address",
            calledMethod: "getWarehouses",
            methodProperties: {
                CityName: "",
                Page: "1",
                Limit: "50",
                Language: "UA",
                WarehouseId: "",
            },
        }),
    });
    const { data:dataDepartment, success: successDepartment } =await getDepartment.json();

    if (success &&successDepartment) {
    console.log( "sdlf")

        dataDepartment.forEach((element:any) => {
            department.push(element)
        });
        city = data[0].Addresses
    } else {
        city = []
        department = []

    }
    return json({ cities: city, department:dataDepartment})
};



const fetchDepartment = async (inputCity: string, department: string) => {
    const response: any = await fetch(API_POSHTA_URL, {
        method: "POST",
        body: JSON.stringify({
            apiKey: API_POSHTA_KEY,
            modelName: "Address",
            calledMethod: "getWarehouses",
            methodProperties: {
                CityName: inputCity,
                Page: "1",
                Limit: "10",
                Language: "UA",
                WarehouseId: department,
            },
        }),
    });
    const { data, success } = await response.json();
    if (success) {
        return json({department: data});
    } else {
        return json({department: []});
    }
};


const API_POSHTA_URL = "https://api.novaposhta.ua/v2.0/json/"
const API_POSHTA_KEY = "fac23a4d2d34c603535680b0e25fac94"
