import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";

import { LocalTime, VisitorTimeZone } from "@/components/local-time";
import { OUTLINE_BUTTON } from "@/components/ui/outline-button";
import { HOST_TIME_ZONE, isFreeSlot, SLOT_MINUTES } from "@/lib/schedule";

export default function BookedPage({ searchParams }: PageProps<"/booked">) {
  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-105 flex-col gap-4">
        <Suspense fallback={<BookingPanel status="Checking…" />}>
          <Booking searchParams={searchParams} />
        </Suspense>
        <Link href="/" className={OUTLINE_BUTTON}>
          Book another time
        </Link>
      </div>
    </main>
  );
}

async function Booking({ searchParams }: Pick<PageProps<"/booked">, "searchParams">) {
  const { start } = await searchParams;
  const instant = new Date(typeof start === "string" ? start : NaN);

  // isFreeSlot reads the current time, which Next allows only per request.
  await connection();
  if (Number.isNaN(+instant) || !isFreeSlot(instant)) {
    return (
      <BookingPanel status="Not available">
        <span className="text-e2e-accent">This time isn&apos;t free. Pick another one.</span>
      </BookingPanel>
    );
  }

  const iso = instant.toISOString();
  const hostTime = instant.toLocaleTimeString("en-US", { timeZone: HOST_TIME_ZONE, timeStyle: "short" });
  return (
    <BookingPanel status="Booked">
      <LocalTime iso={iso} format={{ dateStyle: "full" }} data-testid="booked-date" className="text-e2e-text-bright" />
      <span className="block">
        <LocalTime iso={iso} format={{ timeStyle: "short" }} data-testid="booked-time" /> · {SLOT_MINUTES} min ·{" "}
        <VisitorTimeZone data-testid="time-zone" />
      </span>
      <span data-testid="host-time" className="mt-2 block type-caption text-e2e-text-faint">
        {hostTime} in New York, the host&apos;s time.
      </span>
    </BookingPanel>
  );
}

function BookingPanel({ status, children }: { status: string; children?: ReactNode }) {
  return (
    <section
      aria-labelledby="booking-heading"
      className="flex flex-col gap-2 border border-e2e-hairline-strong bg-e2e-panel p-5"
    >
      <h1 id="booking-heading" className="type-label-xs text-e2e-text-faint">
        Intro call
      </h1>
      <p data-testid="booking-status" className="type-h3-display text-e2e-text-bright">
        {status}
      </p>
      {children && <p className="flex flex-col type-body-s text-e2e-text-soft">{children}</p>}
    </section>
  );
}
