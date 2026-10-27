"use client";

import { useSyncExternalStore, type ComponentProps } from "react";

// The server can't know the visitor's time zone or locale, so it renders nothing here and the browser fills it in.
const subscribe = () => () => {};

export function useVisitorTimeZone() {
  return useSyncExternalStore(
    subscribe,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => null,
  );
}

export function VisitorTimeZone(props: ComponentProps<"span">) {
  return <span {...props}>{useVisitorTimeZone() ?? "your time zone"}</span>;
}

/** An instant in the visitor's time zone and locale. */
export function LocalTime({
  iso,
  format,
  ...props
}: { iso: string; format: Intl.DateTimeFormatOptions } & ComponentProps<"time">) {
  const text = useSyncExternalStore(
    subscribe,
    () => new Date(iso).toLocaleString(undefined, format),
    () => null,
  );
  return (
    <time dateTime={iso} {...props}>
      {text}
    </time>
  );
}
