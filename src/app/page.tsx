"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Globe,
  ShieldCheck,
  Sparkles,
  MousePointer2,
  CheckCircle2,
  BarChart3,
  Palette,
  Plus,
  Minus,
} from "lucide-react";
import {
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaDiscord,
  FaYoutube,
} from "react-icons/fa";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-4xl hover:border-indigo-500/50 transition-all group shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
  >
    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 text-indigo-600 dark:text-indigo-400">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

const StepCard = ({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) => (
  <div className="relative p-8 text-center md:text-left">
    <div className="text-6xl font-black text-slate-100 dark:text-white/5 absolute top-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 -z-10 select-none">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-3 mt-4">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
      {desc}
    </p>
  </div>
);

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 dark:border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {question}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-500 dark:text-slate-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SocialIcon = ({
  icon,
  href,
}: {
  icon: React.ReactNode;
  href: string;
}) => (
  <Link
    href={href}
    className="w-11 h-11 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:scale-110 transition-all duration-300"
  >
    {icon}
  </Link>
);

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center">
    <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
      {value}
    </div>
    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
      {label}
    </div>
  </div>
);

type ThemeKey = "indigo" | "emerald" | "rose";

interface ThemeConfig {
  bgGlow: string;
  avatarGrad: string;
  shadow: string;
  textGrad: string;
  iconTheme: string;
  borderHover: string;
  colorDot: string;
  successMsg: string;
  paletteIcon: string;
}

const themes: Record<ThemeKey, ThemeConfig> = {
  indigo: {
    bgGlow: "from-indigo-500/20 to-purple-500/20",
    avatarGrad: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/30",
    textGrad: "from-indigo-500 to-purple-500",
    iconTheme: "text-indigo-500",
    borderHover: "hover:border-indigo-500/50",
    colorDot: "bg-indigo-500",
    successMsg: "bg-indigo-600 shadow-indigo-600/30",
    paletteIcon: "text-indigo-500",
  },
  emerald: {
    bgGlow: "from-emerald-500/20 to-teal-500/20",
    avatarGrad: "from-emerald-400 to-teal-500",
    shadow: "shadow-emerald-500/30",
    textGrad: "from-emerald-400 to-teal-500",
    iconTheme: "text-emerald-500",
    borderHover: "hover:border-emerald-500/50",
    colorDot: "bg-emerald-500",
    successMsg: "bg-emerald-600 shadow-emerald-600/30",
    paletteIcon: "text-emerald-500",
  },
  rose: {
    bgGlow: "from-rose-500/20 to-orange-500/20",
    avatarGrad: "from-rose-400 to-orange-500",
    shadow: "shadow-rose-500/30",
    textGrad: "from-rose-400 to-orange-500",
    iconTheme: "text-rose-500",
    borderHover: "hover:border-rose-500/50",
    colorDot: "bg-rose-500",
    successMsg: "bg-rose-600 shadow-rose-600/30",
    paletteIcon: "text-rose-500",
  },
};

export default function LandingPage() {
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("indigo");
  const currentTheme = themes[activeTheme];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-indigo-500/30 transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      <section className="pt-32 pb-20 px-6 relative bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-150 bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] -z-10 rounded-full" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-8 uppercase tracking-[0.2em]">
              <Sparkles size={14} className="animate-pulse" />
              The Future of Digital Presence
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-linear-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 bg-clip-text text-transparent leading-none md:leading-[0.95]">
              CRAFT YOUR <br className="hidden md:block" /> DIGITAL IDENTITY.
            </h1>

            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Join thousands of creators building high-end personal websites in
              seconds. No code, just pure professional presence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/25 group"
              >
                Get Started Free
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Layers size={20} />
                Explore Features
              </Link>
            </div>
          </motion.div>

          <div className="mt-32 relative max-w-5xl mx-auto h-150 flex items-center justify-center">
            <div
              className={`absolute inset-0 bg-linear-to-r ${currentTheme.bgGlow} blur-[100px] rounded-full transition-colors duration-700`}
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, type: "spring" }}
              className="relative z-10 w-75 h-150 bg-white dark:bg-slate-950 rounded-[3rem] border-8 border-slate-900 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center pt-12 pb-6 px-6"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 dark:bg-slate-800 rounded-b-2xl" />

              <div
                className={`w-24 h-24 rounded-full bg-linear-to-tr ${currentTheme.avatarGrad} p-1 mb-4 shadow-lg ${currentTheme.shadow} transition-all duration-700`}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-950">
                  <span
                    className={`text-3xl font-bold bg-linear-to-r ${currentTheme.textGrad} bg-clip-text text-transparent transition-all duration-700`}
                  >
                    E
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-1">Eslam Elngar</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center">
                Frontend Developer & Tech Enthusiast
              </p>

              <div className="w-full space-y-3">
                {[
                  { title: "My Portfolio", icon: <Globe size={18} /> },
                  {
                    title: "Latest YouTube Video",
                    icon: <FaYoutube size={18} />,
                  },
                  { title: "GitHub Projects", icon: <FaGithub size={18} /> },
                ].map((btn, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-between cursor-pointer ${currentTheme.borderHover} transition-all duration-300`}
                  >
                    <div className="flex items-center gap-3 font-medium text-sm">
                      <div
                        className={`${currentTheme.iconTheme} transition-colors duration-500`}
                      >
                        {btn.icon}
                      </div>
                      {btn.title}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute left-4 md:left-20 top-32 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${
                    activeTheme === "emerald"
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  } flex items-center justify-center transition-colors duration-500`}
                >
                  <BarChart3 size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Total Views
                  </div>
                  <div className="font-bold text-lg">12,450</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute right-4 md:right-16 bottom-40 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-3 mb-3">
                <Palette
                  size={16}
                  className={`${currentTheme.paletteIcon} transition-colors duration-500`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Theme
                </span>
              </div>
              <div className="flex gap-2">
                {(Object.keys(themes) as ThemeKey[]).map((themeName) => (
                  <div
                    key={themeName}
                    onClick={() => setActiveTheme(themeName)}
                    className={`w-6 h-6 rounded-full ${themes[themeName].colorDot} cursor-pointer transition-all duration-300 ${
                      activeTheme === themeName
                        ? "border-2 border-white dark:border-slate-800 shadow-md scale-125"
                        : "opacity-50 hover:opacity-100 hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className={`absolute left-10 md:left-32 bottom-24 z-20 text-white px-5 py-3 rounded-full items-center gap-2 text-sm font-bold hidden sm:flex transition-all duration-700 ${currentTheme.successMsg}`}
            >
              <CheckCircle2 size={18} />
              Published Successfully
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Launch in minutes.
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Three simple steps to build your digital home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-white/5 -translate-y-1/2 z-0" />

            <div className="relative z-10 bg-slate-50 dark:bg-slate-950">
              <StepCard
                number="01"
                title="Claim Your URL"
                desc="Pick a unique username that represents your brand. It's yours forever."
              />
            </div>
            <div className="relative z-10 bg-slate-50 dark:bg-slate-950">
              <StepCard
                number="02"
                title="Customize Design"
                desc="Choose from premium themes or build your own layout with our drag & drop editor."
              />
            </div>
            <div className="relative z-10 bg-slate-50 dark:bg-slate-950">
              <StepCard
                number="03"
                title="Share Everywhere"
                desc="Put your link in your Instagram, Twitter, or TikTok bio and watch your audience grow."
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-32 px-6 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl text-left">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
                Everything you need.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Powerful tools wrapped in a beautiful, intuitive interface.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MousePointer2 size={28} />}
              title="Intuitive Builder"
              desc="Drag, drop, and rearrange elements easily. Your site updates in real-time as you edit."
            />
            <FeatureCard
              icon={<BarChart3 size={28} />}
              title="In-depth Analytics"
              desc="Track clicks, views, and referrers to understand what your audience engages with most."
            />
            <FeatureCard
              icon={<ShieldCheck size={28} />}
              title="Bank-grade Security"
              desc="Free SSL certificates and robust infrastructure keep your page online and secure 24/7."
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Got questions?
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              We&apos;ve got answers.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-sm">
            <FAQItem
              question="Is it completely free to use?"
              answer="Yes! Our core features are 100% free forever. We also offer a Pro plan for advanced analytics and custom domains."
            />
            <FAQItem
              question="Do I need coding skills?"
              answer="Not at all. Our platform is built for everyone. If you can use a smartphone, you can build a beautiful page."
            />
            <FAQItem
              question="Can I link multiple social accounts?"
              answer="Absolutely. You can add unlimited links to all your social profiles, websites, stores, and more."
            />
            <FAQItem
              question="Can I use my own domain?"
              answer="Yes, custom domain support is available on our premium plans, allowing you to connect your own URL."
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem label="Active Creators" value="150K+" />
            <StatItem label="Links Created" value="2.4M" />
            <StatItem label="Monthly Views" value="45M" />
            <StatItem label="Uptime" value="99.9%" />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-700" />
          <div className="relative bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Stop waiting. <br /> Start creating.
              </h2>
              <p className="text-indigo-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
                Claim your unique URL today and join the world&apos;s fastest
                growing community of modern creators.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/register"
                  className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg"
                >
                  Create My Page
                </Link>
                <Link
                  href="/login"
                  className="px-10 py-5 bg-indigo-700 text-white rounded-2xl font-bold hover:bg-indigo-800 transition-all border border-indigo-500/30"
                >
                  Log In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="pt-24 pb-12 px-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center justify-center md:justify-start gap-2 font-black text-2xl tracking-tighter mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white italic">
                  I
                </div>
                INSTAWEB
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto md:mx-0">
                The leading platform for modern professionals to build their
                digital home. Fast, elegant, and secure.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 dark:text-white uppercase text-xs tracking-widest">
                Platform
              </h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <li>
                  <Link
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Templates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 dark:text-white uppercase text-xs tracking-widest">
                Company
              </h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <li>
                  <Link
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-slate-200 dark:border-white/5">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} InstaWeb Inc. Crafted for creators.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FaTwitter size={20} />} href="#" />
              <SocialIcon icon={<FaInstagram size={20} />} href="#" />
              <SocialIcon icon={<FaGithub size={20} />} href="#" />
              <SocialIcon icon={<FaDiscord size={20} />} href="#" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
