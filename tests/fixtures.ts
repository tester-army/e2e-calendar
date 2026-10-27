import { TZDate } from "@date-fns/tz";
import type { Browser } from "@e2e-dev/web";

export const skip =
  !process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN
    ? "set AI_GATEWAY_API_KEY to run the agent tests"
    : false;

// lib/schedule.ts: New York, weekdays 9:00 to 17:00, Tuesdays at 11:00 taken.
export const HOST_TIME_ZONE = "America/New_York";
export const TUESDAY = 2;
export const WEDNESDAY = 3;

export type Visitor = { timeZone: string; locale: string };

/** The target's `timezoneId` and `locale`, read from the browser. Needs an open page. */
export function readVisitor(browser: Browser): Promise<Visitor> {
  return browser.evaluate(() => {
    const { timeZone, locale } = Intl.DateTimeFormat().resolvedOptions();
    return { timeZone, locale };
  });
}

/** That weekday next week, weeks starting on Monday: the agent's "next Tuesday". */
export function nextWeekday(weekday: number, timeZone: string): TZDate {
  const today = TZDate.tz(timeZone);
  const daysSinceMonday = (today.getDay() + 6) % 7;
  const nextMonday = today.getDate() - daysSinceMonday + 7;
  return new TZDate(today.getFullYear(), today.getMonth(), nextMonday + ((weekday + 6) % 7), timeZone);
}

export function pickableDaysThisMonth(timeZone: string): number[] {
  const today = TZDate.tz(timeZone);
  const days: number[] = [];
  for (let day = today.getDate(); ; day++) {
    const date = new TZDate(today.getFullYear(), today.getMonth(), day, timeZone);
    if (date.getMonth() !== today.getMonth()) return days;
    if (date.getDay() !== 0 && date.getDay() !== 6) days.push(day);
  }
}

/** The instant a clock in `timeZone` shows `time` (HH:MM) on `day`'s date. */
export function at(day: TZDate, time: string, timeZone = day.timeZone): Date {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(+new TZDate(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute, timeZone));
}

export function formatDay(day: TZDate, visitor: Visitor): string {
  return day.toLocaleDateString(visitor.locale, {
    timeZone: visitor.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatTime(instant: Date, visitor: Visitor): string {
  return instant.toLocaleTimeString(visitor.locale, { timeZone: visitor.timeZone, timeStyle: "short" });
}

export function formatDate(instant: Date, visitor: Visitor): string {
  return instant.toLocaleDateString(visitor.locale, { timeZone: visitor.timeZone, dateStyle: "full" });
}
