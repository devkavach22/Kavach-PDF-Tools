import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { Cookie, Settings, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Shared Theme Configuration ---
const particlesOptions = {
  fullScreen: { enable: false, zIndex: 0 },
  background: { color: { value: "transparent" } },
  fpsLimit: 120,
  particles: {
    color: { value: ["#fb923c", "#f87171", "#fbbf24"] },
    links: { color: "#fb923c", distance: 150, enable: true, opacity: 0.2, width: 1 },
    move: { enable: true, speed: 1, direction: "none", random: true, outModes: { default: "bounce" } },
    number: { density: { enable: true, area: 800 }, value: 80 },
    opacity: { value: 0.4 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

const GradientBlob = ({ className }: { className?: string }) => (
  <motion.div 
    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 45, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-full mix-blend-screen blur-[90px] filter ${className}`}
  />
);

export default function CookiesPolicy() {
  const [init, setInit] = useState(false);
  useEffect(() => { initParticlesEngine(async (engine) => await loadSlim(engine)).then(() => setInit(true)); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 font-sans overflow-x-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fb923c0a_1px,transparent_1px),linear-gradient(to_bottom,#fb923c0a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <GradientBlob className="top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-600/10" />
      </div>

      {init && <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"><Particles id="tsparticles" options={particlesOptions} className="h-full w-full" /></div>}

      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 border-b border-white/10 pb-12 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold mb-6">
              <Cookie size={14} />
              <span>Policy & Settings</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Cookie Policy</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              We use cookies to make Kavach faster, more secure, and easier to use. This guide explains what they are and how you can control them.
            </p>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            {/* Introduction */}
            <section className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
               <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Info size={20} className="text-orange-400" /> What are Cookies?</h2>
               <p className="text-slate-400 leading-relaxed">
                 Cookies are small text files stored on your device when you visit a website. They allow the site to remember your actions and preferences (such as login, language, font size, and other display preferences) over a period of time, so you don’t have to keep re-entering them.
               </p>
            </section>

            {/* Types of Cookies */}
            <section>
               <h2 className="text-2xl font-bold text-white mb-8">How We Use Them</h2>
               <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Essential */}
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-orange-500/30 shadow-[0_0_30px_-10px_rgba(249,115,22,0.15)]">
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400"><CheckCircle2 size={24} /></div>
                        <span className="text-xs font-bold bg-orange-500 text-white px-2 py-1 rounded uppercase">Required</span>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Essential Cookies</h3>
                     <p className="text-slate-400 text-sm mb-4">
                        Strictly necessary for the website to function. They enable core functionality like security, network management, and accessibility.
                     </p>
                     <ul className="text-sm text-slate-500 space-y-1 list-disc pl-4">
                        <li>Session IDs (Login status)</li>
                        <li>CSRF Security Tokens</li>
                        <li>Load Balancing</li>
                     </ul>
                  </div>

                  {/* Analytics */}
                  <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/20 transition-colors">
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-slate-800 text-blue-400"><Settings size={24} /></div>
                        <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase">Optional</span>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Analytics Cookies</h3>
                     <p className="text-slate-400 text-sm mb-4">
                        Help us understand how visitors interact with the website by collecting and reporting information anonymously.
                     </p>
                     <ul className="text-sm text-slate-500 space-y-1 list-disc pl-4">
                        <li>Google Analytics</li>
                        <li>Heatmaps (Hotjar)</li>
                        <li>Performance Monitoring</li>
                     </ul>
                  </div>

               </div>
            </section>

            {/* Management */}
            <section>
               <h2 className="text-2xl font-bold text-white mb-6">Managing Your Preferences</h2>
               <div className="text-slate-400 space-y-4">
                  <p>
                     You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
                  </p>
                  <p>
                     However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
                  </p>
               </div>
               
               <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                     <h4 className="text-white font-bold">Current Consent Status</h4>
                     <p className="text-sm text-slate-400">You have not yet set your privacy preferences.</p>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
                     Open Cookie Settings
                  </Button>
               </div>
            </section>

          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}