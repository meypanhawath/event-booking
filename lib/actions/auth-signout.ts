import {headers} from "next/headers";
import {auth} from "@/lib/auth";

export const signOut = async () => {
    const result = await auth.api.signOut({ headers: await headers() });
    return result;
};