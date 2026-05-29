"use client";

import React, { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  BarChart3,
  Users,
  Globe,
  Monitor,
  Smartphone,
  ArrowUpRight,
  Loader2,
  Clock,
  Map,
  Layout,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Site {
  id: string;
  title: string;
  username: string;
  primary_color: string;
}

interface RealStats {
  totalViews: number;
  uniqueVisitors: number;
  topReferrers: { name: string; views: number; color: string }[];
  devices: {
    name: string;
    percentage: number;
    icon: React.ElementType;
    color: string;
  }[];
}

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RealStats>({
    totalViews: 0,
    uniqueVisitors: 0,
    topReferrers: [],
    devices: [],
  });

  useEffect(() => {
    const fetchSiteAndStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: membership } = await supabase
        .from("account_members")
        .select("account_id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!membership) {
        router.push("/dashboard");
        return;
      }

      const { data: siteData, error: siteError } = await supabase
        .from("sites")
        .select("id, title, username, primary_color")
        .eq("id", id)
        .eq("account_id", membership.account_id)
        .single();

      if (siteError || !siteData) {
        router.push("/dashboard");
        return;
      }

      setSite(siteData);

      const { data: viewsData } = await supabase
        .from("page_views")
        .select("visitor_id, device, referrer")
        .eq("site_id", id)
        .eq("account_id", membership.account_id);

      if (viewsData && viewsData.length > 0) {
        const totalViews = viewsData.length;

        const uniqueSet = new Set(viewsData.map((v) => v.visitor_id));
        const uniqueVisitors = uniqueSet.size;

        const referrersMap: Record<string, number> = {};
        viewsData.forEach((v) => {
          const ref = v.referrer && v.referrer !== "" ? v.referrer : "Direct";
          referrersMap[ref] = (referrersMap[ref] || 0) + 1;
        });

        const colors = [
          "bg-blue-500",
          "bg-pink-500",
          "bg-slate-800 dark:bg-slate-200",
          "bg-indigo-500",
        ];

        const topReferrers = Object.entries(referrersMap)
          .map(([name, views], idx) => ({
            name,
            views,
            color: colors[idx % colors.length],
          }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 4);

        const devicesMap = { Mobile: 0, Desktop: 0, Tablet: 0 };
        viewsData.forEach((v) => {
          const dev = (v.device as keyof typeof devicesMap) || "Desktop";
          if (devicesMap[dev] !== undefined) devicesMap[dev]++;
        });

        const devices = [
          {
            name: "Mobile",
            percentage: Math.round((devicesMap.Mobile / totalViews) * 100) || 0,
            icon: Smartphone,
            color: "text-indigo-500",
          },
          {
            name: "Desktop",
            percentage:
              Math.round((devicesMap.Desktop / totalViews) * 100) || 0,
            icon: Monitor,
            color: "text-purple-500",
          },
          {
            name: "Tablet",
            percentage: Math.round((devicesMap.Tablet / totalViews) * 100) || 0,
            icon: Layout,
            color: "text-amber-500",
          },
        ];

        setStats({ totalViews, uniqueVisitors, topReferrers, devices });
      }

      setLoading(false);
    };

    fetchSiteAndStats();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  if (!site) return null;

  const siteColor = site.primary_color || "#6366f1";

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-12 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all border border-slate-100 dark:border-white/5"
            >
              <ChevronLeft size={20} className="text-slate-500" />
            </Link>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                <BarChart3 size={28} style={{ color: siteColor }} />
                Analytics Overview
              </h2>
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                Project: <span style={{ color: siteColor }}>{site.title}</span>{" "}
                (/{site.username})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Tracking Active
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              label: "Total Views",
              value: stats.totalViews.toLocaleString(),
              icon: Globe,
              trend: "Real-time",
            },
            {
              label: "Unique Visitors",
              value: stats.uniqueVisitors.toLocaleString(),
              icon: Users,
              trend: "Real-time",
            },
            {
              label: "Avg. Time",
              value: "~1m 20s",
              icon: Clock,
              trend: "Est.",
            },
            {
              label: "Bounce Rate",
              value: "N/A",
              icon: ArrowUpRight,
              trend: "Est.",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-sm relative overflow-hidden group"
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity rounded-full -mr-10 -mt-10 blur-xl"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${siteColor}, transparent)`,
                }}
              />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <stat.icon
                    size={20}
                    className="text-slate-500 dark:text-slate-400"
                  />
                </div>
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">
                {stat.label}
              </h4>
              <p className="text-3xl font-black text-slate-900 dark:text-white relative z-10">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-3 mb-8">
              <Map size={20} className="text-slate-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Traffic Sources
              </h3>
            </div>
            {stats.topReferrers.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-bold uppercase">
                No data yet
              </div>
            ) : (
              <div className="space-y-6">
                {stats.topReferrers.map((ref, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-slate-500">{ref.name}</span>
                      <span className="text-slate-900 dark:text-white">
                        {ref.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(ref.views / stats.totalViews) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`h-full ${ref.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <Smartphone size={20} className="text-slate-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Device Analytics
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.devices.map((device, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex flex-col items-center justify-center text-center gap-3 border border-slate-100 dark:border-white/5"
                >
                  <div
                    className={`p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm ${device.color}`}
                  >
                    <device.icon size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {device.percentage}%
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      {device.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              {stats.devices.map((device, i) => (
                <motion.div
                  key={i}
                  initial={{ width: 0 }}
                  animate={{ width: `${device.percentage}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className={`h-full ${device.color.replace("text-", "bg-")}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
