import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Cloud, HardDrive, Database, Slack, Mail } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- COMPONENT: GLASS CARD ---
const GlassCard = ({ children, className = "", onClick }: any) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={cn("relative overflow-hidden rounded-[32px] border border-orange-100/60 bg-white/60 backdrop-blur-xl shadow-xl shadow-orange-900/5 cursor-pointer group", className)}
    >
       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent opacity-50" />
       {children}
    </motion.div>
  );
};

const integrations = [
    { name: "Google Drive", icon: Cloud, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Dropbox", icon: HardDrive, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "OneDrive", icon: Cloud, color: "text-sky-600", bg: "bg-sky-50" },
    { name: "Slack", icon: Slack, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "AWS S3", icon: Database, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Gmail", icon: Mail, color: "text-red-600", bg: "bg-red-50" },
];

export default function Integrations() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] text-slate-900 font-sans overflow-x-hidden relative selection:bg-orange-200 selection:text-orange-900">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-0 w-[600px] h-[600px] bg-orange-200/50 rounded-full blur-[100px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light"></div>
      </div>

      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-7xl mx-auto text-center">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-5xl md:text-6xl font-black text-slate-900 mb-6"
           >
             Seamless <span className="text-orange-600">Integrations</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-slate-600 mb-16 max-w-2xl mx-auto text-lg font-medium"
           >
             Connect Kavach with the tools you use every day.
           </motion.p>
           
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {integrations.map((item, idx) => (
                 <GlassCard key={idx} className="p-8 flex flex-col items-center justify-center hover:border-orange-200 hover:shadow-orange-500/10">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 ${item.bg} ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs font-bold text-orange-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Connect Account</p>
                 </GlassCard>
              ))}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}