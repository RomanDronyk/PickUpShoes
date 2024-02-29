import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import {cva, type VariantProps} from 'class-variance-authority';
import {X} from 'lucide-react';

import {cn} from 'app/lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({className, ...props}, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({side = 'right', className, children, ...props}, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({side}), className)}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'relative flex flex-col  text-center sm:text-left',
      className,
    )}
    {...props}
  >
    {children}
    <SheetPrimitive.Close className="rounded-sm  ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.1473 9.99522L19.7627 1.37653C19.9147 1.22387 20 1.01724 19.9998 0.801892C19.9997 0.58654 19.9142 0.380023 19.762 0.227572C19.4573 -0.0753477 18.9208 -0.0768773 18.6131 0.229103L10 8.84779L1.38387 0.226808C1.07771 -0.0753476 0.541158 -0.0738178 0.236528 0.228337C0.160915 0.303604 0.101059 0.393167 0.0604521 0.4918C0.0198453 0.590433 -0.00069891 0.696162 1.81432e-05 0.802815C1.81432e-05 1.02006 0.0842125 1.22354 0.236528 1.37423L8.8519 9.99445L0.237293 18.6154C0.0852729 18.7683 0.000139875 18.9752 0.000570347 19.1908C0.00100082 19.4063 0.0869598 19.6129 0.239589 19.7652C0.387312 19.9113 0.596267 19.9954 0.812111 19.9954H0.816703C1.03331 19.9946 1.24227 19.9097 1.38693 19.7621L10 11.1434L18.6161 19.7644C18.7685 19.9158 18.9721 20 19.1879 20C19.2946 20.0003 19.4004 19.9795 19.499 19.9388C19.5977 19.8982 19.6873 19.8384 19.7628 19.763C19.8383 19.6875 19.8981 19.5979 19.9388 19.4993C19.9795 19.4007 20.0003 19.2951 20 19.1884C20 18.9719 19.9158 18.7677 19.7627 18.617L11.1473 9.99522Z"
          fill="black"
        />
      </svg>
      <span className="sr-only">Close</span>
    </SheetPrimitive.Close>
  </div>
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({className, ...props}, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({className, ...props}, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
