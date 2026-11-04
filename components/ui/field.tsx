import clsx from "clsx";
import type { ReactNode } from "react";

/** A trigger drawn as the e2e text field: the label sits on top, the value below it. */
export const FIELD = clsx(
  "flex h-e2e-7 w-full cursor-pointer items-center justify-between gap-e2e-1 bg-transparent pt-[22px] pr-e2e-6 pb-[12px] pl-e2e-2 text-left whitespace-nowrap",
  "font-cassette text-base leading-none text-e2e-off-white outline-none data-[placeholder]:text-e2e-neutral-500",
  "focus-visible:outline-2 focus-visible:outline-e2e-green",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="e2e-field">
      {children}
      <label htmlFor={htmlFor} className="e2e-field-label">
        {label}
      </label>
    </div>
  );
}
