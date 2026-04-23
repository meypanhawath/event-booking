import { createAuthClient } from "better-auth/react";

import { BETTER_AUTH_BASE_PATH } from "@/lib/better-auth-config";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  basePath: BETTER_AUTH_BASE_PATH,
});
