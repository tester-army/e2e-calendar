import { describe, test } from "@e2e-dev/web";
import { expect } from "e2e";
import { z } from "zod";

import {
  HOST_TIME_ZONE,
  TUESDAY,
  WEDNESDAY,
  at,
  formatBookedDate,
  formatPickedDay,
  formatTime,
  nextWeekday,
  pickableDaysThisMonth,
  readVisitor,
  skip,
} from "./fixtures";

// Every test runs on both targets: London (en-GB) and New York (en-US).
describe("booking", { tags: ["booking"], skip }, () => {
  test("books next Tuesday at 14:30 in the visitor's time zone", async ({ app, agent, screen, browser }) => {
    await app.open("/");
    const visitor = await readVisitor(browser);

    await agent.act("book next Tuesday at 14:30");

    // 14:30 UTC in London, 19:30 UTC in New York.
    const start = at(nextWeekday(TUESDAY, visitor.timeZone), "14:30");
    await expect(screen.getByTestId("booking-status")).toHaveText("Booked");
    await expect(screen.getByTestId("booked-time")).toHaveAttribute("datetime", start.toISOString());
    await expect(screen.getByTestId("booked-time")).toHaveText(formatTime(start, visitor));
    await expect(screen.getByTestId("booked-date")).toHaveText(formatBookedDate(start, visitor));
    await expect(screen.getByTestId("time-zone")).toHaveText(visitor.timeZone);
  });

  test("books the same slot from each time zone", async ({ app, agent, screen, browser }) => {
    await app.open("/");
    const visitor = await readVisitor(browser);

    // The list shows local times, so London's agent has to find 15:00.
    await agent.act("book next Tuesday at 10:00 New York time");

    const start = at(nextWeekday(TUESDAY, visitor.timeZone), "10:00", HOST_TIME_ZONE);
    await expect(screen.getByTestId("booking-status")).toHaveText("Booked");
    await expect(screen.getByTestId("booked-time")).toHaveAttribute("datetime", start.toISOString());
    await expect(screen.getByTestId("booked-time")).toHaveText(formatTime(start, visitor));
    await expect(screen.getByTestId("host-time")).toHaveText("10:00 AM in New York, the host's time.");
  });

  // e2e's agent can't see focus move, so it presses Enter on named controls rather than using Tab and the arrows.
  test(
    "books with the mouse switched off",
    {
      timeout: 180_000,
      agentContext:
        "The mouse is switched off in this test: clicks and taps do nothing. Press Enter on a control instead of clicking it: on the Date field to open the calendar, on Go to the Next Month to page it, on a day's button to pick it, on the Time field to open the list, on a time to pick it, and on Book.",
    },
    async ({ app, agent, screen, browser }) => {
      await browser.addInitScript(switchOffTheMouse);
      await app.open("/");
      const visitor = await readVisitor(browser);

      await agent.act("book next Wednesday at the earliest free time");

      // Nothing is taken on Wednesdays, so the earliest is 9:00 New York.
      const start = at(nextWeekday(WEDNESDAY, visitor.timeZone), "09:00", HOST_TIME_ZONE);
      await expect(screen.getByTestId("booking-status")).toHaveText("Booked");
      await expect(screen.getByTestId("booked-time")).toHaveAttribute("datetime", start.toISOString());
    },
  );

  test("past days and weekends can't be picked", async ({ app, agent, screen, browser }) => {
    await app.open("/");
    const { timeZone } = await readVisitor(browser);

    await agent.act("open the date picker");
    await expect(screen.getByRole("grid")).toBeVisible();

    await agent.assert(
      "in the calendar, every Saturday and Sunday shown is greyed out, every day before today is greyed out, and the weekdays from today on are not",
      { vision: true },
    );

    const month = await screen.getByRole("grid").getAttribute("aria-label");
    const { days } = await agent.extract(`the day number of every enabled day button in the ${month} grid`, {
      schema: z.object({ days: z.array(z.number().int()) }),
    });
    expect(days).toEqual(pickableDaysThisMonth(timeZone));
    await expect(screen.getByRole("button", "Go to the Previous Month")).toBeDisabled();
  });

  test("a taken slot isn't offered, on the page or by the API", async ({ app, agent, screen, browser }) => {
    await app.open("/");
    const visitor = await readVisitor(browser);
    const tuesday = nextWeekday(TUESDAY, visitor.timeZone);

    const slotsResponse = browser.waitForResponse("**/api/slots?**", { timeout: 120_000 });
    await agent.act("pick next Tuesday as the date");
    await expect(screen.getByRole("button", "Date")).toHaveText(formatPickedDay(tuesday, visitor));
    const response = await slotsResponse;

    const query = new URL(response.url).searchParams;
    expect(query.get("timeZone")).toBe(visitor.timeZone);

    const { slots } = await response.json<{ slots: string[] }>();
    expect(slots).toContain(at(tuesday, "10:30", HOST_TIME_ZONE).toISOString());
    expect(slots).not.toContain(at(tuesday, "11:00", HOST_TIME_ZONE).toISOString());
    expect(slots).toContain(at(tuesday, "11:30", HOST_TIME_ZONE).toISOString());

    await screen.getByRole("combobox", "Time").tap();
    await expect(screen.getByRole("option")).toHaveText(slots.map((slot) => formatTime(new Date(slot), visitor)));
  });
});

// A click from a key press has no click count, so it still goes through.
function switchOffTheMouse() {
  const block = (event: Event) => {
    if (event.type === "click" && (event as MouseEvent).detail === 0) return;
    event.stopImmediatePropagation();
    event.preventDefault();
  };
  for (const type of ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "dblclick"]) {
    window.addEventListener(type, block, true);
  }
}
