import { existsSync } from "node:fs";
import type { E2EConfig } from "e2e";
import { web } from "@e2e-dev/web";
import { gateway } from "ai";

// e2e loads no .env file itself.
const envFile = new URL(".env.local", import.meta.url);
if (existsSync(envFile)) process.loadEnvFile(envFile);

const app = {
  url: process.env.APP_URL ?? "http://localhost:3000",
  // Or let the runner start the dev server (and reuse one already running on that URL):
  // command: { executable: "npm", args: ["run", "dev"], reuseExisting: true, log: ".e2e/logs/app.log" },
};

export default {
  // The Vercel AI Gateway serves the model id and reads AI_GATEWAY_API_KEY, or the OIDC token of a linked Vercel project.
  agents: {
    default: {
      model: gateway("openai/gpt-6-luna-fast"),
      system: "You are a thorough QA agent. Verify every outcome.",
      context:
        "The page books a 30-minute intro call: pick a day with the Date picker, a time from the Time list, then Book. Times are listed in the visitor's own time zone and clock format. 'Next Tuesday' means the Tuesday of next week, and weeks start on Monday.",
    },
  },
  // Every test runs once per target: as a visitor in London and as one in New York.
  targets: [
    { name: "london", engine: web({ timezoneId: "Europe/London", locale: "en-GB" }), app },
    { name: "new-york", engine: web({ timezoneId: "America/New_York", locale: "en-US" }), app },
  ],
} satisfies E2EConfig;
