import { generateProductForKeycrm } from "./generateProductForKeycrm";

export const generateOrderInKeycrm = async (formData: FormData) => {

  const productsString: any = formData.get('products') || '[]';
  const products = JSON.parse(productsString);
  const paymentMethod = formData.get("payment");
  const firstName = formData.get('firstName') || "null"
  const lastName = formData.get('lastName') || "null"

  const orderData = {
    source_id: 1,
    manager_id: 1,
    buyer_comment: `Звязатись через ${formData.get('contactType')}  \n Оплата: ${paymentMethod}`,
    buyer: {
      full_name: firstName + " " + lastName || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || ''
    },
    shipping: {
      delivery_service_id: formData.get('delivery') === "novaposhta" ? 1 : 2,
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
    },
    marketing: {
      utm_source: formData.get('utm_source') || '',
      utm_medium: formData.get('utm_medium') || '',
      utm_campaign: formData.get('utm_campaign') || '',
      utm_term: formData.get('utm_term') || '',
      utm_content: formData.get('utm_content') || ''
    },
    products: generateProductForKeycrm(products),
  };
  const response = await fetch(`${KEYCRM_URL}/order`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KEYCRM_API_KEY}`,
    },
    body: JSON.stringify(orderData),
  })
  const result: any = await response.json();
  return result
}
export const generageMonoUrl = async (amount: any, products: any, id: string, siteUrl = "https://pick-up-shoes.com.ua",) => {
  try {
    const response = await fetch(MONO_URL, {
      method: "POST",
      headers: {
        "X-Token": MONO_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100,
        ccy: 980,
        redirectUrl: `${siteUrl}/thanks`,
        webHookUrl: `${siteUrl}/checkout-webhook`,
        merchantPaymInfo: {
          reference: id,
          destination: "Подарунок від MISTER GIFTER",
          comment: "Подарунок від MISTER GIFTER",
          basketOrder: getDataFromMonoUser(products),
        },
        paymentType: "debit",
        validity: 3600,
      }),
    });

    if (!response.ok) {
      // Логування статусу помилки
      const errorText = await response.text();
      console.error(`Monobank API error (status: ${response.status}):`, errorText);
      return { error: errorText, pageUrl: "/thanks" };
    }

    const result:any = await response.json();
    return {pageUrl: result.pageUrl , amount, products,id, siteUrl };

  } catch (error) {
    console.error("Ошибка:", error);
    return { error: error.message || "Unknown error", pageUrl: "/thanks", amount, products,id, siteUrl };
  }
}


const getDataFromMonoUser = (products: any) => {
  return products.map(
    (product: any, index: number) => {
      const splitVariant = product.merchandise.id.split('/')
      const variantId = splitVariant[splitVariant.length - 1]
      return {
        name: product?.merchandise?.product?.title || " ",
        qty: product?.quantity || 0,
        sum: +product?.merchandise?.price?.amount * 100,
        icon: product?.merchandise?.image?.url,
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


const KEYCRM_API_KEY = "ZWNmN2RlMzY5MDhjZTEwZGRkN2JkNGYwNTMzNDIwNDZmNzgzODU0MA";
const MONO_TOKEN = "utR_bnF6LUzdc4pr3yFNFF2kKEPk75xeIlItZx9QfaxY";

const MONO_URL = "https://api.monobank.ua/api/merchant/invoice/create"
const KEYCRM_URL = "https://openapi.keycrm.app/v1"