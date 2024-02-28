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
import monoLogo from '../assets/images/mono.svg';
import shopLogo from '../assets/images/pickUpLogo.png';

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
  console.log(descriptionHtml);
  return (
    <div className="product lg:px-24 md:px-10 px-[10px] w-full pt-10">
      <div className="sm:grid sm:grid-cols-2 flex flex-col gap-y-5 gap-x-10">
        <ProductGalery media={product.media} />
        {/* <ProductImage image={selectedVariant?.image} /> */}
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
        />
      </div>
      <ProductTabs description={descriptionHtml} />
    </div>
  );
}
function ProductTabs({description}: {description: string}) {
  return (
    <div className="product-info my-6">
      <Tabs defaultValue="product-info">
        <TabsList className="w-full bg-none justify-between bg-[#fff]  rounded-none h-[69px]">
          <TabsTrigger
            value="product-info"
            className="w-full text-[20px] text-black py-[19px] data-[state=active]:rounded-none data-[state=active]:border-b-[2px] data-[state=active]:border-b-black"
          >
            Опис
          </TabsTrigger>
          <TabsTrigger
            value="product-payment"
            className="w-full text-[20px] text-black py-[19px] data-[state=active]:rounded-none data-[state=active]:border-b-[2px] data-[state=active]:border-b-black"
          >
            Оплата і доставка
          </TabsTrigger>
          <TabsTrigger
            value="product-delivery"
            className="w-full text-[20px] text-black py-[19px] data-[state=active]:rounded-none data-[state=active]:border-b-[2px] data-[state=active]:border-b-black"
          >
            Обмін та повернення
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="product-info"
          className="flex items-center mt-[34px]"
        >
          <div>
            <h3 className="text-2xl font-bold mb-6">Опис товару</h3>
            <div
              className="grid grid-cols-2 border border-black/10 rounded-[20px] px-[25px] py-[30px] [&>div]:flex [&>div]:flex-col [&>*:nth-child(even)]:font-medium text-2xl"
              dangerouslySetInnerHTML={{__html: description}}
            />
          </div>
        </TabsContent>
        <TabsContent value="product-payment">
          <div className="p-6 border border-black/10 rounded-[20px] w-full">
            <div className="grid md:grid-cols-[1fr,_minmax(40%,_585px)] gap-x-5">
              <div className="flex flex-col gap-5">
                <div className="bg-[#FAFAFA] rounded-[15px] p-5 text-xl">
                  <span className="font-medium">Оплата</span>
                  <div className="grid grid-cols-[40px,_1fr] gap-x-8 items-center">
                    <img src={monoLogo} alt="MonoPay" />
                    <div>
                      <ul className="list-disc pl-5">
                        <li>Онлайн оплата MonoPay</li>
                        <li> Оплата накладеним платежем</li>
                      </ul>
                      <span>0% комісії при сплаті кредитними коштамиі</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FAFAFA] rounded-[15px] p-5 text-xl">
                  <div className="flex items-center gap-3 font-medium">
                    <span>Доставка Новою Поштою по всій Україні </span>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 15.5L8.46422 10.0358V20.9642L3 15.5ZM30 15.5L24.5358 10.0358V20.9642L30 15.5ZM13.9284 18.0716H19.0716V23.5358H21.9642L16.5 29L11.0358 23.5358H13.9284V18.0716ZM13.9284 12.9284H19.0716V7.46422H21.9642L16.5 2L11.0358 7.46422H13.9284V12.9284Z"
                        fill="#B80000"
                      />
                    </svg>
                  </div>
                  <div className="flex self-start w-fit mt-4 bg-white rounded-[15px] px-[15px] py-[10px] ">
                    Терміни - 1/3 дні
                  </div>
                  <p>
                    *відправка відбувається в день замовлення якщо воно
                    оформлене було до 13:00 якщо пізніше тоді відправимо
                    наступного дня.
                  </p>
                  <br />
                  <p>
                    *якщо вам якнайшвидше необхідно отримати своє
                    <br /> замовлення, після оформлення
                    <span className="font-medium">
                      звʼяжіться з нашими <br /> менеджерами
                    </span>
                    для пришвидшення доставки
                  </p>
                </div>
              </div>
              <div className="bg-[#FAFAFA] rounded-[15px] p-5 text-xl">
                <div>
                  <h4 className=" font-medium">
                    Ціна доставки залежить від вашого замовлення
                  </h4>
                  <br />
                  <ul className="list-disc pl-5">
                    <li>Доставка 1/2 пари кросівок від 130 до 200грн</li>
                    <li>Доставка 1/3 пари кросівок від 200 до 250грн</li>
                  </ul>
                  <br />
                  <div className="bg-white rounded-[15px] py-[10px] px-[15px]">
                    Приклад вирахування вартості доставки:
                  </div>
                  <br />
                  <ul className="list-disc pl-5">
                    <li>
                      <span className="font-medium">Онлайн оплата - </span>
                      <p>
                        Доставка +- 80грн + пакування 0 грн (ми пакуємо самі) +
                        страхування посилки 30/50грн ={' '}
                        <span className="inline-flex text-white px-[10px] py-[5px] rounded-[15px] bg-[#2D2D2D] text-xl">
                          110/130грн
                        </span>
                      </p>
                    </li>
                    <br />
                    <li>
                      <span className="font-semibold">
                        Мінімальна передоплата -{' '}
                      </span>
                      <p>
                        Доставка +- 80 грн + пакування 0 грн (ми пакуємо самі) +
                        страухвання посилки 30/50 грн+ комісія за переказ коштів
                        45/60грн ={' '}
                        <span className="inline-flex text-white px-[10px] py-[5px] rounded-[15px] bg-[#2D2D2D] text-xl">
                          145/190грн
                        </span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-[40%,_60%] grid-cols-1 gap-y-5 mt-5 gap-x-5">
              <div className="bg-[#FAFAFA] rounded-[15px] p-5 text-xl">
                <div className="flex gap-[34px] w-full justify-between">
                  <p>
                    <span className="font-medium">
                      Доставка в іншу країну - <br />
                    </span>
                    По домовленості{' '}
                    <span className="font-medium">(звʼязатись з нами)</span>
                  </p>
                  <svg
                    width="83"
                    height="83"
                    viewBox="0 0 83 83"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.3">
                      <path
                        d="M67.1764 15.8446C63.8106 12.4454 59.8062 9.74477 55.3935 7.89784C50.9808 6.05091 46.2466 5.09407 41.4629 5.08229C36.6793 5.07052 31.9404 6.00404 27.5186 7.82923C23.0969 9.65442 19.0793 12.3353 15.6967 15.7179C12.3142 19.1004 9.63327 23.118 7.80808 27.5398C5.98289 31.9616 5.04937 36.7004 5.06115 41.4841C5.07292 46.2677 6.02976 51.0019 7.87669 55.4146C9.72363 59.8274 12.4243 63.8317 15.8234 67.1976C19.1893 70.5968 23.1936 73.2974 27.6064 75.1443C32.0191 76.9912 36.7533 77.9481 41.5369 77.9599C46.3206 77.9716 51.0594 77.0381 55.4812 75.2129C59.903 73.3877 63.9206 70.7068 67.3031 67.3243C70.6857 63.9417 73.3666 59.9241 75.1918 55.5024C77.017 51.0806 77.9505 46.3417 77.9387 41.5581C77.9269 36.7744 76.9701 32.0403 75.1232 27.6275C73.2762 23.2148 70.5756 19.2104 67.1764 15.8446ZM10.3749 41.5211C10.3738 38.7664 10.739 36.0237 11.4611 33.3654C12.6509 35.9267 14.379 38.1395 15.5543 40.7673C17.0733 44.1456 21.152 43.2086 22.953 46.1688C24.5514 48.7965 22.8444 52.1198 24.0407 54.8692C24.9097 56.8647 26.9587 57.3008 28.3723 58.7598C29.8167 60.2317 29.7859 62.2484 30.0064 64.1678C30.2552 66.4229 30.6587 68.6582 31.2141 70.858C31.2141 70.8742 31.2141 70.8921 31.2271 70.9083C19.0964 66.648 10.3749 55.0848 10.3749 41.5211ZM41.4999 72.6461C39.7617 72.6455 38.0265 72.5002 36.3124 72.2116C36.3303 71.7723 36.3384 71.3622 36.3821 71.0769C36.7761 68.4993 38.0665 65.9785 39.8075 64.0494C41.5275 62.1463 43.8846 60.8591 45.3371 58.6998C46.7604 56.5924 47.1867 53.7555 46.5999 51.293C45.7358 47.6553 40.7931 46.4411 38.1281 44.4682C36.5961 43.3335 35.2328 41.5794 33.221 41.4368C32.2937 41.3719 31.5172 41.5713 30.5981 41.3346C29.7551 41.1158 29.0937 40.6619 28.1956 40.7802C26.5178 41.0007 25.4592 42.7936 23.6565 42.5505C21.9463 42.3219 20.1842 40.3198 19.7951 38.6906C19.2958 36.5962 20.9526 35.917 22.7277 35.7305C23.4685 35.6527 24.3001 35.5684 25.0118 35.8408C25.9488 36.1877 26.3913 37.1052 27.2327 37.5689C28.81 38.4345 29.1294 37.0517 28.8878 35.6511C28.5263 33.5534 28.1048 32.6991 29.9756 31.2547C31.2724 30.2593 32.3813 29.5396 32.1738 27.7515C32.0506 26.701 31.4751 26.2261 32.0117 25.1805C32.4186 24.3845 33.5355 23.6664 34.2634 23.1914C36.1422 21.9658 42.3121 22.0566 39.7913 18.6264C39.0505 17.6197 37.6839 15.8203 36.387 15.5739C34.7659 15.2675 34.0461 17.0766 32.9162 17.8742C31.7491 18.6993 29.4763 19.6363 28.3075 18.3605C26.735 16.6438 29.3498 16.0813 29.9286 14.8816C30.196 14.3224 29.9286 13.5459 29.4779 12.8147C30.0626 12.5683 30.657 12.3398 31.2611 12.129C31.6397 12.4087 32.0888 12.5771 32.558 12.6154C33.6425 12.6867 34.6654 12.0998 35.6121 12.8391C36.6626 13.6496 37.4196 14.6741 38.8138 14.927C40.1625 15.1718 41.5907 14.3856 41.9247 13.0044C42.1273 12.1647 41.9247 11.278 41.7301 10.4107C47.793 10.4456 53.7121 12.2613 58.7516 15.6322C58.4274 15.509 58.0399 15.5236 57.5617 15.7457C56.5777 16.2028 55.1836 17.3668 55.0685 18.521C54.9372 19.8308 56.8695 20.0156 57.7871 20.0156C59.165 20.0156 60.5607 19.3996 60.1166 17.8077C59.9237 17.1171 59.661 16.399 59.2379 15.9645C60.255 16.6703 61.2294 17.4357 62.1559 18.2568C62.1413 18.2714 62.1267 18.2843 62.1121 18.3005C61.1784 19.2732 60.0939 20.0432 59.4552 21.2266C59.0045 22.0598 58.4971 22.4554 57.5844 22.671C57.0819 22.7893 56.508 22.8331 56.0865 23.1703C54.9129 24.0943 55.5807 26.3152 56.6928 26.9815C58.0983 27.8228 60.183 27.4273 61.2432 26.2261C62.0716 25.2858 62.5596 23.6534 64.0493 23.655C64.7052 23.6536 65.3353 23.9104 65.8034 24.3699C66.4194 25.0086 66.2978 25.6052 66.4291 26.4028C66.6609 27.8196 67.9108 27.0512 68.6711 26.3363C69.2253 27.3226 69.7253 28.3384 70.169 29.3791C69.3325 30.5836 68.6678 31.8966 66.6561 30.4928C65.4516 29.6514 64.7108 28.4307 63.1983 28.0514C61.8771 27.7272 60.5235 28.0644 59.2185 28.2897C57.7352 28.5475 55.9763 28.6609 54.8513 29.7844C53.7635 30.8672 53.188 32.3165 52.0306 33.4043C49.7918 35.5117 48.8467 37.812 50.296 40.7916C51.6901 43.6561 54.6065 45.2107 57.753 45.0064C60.8444 44.8005 64.0558 43.0076 63.9667 47.4997C63.9342 49.09 64.2666 50.1907 64.7545 51.6675C65.2068 53.0292 65.176 54.3488 65.2798 55.7543C65.3784 57.4001 65.6357 59.0326 66.0482 60.6289C63.1425 64.37 59.4202 67.3976 55.1657 69.4803C50.9112 71.563 46.2369 72.6459 41.4999 72.6461Z"
                        fill="#010101"
                      />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="bg-[#FAFAFA] rounded-[15px] p-5 text-xl">
                <div className="flex gap-[34px] w-full justify-between">
                  <p>
                    <span className="font-medium">Самовивіз -</span>
                    <br />
                    Ви залюбки моежет оплатити і забрати своє замовлення в
                    нашому магазині в м.Коломия
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
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
    <div className="lg:grid lg:grid-cols-[minmax(70px,_152px)_1fr] flex flex-col-reverse gap-y-5 gap-x-[14px]">
      <Carousel
        setApi={setThumbApi}
        opts={{containScroll: 'keepSnaps', dragFree: true}}
        orientation="vertical"
      >
        <CarouselContent className="gap-y-[14px] mt-0 max-w-[152px]">
          {media.nodes.map((item, index) => (
            <CarouselItem
              key={item.id}
              className={cn(
                'max-w-[152px] rounded-[20px] pt-0',
                index === selectedIndex && 'border border-black',
              )}
              onClick={() => handleThumbClick(index)}
            >
              <MediaFile
                mediaOptions={{
                  image: {
                    aspectRatio: '1/1',
                    crop: 'center',
                  },
                }}
                data={item}
                className=" basis-1/2 rounded-[20px]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Carousel setApi={setApi} opts={{loop: true, skipSnaps: false}}>
        <CarouselContent>
          {media.nodes.map((item, index) => (
            <CarouselItem key={item.id}>
              <MediaFile
                mediaOptions={{
                  image: {
                    aspectRatio: '1/1',
                    crop: 'center',
                  },
                }}
                data={item}
                className="rounded-[20px]"
              />
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
      <h1 className="font-bold lg:text-[40px] md:text-3xl text-2xl">{title}</h1>
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
          errorElement="ВиникВиникла помилка при завантажені варіантів товаруі"
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
      <div className="product-options-grid flex flex-wrap gap-[10px] items-start">
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
    <div>
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
    quantityAvailable
    currentlyNotInStock
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
