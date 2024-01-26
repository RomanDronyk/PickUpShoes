import * as React from 'react';

import {cn} from 'app/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, ...props}, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full bg-transparent  rounded-[62px] px-3 text-base ring-offset-background  placeholder:text-placeholder placeholder:text-base placeholder:leading-none disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none placeholder:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export {Input};
