import { toNextJsHandler } from "better-auth/next-js";

import { ensureBetterAuthTables, getAuth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = toNextJsHandler({
  handler: async (request) => {
    try {
      await ensureBetterAuthTables();
      const auth = await getAuth();
      return await auth.handler(request);
    } catch (error) {
      console.error("Better Auth route error:", error);
      return Response.json(
        {
          message: error instanceof Error ? error.message : "Better Auth failed",
        },
        { status: 500 }
      );
    }
  },
});

export const { GET, POST, PATCH, PUT, DELETE } = handler;
