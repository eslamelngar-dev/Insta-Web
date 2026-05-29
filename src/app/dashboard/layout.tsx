import Sidebar from "@/components/shared/Sidebar";
import { isAdminIdentity } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin =
    !!user &&
    isAdminIdentity({
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
