import {useMatches} from '@remix-run/react';

export function Breadcrumbs() {
  const matches = useMatches();
  const deepestRoute = matches.at(-1);

  console.log(matches);
  return <div>Breadcrumbs</div>;
}
