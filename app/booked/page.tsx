import Link from "next/link";
import { connection } from "next/server";
import { Suspense, useId, type ReactNode } from "react";

import { LocalTime, VisitorTimeZone } from "@/components/local-time";
import { buttonClassName } from "@/components/ui/button";
import { HOST_TIME_ZONE, isFreeSlot, SLOT_MINUTES } from "@/lib/schedule";

export default function BookedPage({ searchParams }: PageProps<"/booked">) {
  return (
    <main className="flex flex-1 flex-col justify-center px-e2e-3 py-e2e-8 md:px-e2e-6">
      <div className="mx-auto flex w-full max-w-105 flex-col gap-e2e-2">
        <Suspense fallback={<BookingPanel status="checking…" pending />}>
          <Booking searchParams={searchParams} />
        </Suspense>
        <Link href="/" className={buttonClassName("outline", "w-full")}>
          book another time
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
      <BookingPanel status="not available">
        <span className="text-e2e-mint">this time isn&apos;t free. pick another one.</span>
      </BookingPanel>
    );
  }

  const iso = instant.toISOString();
  const hostTime = instant.toLocaleTimeString("en-US", { timeZone: HOST_TIME_ZONE, timeStyle: "short" });
  return (
    <BookingPanel status="booked">
      <LocalTime iso={iso} format={{ dateStyle: "full" }} data-testid="booked-date" className="text-e2e-off-white" />
      <span className="block">
        <LocalTime iso={iso} format={{ timeStyle: "short" }} data-testid="booked-time" /> · {SLOT_MINUTES} min ·{" "}
        <VisitorTimeZone data-testid="time-zone" />
      </span>
      <span data-testid="host-time" className="mt-e2e-1 block type-body-s text-e2e-neutral-500">
        {hostTime} in New York, the host&apos;s time.
      </span>
    </BookingPanel>
  );
}

// The streamed result sits hidden beside the fallback for a moment, so only the result has the test id.
function BookingPanel({ status, pending, children }: { status: string; pending?: boolean; children?: ReactNode }) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      aria-busy={pending}
      className="flex flex-col gap-e2e-1 border border-e2e-neutral-800 bg-e2e-neutral-800/40 p-e2e-3"
    >
      <h1 id={headingId} className="type-caption text-e2e-neutral-500">
        intro call
      </h1>
      <p data-testid={pending ? undefined : "booking-status"} className="mt-e2e-1 type-h3 text-e2e-off-white">
        {status}
      </p>
      {children && <p className="flex flex-col type-body-m text-e2e-neutral-300">{children}</p>}
    </section>
  );
}
