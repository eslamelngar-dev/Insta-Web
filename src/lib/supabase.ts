import { createBrowserClient } from '@supabase/ssr';

// إنشاء عميل Supabase للعمل داخل مكونات الواجهة (Client Components)
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);