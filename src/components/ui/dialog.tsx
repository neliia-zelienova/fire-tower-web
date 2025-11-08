'use client';
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';

// Primitive re-exports
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogOverlay = DialogPrimitive.Overlay;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = () => (
  <DialogPrimitive.Close
    aria-label="Close"
    className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10"
  >
    <Cross1Icon />
  </DialogPrimitive.Close>
);

// Opinionated Content that includes an Overlay and Close button
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 z-50 bg-black/50" />
    <DialogPrimitive.Content
      {...props}
      ref={ref}
      className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white text-black dark:bg-neutral-900 dark:text-white rounded-md p-4 shadow-lg max-w-2xl w-[90vw] ${
        // preserve incoming className if provided
        (props as any)?.className || ''
      }`}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));

export const DialogContentWrapper = DialogContent as unknown as React.FC<
  React.PropsWithChildren<{}>
>;
