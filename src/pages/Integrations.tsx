import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { Cloud, HardDrive, Database, Slack, Mail } from "lucide-react";

const particlesOptions = {
    fullScreen: { enable: false, zIndex: 0 },
    background: { color: { value: "transparent" } },
    fpsLimit: 120,
    particles: {
      color: { value: ["#fb923c", "#f87171", "#fbbf24"] },
      links: { color: "#cbd5e1", distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { enable: true, speed: 1, direction: "none", random: true, outModes: { default: "bounce" } },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

const GradientBlob = ({ className }: { className?: string }) => (
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 45, 0] }} transition={{ duration: 10, repeat: Infinity }} className={`absolute rounded-full blur-[90px] filter ${className}`} />
);

const integrations = [
    { name: "Google Drive", icon: Cloud, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Dropbox", icon: HardDrive, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "OneDrive", icon: Cloud, color: "text-sky-600", bg: "bg-sky-50" },
    { name: "Slack", icon: Slack, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "AWS S3", icon: Database, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Gmail", icon: Mail, color: "text-red-600", bg: "bg-red-50" },
];

export default function Integrations() {
  const [init, setInit] = useState(false);
  useEffect(() => { initParticlesEngine(async (engine) => await loadSlim(engine)).then(() => setInit(true)); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
          <GradientBlob className="top-20 right-0 w-[600px] h-[600px] bg-orange-100/60" />
      </div>
      {init && <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"><Particles id="tsparticles" options={particlesOptions} className="h-full w-full" /></div>}
      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-7xl mx-auto text-center">
           <h1 className="text-5xl font-bold text-slate-900 mb-6">Seamless <span className="text-orange-500">Integrations</span></h1>
           <p className="text-slate-600 mb-16 max-w-2xl mx-auto">Connect Kavach with the tools you use every day.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {integrations.map((item, idx) => (
                 <motion.div key={idx} whileHover={{ scale: 1.05 }} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center hover:border-orange-200 hover:shadow-lg transition-all group cursor-pointer">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${item.bg} ${item.color} ring-1 ring-slate-100 group-hover:ring-orange-200 transition-all`}>
                        <item.icon size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
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