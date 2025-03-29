export function filterAvailablesProductOptions(products: any) {
  products.forEach((product: any) => {
    const optionMap: any = new Map();

    product.options.forEach((option: any) => {
      optionMap.set(option.name, new Set());
    });

    product.variants.nodes.forEach((variant: any) => {
      if (variant.availableForSale) {
        variant.selectedOptions.forEach((selectedOption: any) => {
          const optionValues = optionMap.get(selectedOption.name);
          if (optionValues) {
            optionValues.add(selectedOption.value);
          }
        });
      }
    });

    product.options = product.options.map((option: any) => ({
      name: option.name,
      values: Array.from(optionMap.get(option.name)),
    }));
  });

  return products;
}
