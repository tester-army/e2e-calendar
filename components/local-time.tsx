"use client";

import { useSyncExternalStore, type ComponentProps } from "react";

// The server can't know the visitor's zone or locale, so only the browser renders these.
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
