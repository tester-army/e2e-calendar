import { BookingCard } from "@/components/booking-card";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10">
      <div className="mx-auto grid w-full max-w-300 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
        <div>
          <h1 className="type-h1 text-e2e-text-primary">
            A booking calendar,
            <br />
            tested end to end
          </h1>
          <p className="mt-4 max-w-120 type-body text-e2e-text-secondary">
            Pick a day and a time for a call. The same e2e tests run as a visitor in London and as one in New York, and
            each sees the times in their own time zone.
          </p>
          <p className="mt-8 type-code-s text-e2e-text-faint">
            The host takes calls 9:00 to 17:00 New York time, Monday to Friday.
          </p>
        </div>

        <BookingCard />
      </div>
    </main>
  );
}
