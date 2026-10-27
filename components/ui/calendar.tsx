"use client";

import { cn } from "cn";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, type ComponentProps } from "react";
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";

// shadcn/ui's Calendar, restyled with the e2e tokens and trimmed to picking single days.
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 [--cell-size:--spacing(9)]", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ size: "icon" }),
          "size-(--cell-size) select-none aria-disabled:pointer-events-none aria-disabled:opacity-30",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ size: "icon" }),
          "size-(--cell-size) select-none aria-disabled:pointer-events-none aria-disabled:opacity-30",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        caption_label: cn("type-button-s text-e2e-text-primary select-none", defaultClassNames.caption_label),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn("flex-1 type-label-xs text-e2e-text-faint select-none", defaultClassNames.weekday),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        day: cn("relative aspect-square h-full w-full p-0 text-center select-none", defaultClassNames.day),
        outside: cn("text-e2e-text-faint", defaultClassNames.outside),
        disabled: cn("opacity-30", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) =>
          orientation === "left" ? (
            <ChevronLeftIcon className={cn("size-4", className)} {...props} />
          ) : (
            <ChevronRightIcon className={cn("size-4", className)} {...props} />
          ),
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  // DayPicker moves focus with the arrow keys; the button follows it.
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      size="icon"
      data-day={day.isoDate}
      data-selected-single={modifiers.selected}
      data-today={modifiers.today}
      className={cn(
        "aspect-square size-auto w-full min-w-(--cell-size)",
        "data-[today=true]:inset-ring-[0.5px] data-[today=true]:inset-ring-e2e-chip-stroke",
        "data-[selected-single=true]:bg-e2e-button-fill-solid data-[selected-single=true]:font-medium data-[selected-single=true]:text-e2e-text-on-light data-[selected-single=true]:hover:bg-e2e-paper-0",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
