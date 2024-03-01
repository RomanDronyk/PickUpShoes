import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';
import AboutShop from '../components/AboutShop';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

const PoliciesTitle: {[key: string]: string} = {
  'refund-policy': 'Обмін та повернення',
  'privacy-policy': 'Політика конфіденційності',
  'terms-of-service': 'Угода користувача',
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Pick Up Shoes | ${data?.policy?.title ?? 'Про магазин'}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  return json({policy});
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();
  if (policy) {
    return (
      <div className="policy lg:px-24 md:px-10 px-[10px] mb-12">
        <h1 className="font-bold sm:text-2xl text-lg my-6">
          {PoliciesTitle[policy.handle]}
        </h1>
        <div
          dangerouslySetInnerHTML={{__html: policy.body}}
          className="flex flex-col gap-4 sm:text-xl text-sm"
        />
      </div>
    );
  }

  return <AboutShop />;
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
