import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  type MetaFunction,
} from '@remix-run/react';
import { CustomerAccessToken } from '@shopify/hydrogen-react/storefront-api-types';
import { ActionFunction, defer, json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { FC, useCallback, useState } from 'react';
import RecommendationProducts from '~/components/RecommendationProducts';
import ViewedProducts from '~/components/ViewedProducts';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Radio, RadioItem } from '~/components/ui/radio';
import { viewedProductsCookie } from '~/cookies.server';
import { ProductPageTopView, loadCriticalData, loadDeferredData } from '~/module/ProductPageTopView';
import fetchProductReviewsEasy from '~/module/Reviews/api/fetchProductReviewsEasy';
import formatDateFromMilliseconds from '~/module/Reviews/helpers/formatDateFromMilliseconds';
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Storefront } from '@shopify/hydrogen';
import sendReview from '~/module/Reviews/api/sendReview';
import sendReviewImages from '~/module/Reviews/api/sendReviewImages';

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

export const action: ActionFunction = async ({ context, request, params }) => {
  const errors: any = {
  };
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

  console.log(JSON.stringify(errors, null, 2), "errrors")
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  const getUser = await getUserData(context.storefront, customerAccessToken?.accessToken || "")

  try {
    // Виклик функції для відправки відгуку
    const result: any = await sendReview(objects, getUser, params?.handle || '');
    if (result.status === "success") {
      const mediaFiles = formData.getAll("media_files")
      if (mediaFiles && mediaFiles.length > 0 && mediaFiles[0] instanceof File) {
        const imageData = new FormData()
        mediaFiles.forEach((file, index) => {
          if (file instanceof File) {
            imageData.append("media_files", file)
          }

        })
        const sendImages = await sendReviewImages(`${result?.review_id}` || "", formData)
      }
    }
    return json({ message: "success" });
  } catch (error) {
    console.error(error);
    return json({ error: 'Помилка при створенні відгуку' }, { status: 500 });
  }
};

function transformReviewsData(data: any): IReviewsList {
  return data?.reviews?.data.map((review: any) => ({
    rating_percentage: review.rating_percentage,
    reviewer_name: review.reviewer.name,
    review_ratings: review.review_ratings.map((rating: any) => ({
      reviews_id: String(rating.reviews_id),
      rating_title: rating.rating_title,
      rating_value: String(rating.rating_value),
    })),
    content: review.review_content,
    review_medias: review.review_medias.map((media: any) => ({
      media_path: media.media_path,
    })),
    reviewed_at: new Date(review.created_dt).getTime(),
  }))
}

const getProductReviews = async (id: string) => {
  const easyReviews = await fetchProductReviewsEasy(id)
  return { easyReviews }
}
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

export async function loader(args: LoaderFunctionArgs) {

  const customerAccessToken = args.context.session.get('customerAccessToken');

  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const getProductId = criticalData.product.id.split("/");
  const getReviews = await getProductReviews(getProductId[getProductId.length - 1])

  const reviews = transformReviewsData(getReviews.easyReviews)

  const { cookie } = criticalData;
  return defer(
    {
      customerAccessToken: customerAccessToken || { accessToken: null },
      reviews: reviews,
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
  const { product, customerAccessToken, variants, viewedProducts, handle, recommendations, relatedProducts, reviews }: any = useLoaderData<typeof loader>();


  return (
    <div className="pt-[16px] product lg:px-24 md:px-10 px-[10px] w-full ">
      <ProductPageTopView handle={handle}
        variants={variants}
        relatedProducts={relatedProducts}
        product={product}
        customerAccessToken={customerAccessToken}
        reviews={reviews}
      />
      <Form onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData();
        const fileInput = e.currentTarget.elements.media_files.files
        console.log(fileInput)
        for (let i = 0; i < fileInput.length; i++) {
          formData.append('media_files', fileInput[i]);
        }
        await sendReviewImages('170444', formData)

      }}>
        <input type="file" multiple name='media_files' />
        <Button type='submit' ></Button>
      </Form>
      <div className="flex flex-col my-4 pt-[50px] border-t border-r-black/10 mt-[50px]">
        <ViewedProducts products={viewedProducts} />
        <RecommendationProducts recommended={recommendations} />
      </div>
    </div>
  );
}
interface IReviewsModal {
  customerAccessToken: CustomerAccessToken,
}
export const ReviewsModal: FC<IReviewsModal> = ({ customerAccessToken }) => {
  const actionData = useActionData<typeof action>();

  return (
    <Dialog >
      <DialogTrigger className='overflow-hidden' asChild>
        <Button
          type="submit"
          variant="outline"
          className="max-w-[166px] h-[50px] bg-black text-white font-medium text-[18px] px-[23px] w-full rounded-[62px] py-[15px] cursor-pointer"
        >
          Написати відгук
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:rounded-[30px] rounded-[30px] overflow-y-scroll overflow-x-scroll xl:overflow-visible max-h-[90vh]">
        {actionData?.message == "success" ?
          <ReviewThanks /> :
          <>
            {customerAccessToken?.accessToken &&
              <ReviewInputs />
            }
            {!customerAccessToken?.accessToken &&
              <ReviewLogin />
            }
          </>
        }


      </DialogContent>
    </Dialog>
  )
}

export const ReviewInputs = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const review_contents = ["Комфорт", "Якість", "Дизайн"];

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const onRemoveFile = (fileToRemove: FileWithPath) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const imageMimeTypes = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
    "image/bmp": [".bmp"],
    "image/tiff": [".tiff"],
    "image/svg+xml": [".svg"],
    "image/heic": [".heic"] // Додав підтримку HEIC
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: imageMimeTypes,
    maxSize: 5 * 1024 * 1024, // Максимальний розмір 5MB
  });

  return (
    <Form method="post" className="block" encType="multipart/form-data">
      <DialogHeader className="block overflow-hidden flex items-center justify-start ">
        <DialogTitle className='font-bold text-[26px] text-left'>Написати відгук</DialogTitle>
      </DialogHeader>
      <div className="size-grid">
        <div className="w-full flex items-center justify-between mt-10">
          <div className="grid gap-[15px] w-full">
            {review_contents.map((name, index) => {
              return (
                <div key={name + index} className="flex justify-between gap-[25px] ">
                  <Button
                    className="bg-black text-white font-medium rounded-[30px] text-[15px] px-[15px] py-[7px] cursor-pointer"
                    type="button"
                    variant="outline"
                  >
                    {name}
                  </Button>
                  <Radio name={name} className="w-full flex overflow-hidden justify-between bg-gray-100 rounded-full" defaultValue="10">
                    {Array.from({ length: 5 }, (_, i) => (
                      <RadioItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </RadioItem>
                    ))}
                  </Radio>
                </div>
              );
            })}
          </div>
        </div>
        {actionData?.errors?.stars ? (
          <em className='text-red'>Ви не вибрали {
            actionData?.errors?.stars.map((error) => {
              return error + ". "
            })
          }
          </em>
        ) : null}
        <div className="grid gap-[8px]">
          <div className="mt-4">
            {files.length !== 0 && (
              <>
                <h4 className="text-[18px] font-medium mb-[8px]">Прикріплені файли:</h4>
                <div className="flex gap-4 flex-wrap">
                  {files.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`uploaded-image-${index}`}
                        className="w-[100px] h-[100px] object-cover rounded-[10px]"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveFile(file)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-[5px] text-xs"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div
            {...getRootProps()}
            className="dropzone w-full p-6 border-dashed border-2 border-gray-300 bg-gray-100 rounded-lg"
          >
            <input type="file" name='media_files' {...getInputProps()} />
            <p className="text-center text-gray-600">
              {isDragActive ? "Перетягніть файли сюди..." : "Перетягніть або виберіть файли для завантаження"}
            </p>
          </div>
        </div>
        <h3 className="text-[24px] font-medium mb-[10px] mt-[40px]">Залиш коментар</h3>
        <textarea name='content' placeholder='Коментар... ' className="w-full rounded-[25px] bg-[#f0f0f0] ring-offset-background p-[18px] min-h-[128px] placeholder:text-placeholder  disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none placeholder:opacity-50" />
        {actionData?.errors?.content ? (
          <em className='text-red'>{actionData?.errors?.content}</em>
        ) : null}
        <Button variant={"outline"} className='text-white text-[20px] w-full bg-[#01AB31] rounded-[30px] '>Опублікувати відгук
          <svg className='ml-[15px]' width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12C0 14.2745 0.674463 16.4979 1.9381 18.3891C3.20174 20.2802 4.99779 21.7542 7.09914 22.6246C9.20049 23.495 11.5128 23.7228 13.7435 23.279C15.9743 22.8353 18.0234 21.74 19.6317 20.1317C21.24 18.5234 22.3353 16.4743 22.779 14.2435C23.2228 12.0128 22.995 9.70049 22.1246 7.59914C21.2542 5.49779 19.7802 3.70174 17.8891 2.4381C15.9979 1.17446 13.7745 0.5 11.5 0.5C8.45001 0.5 5.52494 1.7116 3.36827 3.86827C1.2116 6.02494 0 8.95001 0 12ZM4.92857 11.1786H14.9089L10.3254 6.57282L11.5 5.42857L18.0714 12L11.5 18.5714L10.3254 17.3992L14.9089 12.8214H4.92857V11.1786Z"
              fill="currentColor"
            />
          </svg>
        </Button>

      </div>
    </Form>

  );
};

export const ReviewThanks = () => {
  return (
    <div style={{ display: "block" }}>
      <DialogHeader className="block overflow-hidden flex items-center justify-center ">
        <DialogTitle className='font-bold text-[26px] text-center'>Дякуємо!</DialogTitle>
      </DialogHeader>
      <div className="size-grid">
        <h5>Ваші відгуки допомагають ставати нам кращими</h5>
      </div>
    </div>
  )
}
export const ReviewLogin = () => {
  return (
    <div style={{ display: "block" }}>
      <DialogHeader className="block overflow-hidden flex items-center justify-center ">
        <DialogTitle className='font-bold text-[26px] text-center'>Для початку вам потрібно зареєструватись!</DialogTitle>
      </DialogHeader>
      <div className="size-grid">
        <div className="w-full flex items-center justify-end mt-10">
          <Link to="/account/login"
            className="flex items-center justify-center whitespace-nowrap rounded-[15px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-[50px] bg-black text-white font-medium text-[18px] px-[23px] w-full rounded-[62px] py-[15px] cursor-pointer group "
          >
            В особистий кабінет
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:text-black"
            >
              <path
                d="M24 27V24.3333C24 22.9188 23.5224 21.5623 22.6722 20.5621C21.8221 19.5619 20.669 19 19.4667 19H11.5333C10.331 19 9.17795 19.5619 8.32778 20.5621C7.47762 21.5623 7 22.9188 7 24.3333V27"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.5 14C17.9853 14 20 11.9853 20 9.5C20 7.01472 17.9853 5 15.5 5C13.0147 5 11 7.01472 11 9.5C11 11.9853 13.0147 14 15.5 14Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}



interface IReviewMedias {
  media_path: string,
}
interface IReviewRatings {
  reviews_id: string,
  rating_title: string,
  rating_value: string,
}
interface IReview {
  rating_percentage: number,
  reviewer_name: string,
  review_ratings: IReviewRatings[],
  content: string
  review_medias: IReviewMedias[]
  reviewed_at: number
}
interface IReviewsList {
  reviews: IReview[],
}

export const ReviewsList: FC<IReviewsList> = ({ reviews }) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((review: any) => {
          return (
            <div key={review.reviewed_at} className="border py-[28px] px-[32px] rounded-[20px] shadow-lg">
              <div className="mb-[25px]">
                <div style={{ unicodeBidi: "bidi-override" }} className="text-[#cccccc60] text-3xl h-[30px] w-auto relative leading-none inline-block before:content-['★★★★★']">
                  <span style={{ width: `${review.rating_percentage}%` }} className='inline-block absolute overflow-hidden w-0 left-0 top-0 before:text-[color:#ffaa00] before:content-["★★★★★"]'></span>
                </div>
                <div>
                  <span className="font-bold text-[20px] ">{review.reviewer_name}</span>
                  <span className="ml-2 text-green-600">✔</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {review.review_ratings.map((rating: IReviewRatings) => {
                  return (
                    <span key={rating.reviews_id + rating.rating_title} className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm">{rating.rating_title} — {rating.rating_value}</span>
                  )
                })}
              </div>
              <p className="text-gray-700 mb-[15px]">
                {review.content}
              </p>
              <div className="flex space-x-2 mb-[30px]">
                {review.review_medias.map((image: IReviewMedias) => {
                  return <div key={image.media_path} className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md">
                    <span className="text-gray-500"><img srcSet={`${image.media_path}/w=300,sharpen=1 2x, ${image.media_path}/w=450,sharpen=1 3x`} src={image.media_path + "/w=150,sharpen=1"} /></span>
                  </div>
                })}
              </div>
              <div className="text-gray-500 text-sm">
                Опубліковано {formatDateFromMilliseconds(review.reviewed_at)}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
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

