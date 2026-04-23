"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAuth } from "../auth";

export const signInSocial = async (provider: "github" | "google") => {
    const auth = await getAuth();
    const { url } = await auth.api.signInSocial({
        body: {
            provider,
            callbackURL: "/auth/social-complete",
        },
    });

    if (url) {
        redirect(url);
    }
};

export const signOut = async () => {
    const auth = await getAuth();
    const result = await auth.api.signOut({ headers: await headers() });
    return result;
};
