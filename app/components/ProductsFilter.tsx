import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
  useMatches,
  type Location,
} from '@remix-run/react';
import type {
  Filter,
  FilterValue,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {ChevronDown} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {useDebounce} from 'react-use';
import type {SortParam} from '~/routes/($locale).collections.$handle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {
  Sheet,
  SheetClose,
  SheetHeader,
  SheetTrigger,
  SheetContent,
} from './ui/sheet';
import {Button} from './ui/button';
import {Command, CommandGroup, CommandItem} from './ui/command';
import {Input} from './ui/input';
import {Popover, PopoverContent, PopoverTrigger} from './ui/popover';
import {Slider} from './ui/slider';
import {ToggleGroup, ToggleGroupItem} from './ui/toggle-group';
import {cn} from '~/lib/utils';

export const FILTER_URL_PREFIX = 'filter.';

export type AppliedFilter = {
  label: string;
  filter: ProductFilter;
  name?: string;
};

export function ProductsFilter({
  filters,
  initialFilters,
  appliedFilters = [],
}: {
  filters: Filter[];
  initialFilters: Filter[];
  appliedFilters?: AppliedFilter[];
}) {
  return (
    <div className="flex flex-col gap-6 border border-black/10 rounded-[20px] py-5 px-6 ">
      <div className="pb-6 border-b border-b-black/10 flex justify-between items-center">
        <div className="font-semibold text-xl">Фільтрація товару</div>

        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.125 11.625V20.25C13.125 20.5484 13.0065 20.8345 12.7955 21.0455C12.5845 21.2565 12.2984 21.375 12 21.375C11.7016 21.375 11.4155 21.2565 11.2045 21.0455C10.9935 20.8345 10.875 20.5484 10.875 20.25V11.625C10.875 11.3266 10.9935 11.0405 11.2045 10.8295C11.4155 10.6185 11.7016 10.5 12 10.5C12.2984 10.5 12.5845 10.6185 12.7955 10.8295C13.0065 11.0405 13.125 11.3266 13.125 11.625ZM18.75 18C18.4516 18 18.1655 18.1185 17.9545 18.3295C17.7435 18.5405 17.625 18.8266 17.625 19.125V20.25C17.625 20.5484 17.7435 20.8345 17.9545 21.0455C18.1655 21.2565 18.4516 21.375 18.75 21.375C19.0484 21.375 19.3345 21.2565 19.5455 21.0455C19.7565 20.8345 19.875 20.5484 19.875 20.25V19.125C19.875 18.8266 19.7565 18.5405 19.5455 18.3295C19.3345 18.1185 19.0484 18 18.75 18ZM21 14.25H19.875V3.75C19.875 3.45163 19.7565 3.16548 19.5455 2.9545C19.3345 2.74353 19.0484 2.625 18.75 2.625C18.4516 2.625 18.1655 2.74353 17.9545 2.9545C17.7435 3.16548 17.625 3.45163 17.625 3.75V14.25H16.5C16.2016 14.25 15.9155 14.3685 15.7045 14.5795C15.4935 14.7905 15.375 15.0766 15.375 15.375C15.375 15.6734 15.4935 15.9595 15.7045 16.1705C15.9155 16.3815 16.2016 16.5 16.5 16.5H21C21.2984 16.5 21.5845 16.3815 21.7955 16.1705C22.0065 15.9595 22.125 15.6734 22.125 15.375C22.125 15.0766 22.0065 14.7905 21.7955 14.5795C21.5845 14.3685 21.2984 14.25 21 14.25ZM5.25 15C4.95163 15 4.66548 15.1185 4.4545 15.3295C4.24353 15.5405 4.125 15.8266 4.125 16.125V20.25C4.125 20.5484 4.24353 20.8345 4.4545 21.0455C4.66548 21.2565 4.95163 21.375 5.25 21.375C5.54837 21.375 5.83452 21.2565 6.0455 21.0455C6.25647 20.8345 6.375 20.5484 6.375 20.25V16.125C6.375 15.8266 6.25647 15.5405 6.0455 15.3295C5.83452 15.1185 5.54837 15 5.25 15ZM7.5 11.25H6.375V3.75C6.375 3.45163 6.25647 3.16548 6.0455 2.9545C5.83452 2.74353 5.54837 2.625 5.25 2.625C4.95163 2.625 4.66548 2.74353 4.4545 2.9545C4.24353 3.16548 4.125 3.45163 4.125 3.75V11.25H3C2.70163 11.25 2.41548 11.3685 2.2045 11.5795C1.99353 11.7905 1.875 12.0766 1.875 12.375C1.875 12.6734 1.99353 12.9595 2.2045 13.1705C2.41548 13.3815 2.70163 13.5 3 13.5H7.5C7.79837 13.5 8.08452 13.3815 8.2955 13.1705C8.50647 12.9595 8.625 12.6734 8.625 12.375C8.625 12.0766 8.50647 11.7905 8.2955 11.5795C8.08452 11.3685 7.79837 11.25 7.5 11.25ZM14.25 6.75H13.125V3.75C13.125 3.45163 13.0065 3.16548 12.7955 2.9545C12.5845 2.74353 12.2984 2.625 12 2.625C11.7016 2.625 11.4155 2.74353 11.2045 2.9545C10.9935 3.16548 10.875 3.45163 10.875 3.75V6.75H9.75C9.45163 6.75 9.16548 6.86853 8.9545 7.0795C8.74353 7.29048 8.625 7.57663 8.625 7.875C8.625 8.17337 8.74353 8.45952 8.9545 8.6705C9.16548 8.88147 9.45163 9 9.75 9H14.25C14.5484 9 14.8345 8.88147 15.0455 8.6705C15.2565 8.45952 15.375 8.17337 15.375 7.875C15.375 7.57663 15.2565 7.29048 15.0455 7.0795C14.8345 6.86853 14.5484 6.75 14.25 6.75Z"
            fill="black"
            fillOpacity="0.4"
          />
        </svg>
      </div>
      {appliedFilters.length > 0 && (
        <div className="pb-6">
          <AppliedFilters filters={appliedFilters} />
        </div>
      )}
      <FilterDraw initial={initialFilters} filters={filters} />
    </div>
  );
}

function FilterDraw({
  filters,
  initial,
}: {
  filters: Filter[];
  initial: Filter[];
}) {
  const [params] = useSearchParams();
  const initialFilterPrice = initial.find(
    (item) => item.type === 'PRICE_RANGE',
  );
  const initialRangePrice = JSON.parse(
    initialFilterPrice?.values[0].input as string,
  ) as {price: {min: number; max: number}};
  const markup = (filter: Filter) => {
    switch (filter.type) {
      case 'PRICE_RANGE':
        const priceFilterValue = params.get(`${FILTER_URL_PREFIX}price`);
        const price = priceFilterValue
          ? (JSON.parse(priceFilterValue) as {min: number; max: number})
          : {
              min: initialRangePrice.price.min,
              max: initialRangePrice.price.max,
            };
        return (
          <PriceFilter
            key={filter.id}
            min={initialRangePrice.price.min}
            max={initialRangePrice.price.max}
            value={price}
          />
        );
      case 'LIST':
        if (filter.id !== 'filter.v.option.color') {
          return <ListFilter key={filter.id} filter={filter} />;
        }
    }
  };
  return (
    <div className="flex flex-col">
      {filters.map((item, index) => markup(item))}
    </div>
  );
}

function PriceFilter({
  min = 0,
  max = 0,
  value,
}: {
  min: number;
  max: number;
  value: {min: number; max: number};
}) {
  const initialRangeValue = value ? [value.min, value.max] : [min, max];
  const [priceRange, setPriceRange] = useState(initialRangeValue);
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigate = useNavigate();

  useDebounce(
    () => {
      if (priceRange[0] === min && priceRange[1] === max) {
        params.delete(`${FILTER_URL_PREFIX}price`);
        navigate(`${location.pathname}?${params.toString()}`);
        return;
      }
      const price = {
        ...(priceRange[0] === undefined ? {} : {min: priceRange[0]}),
        ...(priceRange[1] === undefined ? {} : {max: priceRange[1]}),
      };
      const newParams = filterInputToParams({price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`);
    },
    500,
    [priceRange],
  );
  return (
    <div className="flex flex-col gap-[10px] pb-12 md:pb-6 border-b border-b-black/10">
      <div className="font-semibold text-xl mb-[10px]">
        <span>Ціновий діапазон</span>
      </div>
      <div className="bg-input flex flex-row rounded-[40px] py-[5px]">
        <div className="w-2/4 relative before:w-[1px] before:h-full before:bg-black before:right-0 before:block before:absolute">
          <Input
            value={`${priceRange[0]} грн`}
            type="text"
            className="text-center h-5 w-full"
            readOnly={true}
          />
        </div>
        <div className="w-2/4">
          <Input
            value={`${priceRange[1]} грн`}
            type="text"
            className="text-center h-5 w-ful"
            readOnly={true}
          />
        </div>
      </div>
      <Slider
        onValueChange={setPriceRange}
        minStepsBetweenThumbs={10}
        defaultValue={initialRangeValue}
        max={max}
        step={1}
      />
    </div>
  );
}

function ListFilter({filter}: {filter: Filter}) {
  const [value, setValue] = useState<string[]>([]);

  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const navigate = useNavigate();
  //get prefix fitler
  const exampleValue = filter.values[0];

  const exampleValueObj = JSON.parse(
    exampleValue.input as string,
  ) as ProductFilter;

  const matches = useMatches();

  const catalogMatch = matches.find(
    (match) => match.id === 'routes/($locale).collections.$handle',
  );

  const filtersValue = catalogMatch?.data?.appliedFilters.map((filter) => {
    return JSON.stringify(filter.filter);
  });

  const filterKey = Object.keys(exampleValueObj)[0];

  // console.log('Filter:', filter);
  // console.log('Value:', value);
  // console.log('Object from params:', catalogMatch);
  // console.log(filtersValue);

  const calculatedValues = filter.values.filter((value) =>
    filtersValue.includes(value.input),
  );

  const handleChange = (value: string[]) => {
    setValue(value);
  };

  useDebounce(
    () => {
      if (value.length === 0) {
        params.delete(`${FILTER_URL_PREFIX}${filterKey}`);
        navigate(`${location.pathname}?${params.toString()}`);
        return;
      }
      const selectedItems = filter.values.filter((item) =>
        value.includes(item.id),
      );

      const link = getFilterLink(selectedItems, params, location);
      navigate(`${link}`);
    },
    0,
    [value],
  );

  useEffect(() => {
    const appliedValues = calculatedValues.map((item) => item.id);
    const newValue = new Set(value.concat(appliedValues));
    setValue([...newValue]);
  }, []);

  return (
    <div className="md:pb-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="size">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center font-semibold md:text-xl text-[16px] md:mb-[10px]">
              <span>{filter.label}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              <ToggleGroup
                type="multiple"
                className="flex flex-wrap justify-start"
                onValueChange={handleChange}
                value={value}
              >
                {filter.values.map((filterItem) => (
                  <ToggleGroupItem
                    key={filterItem.id}
                    value={filterItem.id}
                    className={cn(
                      'data-[state=on]:bg-black data-[state=on]:text-white rounded-[62px] text-black/60  bg-[#F0F0F0] px-5 py-1',
                    )}
                  >
                    <span>{filterItem.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
export function AppliedFilters({filters = []}: {filters: AppliedFilter[]}) {
  const [params] = useSearchParams();
  const location = useLocation();
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter: AppliedFilter) => {
          return (
            <Button
              key={`${filter.label}-${JSON.stringify(filter.filter)}`}
              variant="ghost"
              className="bg-[#535353] rounded-2xl px-[10px] py-[5px] text-white hover:bg-[#535353]/60"
            >
              <Link
                to={getAppliedFilterLink(filter, params, location)}
                className="flex gap-2 items-center text-[12px] "
              >
                {filter.name && <span>{filter.name}: </span>}
                <span className="flex-grow">{filter.label}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="14" height="14" rx="7" fill="white" />
                  <path
                    d="M7.44971 6.9982L10.8265 3.6181C10.8861 3.55823 10.9195 3.47719 10.9194 3.39274C10.9194 3.30828 10.8859 3.22729 10.8262 3.1675C10.7068 3.0487 10.4965 3.0481 10.3759 3.1681L7.00001 6.5482L3.62291 3.1672C3.50291 3.0487 3.29261 3.0493 3.17321 3.1678C3.14358 3.19732 3.12012 3.23244 3.1042 3.27112C3.08828 3.3098 3.08023 3.35127 3.08051 3.3931C3.08051 3.4783 3.11351 3.5581 3.17321 3.6172L6.55001 6.9979L3.17351 10.3789C3.11393 10.4389 3.08056 10.52 3.08073 10.6045C3.0809 10.6891 3.11459 10.7701 3.17441 10.8298C3.23231 10.8871 3.31421 10.9201 3.39881 10.9201H3.40061C3.48551 10.9198 3.56741 10.8865 3.62411 10.8286L7.00001 7.4485L10.3771 10.8295C10.4368 10.8889 10.5166 10.9219 10.6012 10.9219C10.643 10.922 10.6845 10.9139 10.7232 10.8979C10.7618 10.882 10.797 10.8585 10.8265 10.8289C10.8561 10.7994 10.8796 10.7642 10.8955 10.7255C10.9115 10.6869 10.9196 10.6454 10.9195 10.6036C10.9195 10.5187 10.8865 10.4386 10.8265 10.3795L7.44971 6.9982Z"
                    fill="#535353"
                  />
                </svg>
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
function filterInputToParams(
  rawInput: string | ProductFilter,
  params: URLSearchParams,
) {
  const input =
    typeof rawInput === 'string'
      ? (JSON.parse(rawInput) as ProductFilter)
      : rawInput;

  Object.entries(input).forEach(([key, value]) => {
    if (params.has(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value))) {
      return;
    }
    if (key === 'price') {
      // For price, we want to overwrite
      params.set(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    } else {
      params.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    }
  });

  return params;
}
function getFilterLink(
  rawInput: FilterValue[],
  params: URLSearchParams,
  location: ReturnType<typeof useLocation>,
) {
  const paramsClone = new URLSearchParams(params);
  rawInput.forEach((item) => {
    const input =
      typeof item.input === 'string'
        ? (JSON.parse(item.input) as ProductFilter)
        : rawInput;
    Object.entries(input).forEach(([key, value]) => {
      if (
        paramsClone.has(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value))
      ) {
        return;
      }
      if (key === 'price') {
        // For price, we want to overwrite
        paramsClone.set(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
      } else {
        paramsClone.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
      }
    });
  });

  return `${location.pathname}?${paramsClone.toString()}`;
}

function getFilterFromLink(
  filter: Filter,
  location: ReturnType<typeof useLocation>,
) {
  const decodeSearchParams = decodeURIComponent(location.search);
  const arrayDecodeSearchParams = decodeSearchParams
    ? decodeSearchParams.split('&')
    : [];
  // console.log(filter);
}
//create URL for sort products
function getSortLink(
  sort: SortParam | string,
  params: URLSearchParams,
  location: Location,
) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}
// Sort menu component
const sortMenu: {value: string; label: string}[] = [
  {
    label: 'Популярністю',
    value: 'best-selling',
  },
  {
    label: 'Ціною за спаданням',
    value: 'price-high-low',
  },
  {
    label: 'Ціною за зростанням',
    value: 'price-low-high',
  },
];

export function SortProducts() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('best-selling');
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSort = (newValue: SortParam | string) => {
    setValue(newValue === value ? value : newValue);
    setOpen(false);
    navigate(getSortLink(newValue, params, location));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="flex gap-[5px]"
        >
          <span className="text-black/60">Сортувати за: </span>
          <span className="font-semibold text-base">
            {sortMenu.find((item) => item.value === value)?.label}
          </span>
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <Command>
          <CommandGroup>
            {sortMenu.map((item) => (
              <CommandItem
                className="font-semibold"
                key={item.value}
                value={item.value}
                onSelect={handleSort}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function getAppliedFilterLink(
  filter: AppliedFilter,
  params: URLSearchParams,
  location: Location,
) {
  const paramsClone = new URLSearchParams(params);

  Object.entries(filter.filter).forEach(([key, value]) => {
    const fullKey = FILTER_URL_PREFIX + key;
    paramsClone.delete(fullKey, JSON.stringify(value));
  });
  return `${location.pathname}?${paramsClone.toString()}`;
}

export function MobileFilters({
  filters,
  initialFilters,
}: {
  filters: Filter[];
  initialFilters: Filter[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-[5px] text-[14px] font-semibold"
        >
          <span>Фільтрація товару</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.9375 9.6875V16.875C10.9375 17.1236 10.8387 17.3621 10.6629 17.5379C10.4871 17.7137 10.2486 17.8125 10 17.8125C9.75136 17.8125 9.5129 17.7137 9.33709 17.5379C9.16127 17.3621 9.0625 17.1236 9.0625 16.875V9.6875C9.0625 9.43886 9.16127 9.2004 9.33709 9.02459C9.5129 8.84877 9.75136 8.75 10 8.75C10.2486 8.75 10.4871 8.84877 10.6629 9.02459C10.8387 9.2004 10.9375 9.43886 10.9375 9.6875ZM15.625 15C15.3764 15 15.1379 15.0988 14.9621 15.2746C14.7863 15.4504 14.6875 15.6889 14.6875 15.9375V16.875C14.6875 17.1236 14.7863 17.3621 14.9621 17.5379C15.1379 17.7137 15.3764 17.8125 15.625 17.8125C15.8736 17.8125 16.1121 17.7137 16.2879 17.5379C16.4637 17.3621 16.5625 17.1236 16.5625 16.875V15.9375C16.5625 15.6889 16.4637 15.4504 16.2879 15.2746C16.1121 15.0988 15.8736 15 15.625 15ZM17.5 11.875H16.5625V3.125C16.5625 2.87636 16.4637 2.6379 16.2879 2.46209C16.1121 2.28627 15.8736 2.1875 15.625 2.1875C15.3764 2.1875 15.1379 2.28627 14.9621 2.46209C14.7863 2.6379 14.6875 2.87636 14.6875 3.125V11.875H13.75C13.5014 11.875 13.2629 11.9738 13.0871 12.1496C12.9113 12.3254 12.8125 12.5639 12.8125 12.8125C12.8125 13.0611 12.9113 13.2996 13.0871 13.4754C13.2629 13.6512 13.5014 13.75 13.75 13.75H17.5C17.7486 13.75 17.9871 13.6512 18.1629 13.4754C18.3387 13.2996 18.4375 13.0611 18.4375 12.8125C18.4375 12.5639 18.3387 12.3254 18.1629 12.1496C17.9871 11.9738 17.7486 11.875 17.5 11.875ZM4.375 12.5C4.12636 12.5 3.8879 12.5988 3.71209 12.7746C3.53627 12.9504 3.4375 13.1889 3.4375 13.4375V16.875C3.4375 17.1236 3.53627 17.3621 3.71209 17.5379C3.8879 17.7137 4.12636 17.8125 4.375 17.8125C4.62364 17.8125 4.8621 17.7137 5.03791 17.5379C5.21373 17.3621 5.3125 17.1236 5.3125 16.875V13.4375C5.3125 13.1889 5.21373 12.9504 5.03791 12.7746C4.8621 12.5988 4.62364 12.5 4.375 12.5ZM6.25 9.375H5.3125V3.125C5.3125 2.87636 5.21373 2.6379 5.03791 2.46209C4.8621 2.28627 4.62364 2.1875 4.375 2.1875C4.12636 2.1875 3.8879 2.28627 3.71209 2.46209C3.53627 2.6379 3.4375 2.87636 3.4375 3.125V9.375H2.5C2.25136 9.375 2.0129 9.47377 1.83709 9.64959C1.66127 9.8254 1.5625 10.0639 1.5625 10.3125C1.5625 10.5611 1.66127 10.7996 1.83709 10.9754C2.0129 11.1512 2.25136 11.25 2.5 11.25H6.25C6.49864 11.25 6.7371 11.1512 6.91291 10.9754C7.08873 10.7996 7.1875 10.5611 7.1875 10.3125C7.1875 10.0639 7.08873 9.8254 6.91291 9.64959C6.7371 9.47377 6.49864 9.375 6.25 9.375ZM11.875 5.625H10.9375V3.125C10.9375 2.87636 10.8387 2.6379 10.6629 2.46209C10.4871 2.28627 10.2486 2.1875 10 2.1875C9.75136 2.1875 9.5129 2.28627 9.33709 2.46209C9.16127 2.6379 9.0625 2.87636 9.0625 3.125V5.625H8.125C7.87636 5.625 7.6379 5.72377 7.46209 5.89959C7.28627 6.0754 7.1875 6.31386 7.1875 6.5625C7.1875 6.81114 7.28627 7.0496 7.46209 7.22541C7.6379 7.40123 7.87636 7.5 8.125 7.5H11.875C12.1236 7.5 12.3621 7.40123 12.5379 7.22541C12.7137 7.0496 12.8125 6.81114 12.8125 6.5625C12.8125 6.31386 12.7137 6.0754 12.5379 5.89959C12.3621 5.72377 12.1236 5.625 11.875 5.625Z"
              fill="black"
            />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="sm:max-w-full w-full h-full overflow-y-auto"
      >
        <SheetHeader className="mb-10 flex justify-between items-center flex-row">
          <div className="text-[18px] font-semibold flex items-center gap-[10px]">
            <span>Фільтрація товару</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.9375 9.6875V16.875C10.9375 17.1236 10.8387 17.3621 10.6629 17.5379C10.4871 17.7137 10.2486 17.8125 10 17.8125C9.75136 17.8125 9.5129 17.7137 9.33709 17.5379C9.16127 17.3621 9.0625 17.1236 9.0625 16.875V9.6875C9.0625 9.43886 9.16127 9.2004 9.33709 9.02459C9.5129 8.84877 9.75136 8.75 10 8.75C10.2486 8.75 10.4871 8.84877 10.6629 9.02459C10.8387 9.2004 10.9375 9.43886 10.9375 9.6875ZM15.625 15C15.3764 15 15.1379 15.0988 14.9621 15.2746C14.7863 15.4504 14.6875 15.6889 14.6875 15.9375V16.875C14.6875 17.1236 14.7863 17.3621 14.9621 17.5379C15.1379 17.7137 15.3764 17.8125 15.625 17.8125C15.8736 17.8125 16.1121 17.7137 16.2879 17.5379C16.4637 17.3621 16.5625 17.1236 16.5625 16.875V15.9375C16.5625 15.6889 16.4637 15.4504 16.2879 15.2746C16.1121 15.0988 15.8736 15 15.625 15ZM17.5 11.875H16.5625V3.125C16.5625 2.87636 16.4637 2.6379 16.2879 2.46209C16.1121 2.28627 15.8736 2.1875 15.625 2.1875C15.3764 2.1875 15.1379 2.28627 14.9621 2.46209C14.7863 2.6379 14.6875 2.87636 14.6875 3.125V11.875H13.75C13.5014 11.875 13.2629 11.9738 13.0871 12.1496C12.9113 12.3254 12.8125 12.5639 12.8125 12.8125C12.8125 13.0611 12.9113 13.2996 13.0871 13.4754C13.2629 13.6512 13.5014 13.75 13.75 13.75H17.5C17.7486 13.75 17.9871 13.6512 18.1629 13.4754C18.3387 13.2996 18.4375 13.0611 18.4375 12.8125C18.4375 12.5639 18.3387 12.3254 18.1629 12.1496C17.9871 11.9738 17.7486 11.875 17.5 11.875ZM4.375 12.5C4.12636 12.5 3.8879 12.5988 3.71209 12.7746C3.53627 12.9504 3.4375 13.1889 3.4375 13.4375V16.875C3.4375 17.1236 3.53627 17.3621 3.71209 17.5379C3.8879 17.7137 4.12636 17.8125 4.375 17.8125C4.62364 17.8125 4.8621 17.7137 5.03791 17.5379C5.21373 17.3621 5.3125 17.1236 5.3125 16.875V13.4375C5.3125 13.1889 5.21373 12.9504 5.03791 12.7746C4.8621 12.5988 4.62364 12.5 4.375 12.5ZM6.25 9.375H5.3125V3.125C5.3125 2.87636 5.21373 2.6379 5.03791 2.46209C4.8621 2.28627 4.62364 2.1875 4.375 2.1875C4.12636 2.1875 3.8879 2.28627 3.71209 2.46209C3.53627 2.6379 3.4375 2.87636 3.4375 3.125V9.375H2.5C2.25136 9.375 2.0129 9.47377 1.83709 9.64959C1.66127 9.8254 1.5625 10.0639 1.5625 10.3125C1.5625 10.5611 1.66127 10.7996 1.83709 10.9754C2.0129 11.1512 2.25136 11.25 2.5 11.25H6.25C6.49864 11.25 6.7371 11.1512 6.91291 10.9754C7.08873 10.7996 7.1875 10.5611 7.1875 10.3125C7.1875 10.0639 7.08873 9.8254 6.91291 9.64959C6.7371 9.47377 6.49864 9.375 6.25 9.375ZM11.875 5.625H10.9375V3.125C10.9375 2.87636 10.8387 2.6379 10.6629 2.46209C10.4871 2.28627 10.2486 2.1875 10 2.1875C9.75136 2.1875 9.5129 2.28627 9.33709 2.46209C9.16127 2.6379 9.0625 2.87636 9.0625 3.125V5.625H8.125C7.87636 5.625 7.6379 5.72377 7.46209 5.89959C7.28627 6.0754 7.1875 6.31386 7.1875 6.5625C7.1875 6.81114 7.28627 7.0496 7.46209 7.22541C7.6379 7.40123 7.87636 7.5 8.125 7.5H11.875C12.1236 7.5 12.3621 7.40123 12.5379 7.22541C12.7137 7.0496 12.8125 6.81114 12.8125 6.5625C12.8125 6.31386 12.7137 6.0754 12.5379 5.89959C12.3621 5.72377 12.1236 5.625 11.875 5.625Z"
                fill="black"
              />
            </svg>
          </div>
        </SheetHeader>
        <FilterDraw filters={filters} initial={initialFilters} />
        <SheetClose asChild>
          <Button className="font-medium text-base text-white rounded-[30px] bg-black w-full mt-9 py-3">
            <span>Застосувати фільтри</span>
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
