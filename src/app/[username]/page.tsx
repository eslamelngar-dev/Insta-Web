import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function UserSite({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { data: site } = await supabase.from("sites").select("*").eq("username", username).single();

  if (!site) notFound();

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center transition-all duration-700" style={{ backgroundColor: `${site.primary_color}08` }}>
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-[2rem] rotate-12 mx-auto mb-8 shadow-2xl animate-pulse" style={{ backgroundColor: site.primary_color }} />
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">{site.title}</h1>
        <p className="text-slate-500 font-medium mb-12 px-4 leading-relaxed">{site.bio}</p>

        <div className="space-y-4">
          {site.links?.map((link: any) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              className="flex items-center justify-center w-full py-5 rounded-2xl font-bold text-white transition-all hover:scale-[1.03] active:scale-95 shadow-lg"
              style={{ backgroundColor: site.primary_color }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <footer className="mt-20 opacity-20 font-black text-[10px] tracking-widest uppercase">
          Build with InstaWeb
        </footer>
      </div>
    </div>
  );
}