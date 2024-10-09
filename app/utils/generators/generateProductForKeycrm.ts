export const generateProductForKeycrm = (products: any) => {
  return products.map((product: any) => {
      const splitVariant = product.merchandise.id.split('/')
      const variantId = splitVariant[splitVariant.length - 1]
      return {
          "sku": variantId,
          "price": product?.merchandise?.price?.amount || 0,
          "quantity": product?.quantity || 0,
          "unit_type": "шт",
          "name": product?.merchandise?.product?.title || " ",
          "picture": product?.merchandise?.image?.url,
          "properties": product?.merchandise?.selectedOptions
      }
  })
}