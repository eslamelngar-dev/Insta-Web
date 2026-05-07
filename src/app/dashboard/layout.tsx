import Sidebar from "@/components/shared/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar /> {/* السايد بار سيظهر ثابتاً في اليسار */}
      <main className="flex-1 overflow-y-auto">
        {children} {/* هنا ستظهر صفحات Dashboard, Billing, Settings */}
      </main>
    </div>
  );
}