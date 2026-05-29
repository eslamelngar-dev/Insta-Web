import { redirect } from "next/navigation";
import AdminAccountsManager from "@/components/admin/AdminAccountsManager";
import { fetchAdminAccountsSnapshot, requireAdmin } from "@/lib/admin";

export default async function AdminPage() {
  let adminEmail: string | null = null;

  try {
    const { user } = await requireAdmin();
    adminEmail = user.email ?? null;
  } catch {
    redirect("/dashboard");
  }

  const accounts = await fetchAdminAccountsSnapshot(200);

  return (
    <AdminAccountsManager initialAccounts={accounts} adminEmail={adminEmail} />
  );
}
