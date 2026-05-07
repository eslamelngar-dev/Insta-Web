import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

// إعداد Supabase للعمل في بيئة السيرفر (Server Component لـ SEO ممتاز)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function UserSite({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // جلب بيانات الموقع من قاعدة البيانات
  const { data: site } = await supabase
    .from("sites")
    .select("*")
    .eq("username", username)
    .single();

  // لو الرابط غلط أو الموقع مش موجود، هنوجهه لصفحة 404
  if (!site) {
    notFound(); 
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500" 
      style={{ backgroundColor: `${site.primary_color}10` }}
    >
      <div 
        className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 max-w-lg w-full text-center border-t-8" 
        style={{ borderColor: site.primary_color }}
      >
        <div 
          className="w-28 h-28 rounded-3xl rotate-6 mx-auto mb-8 shadow-xl transition-transform hover:rotate-12 duration-300" 
          style={{ backgroundColor: site.primary_color }} 
        />
        <h1 className="text-4xl font-black mb-4 text-slate-900">{site.title}</h1>
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">{site.bio}</p>
        
        {/* زرار مبدئي هنربطه بعدين باللينكات الحقيقية */}
        <a 
          href="#" 
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg"
          style={{ backgroundColor: site.primary_color, boxShadow: `0 10px 25px -5px ${site.primary_color}60` }}
        >
          <ExternalLink size={20} />
          Visit My Work
        </a>
      </div>
    </div>
  );
}