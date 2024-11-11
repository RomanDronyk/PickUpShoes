import * as React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { cn } from "app/lib/utils";

const Radio = RadioGroup.Root;

const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroup.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroup.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroup.Item
    ref={ref}
    className={cn(
      "p-[7px] relative h-[48px] w-full flex items-center justify-center text-lg font-medium text-black border border-left-gray-300",
      "hover:bg-gray-100 ",
      className
    )}
    {...props}
  >
    {children}
    <RadioGroup.Indicator
      className={cn(
        "absolute inset-0 bg-black text-white flex items-center justify-center transition-all duration-300"
      )}
    >
      {children}
    </RadioGroup.Indicator>
  </RadioGroup.Item>
));
RadioItem.displayName = "RadioItem";

export {
  Radio,
  RadioItem,
};
