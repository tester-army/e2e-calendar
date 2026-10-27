import clsx from "clsx";
import type { ReactNode } from "react";

// The landing configurator's input, for the Date and Time triggers.
export const FIELD = clsx(
  "flex h-11 w-full items-center justify-between gap-2 px-4 whitespace-nowrap",
  "border border-e2e-field-stroke bg-e2e-field-fill type-field text-e2e-text-primary",
  "transition-colors outline-none hover:border-e2e-white-50 focus-visible:border-e2e-white-80",
  "disabled:pointer-events-none disabled:opacity-40 data-[placeholder]:text-e2e-text-faint",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
);

export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="type-label-xs text-e2e-text-faint">
        {label}
      </label>
      {children}
    </div>
  );
}
