import { createClient } from "@supabase/supabase-js";

// Admin client بيستخدم service role - بس في server-side
// مافي cookies، مافي RLS
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
