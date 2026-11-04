"use client";

import { format } from "date-fns";
import { useRef, useState } from "react";

import { VisitorTimeZone } from "@/components/local-time";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DottedIcon } from "@/components/ui/dotted-icon";
import { FIELD, Field } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const dayFormat = { weekday: "long", day: "numeric", month: "long" } as const;

export function BookingCard() {
  const [day, setDay] = useState<Date>();
  const [pickingDay, setPickingDay] = useState(false);
  const [slots, setSlots] = useState<string[] | "loading" | "failed">([]);
  const [start, setStart] = useState("");
  const slotsRequest = useRef<AbortController>(null);

  async function pickDay(picked: Date) {
    setDay(picked);
    setPickingDay(false);
    setStart("");
    setSlots("loading");

    slotsRequest.current?.abort();
    const request = new AbortController();
    slotsRequest.current = request;

    const query = new URLSearchParams({
      date: format(picked, "yyyy-MM-dd"),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    try {
      const response = await fetch(`/api/slots?${query}`, { signal: request.signal });
      if (!response.ok) throw new Error(`GET /api/slots answered ${response.status}`);
      const body: { slots: string[] } = await response.json();
      setSlots(body.slots);
    } catch (error) {
      if (!request.signal.aborted) {
        console.error(error);
        setSlots("failed");
      }
    }
  }

  const options = Array.isArray(slots) ? slots : [];
  const placeholder = !day
    ? "pick a day first"
    : slots === "loading"
      ? "loading times…"
      : slots === "failed"
        ? "couldn't load the times"
        : options.length === 0
          ? "no free times"
          : "pick a time";

  return (
    <section
      aria-labelledby="offer-heading"
      className="flex flex-col gap-e2e-3 border border-e2e-neutral-800 bg-e2e-neutral-800/40 p-e2e-3"
    >
      <div className="flex flex-col gap-e2e-1">
        <h2 id="offer-heading" className="type-h3 text-e2e-off-white">
          intro call
        </h2>
        <p className="type-body-m text-e2e-neutral-400">30 min · with the e2e team in New York</p>
      </div>

      <form action="/booked" className="flex flex-col gap-e2e-2">
        <Field label="date" htmlFor="day">
          <Popover open={pickingDay} onOpenChange={setPickingDay}>
            <PopoverTrigger id="day" className={FIELD}>
              <span className={day ? undefined : "text-e2e-neutral-500"}>
                {day ? day.toLocaleDateString(undefined, dayFormat) : "pick a day"}
              </span>
              <span className="e2e-field-caret">
                <DottedIcon name="chevron-down" />
              </span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <DayCalendar selected={day} onSelect={pickDay} />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="time" htmlFor="time">
          <Select name="start" required value={start} onValueChange={setStart} disabled={options.length === 0}>
            <SelectTrigger id="time">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {options.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {new Date(slot).toLocaleTimeString(undefined, { timeStyle: "short" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <p className="type-body-s text-e2e-neutral-500">
          times in <VisitorTimeZone data-testid="time-zone" />
        </p>

        <Button type="submit" disabled={!start} className="mt-e2e-1 w-full">
          book
        </Button>
      </form>
    </section>
  );
}

// Only renders in the open popover, so "today" is the browser's, never the server's.
function DayCalendar({ selected, onSelect }: { selected?: Date; onSelect: (day: Date) => void }) {
  const today = new Date();

  return (
    <Calendar
      mode="single"
      required
      selected={selected}
      onSelect={onSelect}
      defaultMonth={selected ?? today}
      startMonth={today}
      showOutsideDays={false}
      disabled={[{ before: today }, { dayOfWeek: [0, 6] }]}
      autoFocus
    />
  );
}
