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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadJSON(vendor);
        setSizeChart(data);
      } catch (error) {
        console.error('Eror load size grid', error);
      }
    };
    fetchData();
  }, [vendor]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Розмірна сітка</Button>
      </DialogTrigger>
      <DialogContent className="">
        <ScrollArea>
          <DialogHeader className="flex items-center justify-center font-bold text-2xl">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
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
    <div className="flex md:flex-row flex-col">
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
