import { useLocation } from '@remix-run/react';
import type {
  SelectedOption,
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';
import { useMemo } from 'react';
import { traslationOptionDict } from './traslationOptionDict';

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label?: string;
  currency?: CurrencyCode;
};

export type Localizations = Record<string, Locale>;

export type I18nLocale = Locale & {
  pathPrefix: string;
};

export function useVariantUrl(
  handle: string,
  selectedOptions: SelectedOption[],
) {
  const { pathname } = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
}

export const getVariantUrl2 = (handle: string, id: string): string => {
  const arrayFromId = id.split("/");
  const newUrl = `/products/${handle}?variant=${arrayFromId[arrayFromId.length - 1]}`
  return newUrl;
}




export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions: SelectedOption[];
}) {

  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const isLocalePathname = match && match.length > 0;

  const path = isLocalePathname
    ? `${match![0]}products/${handle}`
    : `/products/${handle}`;

  const translatedSearchParams = new URLSearchParams();

  selectedOptions.forEach((option) => {
    const translatedKey = traslationOptionDict[option.name] || option.name;
    translatedSearchParams.set(translatedKey, option.value);
  });

  const searchString = translatedSearchParams.toString();

  return path + (searchString ? '?' + searchString.toString() : '');
}
export function parseAsCurrency(value: number, locale: I18nLocale) {
  return new Intl.NumberFormat(
    locale.language + '-' + locale.country,
    {},
  ).format(value);
}

