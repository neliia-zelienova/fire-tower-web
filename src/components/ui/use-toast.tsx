'use client';

import * as React from 'react';
import {
  ToastProvider as RadixToastProvider,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from './toats';
import { Cross1Icon } from '@radix-ui/react-icons';

type ToastOptions = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  // You can extend with variants, actions, etc.
};

type ToastContextValue = {
  toast: (opts: ToastOptions) => string; // returns id
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined,
);

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<
    (Required<Pick<ToastOptions, 'id'>> & ToastOptions)[]
  >([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((opts: ToastOptions) => {
    const id = opts.id ?? Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...opts }]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <RadixToastProvider swipeDirection="right">
        {toasts.map((t) => (
          <ToastRoot
            key={t.id}
            duration={t.duration ?? 3000}
            onOpenChange={(open) => {
              if (!open) dismiss(t.id);
            }}
            className="pointer-events-auto bg-black text-white dark:bg-white dark:text-black rounded-md px-3 py-2 shadow-md gap-2 flex flex-row items-center"
          >
            <div className="flex items-center justify-between gap-2">
              {t.title && <ToastTitle>{t.title}</ToastTitle>}
              {t.description && (
                <ToastDescription>{t.description}</ToastDescription>
              )}
            </div>

            <ToastClose aria-label="Close" className="ml-2">
              <Cross1Icon />
            </ToastClose>
          </ToastRoot>
        ))}
        <ToastViewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 outline-none" />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within <AppToastProvider>');
  }
  return ctx;
}
