import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { ShieldCheck, Lock, Server, EyeOff, FileKey } from "lucide-react";

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
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 45, 0] }} transition={{ duration: 10, repeat: Infinity }} className={`absolute rounded-full mix-blend-multiply blur-[90px] filter ${className}`} />
);

export default function Security() {
  const [init, setInit] = useState(false);
  useEffect(() => { initParticlesEngine(async (engine) => await loadSlim(engine)).then(() => setInit(true)); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
          <GradientBlob className="bottom-0 left-0 w-[800px] h-[800px] bg-red-200/50" />
      </div>
      {init && <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"><Particles id="tsparticles" options={particlesOptions} className="h-full w-full" /></div>}
      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-700 text-sm font-bold mb-4">
                   <ShieldCheck size={14} /> ISO 27001 Certified
                </div>
                <h1 className="text-5xl font-bold text-slate-900 mb-6">Security at our <span className="text-red-600">Core</span></h1>
                <p className="text-slate-600 max-w-2xl mx-auto">We don't just process your files. We protect them. Our zero-knowledge architecture means we can't read your data even if we wanted to.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                    <Lock className="w-10 h-10 text-orange-500 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">AES-256 Encryption</h3>
                    <p className="text-slate-600">All files are encrypted in transit using TLS 1.3 and at rest using AES-256. Your documents are mathematically secure.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                    <EyeOff className="w-10 h-10 text-red-500 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Zero-Knowledge Privacy</h3>
                    <p className="text-slate-600">Most processing happens in your browser via WebAssembly. The files never leave your device for basic operations.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                    <Server className="w-10 h-10 text-amber-500 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Automatic Deletion</h3>
                    <p className="text-slate-600">For server-side tasks, files are automatically and permanently wiped from our servers after 1 hour.</p>
                </div>
                 <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                    <FileKey className="w-10 h-10 text-blue-500 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">GDPR Compliant</h3>
                    <p className="text-slate-600">We strictly adhere to GDPR and CCPA regulations. You own your data, always.</p>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}