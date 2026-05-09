import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import SiteRenderer from "@/components/SiteRenderer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function UserSite({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { data: site } = await supabase
    .from("sites")
    .select("*")
    .eq("username", username)
    .single();

  if (!site) notFound();

  return (
    <SiteRenderer
      site={site}
      templateId={site.template_id || "classic"}
    />
  );
}