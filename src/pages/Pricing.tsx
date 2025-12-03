import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

const plans = [
    { name: "Basic", price: "$0", period: "/mo", desc: "For casual users", features: ["3 Tasks per day", "Standard Speed", "Ad-supported"], highlight: false },
    { name: "Pro Shield", price: "$12", period: "/mo", desc: "For power users", features: ["Unlimited Tasks", "OCR & eSign", "No Ads", "Priority Support", "256-bit Encryption"], highlight: true, badge: "Most Popular" },
    { name: "Enterprise", price: "$1499", desc: "Scalable security for large teams.", features: ["API Access", "SSO Integration", "Dedicated Server Instance", "Audit Logs", "24/7 Dedicated Support"], highlight: false },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] text-slate-900 font-sans overflow-x-hidden relative selection:bg-orange-200 selection:text-orange-900">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-orange-200 to-amber-100 rounded-full blur-[100px] opacity-50" 
        />
         <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-l from-red-200 to-orange-100 rounded-full blur-[100px] opacity-50" 
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
            Simple, Transparent <span className="text-orange-600">Pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mb-10 text-lg font-medium"
          >
            Choose the shield that fits your workflow.
          </motion.p>

          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center items-center gap-4 mb-16"
          >
            <span className={`text-sm font-bold ${!annual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <div onClick={() => setAnnual(!annual)} className="w-14 h-7 rounded-full bg-slate-200 border border-slate-300 relative cursor-pointer transition-colors hover:border-orange-500/50">
                <motion.div animate={{ x: annual ? 28 : 2 }} className="absolute top-1 left-0 w-5 h-5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
            </div>
            <span className={`text-sm font-bold ${annual ? 'text-slate-900' : 'text-slate-400'}`}>Yearly <span className="text-orange-600 text-xs ml-1 font-extrabold">(Save 20%)</span></span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <GlassCard 
                key={idx} 
                className={`flex flex-col p-8 text-left ${plan.highlight ? 'bg-white/80 border-orange-400/50 shadow-orange-500/20 scale-105 z-10' : 'bg-white/40'}`}
              >
                {plan.highlight && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 to-red-600" />
                )}
                {plan.highlight && <div className="absolute top-4 right-4 px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-orange-200">{plan.badge}</div>}
                
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-orange-600' : 'text-slate-700'}`}>{plan.name}</h3>
                
                <div className="flex items-baseline gap-1 mb-2">
                   <span className="text-4xl font-black text-slate-900">{annual && plan.price !== "$0" ? `$${parseInt(plan.price.slice(1)) * 10}` : plan.price}</span>
                   <span className="text-slate-500 font-bold">{annual && plan.price !== "$0" ? "/yr" : plan.period}</span>
                </div>
                
                <p className="text-slate-500 text-sm mb-8 font-medium">{plan.desc}</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                            <Check className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-orange-500' : 'text-slate-400'}`} /> 
                            {f}
                        </li>
                    ))}
                </ul>
                
                <Button className={`w-full rounded-xl font-bold h-12 ${plan.highlight ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/20' : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-600'}`}>
                    Choose {plan.name}
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}