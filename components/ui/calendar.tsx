"use client";

import { cn } from "cn";
import { useEffect, useRef, type ComponentProps } from "react";
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker";

import { DottedIcon } from "@/components/ui/dotted-icon";

const CELL = cn(
  "inline-flex cursor-pointer items-center justify-center outline-none select-none",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-e2e-green",
  "disabled:pointer-events-none disabled:opacity-30",
);

// shadcn/ui's Calendar, cut down to single days.
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  labels,
  ...props
}: ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-e2e-2 [--cell-size:--spacing(10)]", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-e2e-2", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-e2e-2", defaultClassNames.month),
        nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between", defaultClassNames.nav),
        button_previous: cn(
          CELL,
          "size-(--cell-size) text-e2e-off-white aria-disabled:pointer-events-none aria-disabled:opacity-30",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          CELL,
          "size-(--cell-size) text-e2e-off-white aria-disabled:pointer-events-none aria-disabled:opacity-30",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        caption_label: cn("type-mono-m text-e2e-off-white select-none", defaultClassNames.caption_label),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn("flex-1 type-caption text-e2e-neutral-500 select-none", defaultClassNames.weekday),
        week: cn("mt-e2e-half flex w-full", defaultClassNames.week),
        day: cn("relative aspect-square h-full w-full p-0 text-center select-none", defaultClassNames.day),
        outside: cn("text-e2e-neutral-500", defaultClassNames.outside),
        disabled: cn("opacity-30", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      labels={{
        labelPrevious: () => "go to the previous month",
        labelNext: () => "go to the next month",
        ...labels,
      }}
      components={{
        Chevron: ({ orientation }) => <DottedIcon name={orientation === "left" ? "chevron-left" : "chevron-right"} />,
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.isoDate}
      data-selected-single={modifiers.selected}
      data-today={modifiers.today}
      className={cn(
        CELL,
        "aspect-square size-auto w-full min-w-(--cell-size) type-body-m text-e2e-neutral-300",
        "data-[today=true]:border data-[today=true]:border-e2e-neutral-700 data-[today=true]:text-e2e-off-white",
        "data-[selected-single=true]:border-0 data-[selected-single=true]:bg-e2e-blue data-[selected-single=true]:text-e2e-off-white",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar };
