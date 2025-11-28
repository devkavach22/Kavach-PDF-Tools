import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
// Removed: import { initParticlesEngine } from "tsparticles-engine";
import { TypeAnimation } from "react-type-animation";
import { Copy, Terminal } from "lucide-react";

const particlesOptions: any = {
  fullScreen: { enable: false, zIndex: 0 },
  background: { color: { value: "transparent" } },
  fpsLimit: 120,
  particles: {
    color: { value: ["#fb923c", "#f87171", "#fbbf24"] },
    links: { color: "#cbd5e1", distance: 150, enable: true, opacity: 0.2, width: 1 }, // Lighter links
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

export default function APIPage() {
  // No need for init state or useEffect for particles
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans overflow-x-hidden relative">
       {/* Background Overlay */}
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <GradientBlob className="top-[20%] right-[-10%] w-[500px] h-[500px] bg-orange-200/50" />
      </div>
      
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="h-full w-full"
          init={loadSlim}
        />
      </div>
      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-mono">
              <Terminal size={14} /> DEV_MODE
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
              Automate with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Powerful APIs</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Integrate Kavach's PDF engine directly into your application. RESTful endpoints, WebAssembly processing, and 99.9% uptime SLA.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium border border-slate-200 transition-all">Read Documentation</button>
              <button className="px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/20 transition-all">Get API Key</button>
            </div>
          </div>

          {/* Right Code Block - Kept Dark for High Contrast Syntax Highlighting */}
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl overflow-hidden border border-slate-200 bg-[#1e293b] shadow-2xl shadow-slate-200"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-slate-400 font-mono">POST /v1/pdf/merge</span>
                <Copy size={14} className="text-slate-400 cursor-pointer hover:text-white" />
              </div>
              <div className="p-6 font-mono text-sm text-slate-300 overflow-x-auto">
                <div className="text-purple-400">curl <span className="text-slate-300">-X POST https://api.kavach.io/v1/merge \</span></div>
                <div className="pl-4 text-slate-300">-H <span className="text-green-400">"Authorization: Bearer YOUR_KEY"</span> \</div>
                <div className="pl-4 text-slate-300">-d <span className="text-orange-300">'{`{`}</span></div>
                <div className="pl-8 text-blue-400">"files"<span className="text-slate-300">: [</span><span className="text-green-400">"doc1.pdf"</span><span className="text-slate-300">, </span><span className="text-green-400">"doc2.pdf"</span><span className="text-slate-300">],</span></div>
                <div className="pl-8 text-blue-400">"encrypt"<span className="text-slate-300">: </span><span className="text-red-400">true</span></div>
                <div className="pl-4 text-orange-300">{`}'`}</div>
                <div className="mt-4 text-emerald-400">
                  <TypeAnimation
                     sequence={[1000, '> Processing...\n> Batch ID: #8823\n> Status: Success (200 OK)']}
                     speed={70}
                     cursor={true}
                     style={{ whiteSpace: 'pre-line' }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}