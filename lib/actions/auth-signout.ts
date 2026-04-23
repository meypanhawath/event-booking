import { headers } from "next/headers";

import { getAuth } from "@/lib/auth";

export const signOut = async () => {
    const auth = await getAuth();
    const result = await auth.api.signOut({ headers: await headers() });
    return result;
};
