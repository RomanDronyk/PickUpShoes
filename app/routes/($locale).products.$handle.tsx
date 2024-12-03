import {
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import { ActionFunction, defer, json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { viewedProductsCookie } from '~/cookies.server';
import { loadCriticalData, loadDeferredData } from '~/module/ProductTop';
import fetchProductReviewsEasy from '~/module/Reviews/api/fetchProductReviewsEasy';
import { Storefront } from '@shopify/hydrogen';
import sendReview from '~/module/Reviews/api/sendReview';
import sendReviewImages from '~/module/Reviews/api/sendReviewImages';
import { transformReviewsData } from '~/module/Reviews';
import ProductPageScreen from '~/screens/ProductPageScreen';

export const meta: MetaFunction<typeof loader> = ({ data }: any) => {
  return [
    {
      title: `PickUpShoes | ${data?.product?.title ?? ''}`,
      'Content-Security-Policy': "default-src 'self' https://cdn.shopify.com https://shopify.com http://localhost:*; img-src 'self' https://imagedelivery.net https://cdn.shopify.com https://shopify.com data: blob:; style-src 'self' 'unsafe-inline'; media-src *; script-src 'self' 'unsafe-eval';",
    },
  ];
};

export const handle = {
  breadcrumb: 'product',
};

const getUserData = async (storefront: Storefront, customerAccessToken: string) => {
  if (customerAccessToken === "" || typeof (customerAccessToken) !== "string" || customerAccessToken.length == 0) {
    throw new Error(`Введіть коректний customerAccessToken`);
  }
  return await storefront.query(CUSTOMER_DATA_BY_ACCESS_TOKEN_QUERY, {
    variables: {
      customerAccessToken: customerAccessToken
    }
  },
  );
}

export const action: ActionFunction = async ({ context, request, params }) => {
  const errors: any = {};
  const formData = await request.formData();
  const content = String(formData.get("content"))
  const objects = Object.fromEntries(formData)
  const customerAccessToken = context.session.get('customerAccessToken');
  ["Комфорт", "Якість", "Дизайн"].forEach((element) => {
    if (!formData.get(element)) {
      errors.stars = errors.stars || [];
      errors.stars.push(element);
    }
  })
  if (content.length < 5) {
    errors.content =
      "Відгук має бути не менше 5 букв";
  } else if (!content) {
    errors.content =
      "Вкажіть текст";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  const getUser = await getUserData(context.storefront, customerAccessToken?.accessToken || "")
  try {
    const result: any = await sendReview(objects, getUser, params?.handle || '');
    if (result.status === "success") {
      const mediaFiles = formData.getAll("media_files")
      if (mediaFiles && mediaFiles.length > 0 && mediaFiles[0] instanceof File) {
        const imageData = new FormData()
        mediaFiles.forEach((file, index) => {
          if (file instanceof File) {
            imageData.append("media_files[]", file)
          }

        })
        await sendReviewImages(`${result?.review_id}` || "", imageData)
      }
    }
    return json({ message: "success" });
  } catch (error) {
    console.error(error);
    return json({ error: 'Помилка при створенні відгуку' }, { status: 500 });
  }
};



export async function loader(args: LoaderFunctionArgs) {
  const { context } = args;
  const { session } = context
  const customerAccessToken = session.get('customerAccessToken');
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const { cookie, product } = criticalData;

  const getProductId = product.id.split("/");
  const getReviews = await fetchProductReviewsEasy(getProductId[getProductId.length - 1])
  console.log(JSON.stringify(getReviews, null, 2))
  const reviews = transformReviewsData(getReviews) || []
  const newReviews = getReviews.reviews
  const reviewDataForPaginations = {
    nodes: reviews,
    pageInfo: {
      endCursor: newReviews.prev_page_url,
      hasPreviousPage: Boolean(newReviews?.prev_page_url),
      hasNextPage: Boolean(newReviews?.next_page_url),
      startCursor: newReviews.next_page_url
    }
  }
  return defer(
    {
      customerAccessToken: customerAccessToken || { accessToken: null },
      reviews: reviews,
      reviewsReal: reviewDataForPaginations,
      ...deferredData,
      ...criticalData,
    },
    {
      headers: {
        'Set-Cookie': await viewedProductsCookie.serialize(cookie),
      },
    },
  );
}


export default function Product() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <ProductPageScreen
      loaderData={loaderData}
    />
  );
}

export const QUERY_RELATED_PRODUCT_BY_ID = `#graphql 
query getProductById($id: ID!) {
  product(id: $id) {
    title
    createdAt
    id
    handle
    availableForSale
    variants(first: 100) {
      edges {
        node {
          id
          title
          priceV2 {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          availableForSale
        }
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
}
`
export const CUSTOMER_DATA_BY_ACCESS_TOKEN_QUERY = `#graphql
query customerGetId (
  $customerAccessToken: String!
) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    firstName
    lastName
    email
  }
}`;

