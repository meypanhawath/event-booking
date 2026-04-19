"use client"


import { redirect } from "next/navigation";
import {Button} from "@/components/ui/button";
import {signOut} from "better-auth/api";

export function DashboardClient() {
    const handleSignOut = async () => {
        await signOut();
        redirect("/")
    };
    return (
        <Button onClick={() => handleSignOut()}>Sign Out</Button>

    )
}
