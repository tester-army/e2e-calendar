import { test } from "@e2e-dev/web";
import { expect } from "e2e";

import { readVisitor } from "./fixtures";

test("the offer card shows the call, the date and time fields, and a disabled book button", async ({ app, screen }) => {
  await app.open("/");

  await expect(screen.getByRole("heading", "a booking calendar, tested end to end")).toBeVisible();
  await expect(screen.getByRole("heading", "intro call")).toBeVisible();
  await expect(screen.getByLabel("date")).toHaveText("pick a day");
  await expect(screen.getByLabel("time")).toBeDisabled();
  await expect(screen.getByRole("button", "book")).toBeDisabled();
});

test("the times are in the browser's time zone", async ({ app, screen, browser }) => {
  await app.open("/");

  const { timeZone } = await readVisitor(browser);
  await expect(screen.getByTestId("time-zone")).toHaveText(timeZone);
});
