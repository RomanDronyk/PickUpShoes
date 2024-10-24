import { FormProps, useParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";
import { SearchIcon } from "../SearchIcon";
import { PredictiveSearchResults } from "./PredictiveSearchResults";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { Image } from "@shopify/hydrogen-react";
import { X } from "lucide-react";
import clsx from "clsx";
import { Input } from "../ui/input";
import { NormalizedPredictiveSearchResults } from "../Search";

type SearchFromProps = {
  action?: FormProps['action'];
  method?: FormProps['method'];
  isMobile: boolean;
  brandLogo?: any;
  [key: string]: unknown;
};


export function PredictiveSearchForm({
  action,
  method = 'POST',
  isMobile = false,
  brandLogo,
  ...props
}: SearchFromProps) {
  const params = useParams();
  const fetcher = useFetcher<NormalizedPredictiveSearchResults>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focusForm, setFocusForm] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inputValue, setInputValue] = useState("")

  useEffect(()=>{
    console.log(mobileOpen, "sdlkfjs")
  },[mobileOpen])

  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    const searchAction = action ?? '/api/predictive-search';
    const localizedAction = params.locale
      ? `/${params.locale}${searchAction}`
      : searchAction;
    const newSearchTerm = event.target.value || '';
    setInputValue(event.target.value)
    fetcher.submit(
      { q: newSearchTerm, limit: '6' },
      { method, action: localizedAction },
    );
  }
  const classes = clsx({
    'border xl:w-[427px]  border-input rounded-[62px] bg-lightGray px-4 py-[3px] z-20 relative mr-[20px]':
      !focusForm,
    'border xl:w-[427px] border-input rounded-t-[21px]   bg-lightGray px-4 py-[3px] z-20  drop-shadow-3xl relative ':
      focusForm,
  });

  const handleStatusInput = (event: any) => {
    if (event.target?.value === '') {
      setFocusForm(false);
    } else {
      setFocusForm(true);
    }
  };
  if (!isMobile) {
    return (
      <fetcher.Form
        {...props}
        className={classes}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!inputRef?.current || inputRef.current.value === '') {
            return;
          }
          inputRef.current.blur();
        }}
        onFocus={(event) => {
          handleStatusInput(event);
        }}
        onBlur={(event) => {
          handleStatusInput(event);
        }}
        onChange={(event) => {
          handleStatusInput(event);
        }}
      >
        <div className="flex items-center">
          <SearchIcon />
          <Input
            name="q"
            value={inputValue}
            placeholder="Що ти шукаєш?"
            ref={inputRef}
            onChange={fetchResults}
            onFocus={fetchResults}
            type="search"
            className="border-none"
          />
        </div>
        <PredictiveSearchResults />
      </fetcher.Form>
    );
  } else {
    return (
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="py-2 px-2">
            <svg
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5 15L11.1945 11.6886M13.0263 7.26316C13.0263 8.92425 12.3664 10.5173 11.1919 11.6919C10.0173 12.8664 8.42425 13.5263 6.76316 13.5263C5.10207 13.5263 3.50901 12.8664 2.33444 11.6919C1.15987 10.5173 0.5 8.92425 0.5 7.26316C0.5 5.60207 1.15987 4.00901 2.33444 2.83444C3.50901 1.65987 5.10207 1 6.76316 1C8.42425 1 10.0173 1.65987 11.1919 2.83444C12.3664 4.00901 13.0263 5.60207 13.0263 7.26316V7.26316Z"
                stroke="black"
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-5 h-full">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <Image src={brandLogo?.url} className="max-w-[130px]" />
              <DrawerClose asChild>
                <Button className="rounded-full bg-[#535353] p-0 w-[28px] h-[28px]">
                  <X size={18} />
                </Button>
              </DrawerClose>
            </div>
            <div className="search-block mt-6 mb-7">
              <fetcher.Form
                {...props}
                className="border border-input rounded-[62px] bg-lightGray px-4 py-[3px] z-20 relative"
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (!inputRef?.current || inputRef.current.value === '') {
                    return;
                  }
                  inputRef.current.blur();
                }}
                onFocus={(event) => {
                  handleStatusInput(event);
                }}
                onBlur={(event) => {
                  handleStatusInput(event);
                }}
                onChange={(event) => {
                  handleStatusInput(event);
                }}
              >
                <div className="flex items-center">
                  <Input
                    name="q"
                    placeholder="Пошук..."
                    ref={inputRef}
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    type="search"
                    className="border-none placeholder:text-lg text-lg h-[52px]"
                  />
                  <SearchIcon />
                </div>
              </fetcher.Form>
            </div>
          </DrawerHeader>
          <PredictiveSearchResults setInputValue={setInputValue} setMobileOpen={setMobileOpen} />
        </DrawerContent>
      </Drawer>
    );
  }
}
