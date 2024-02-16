import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {useVariantUrl} from '~/utils';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Pick Up Pickup Shoes | Каталог товарів',
    },
  ];
};

export default function Catalog() {
  return (
    <div>
      <h1>Тут буде каталог товарів</h1>
      <div>А тут будуть товари зовсім скоро</div>
    </div>
  );
}
