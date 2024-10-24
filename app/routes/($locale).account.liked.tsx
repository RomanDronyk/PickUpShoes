import type { AddressFragment } from 'storefrontapi.generated';
import {
  defer,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import { LikedCart } from '~/components/LikedCart/LikedCart';
import { useMedia } from 'react-use';
import { likedProductsCookie } from '~/cookies.server';
import { getUserLikedCartIds, validateCustomerAccessToken } from '~/utils';
import { LIKED_PRODUCT_QUERY } from '~/graphql/queries';


export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};


export const meta: MetaFunction = () => {
  return [{ title: 'Вподобане' }];
};


export const handle = {
  breadcrumb: 'likes',
};


export async function loader({ context, request }: LoaderFunctionArgs) {
  const { session, admin }: any = context;
  const customerAccessToken = await session.get('customerAccessToken');


  const { isLoggedIn, headers } = await validateCustomerAccessToken(
    session,
    customerAccessToken,
  );
  const cookieHeader = request.headers.get('Cookie');
  let likedCookes = (await likedProductsCookie.parse(cookieHeader)) || [];

  if (isLoggedIn && customerAccessToken?.accessToken) {
    likedCookes = await getUserLikedCartIds(customerAccessToken.accessToken, context)
  }
  const likedPromises = likedCookes.map((id: string) => {
    return admin(LIKED_PRODUCT_QUERY, {
      variables: {
        id
      }
    })
  })

  const products = await Promise.all(likedPromises)

  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return defer(
    {
      products,
    },
    {
      headers: {
        'Set-Cookie': await likedProductsCookie.serialize(likedCookes),
      },
    });
}


export default function Liked() {
  const loaderData = useLoaderData<typeof loader>()
  const { products }: any = loaderData;


  return (
    <div style={{ minHeight: 100 }} className={"mb-[60px] relative addresses rounded-[20px] border border-black/10 p-6"}>
      {products.length > 0 ?
        <div style={{ display: "grid", gap: 10 }}>
          {products.map((product: any) => <LikedCart key={product.productVariant.id} product={product.productVariant} />)}
        </div>
        :
        <h2 className="text-gray-500 text-2xl  font-semibold left-1/2 opacity-70 absolute text-center top-[50%] transform -translate-x-1/2 -translate-y-1/2">
          На жаль, ви нічого не вподобали
        </h2>
      }
    </div>
  );
}
