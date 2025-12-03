import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Copy, Terminal } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- COMPONENT: GLASS CARD ---
const GlassCard = ({ children, className = "" }: any) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-orange-100/60 bg-white/60 backdrop-blur-xl shadow-xl shadow-orange-900/5",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent opacity-50" />
      {children}
    </div>
  );
};

export default function APIPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] text-slate-900 font-sans overflow-x-hidden relative selection:bg-orange-200 selection:text-orange-900">
       
       {/* --- BACKGROUND EFFECTS --- */}
       <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-orange-200 to-amber-100 rounded-full blur-[100px] opacity-50" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light"></div>
      </div>
      
      <div className="relative z-50"><Header isAuthenticated={false} isAdmin={false} /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold font-mono uppercase"
            >
              <Terminal size={14} /> DEV_MODE
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight"
            >
              Automate with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Powerful APIs</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 text-lg font-medium leading-relaxed max-w-lg"
            >
              Integrate Kavach's PDF engine directly into your application. RESTful endpoints, WebAssembly processing, and 99.9% uptime SLA.
            </motion.p>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4"
            >
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-105">
                  Get API Key
              </button>
              <button className="px-8 py-4 rounded-xl bg-white border border-orange-200 text-slate-700 font-bold hover:bg-orange-50 transition-all">
                  Read Docs
              </button>
            </motion.div>
          </div>

          {/* Right Code Block */}
          <div className="flex-1 w-full max-w-xl">
            <GlassCard className="bg-[#1e293b]/90 border-slate-700 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-400 font-mono font-bold">POST /v1/pdf/merge</span>
                <Copy size={14} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
              </div>
              <div className="p-6 font-mono text-sm text-slate-300 overflow-x-auto min-h-[300px]">
                <div className="text-purple-400 font-bold">curl <span className="text-slate-300 font-normal">-X POST https://api.kavach.io/v1/merge \</span></div>
                <div className="pl-4 text-slate-300">-H <span className="text-green-400">"Authorization: Bearer YOUR_KEY"</span> \</div>
                <div className="pl-4 text-slate-300">-d <span className="text-orange-300">'{`{`}</span></div>
                <div className="pl-8 text-blue-400 font-bold">"files"<span className="text-slate-300">: [</span><span className="text-green-400">"doc1.pdf"</span><span className="text-slate-300">, </span><span className="text-green-400">"doc2.pdf"</span><span className="text-slate-300">],</span></div>
                <div className="pl-8 text-blue-400 font-bold">"encrypt"<span className="text-slate-300">: </span><span className="text-red-400 font-bold">true</span></div>
                <div className="pl-4 text-orange-300">{`}'`}</div>
                <div className="mt-6 text-emerald-400 font-bold">
                  <TypeAnimation
                     sequence={[1500, '> Processing request...\n> Verifying signatures...\n> Merge Complete.\n> Status: 200 OK']}
                     speed={80}
                     cursor={true}
                     style={{ whiteSpace: 'pre-line' }}
                  />
                </div>
              </div>
            </GlassCard>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}