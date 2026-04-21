"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminData } from "@/lib/admin-auth";
import { DashboardClient } from "@/components/ui/dashboard-client";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const cookieStore = await cookies();
  const authToken = cookieStore.get("better-auth.session_data");
  if (!authToken) {
    redirect("/login");
  }

  const token = authToken?.value;
  const res = await getAdminData(token);

  if (res.role !== "admin") {
    redirect("/");
  }
  return (
    <main>
      <h2>Welcome, {session?.user.name}</h2>
      <DashboardClient />
    </main>
  );
}
