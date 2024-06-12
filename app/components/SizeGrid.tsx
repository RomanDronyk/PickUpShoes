import {useState, useEffect} from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {ScrollArea, ScrollBar} from './ui/scroll-area';
import {Switch} from './ui/switch';
import {Button} from './ui/button';

type SizeGrid = {
  name: string;
  type: 'shoes' | 'clothes';
  mens: {
    UK: number[];
    US: number[];
    EU: number[];
    SM: number[];
  };
  woomens: {
    UK: number[];
    US: number[];
    EU: number[];
    SM: number[];
  };
};

export const SizeGrid = ({vendor}: {vendor: string}) => {
  const [sizeChart, setSizeChart] = useState<SizeGrid>();
  const [gridView, setGridView] = useState(false);
  useEffect(()=>{
    console.log(sizeChart, "sizeChart")
  },[sizeChart])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadJSON(vendor);
        setSizeChart(data);
      } catch (error) {
        const data = await loadJSON("Adidas");

        console.error('Eror load size grid', error);
      }
    };
    fetchData();
  }, [vendor]);
  if (sizeChart) {
    return (
      <Dialog >
<div style={{overflow:"hidden"}}>
<DialogTrigger className='overflow-hidden' asChild>
          <Button variant="ghost" className="flex gap-2">
            Розмірна сітка
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_157_17796)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.625 8.125C5.95652 8.125 6.27446 8.2567 6.50888 8.49112C6.7433 8.72554 6.875 9.04348 6.875 9.375V11.875C6.875 12.2065 6.7433 12.5245 6.50888 12.7589C6.27446 12.9933 5.95652 13.125 5.625 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V9.375C1.875 9.04348 2.0067 8.72554 2.24112 8.49112C2.47554 8.2567 2.79348 8.125 3.125 8.125H5.625ZM11.875 8.125C12.2065 8.125 12.5245 8.2567 12.7589 8.49112C12.9933 8.72554 13.125 9.04348 13.125 9.375V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H9.375C9.04348 13.125 8.72554 12.9933 8.49112 12.7589C8.2567 12.5245 8.125 12.2065 8.125 11.875V9.375C8.125 9.04348 8.2567 8.72554 8.49112 8.49112C8.72554 8.2567 9.04348 8.125 9.375 8.125H11.875ZM5.625 1.875C5.95652 1.875 6.27446 2.0067 6.50888 2.24112C6.7433 2.47554 6.875 2.79348 6.875 3.125V5.625C6.875 5.95652 6.7433 6.27446 6.50888 6.50888C6.27446 6.7433 5.95652 6.875 5.625 6.875H3.125C2.79348 6.875 2.47554 6.7433 2.24112 6.50888C2.0067 6.27446 1.875 5.95652 1.875 5.625V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H5.625ZM11.875 1.875C12.2065 1.875 12.5245 2.0067 12.7589 2.24112C12.9933 2.47554 13.125 2.79348 13.125 3.125V5.625C13.125 5.95652 12.9933 6.27446 12.7589 6.50888C12.5245 6.7433 12.2065 6.875 11.875 6.875H9.375C9.04348 6.875 8.72554 6.7433 8.49112 6.50888C8.2567 6.27446 8.125 5.95652 8.125 5.625V3.125C8.125 2.79348 8.2567 2.47554 8.49112 2.24112C8.72554 2.0067 9.04348 1.875 9.375 1.875H11.875Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_157_17796">
                  <rect width="15" height="15" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-scroll overflow-x-scroll xl:overflow-visible max-h-[90vh]">
          <ScrollArea style={{display: "block !important "}} >
<div style={{display: "block"}}>

<DialogHeader  className="block overflow-hidden flex items-center justify-center font-bold text-2xl">
              <DialogTitle>Розмірна сітка: {vendor}</DialogTitle>
            </DialogHeader>
            <div className="size-grid">
              <div className="w-full flex items-center justify-end mt-10">
                <Switch checked={gridView} onCheckedChange={setGridView} />
              </div>
              <div className="size-grid-content mt-5">
                {!gridView ? (
                  <GridRow data={sizeChart?.mens} />
                ) : (
                  <GridRow data={sizeChart?.woomens} />
                )}
              </div>
            </div>
            <ScrollBar orientation="vertical" className="scrollbar-none" />
</div>
          </ScrollArea>
        </DialogContent>
</div>
      </Dialog>
    );
  }
};

function GridRow({
  data,
}: {
  data: {UK: number[]; US: number[]; EU: number[]; SM: number[]};
}) {
  const {UK, US, EU, SM} = data;
  const [sizesArray, setSizesArray] = useState<any[][]>();
  useEffect(() => {
    normalizeGrid();
  }, [data]);

  const normalizeGrid = () => {
    const mainArr = [];
    for (let i = 0; i < SM.length; i++) {
      const arr = [];
      arr.push(UK[i]);
      arr.push(US[i]);
      arr.push(EU[i]);
      arr.push(SM[i]);
      mainArr.push(arr);
    }
    setSizesArray(mainArr);
  };
  return (
    <div className="overflow-x-scroll flex md:flex-row flex-col">
      <div className="flex md:flex-col flex-row md:gap-[10px] justify-between">
        <div className="bg-black text-white font-semibold rounded-l-none rounded-t-[62px] py-[20px] md:py-0 justify-center items-center flex-col flex md:rounded-none  md:rounded-l-[62px] h-[64px] md:h-[44px] md:pl-[21px]  md:pr-[14px]  px-[14px] pb-[21px] md:pb-0 max-w-[55px] w-full">
          <span>UK</span>
        </div>
        <div className="bg-black text-white font-semibold rounded-l-none rounded-t-[62px] py-[20px] md:py-0 justify-center items-center flex-col flex md:rounded-none  md:rounded-l-[62px] h-[64px] md:h-[44px] md:pl-[21px]  md:pr-[14px]  px-[14px] pb-[21px] md:pb-0 max-w-[55px] w-full">
          <span>US</span>
        </div>
        <div className="bg-black text-white font-semibold rounded-l-none rounded-t-[62px] py-[20px] md:py-0 justify-center items-center flex-col flex md:rounded-none  md:rounded-l-[62px] h-[64px] md:h-[44px] md:pl-[21px]  md:pr-[14px]  px-[14px] pb-[21px] md:pb-0 max-w-[55px] w-full">
          <span>EU</span>
        </div>
        <div className="bg-black text-white font-semibold rounded-l-none rounded-t-[62px] py-[20px] md:py-0 justify-center items-center flex-col flex md:rounded-none  md:rounded-l-[62px] h-[64px] md:h-[44px] md:pl-[21px]  md:pr-[14px]  px-[14px] pb-[21px] md:pb-0 max-w-[55px] w-full">
          <span>СМ</span>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-[5px] ">
        {sizesArray &&
          sizesArray.map((item, index) => (
            <div
              key={`column-${index}`}
              className="flex md:flex-col flex-row justify-between bg-[#F0F0F0] text-base rounded-[5px]"
            >
              {item.map((item) => (
                <div
                  key={item}
                  className="h-[44px] md:w-auto w-[55px] flex items-center justify-center px-[6px] text-center relative after:block md:after:h-[1px] after:h-[23px] md:after:w-[23px] after:w-[1px] after:bg-[#AD9F9F] after:absolute md:after:-bottom-[4px] md:after:right-2/4 md:after:translate-x-2/4 after:-right-[10px] last-of-type:after:hidden"
                >
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

async function loadJSON(vendorName: string) {
  const url = `/size-charts/${vendorName}.json`;
  const response = await fetch(url);
  const data = (await response.json()) as SizeGrid;
  return data;
}
