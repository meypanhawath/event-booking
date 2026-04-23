import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { BETTER_AUTH_BASE_PATH } from "@/lib/better-auth-config";

type BetterAuthInstance = ReturnType<typeof betterAuth>;

let authPromise: Promise<BetterAuthInstance> | null = null;
let migrationsPromise: Promise<void> | null = null;

export async function getAuth() {
  if (!authPromise) {
    authPromise = (async () => {
      const { DatabaseSync } = await import("node:sqlite");

      const dataDir = join(process.cwd(), ".data");
      mkdirSync(dataDir, { recursive: true });

      const database = new DatabaseSync(join(dataDir, "better-auth.sqlite"));

      const socialProviders = {
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
          ? {
              google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                prompt: "select_account" as const,
              },
            }
          : {}),
        ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
          ? {
              github: {
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
              },
            }
          : {}),
      };

      return betterAuth({
        appName: "Eventizo",
        baseURL: process.env.BETTER_AUTH_URL,
        basePath: BETTER_AUTH_BASE_PATH,
        secret: process.env.BETTER_AUTH_SECRET,
        database,
        emailAndPassword: {
          enabled: false,
        },
        socialProviders,
        session: {
          cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
          },
        },
        account: {
          accountLinking: {
            enabled: true,
            trustedProviders: Object.keys(socialProviders),
            allowDifferentEmails: false,
          },
        },
        trustedOrigins: process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : undefined,
        telemetry: {
          enabled: false,
        },
        plugins: [nextCookies()],
      });
    })().catch((error) => {
      authPromise = null;
      throw error;
    });
  }

  return authPromise;
}

export async function ensureBetterAuthTables() {
  if (!migrationsPromise) {
    migrationsPromise = (async () => {
      const auth = await getAuth();
      const context = await auth.$context;
      await context.runMigrations();
    })().catch((error) => {
      migrationsPromise = null;
      throw error;
    });
  }

  await migrationsPromise;
}
