import type {MailingAddressInput} from '@shopify/hydrogen/storefront-api-types';
import type {AddressFragment, CustomerFragment} from 'storefrontapi.generated';
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

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: MetaFunction = () => {
  return [{title: 'Addresses'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {session} = context;
  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront, session} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    const customerAccessToken = await session.get('customerAccessToken');
    if (!customerAccessToken) {
      return json({error: {[addressId]: 'Unauthorized'}}, {status: 401});
    }
    const {accessToken} = customerAccessToken;

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : null;
    const address: MailingAddressInput = {};
    const keys: (keyof MailingAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'country',
      'firstName',
      'lastName',
      'phone',
      'province',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {customerAddressCreate} = await storefront.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {customerAccessToken: accessToken, address},
            },
          );

          if (customerAddressCreate?.customerUserErrors?.length) {
            const error = customerAddressCreate.customerUserErrors[0];
            throw new Error(error.message);
          }

          const createdAddress = customerAddressCreate?.customerAddress;
          if (!createdAddress?.id) {
            throw new Error(
              'Expected customer address to be created, but the id is missing',
            );
          }

          if (defaultAddress) {
            const createdAddressId = decodeURIComponent(createdAddress.id);
            const {customerDefaultAddressUpdate} = await storefront.mutate(
              UPDATE_DEFAULT_ADDRESS_MUTATION,
              {
                variables: {
                  customerAccessToken: accessToken,
                  addressId: createdAddressId,
                },
              },
            );

            if (customerDefaultAddressUpdate?.customerUserErrors?.length) {
              const error = customerDefaultAddressUpdate.customerUserErrors[0];
              throw new Error(error.message);
            }
          }

          return json({error: null, createdAddress, defaultAddress});
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json({error: {[addressId]: error.message}}, {status: 400});
          }
          return json({error: {[addressId]: error}}, {status: 400});
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {customerAddressUpdate} = await storefront.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                customerAccessToken: accessToken,
                id: decodeURIComponent(addressId),
              },
            },
          );

          const updatedAddress = customerAddressUpdate?.customerAddress;

          if (customerAddressUpdate?.customerUserErrors?.length) {
            const error = customerAddressUpdate.customerUserErrors[0];
            throw new Error(error.message);
          }

          if (defaultAddress) {
            const {customerDefaultAddressUpdate} = await storefront.mutate(
              UPDATE_DEFAULT_ADDRESS_MUTATION,
              {
                variables: {
                  customerAccessToken: accessToken,
                  addressId: decodeURIComponent(addressId),
                },
              },
            );

            if (customerDefaultAddressUpdate?.customerUserErrors?.length) {
              const error = customerDefaultAddressUpdate.customerUserErrors[0];
              throw new Error(error.message);
            }
          }

          return json({error: null, updatedAddress, defaultAddress});
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json({error: {[addressId]: error.message}}, {status: 400});
          }
          return json({error: {[addressId]: error}}, {status: 400});
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {customerAddressDelete} = await storefront.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {customerAccessToken: accessToken, id: addressId},
            },
          );

          if (customerAddressDelete?.customerUserErrors?.length) {
            const error = customerAddressDelete.customerUserErrors[0];
            throw new Error(error.message);
          }
          return json({error: null, deletedAddress: addressId});
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json({error: {[addressId]: error.message}}, {status: 400});
          }
          return json({error: {[addressId]: error}}, {status: 400});
        }
      }

      default: {
        return json(
          {error: {[addressId]: 'Method not allowed'}},
          {status: 405},
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Addresses() {
  const { customer } = useOutletContext<{ customer: CustomerFragment }>();
  const { defaultAddress, addresses } = customer;

  return (
    <div className="container grid lg:grid-cols-2 grid-cols-1 gap-y-10 gap-x-10 sm:px-24 px-[10px] my-10 w-full">
      <div className="addresses rounded-[20px] border border-black/10 p-6">
        <h2 className="xl:text-[32px] text-[24px] md:text-left text-center font-medium mb-[25px]">Адреси</h2>
        <br />
        {!addresses.nodes.length ? (
          <p>У вас немає збережених адрес.</p>
        ) : (
          <div>
            <NewAddressForm />
            <br />
            <hr />
            <br />
            <ExistingAddresses addresses={addresses} defaultAddress={defaultAddress} />
          </div>
        )}
      </div>
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
