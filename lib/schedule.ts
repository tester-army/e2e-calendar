import { TZDate } from "@date-fns/tz";

// Nothing is stored, so the taken slot is fixed.
export const HOST_TIME_ZONE = "America/New_York";
export const SLOT_MINUTES = 30;
const OPEN_HOUR = 9;
const CLOSE_HOUR = 17;
const WORK_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
const TAKEN = [{ weekday: 2, hour: 11, minute: 0 }]; // Tuesdays at 11:00: someone else's weekly call

/** The free slots that start on `date` (YYYY-MM-DD) in `timeZone`. */
export function freeSlots(date: string, timeZone: string, now = new Date()): Date[] {
  const [year, month, day] = date.split("-").map(Number);
  const from = new TZDate(year, month - 1, day, timeZone);
  const to = new TZDate(year, month - 1, day + 1, timeZone);

  // A visitor's day overlaps at most three host days.
  const first = new TZDate(+from, HOST_TIME_ZONE);
  return [0, 1, 2]
    .flatMap((offset) => hostSlots(first.getFullYear(), first.getMonth(), first.getDate() + offset))
    .filter((slot) => slot >= from && slot < to && slot > now);
}

export function isFreeSlot(start: Date, now = new Date()): boolean {
  const host = new TZDate(+start, HOST_TIME_ZONE);
  return start > now && hostSlots(host.getFullYear(), host.getMonth(), host.getDate()).some((slot) => +slot === +start);
}

function hostSlots(year: number, month: number, day: number): Date[] {
  const date = new TZDate(year, month, day, HOST_TIME_ZONE);
  if (!WORK_DAYS.includes(date.getDay())) return [];

  const slots: Date[] = [];
  for (let minutes = OPEN_HOUR * 60; minutes < CLOSE_HOUR * 60; minutes += SLOT_MINUTES) {
    const [hour, minute] = [Math.floor(minutes / 60), minutes % 60];
    const taken = TAKEN.some((slot) => slot.weekday === date.getDay() && slot.hour === hour && slot.minute === minute);
    if (!taken) slots.push(new Date(+new TZDate(year, month, day, hour, minute, HOST_TIME_ZONE)));
  }
  return slots;
}
