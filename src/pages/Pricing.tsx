import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { Check, Crown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Ensure you have a switch component or standard input

// ... [Insert Copy of particlesOptions & GradientBlob here] ...
const particlesOptions = { /* ... */ };
const GradientBlob = ({ className }: { className?: string }) => (
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 45, 0] }} transition={{ duration: 10, repeat: Infinity }} className={`absolute rounded-full mix-blend-screen blur-[90px] filter ${className}`} />
);

const plans = [
    { name: "Basic", price: "$0", period: "/mo", desc: "For casual users", features: ["3 Tasks per day", "Standard Speed", "Ad-supported"], highlight: false },
    { name: "Pro Shield", price: "$12", period: "/mo", desc: "For power users", features: ["Unlimited Tasks", "OCR & eSign", "No Ads", "Priority Support", "256-bit Encryption"], highlight: true, badge: "Most Popular" },
    { name: "Enterprise", price: "$1499",desc: "Scalable security for large teams.", features: ["API Access", "SSO Integration", "Dedicated Server Instance", "Audit Logs", "24/7 Dedicated Support"], highlight: false },
];

export default function Pricing() {
  const [init, setInit] = useState(false);
  const [annual, setAnnual] = useState(true);
  useEffect(() => { initParticlesEngine(async (engine) => await loadSlim(engine)).then(() => setInit(true)); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none"><div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" /><GradientBlob className="top-0 left-1/2 w-[800px] h-[800px] bg-orange-600/10 -translate-x-1/2" /></div>
      {init && <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"><Particles id="tsparticles" options={particlesOptions} className="h-full w-full" /></div>}
      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Simple, Transparent <span className="text-orange-500">Pricing</span></h1>
          <p className="text-slate-400 mb-10">Choose the shield that fits your workflow.</p>

          {/* Toggle */}
          <div className="flex justify-center items-center gap-4 mb-16">
            <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <div onClick={() => setAnnual(!annual)} className="w-14 h-7 rounded-full bg-slate-800 border border-white/10 relative cursor-pointer transition-colors hover:border-orange-500/50">
                <motion.div animate={{ x: annual ? 28 : 2 }} className="absolute top-1 left-0 w-5 h-5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
            </div>
            <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-slate-500'}`}>Yearly <span className="text-orange-400 text-xs ml-1">(Save 20%)</span></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className={`relative p-8 rounded-3xl border text-left flex flex-col ${plan.highlight ? 'bg-slate-900 border-orange-500/50 shadow-[0_0_60px_-15px_rgba(249,115,22,0.3)] z-10 scale-105' : 'bg-slate-900/50 border-white/5'}`}
              >
                {plan.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">{plan.badge}</div>}
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-orange-400' : 'text-slate-300'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                   <span className="text-4xl font-bold text-white">{annual && plan.price !== "$0" ? `$${parseInt(plan.price.slice(1)) * 10}` : plan.price}</span>
                   <span className="text-slate-500">{annual && plan.price !== "$0" ? "/yr" : plan.period}</span>
                </div>
                <p className="text-slate-400 text-sm mb-8">{plan.desc}</p>
                <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300"><Check className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-orange-500' : 'text-slate-600'}`} /> {f}</li>
                    ))}
                </ul>
                <Button className={`w-full rounded-xl font-bold h-12 ${plan.highlight ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/20' : 'bg-white/5 hover:bg-white/10 text-white'}`}>Choose {plan.name}</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}