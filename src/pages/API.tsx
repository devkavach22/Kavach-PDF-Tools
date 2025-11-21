import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { TypeAnimation } from "react-type-animation";
import { Code2, Terminal, Copy, Check, Cpu } from "lucide-react";

// ... [Insert Copy of particlesOptions & GradientBlob here] ...
// For brevity, assuming these are imported or pasted as seen in Features.tsx

const particlesOptions = { /* ... Same as Landing ... */ };
const GradientBlob = ({ className }: { className?: string }) => (
  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 45, 0] }} transition={{ duration: 10, repeat: Infinity }} className={`absolute rounded-full mix-blend-screen blur-[90px] filter ${className}`} />
);

export default function APIPage() {
  const [init, setInit] = useState(false);
  useEffect(() => { initParticlesEngine(async (engine) => await loadSlim(engine)).then(() => setInit(true)); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 font-sans overflow-x-hidden relative">
       {/* Background Overlay */}
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fb923c0a_1px,transparent_1px),linear-gradient(to_bottom,#fb923c0a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <GradientBlob className="top-[20%] right-[-10%] w-[500px] h-[500px] bg-orange-600/20" />
      </div>
      
      {init && <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"><Particles id="tsparticles" options={particlesOptions} className="h-full w-full" /></div>}
      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
              <Terminal size={14} /> DEV_MODE
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Automate with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Powerful APIs</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Integrate Kavach's PDF engine directly into your application. RESTful endpoints, WebAssembly processing, and 99.9% uptime SLA.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10 transition-all">Read Documentation</button>
              <button className="px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/20 transition-all">Get API Key</button>
            </div>
          </div>

          {/* Right Code Block */}
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl overflow-hidden border border-white/10 bg-[#0b1120] shadow-2xl shadow-orange-500/5"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs text-slate-500 font-mono">POST /v1/pdf/merge</span>
                <Copy size={14} className="text-slate-500 cursor-pointer hover:text-white" />
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