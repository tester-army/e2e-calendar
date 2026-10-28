import { test } from "@e2e-dev/web";
import { expect } from "e2e";

import { readVisitor } from "./fixtures";

test("the offer card shows the call, the Date and Time fields, and a disabled Book button", async ({ app, screen }) => {
  await app.open("/");

  await expect(screen.getByRole("heading", "A booking calendar, tested end to end")).toBeVisible();
  await expect(screen.getByRole("heading", "Intro call")).toBeVisible();
  await expect(screen.getByLabel("Date")).toHaveText("Pick a day");
  await expect(screen.getByLabel("Time")).toBeDisabled();
  await expect(screen.getByRole("button", "Book")).toBeDisabled();
});

test("the times are in the browser's time zone", async ({ app, screen, browser }) => {
  await app.open("/");

  const { timeZone } = await readVisitor(browser);
  await expect(screen.getByTestId("time-zone")).toHaveText(timeZone);
});
