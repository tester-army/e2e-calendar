import { BookingCard } from "@/components/booking-card";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center py-e2e-8">
      <div className="mx-auto grid w-full max-w-312 items-center gap-e2e-8 px-e2e-3 md:px-e2e-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-e2e-10">
        <div>
          <p className="type-caption text-e2e-mint">calendar example</p>
          <h1 className="mt-e2e-2 type-h1 text-e2e-off-white">
            a booking calendar,
            <br />
            tested end to end
          </h1>
          <p className="mt-e2e-3 max-w-120 type-body-l text-e2e-neutral-400">
            pick a day and a time for a call. the same e2e tests run as a visitor in London and as one in New York, and
            each sees the times in their own time zone.
          </p>
          <p className="mt-e2e-4 type-caption text-e2e-neutral-500">
            the host takes calls 9:00 to 17:00 New York time, monday to friday.
          </p>
        </div>

        <BookingCard />
      </div>
    </main>
  );
}
