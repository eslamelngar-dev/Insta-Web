import React from "react";

async function getSiteData(username: string) {
  // هنا يتم جلب البيانات من Supabase
  return {
    title: "Eslam Elngar",
    bio: "Full Stack Developer",
    primaryColor: "#6366f1",
  };
}

export default async function PublicSite({ params }: { params: { username: string } }) {
  const data = await getSiteData(params.username);

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <header className="p-20 flex flex-col items-center justify-center min-h-screen text-center" style={{ background: `radial-gradient(circle at center, ${data.primaryColor}10, transparent)` }}>
        <div className="w-40 h-40 rounded-[2.5rem] mb-10 shadow-2xl rotate-6" style={{ backgroundColor: data.primaryColor }} />
        <h1 className="text-8xl font-black mb-8 tracking-tighter" style={{ color: data.primaryColor }}>{data.title}</h1>
        <p className="max-w-xl text-slate-500 text-2xl font-medium leading-relaxed">{data.bio}</p>
      </header>
    </div>
  );
}