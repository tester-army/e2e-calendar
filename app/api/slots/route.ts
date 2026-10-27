import { freeSlots } from "@/lib/schedule";

// GET /api/slots?date=2026-11-03&timeZone=Europe/London → { "slots": ["2026-11-03T14:00:00.000Z", …] }
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const date = params.get("date") ?? "";
  const timeZone = params.get("timeZone") ?? "";

  if (!isDate(date) || !isTimeZone(timeZone)) {
    return Response.json({ error: "Pass date as YYYY-MM-DD and timeZone as an IANA time zone." }, { status: 400 });
  }
  return Response.json({ slots: freeSlots(date, timeZone).map((slot) => slot.toISOString()) });
}

// A real day: 2026-02-31 rolls over to March, and 2026-13-01 doesn't parse.
function isDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(+date) && date.toISOString().startsWith(value);
}

function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return value !== "";
  } catch {
    return false;
  }
}
