import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[var(--color-ink)]">
      <DashboardHeader username={session.username} />
      <DashboardClient />
    </main>
  );
}
