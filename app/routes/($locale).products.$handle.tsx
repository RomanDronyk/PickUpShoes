import {
  Await,
  Link,
  useLoaderData,
  type FetcherWithComponents,
  type MetaFunction,
} from '@remix-run/react';
import {MediaFile} from '@shopify/hydrogen';
import type {
  CartLineInput,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense, useState, useCallback, useEffect} from 'react';
import type {
  ProductFragment,
  ProductVariantFragment,
  ProductVariantsQuery,
} from 'storefrontapi.generated';

import {
  CartForm,
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  type VariantOption,
} from '@shopify/hydrogen';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '~/components/ui/tabs';
import {cn} from '~/lib/utils';
import {getVariantUrl} from '~/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '~/components/ui/carousel';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

export const handle = {
  breadcrumbType: 'product',
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);

  // Get the accept-language header
  const acceptLang = request.headers.get('accept-language');
  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }
  const locale = context.storefront.i18n;
  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, variants});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants} = useLoaderData<typeof loader>();
  const {selectedVariant, descriptionHtml} = product;
  return (
    <div className="product px-24 w-full pt-10">
      <div className="grid grid-cols-2 gap-x-10">
        <ProductGalery media={product.media} />
        {/* <ProductImage image={selectedVariant?.image} /> */}
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
        />
      </div>
      <div className="product-info mt-[25px]">
        <Tabs defaultValue="product-payment">
          <TabsList className="w-full bg-none justify-between bg-[#fff] border-b border-b-black/60 rounded-none h-[69px]">
            <TabsTrigger
              value="product-info"
              className="text-[20px] text-black py-[20px] data-[state=active]:border data-[state=active]:border-b data-[state=active]:border-b-black"
            >
              Опис
            </TabsTrigger>
            <TabsTrigger
              value="product-payment"
              className="text-[20px] text-black py-[20px]"
            >
              Оплата і доставка
            </TabsTrigger>
            <TabsTrigger
              value="product-delivery"
              className="text-[20px] text-black py-[20px]"
            >
              Обмін та повернення
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="product-info"
            className="flex items-center justify-center"
          >
            <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image rounded-[20px]">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        className="rounded-[20px] max-h-[830px]"
      />
    </div>
  );
}

function ProductGalery({media}: {media: ProductFragment['media']}) {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(0);
  const [api, setApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();

  const handleThumbClick = useCallback(
    (index: number) => {
      if (!api) return;
      api?.scrollTo(index);
    },
    [api],
  );

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    thumbApi?.scrollTo(api.selectedScrollSnap());
  }, [api, thumbApi, setSelectedIndex]);

  useEffect(() => {
    onSelect();
    if (!api) return;
    api.on('select', onSelect);
  }, [api, onSelect]);

  return (
    <div className="grid grid-cols-[minmax(100px,_152px)_1fr] gap-x-[14px]">
      <Carousel
        setApi={setThumbApi}
        opts={{containScroll: 'keepSnaps', dragFree: true}}
        orientation="vertical"
      >
        <CarouselContent className="gap-y-[14px] mt-0max-w-[152px]">
          {media.nodes.map((item, index) => (
            <CarouselItem
              key={item.id}
              className={cn(
                'max-w-[152px] roundced-[20px] pt-0',
                index === selectedIndex && 'border border-black',
              )}
              onClick={() => handleThumbClick(index)}
            >
              <MediaFile data={item} className=" basis-1/2 rounded-[20px]" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Carousel setApi={setApi} opts={{loop: true, skipSnaps: false}}>
        <CarouselContent>
          {media.nodes.map((item, index) => (
            <CarouselItem key={item.id}>
              <MediaFile data={item} className="rounded-[20px]" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="product-main">
      <h1 className="font-bold text-[40px]">{title}</h1>
      <div className="flex items-center gap-x-[16px] mb-[30px]">
        <span className="font-semibold text-[20px] text-black/50">
          {product.selectedVariant?.sku}
        </span>
        <span className="text-white text-[16px] flex items-center jusity-center px-[14px] py-[5px] bg-black rounded-3xl self-start">
          {product.vendor}
        </span>
      </div>
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  const percentageAmount = selectedVariant?.compareAtPrice
    ? (
        (1 -
          parseInt(selectedVariant.price.amount) /
            parseInt(selectedVariant.compareAtPrice.amount)) *
        100
      ).toFixed()
    : null;
  return (
    <div className="product-price price flex gap-x-[10px] md:font-medium md:text-2xl text-lg">
      <div className="price flex gap-x-[10px] md:font-medium md:text-[32px] text-lg">
        <span className="font-extrabold text-[32px]">
          {selectedVariant?.price.amount} грн
        </span>
        {selectedVariant?.compareAtPrice && (
          <>
            <span className="line-through text-[#B3B3B3]">
              {selectedVariant?.compareAtPrice.amount}
            </span>
            <span className="flex self-center py-1 items-center justify-center rounded-xl px-3 bg-darkRed/10 font-medium text-[16px] text-destructive">
              {percentageAmount}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale
          ? 'Додати в корзину'
          : 'Немає в наявності'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <h5 className="text-[16px] text-black/60 mb-4">{option.name}</h5>
      <div className="product-options-grid flex gap-[10px] items-start">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              className={cn(
                'text-black text-[16px] px-[18px] py-[15px] rounded-[22px] flex self-start bg-[#F0F0F0]',
                isActive && 'text-white bg-black',
              )}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
}) {
  return (
    <div className="border-t border-t-black/50">
      <CartForm
        route="/cart"
        inputs={{lines}}
        action={CartForm.ACTIONS.LinesAdd}
      >
        {(fetcher: FetcherWithComponents<any>) => (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? fetcher.state !== 'idle'}
              className="bg-black text-white font-medium text-[18px] w-full rounded-[62px] py-[15px]"
            >
              {children}
            </button>
          </>
        )}
      </CartForm>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    media(first: 10) {
      nodes {
        ... on MediaImage {
          __typename
          id
          previewImage {
            url
            id
            height
            width
          }
          image {
            url
          }
        }
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
