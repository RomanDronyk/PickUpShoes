import { useMedia } from "react-use";

export function NoPredictiveSearchResults({
  searchTerm,
}: {
  searchTerm: React.MutableRefObject<string>;
}) {
  const isMobile = useMedia('(max-width: 767px)', false);

  if (!searchTerm.current) {
    return null;
  }
  if (!isMobile) {
    return (
      <p className="absolute bg-lightGray inline-flex w-full px-4 py-3 left-0 rounded-b-[21px] justify-center">
        За запитом &nbsp; <q>{searchTerm.current}</q> &nbsp; нічого не знайдено
      </p>
    );
  }
  return (
    <p className="inline-flex w-full px-4 py-3 left-0 rounded-b-[21px] justify-center">
      За запитом &nbsp; <q>{searchTerm.current}</q> &nbsp; нічого не знайдено
    </p>
  );
}