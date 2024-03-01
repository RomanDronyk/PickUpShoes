import {useMatches} from '@remix-run/react';
import {ReceiptEuroIcon} from 'lucide-react';
import {z} from 'zod';

export const breadcrumbsSchema = z.enum([
  'collections',
  'collection',
  'product',
  'policy',
]);
export type TBreadcrumbsType = z.infer<typeof breadcrumbsSchema>;

export function Breadcrumbs() {
  const matches = useMatches();
  const deepsRoute = matches.at(-1);

  const parsedBreadcrumbType = breadcrumbsSchema.safeParse(
    deepsRoute?.handle.breadcrumb,
  );
  const isValidBreadcrumb = parsedBreadcrumbType.success;

  console.log(isValidBreadcrumb);
  if (isValidBreadcrumb) {
    return <div>{parsedBreadcrumbType.data}</div>;
  } else {
    return null;
  }
}
