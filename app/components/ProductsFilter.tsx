import {
  useLocation,
  useNavigate,
  useSearchParams,
  type Location,
} from '@remix-run/react';
import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {useDebounce, useSearchParam} from 'react-use';
import {ChevronDown} from 'lucide-react';
import {useMemo, useState} from 'react';
import type {SortParam} from '~/routes/($locale).collections.$handle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {Button} from './ui/button';
import {Command, CommandGroup, CommandItem} from './ui/command';
import {Input} from './ui/input';
import {Popover, PopoverContent, PopoverTrigger} from './ui/popover';
import {Slider} from './ui/slider';
import {ToggleGroup, ToggleGroupItem} from './ui/toggle-group';

export const FILTER_URL_PREFIX = 'filter.';

export function ProductsFilter({
  initialFilters,
  filters,
}: {
  filters: Filter[];
  initialFilters: Filter[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const setFilter = (value: string[]) => {
    const searchStr = JSON.stringify(value);
    setSearchParams({gender: searchStr});
  };

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
      <FilterDraw initial={initialFilters} filters={filters} />
      <div className="pb-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="size">
            <AccordionTrigger>
              <div className="font-semibold text-xl mb-[10px]">
                <span>Розмір (см)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <ToggleGroup
                  type="multiple"
                  className="flex flex-wrap justify-start"
                >
                  <ToggleGroupItem
                    value="36"
                    className="data-[state=on]:bg-black data-[state=on]:text-white rounded-[62px] text-black/60  bg-[#F0F0F0] px-5 py-1"
                  >
                    <span>36</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="38"
                    className="data-[state=on]:bg-black data-[state=on]:text-white rounded-[62px] text-black/60  bg-[#F0F0F0] px-5 py-1"
                  >
                    <span>38</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="37/5"
                    className="data-[state=on]:bg-black data-[state=on]:text-white rounded-[62px] text-black/60  bg-[#F0F0F0] px-5 py-1"
                  >
                    <span>37/5</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="46"
                    className="data-[state=on]:bg-black data-[state=on]:text-white rounded-[62px] text-black/60  bg-[#F0F0F0] px-5 py-1"
                  >
                    <span>46</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="48"
                    className="data-[state=on]:bg-black data-[state=on]:text-white rounded-[62px] text-black/60  bg-[#F0F0F0] px-5 py-1"
                  >
                    <span>48</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="pb-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="color">
            <AccordionTrigger>
              <div className="font-semibold text-xl mb-[10px]">
                <span>Колір</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ToggleGroup
                type="multiple"
                className="flex flex-wrap justify-start gap-[15px]"
              >
                <ToggleGroupItem
                  value="37/5"
                  className="relative data-[state=on]:before:absolute data-[state=on]:before:left-2/4 data-[state=on]:before:top-2/4 data-[state=on]:before:-translate-x-2/4 data-[state=on]:before:-translate-y-2/4 data-[state=on]:before:content-colorFilterActive before:block data-[state=on]:text-white   px-2 py-1  border border-black/20 data-[state=on]:bg-[#7D06F5] bg-[#7D06F5] rounded-full w-[37px] h-[37px] "
                ></ToggleGroupItem>
                <ToggleGroupItem
                  value="46"
                  className="relative data-[state=on]:before:absolute data-[state=on]:before:left-2/4 data-[state=on]:before:top-2/4 data-[state=on]:before:-translate-x-2/4 data-[state=on]:before:-translate-y-2/4 data-[state=on]:before:content-colorFilterActive before:block data-[state=on]:text-white   px-2 py-1  border border-black/20 data-[state=on]:bg-[#F50606] bg-[#F50606] rounded-full w-[37px] h-[37px] "
                ></ToggleGroupItem>
                <ToggleGroupItem
                  value="48"
                  className="relative data-[state=on]:before:absolute data-[state=on]:before:left-2/4 data-[state=on]:before:top-2/4 data-[state=on]:before:-translate-x-2/4 data-[state=on]:before:-translate-y-2/4 data-[state=on]:before:content-colorFilterActive before:block data-[state=on]:text-white   px-2 py-1  border border-black/20 bg-[#FFDE33] data-[state=on]:bg-[#FFDE33] rounded-full w-[37px] h-[37px] "
                ></ToggleGroupItem>
              </ToggleGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
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
            min={initialRangePrice.price.min}
            max={initialRangePrice.price.max}
            value={price}
          />
        );
    }
    return <div>div</div>;
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
  const filtredValue = value ? [value.min, value.max] : [];

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
    <div className="flex flex-col gap-[10px] pb-6 border-b border-b-black/10">
      <div className="font-semibold text-xl mb-[10px]">
        <span>Ціновий діапазон</span>
      </div>
      <div className="bg-input flex flex-row rounded-[40px] py-[5px]">
        <div className="relative before:w-[1px] before:h-full before:bg-black before:right-0 before:block before:absolute">
          <Input
            value={`${priceRange[0]} грн`}
            type="text"
            className="text-center h-5 "
            readOnly={true}
          />
        </div>
        <div>
          <Input
            value={`${priceRange[1]} грн`}
            type="text"
            className="text-center h-5"
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
