import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import {cn} from 'app/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({className, ...props}, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-[47px] w-[98px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50   data-[state=unchecked]:bg-switchWoomenBlack bg-no-repeat data-[state=unchecked]:[background-position:85%] data-[state=checked]:bg-swtichMenBlack data-[state=checked]:[background-position:15%]   bg-[#f6f6f6]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-full w-2/4 rounded-full bg-black data-[state=unchecked]:bg-swtichMenWite bg-no-repeat bg-center data-[state=checked]:bg-switchWoomenWhite   shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-11 data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export {Switch};
