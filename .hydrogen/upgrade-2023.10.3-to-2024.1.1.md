# Hydrogen upgrade guide: 2023.10.3 to 2024.1.1

----

## Features

### Update the GraphQL config in .graphqlrc.yml to use the more modern projects structure: [#1577](https://github.com/Shopify/hydrogen/pull/1577)

#### Step: 1. This allows you to add additional projects to the GraphQL config, such as third party CMS schemas. [#1577](https://github.com/Shopify/hydrogen/pull/1577)

[#1577](https://github.com/Shopify/hydrogen/pull/1577)
```diff
-schema: node_modules/@shopify/hydrogen/storefront.schema.json
+projects:
+ default:
+    schema: 'node_modules/@shopify/hydrogen/storefront.schema.json
```

#### Step: 2. Also, you can modify the document paths used for the Storefront API queries. This is useful if you have a large codebase and want to exclude certain files from being used for codegen or other GraphQL utilities: [#1577](https://github.com/Shopify/hydrogen/pull/1577)

[#1577](https://github.com/Shopify/hydrogen/pull/1577)
 ```yaml
    projects:
      default:
        schema: 'node_modules/@shopify/hydrogen/storefront.schema.json'
        documents:
          - '!*.d.ts'
          - '*.{ts,tsx,js,jsx}'
          - 'app/**/*.{ts,tsx,js,jsx}'
    ```

### Use new `variantBySelectedOptions` parameters introduced in Storefront API v2024-01 to fix redirection to the product's default variant when there are unknown query params in the URL. [#1642](https://github.com/Shopify/hydrogen/pull/1642)

#### Update the `product` query to include the `variantBySelectedOptions` parameters `ignoreUnknownOptions` and `caseInsensitiveMatch`
[#1642](https://github.com/Shopify/hydrogen/pull/1642)
```diff
-   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
+   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
```

### Better Hydrogen error handling [#1645](https://github.com/Shopify/hydrogen/pull/1645)

#### Changed the shape of the error objects returned by createCartHandler. Previously, mutations could return an errors array that contained a userErrors array. With this change, these arrays are no longer nested. The response can contain both an errors array and a userErrors array. errors contains GraphQL execution errors. userErrors contains errors caused by the cart mutation itself (such as adding a product that has zero inventory). storefront.isApiError is deprecated.
[#1645](https://github.com/Shopify/hydrogen/pull/1645)
```diff
- const data = await context.storefront.query(EXAMPLE_QUERY)
+ const {data, errors, userErrors} = await context.storefront.query(EXAMPLE_QUERY) 
```

```diff
- const cart = await context.cart.get()
+ const {cart, errors, userErrors} = await context.cart.get()
```

### Add deploy command to Hydrogen CLI [#1628](https://github.com/Shopify/hydrogen/pull/1628)

#### Use the new `h2 deploy` command to deploy your app
[#1628](https://github.com/Shopify/hydrogen/pull/1628)
```bash
npx shopify hydrogen deploy --help
```

### Add `--template` flag to enable scaffolding projects based on examples from the Hydrogen repo [#1608](https://github.com/Shopify/hydrogen/pull/1608)

#### Use the new `--template` flag to scaffold your app
[#1608](https://github.com/Shopify/hydrogen/pull/1608)
```bash
npm create @shopify/hydrogen@latest -- --template multipass
```

### Make the worker runtime the default environment for the local dev and preview. [#1625](https://github.com/Shopify/hydrogen/pull/1625)

#### To access the legacy Node.js runtime, pass the --legacy-runtime flag. The legacy runtime will be deprecated and removed in a future release.
[#1625](https://github.com/Shopify/hydrogen/pull/1625)
```diff
"scripts": {
-   "dev": "shopify hydrogen dev --codegen",
+   "dev": "shopify hydrogen dev --codegen --legacy-runtime",
-    "preview": "npm run build && shopify hydrogen preview",
+    "preview": "npm run build && shopify hydrogen preview --legacy-runtime",
}
```

### Make default HydrogenSession type extensible [#1590](https://github.com/Shopify/hydrogen/pull/1590)

#### New HydrogenSession type
[#1590](https://github.com/Shopify/hydrogen/pull/1590)
```diff
import {
+ type HydrogenSession,
} from '@shopify/hydrogen';

- class HydrogenSession {
+ class AppSession implements HydrogenSession {
    ...
}
```

----

----

## Fixes

### Use new `variantBySelectedOptions` parameters introduced in Storefront API v2024-01 to fix redirection to the product's default variant when there are unknown query params in the URL. [#1642](https://github.com/Shopify/hydrogen/pull/1642)

#### Update the `product` query to include the `variantBySelectedOptions` parameters `ignoreUnknownOptions` and `caseInsensitiveMatch`
[#1642](https://github.com/Shopify/hydrogen/pull/1642)
```diff
-   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
+   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
```
