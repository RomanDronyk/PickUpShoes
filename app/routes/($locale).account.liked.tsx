import type { MailingAddressInput } from '@shopify/hydrogen/storefront-api-types';
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
          {likedCart.map((product: ProductItemFragment) => <LikedCart key={product.id} product={product} />)}
        </div>
        :
        <h2 className="text-gray-500 text-2xl  font-semibold left-1/2 opacity-70 absolute text-center top-[50%] transform -translate-x-1/2 -translate-y-1/2">
          На жаль, ви нічого не вподобали
        </h2>
      }
    </div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    country: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phone: '',
    province: '',
    zip: '',
  } as AddressFragment;

  return (
    <AddressForm address={newAddress} defaultAddress={null}>
      {({ stateForMethod }) => (
        <div>
          <Button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
          >
            {stateForMethod('POST') !== 'idle' ? 'Створення' : 'Створити'}
          </Button>
        </div>
      )}
    </AddressForm>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div>
      <h3>Існуючі адреси</h3>
      {addresses.nodes.map((address) => (
        <AddressForm key={address.id} address={address} defaultAddress={defaultAddress}>
          {({ stateForMethod }) => (
            <div className="flex gap-4">
              <Button
                disabled={stateForMethod('PUT') !== 'idle'}
                formMethod="PUT"
                type="submit"
              >
                {stateForMethod('PUT') !== 'idle' ? 'Збереження' : 'Зберегти'}
              </Button>
              <Button
                disabled={stateForMethod('DELETE') !== 'idle'}
                formMethod="DELETE"
                type="submit"
              >
                {stateForMethod('DELETE') !== 'idle' ? 'Видалення' : 'Видалити'}
              </Button>
            </div>
          )}
        </AddressForm>
      ))}
    </div>
  );
}

function AddressForm({
  address,
  defaultAddress,
  children,
}: {
  children: (props: { stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => ReturnType<typeof useNavigation>['state'] }) => React.ReactNode;
  defaultAddress: CustomerFragment['defaultAddress'];
  address: AddressFragment;
}) {
  const { state, formMethod } = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[address.id];
  const isDefaultAddress = defaultAddress?.id === address.id;

  return (
    <Form id={address.id}>
      <fieldset>
        <input type="hidden" name="addressId" defaultValue={address.id} />
        <Input
          id="firstName"
          name="firstName"
          type="text"
          autoComplete="given-name"
          defaultValue={address?.firstName ?? ''}
          placeholder="Ім'я"
          aria-label="First name"
          required
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px]"
        />
        <Input
          id="lastName"
          name="lastName"
          type="text"
          autoComplete="family-name"
          defaultValue={address?.lastName ?? ''}
          placeholder="Прізвище"
          aria-label="Last name"
          required
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
        />
        <Input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          defaultValue={address?.company ?? ''}
          placeholder="Компанія"
          aria-label="Company"
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
        />
        <Input
          id="address1"
          name="address1"
          type="text"
          autoComplete="address-line1"
          defaultValue={address?.address1 ?? ''}
          placeholder="Адреса"
          aria-label="Address line 1"
          required
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
        />
        <Input
          id="address2"
          name="address2"
          type="text"
          autoComplete="address-line2"
          defaultValue={address?.address2 ?? ''}
          placeholder="Адреса (продовження)"
          aria-label="Address line 2"
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
        />
        <Input
          id="city"
          name="city"
          type="text"
          autoComplete="address-level2"
          defaultValue={address?.city ?? ''}
          placeholder="Місто"
          aria-label="City"
          required
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
        />
        <Input
          id="province"
          name="province"
          type="text"
          autoComplete="address-level1"
          defaultValue={address?.province ?? ''}
          placeholder="Штат / Провінція"
          aria-label="State / Province"
          required
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
        />
        <Input
          id="zip"
          name="zip"
          type="text"
          autoComplete="postal-code"
          defaultValue={address?.zip ?? ''}
          placeholder="Поштовий індекс"
          aria-label="Zip / Postal Code"
          required
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
        />
        <Input
          id="country"
          name="country"
          type="text"
          autoComplete="country-name"
          defaultValue={address?.country ?? ''}
          placeholder="Країна"
          aria-label="Country"
          required
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
        />
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={address?.phone ?? ''}
          placeholder="+380123456789"
          aria-label="Phone"
          pattern="^\+?[1-9]\d{3,14}$"
          className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] mt-4"
        />
        <div className="flex items-center mt-4">
          <input
            defaultChecked={isDefaultAddress}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
            className="mr-2"
          />
          <label htmlFor="defaultAddress">Зробити адресою за замовчуванням</label>
        </div>
        {error ? (
          <p>
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
        {children({
          stateForMethod: (method) => (formMethod === method ? state : 'idle'),
        })}
      </fieldset>
    </Form>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/2023-04/mutations/customeraddressupdate
const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressUpdate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
 ) @inContext(country: $country, language: $language) {
    customerAddressUpdate(
      address: $address
      customerAccessToken: $customerAccessToken
      id: $id
    ) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerAddressDelete
const DELETE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressDelete(
    $customerAccessToken: String!,
    $id: ID!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        code
        field
        message
      }
      deletedCustomerAddressId
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerdefaultaddressupdate
const UPDATE_DEFAULT_ADDRESS_MUTATION = `#graphql
  mutation customerDefaultAddressUpdate(
    $addressId: ID!
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerDefaultAddressUpdate(
      addressId: $addressId
      customerAccessToken: $customerAccessToken
    ) {
      customer {
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraddresscreate
const CREATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressCreate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerAddressCreate(
      address: $address
      customerAccessToken: $customerAccessToken
    ) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
