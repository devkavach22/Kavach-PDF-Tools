import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { Cloud, HardDrive, Share2, Database, Slack, Mail } from "lucide-react";

// ... [Insert Copy of particlesOptions & GradientBlob here] ...
const particlesOptions = { /* ... */ };
const GradientBlob = ({ className }: { className?: string }) => (
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 45, 0] }} transition={{ duration: 10, repeat: Infinity }} className={`absolute rounded-full mix-blend-screen blur-[90px] filter ${className}`} />
);

const integrations = [
    { name: "Google Drive", icon: Cloud, color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Dropbox", icon: HardDrive, color: "text-blue-300", bg: "bg-blue-400/10" },
    { name: "OneDrive", icon: Cloud, color: "text-sky-400", bg: "bg-sky-500/10" },
    { name: "Slack", icon: Slack, color: "text-purple-400", bg: "bg-purple-500/10" },
    { name: "AWS S3", icon: Database, color: "text-orange-400", bg: "bg-orange-500/10" },
    { name: "Gmail", icon: Mail, color: "text-red-400", bg: "bg-red-500/10" },
];

export default function Integrations() {
  const [init, setInit] = useState(false);
  useEffect(() => { initParticlesEngine(async (engine) => await loadSlim(engine)).then(() => setInit(true)); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none"><div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" /><GradientBlob className="top-20 right-0 w-[600px] h-[600px] bg-orange-600/10" /></div>
      {init && <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"><Particles id="tsparticles" options={particlesOptions} className="h-full w-full" /></div>}
      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-7xl mx-auto text-center">
           <h1 className="text-5xl font-bold text-white mb-6">Seamless <span className="text-orange-500">Integrations</span></h1>
           <p className="text-slate-400 mb-16 max-w-2xl mx-auto">Connect Kavach with the tools you use every day.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {integrations.map((item, idx) => (
                 <motion.div key={idx} whileHover={{ scale: 1.05 }} className="p-8 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col items-center justify-center hover:border-orange-500/30 transition-colors group cursor-pointer">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${item.bg} ${item.color} ring-1 ring-white/5 group-hover:ring-orange-500/30 transition-all`}>
                        <item.icon size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-200">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-2">Connect Account</p>
                 </motion.div>
              ))}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}