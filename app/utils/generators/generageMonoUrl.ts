export const generageMonoUrl = async (
  amount: any,
  products: any,
  id: string,
  siteUrl = 'https://pick-up-shoes.com.ua',
) => {
  const MONO_TOKEN = 'mcj6m0Oy6AyAVLqfvAHk3jA';
  const MONO_URL = 'https://api.monobank.ua/api/merchant/invoice/create';
  try {
    const response = await fetch(MONO_URL, {
      method: 'POST',
      headers: {
        'X-Token': MONO_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100,
        ccy: 980,
        redirectUrl: `${siteUrl}/thanks`,
        webHookUrl: `${siteUrl}/checkout-webhook`,
        merchantPaymInfo: {
          reference: id,
          destination: `Оплата замовлення: ${id}`,
          comment: `Оплата замовлення: ${id}`,
          basketOrder: getDataFromMonoUser(products),
        },
        paymentType: 'debit',
        validity: 3600,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Monobank API error (status: ${response.status}):`,
        errorText,
      );
      return { error: errorText, jsonText: response.json(), pageUrl: '/thanks' };
    }

    const result: any = await response.json();
    return { pageUrl: result.pageUrl, amount, products, id, siteUrl };
  } catch (error: any) {
    console.error('Ошибка:', error);
    return {
      error: error.message || 'Unknown error',
      pageUrl: '/thanks',
      amount,
      products,
      id,
      siteUrl,
    };
  }
};

const getDataFromMonoUser = (products: any) => {
  return products?.map((product: any, index: number) => {
    const splitVariant = product.merchandise.id.split('/');
    const variantId = splitVariant[splitVariant.length - 1];
    return {
      name: product?.merchandise?.product?.title || ' ',
      qty: product?.quantity || 0,
      sum: +product?.merchandise?.price?.amount * 100,
      icon: product?.merchandise?.image?.url,
      unit: 'шт.',
      barcode: variantId,
      header: 'header',
      code: variantId,
      footer: 'footer',
      tax: [0],
      uktzed: 'uktzedcode',
    };
  });
};
