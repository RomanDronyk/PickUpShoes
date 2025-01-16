import {FC, useCallback, useEffect, useState} from 'react';
import {
  IReview,
  ReviewsList,
  ReviewsModal,
  fetchProductReviewsEasyByUrl,
  transformReviewsData,
} from '~/module/Reviews';
import {ProductTabs, ProductTop} from '~/module/ProductTop';
import RecommendationProducts from '~/components/RecommendationProducts';
import ViewedProducts from '~/components/ViewedProducts';
interface IProductPageScreen {
  loaderData: any;
}

const ProductPageScreen: FC<IProductPageScreen> = ({loaderData}) => {
  const {
    product,
    reviewsReal,
    customerAccessToken,
    variants,
    viewedProducts,
    handle,
    recommendations,
    relatedProducts,
    reviews: Reviews,
  }: any = loaderData;
  const {descriptionHtml} = product;

  const [startCursor, setStartCursor] = useState('');
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadMoreReviews = useCallback(async () => {
    setLoading(true);
    const newReviews = await fetchProductReviewsEasyByUrl(startCursor);
    if (newReviews?.reviews) {
      setStartCursor(newReviews.reviews.next_page_url);
      const formattedResponce = transformReviewsData(newReviews);
      setReviews((prev) => [...prev, ...formattedResponce]);
    } else {
      setErrorMessage('Виникла помилка при загрузці данних');
    }
    setLoading(false);
  }, [startCursor]);

  useEffect(() => {
    setReviews(Reviews);
    setStartCursor(reviewsReal.pageInfo.startCursor);
  }, [Reviews, reviewsReal]);

  return (
    <div className="pt-[16px] product lg:px-24 md:px-10 px-[10px] w-full ">
      <ProductTop
        handle={handle}
        variants={variants}
        relatedProducts={relatedProducts}
        product={product}
      />
      <ProductTabs
        customerAccessToken={customerAccessToken}
        reviews={reviews}
        description={descriptionHtml}
      >
        <div className="mb-[24px] flex justify-between">
          <h2 className="sm:text-[24px] text-[18px] font-semibold  mb-[20px]">
            Відгуки покупців
          </h2>
          <ReviewsModal customerAccessToken={customerAccessToken} />
        </div>
        <ReviewsList
          errorMessage={errorMessage}
          startCursor={startCursor}
          loadMoreReviews={loadMoreReviews}
          loading={loading}
          reviews={reviews}
        />
      </ProductTabs>
      <div className="flex flex-col my-4 pt-[50px] border-t border-r-black/10 mt-[50px]">
        <ViewedProducts products={viewedProducts} />
        <RecommendationProducts recommended={recommendations} />
      </div>
    </div>
  );
};
export default ProductPageScreen;
