"use client";

import { CalendarIcon } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { Calendar } from "@/components/ui/calendar";
import { FIELD, Field } from "@/components/ui/field";
import { LightButton } from "@/components/ui/light-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const dayFormat = { weekday: "long", day: "numeric", month: "long" } as const;

export function BookingCard() {
  const [day, setDay] = useState<Date>();
  const [pickingDay, setPickingDay] = useState(false);
  const [start, setStart] = useState("");
  const timeZone = useVisitorTimeZone();
  // Free slots arrive with GET /api/slots in step 3.
  const slots: { start: string; label: string }[] = [];

  return (
    <section
      aria-labelledby="offer-heading"
      className="flex flex-col gap-6 border border-e2e-hairline-strong bg-e2e-panel p-5"
    >
      <div className="flex flex-col gap-1">
        <h2 id="offer-heading" className="type-h3-display text-e2e-text-bright">
          Intro call
        </h2>
        <p className="type-body-s text-e2e-text-secondary">30 min · with the e2e team in New York</p>
      </div>

      <form action="/booked" className="flex flex-col gap-4">
        <Field label="Date" htmlFor="day">
          <Popover open={pickingDay} onOpenChange={setPickingDay}>
            <PopoverTrigger id="day" className={FIELD}>
              <span className={day ? undefined : "text-e2e-text-faint"}>
                {day ? day.toLocaleDateString(undefined, dayFormat) : "Pick a day"}
              </span>
              <CalendarIcon className="size-4 text-e2e-text-faint" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <DayCalendar
                selected={day}
                onSelect={(picked) => {
                  setDay(picked);
                  setStart("");
                  setPickingDay(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Time" htmlFor="time">
          <Select name="start" required value={start} onValueChange={setStart} disabled={slots.length === 0}>
            <SelectTrigger id="time">
              <SelectValue placeholder={day ? "No free times" : "Pick a day first"} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {slots.map((slot) => (
                <SelectItem key={slot.start} value={slot.start}>
                  {slot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <p className="type-caption text-e2e-text-faint">
          Times in <span data-testid="time-zone">{timeZone ?? "your time zone"}</span>
        </p>

        <LightButton type="submit" disabled={!start}>
          Book
        </LightButton>
      </form>
    </section>
  );
}

// Only rendered in the open popover, so "today" is always the browser's today, never the server's.
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
      disabled={[{ before: today }, { dayOfWeek: [0, 6] }]}
      autoFocus
    />
  );
}

const subscribe = () => () => {};

// The server can't know the visitor's time zone, so it renders null and the browser fills it in.
function useVisitorTimeZone() {
  return useSyncExternalStore(
    subscribe,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => null,
  );
}
