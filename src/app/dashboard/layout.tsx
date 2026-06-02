import Sidebar from "@/components/shared/Sidebar";
import { isAdminIdentity } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase-server";
import { canProvisionUser, ensureUserWorkspace } from "@/lib/user-workspace";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!canProvisionUser(user)) {
    redirect("/login?error=Please%20verify%20your%20email%20first.");
  }

  const { username } = await ensureUserWorkspace(user);

  if (!username) {
    redirect("/onboarding");
  }

  const isAdmin = isAdminIdentity({
    id: user.id,
    email: user.email ?? null,
  });

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
