import type { AddressFragment, CustomerFragment, ProductItemFragment } from 'storefrontapi.generated';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { HeaderBasketContext, HeaderContextInterface } from '~/context/HeaderCarts';
import { useContext } from 'react';
import { LikedCart } from '~/components/LikedCart/LikedCart';
import { useMedia } from 'react-use';

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

export async function loader({ context }: LoaderFunctionArgs) {
  const { session } = context;
  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return json({});
}


export default function Liked() {

  const isMobile = useMedia('(max-width: 1024px)', false);

  const {
    likedCart,
  } = useContext(HeaderBasketContext) as HeaderContextInterface

  return (
    <div style={{minHeight:90}} className={ "mb-[60px] relative addresses rounded-[20px] border border-black/10 p-6" }>
      {likedCart.length > 0 ?
        <div style={{ display: "grid", gap: 10 }}>
          {likedCart.map((product: any) => <LikedCart key={product.id} product={product} />)}
        </div>
        :
        <h2 className="text-gray-500 text-2xl  font-semibold left-1/2 opacity-70 absolute text-center top-[50%] transform -translate-x-1/2 -translate-y-1/2">
          На жаль, ви нічого не вподобали
        </h2>
      }
    </div>
  );
}
