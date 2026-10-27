"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRef, useState } from "react";

import { VisitorTimeZone } from "@/components/local-time";
import { Calendar } from "@/components/ui/calendar";
import { FIELD, Field } from "@/components/ui/field";
import { LightButton } from "@/components/ui/light-button";
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
    ? "Pick a day first"
    : slots === "loading"
      ? "Loading times…"
      : slots === "failed"
        ? "Couldn't load the times"
        : options.length === 0
          ? "No free times"
          : "Pick a time";

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
              <DayCalendar selected={day} onSelect={pickDay} />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Time" htmlFor="time">
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

        <p className="type-caption text-e2e-text-faint">
          Times in <VisitorTimeZone data-testid="time-zone" />
        </p>

        <LightButton type="submit" disabled={!start}>
          Book
        </LightButton>
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
      disabled={[{ before: today }, { dayOfWeek: [0, 6] }]}
      autoFocus
    />
  );
}
