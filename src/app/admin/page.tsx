import { redirect } from "next/navigation";
import AdminAccountsManager from "@/components/admin/AdminAccountsManager";
import {
  fetchAdminAccountsSnapshot,
  fetchPlatformStats,
  requireAdmin,
} from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminContext = await requireAdmin().catch(() => redirect("/dashboard"));

  const [accounts, stats] = await Promise.all([
    fetchAdminAccountsSnapshot(200),
    fetchPlatformStats(),
  ]);

  return (
    <AdminAccountsManager
      initialAccounts={accounts}
      initialStats={stats}
      adminEmail={adminContext.user.email ?? null}
    />
  );
}
