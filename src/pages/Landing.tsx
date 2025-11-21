import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Ensure these paths exist in your project, or comment them out if testing
import { Header } from "@/components/Header"; 
import { Footer } from "@/components/Footer";
import { TypeAnimation } from "react-type-animation";
import { motion, useScroll, useTransform } from "framer-motion";

// Fixed: Updated imports for v3 stability
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";

import {
  Shield,
  Zap,
  FileStack,
  Signature,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Cpu,
  Lock,
  Globe,
  Flame,
  FileSignature,
  FileText,
  Minimize2,
  Combine,
  Split,
  Image as ImageIcon,
  Layers,
  Rocket,
  Crown,
  Check,
  PlayCircle
} from "lucide-react";

// --- Theme Configuration ---
const particlesOptions = {
  fullScreen: { enable: false, zIndex: 0 },
  background: { color: { value: "transparent" } },
  fpsLimit: 120,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      repulse: { distance: 150, duration: 0.4 },
    },
  },
  particles: {
    color: { value: ["#fb923c", "#f87171", "#fbbf24"] }, // Orange, Red, Amber
    links: {
      color: "#fb923c",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1, 
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "bounce" },
    },
    number: { density: { enable: true, area: 800 }, value: 80 },
    opacity: { value: 0.4 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

// --- Mock Data ---
const companies = [
  { name: "Fortress", icon: Shield },
  { name: "Magma", icon: Flame },
  { name: "Vertex", icon: Layers },
  { name: "Nova", icon: Sparkles },
  { name: "Sentry", icon: Lock },
  { name: "Flux", icon: Zap },
];

const pdfTools = [
  {
    title: "E-Sign PDF",
    desc: "Legally binding digital signatures.",
    icon: FileSignature,
    color: "text-orange-400",
    gradient: "from-orange-500/20",
  },
  {
    title: "PDF to Word",
    desc: "Convert docs with perfect formatting.",
    icon: FileText,
    color: "text-red-400",
    gradient: "from-red-500/20",
  },
  {
    title: "Optimize PDF",
    desc: "Compress file size without quality loss.",
    icon: Minimize2,
    color: "text-amber-400",
    gradient: "from-amber-500/20",
  },
  {
    title: "Merge PDF",
    desc: "Combine multiple files into one.",
    icon: Combine,
    color: "text-orange-300",
    gradient: "from-orange-400/20",
  },
  {
    title: "Split PDF",
    desc: "Extract pages or split documents.",
    icon: Split,
    color: "text-red-300",
    gradient: "from-red-400/20",
  },
  {
    title: "PDF to JPG",
    desc: "Turn pages into high-res images.",
    icon: ImageIcon,
    color: "text-amber-300",
    gradient: "from-amber-400/20",
  },
];

const features = [
  {
    icon: Shield,
    title: "Military-Grade Security",
    description: "AES-256 encryption. We build the shield, you hold the key.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "group-hover:border-orange-500/50",
    glow: "shadow-[0_0_20px_-5px_rgba(251,146,60,0.3)]",
  },
  {
    icon: Zap,
    title: "Blazing Fast Engine",
    description: "Powered by WebAssembly. Zero uploads, instant processing.",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "group-hover:border-red-500/50",
    glow: "shadow-[0_0_20px_-5px_rgba(248,113,113,0.3)]",
  },
  {
    icon: Globe,
    title: "Universal Access",
    description: "Works entirely offline once loaded. True freedom for your files.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "group-hover:border-amber-500/50",
    glow: "shadow-[0_0_20px_-5px_rgba(251,191,36,0.3)]",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Essential tools for casual users.",
    features: ["Basic PDF Tools (Merge, Split)", "File size up to 5MB", "3 Daily Tasks", "Standard Encryption"],
    cta: "Get Started",
    highlight: false,
    color: "text-slate-300"
  },
  {
    name: "Pro Shield",
    price: "$12",
    period: "/month",
    description: "Complete power for professionals.",
    features: ["Unlimited Processing", "OCR & AI Analysis", "256-bit AES Encryption", "Priority Support", "No File Size Limits"],
    cta: "Upgrade Now",
    highlight: true,
    badge: "Most Popular",
    color: "text-orange-400"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Scalable security for large teams.",
    features: ["API Access", "SSO Integration", "Dedicated Server Instance", "Audit Logs", "24/7 Dedicated Support"],
    cta: "Contact Sales",
    highlight: false,
    color: "text-slate-300"
  }
];

// Background animated blob component
const GradientBlob = ({ className }: { className?: string }) => (
  <motion.div 
    animate={{ 
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2],
      rotate: [0, 45, 0]
    }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-full mix-blend-screen blur-[90px] filter ${className}`}
  />
);

export default function Landing() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-100 overflow-x-hidden relative">
      
      {/* --- Background & Particles --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fb923c0a_1px,transparent_1px),linear-gradient(to_bottom,#fb923c0a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <GradientBlob className="top-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-600/20" />
        <GradientBlob className="top-[40%] right-[-15%] w-[500px] h-[500px] bg-red-600/20" />
        <GradientBlob className="bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-amber-600/15" />
      </div>

      {init && (
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
           {/* @ts-ignore */}
          <Particles id="tsparticles" options={particlesOptions} className="h-full w-full" />
        </div>
      )}

      <div className="relative z-50">
        <Header />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-24 lg:pt-48 lg:pb-40 px-6 overflow-visible">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container max-w-7xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/5 border border-orange-500/20 backdrop-blur-md hover:bg-orange-500/10 transition-all cursor-default shadow-[0_0_20px_rgba(251,146,60,0.15)]">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
              <span className="text-xs font-bold text-orange-300 tracking-wide uppercase">
                Kavach 2.0: Ultimate Defense
              </span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative mb-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-white">
              Redefining PDF <br />
              <span className="relative inline-block mt-2">
                 <span className="absolute -inset-2 bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 blur-3xl opacity-25 animate-pulse"></span>
                 <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-300 to-amber-300">
                   Security & Speed.
                 </span>
              </span>
            </h1>
            
            <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute -top-10 left-0 lg:left-10 opacity-30 pointer-events-none">
               <FileStack className="w-24 h-24 text-orange-500/40 rotate-[-15deg]" />
            </motion.div>
             <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute top-20 right-0 lg:right-10 opacity-30 pointer-events-none">
               <Shield className="w-32 h-32 text-red-500/40 rotate-[15deg]" />
            </motion.div>
          </motion.div>

          <motion.div variants={fadeInUp} className="max-w-2xl mx-auto space-y-8 mb-12">
            <div className="text-xl md:text-2xl text-slate-400 font-light">
               The complete toolkit to
               <TypeAnimation
                 sequence={[
                   " Protect.", 2000, " Optimize.", 2000, " Organize.", 2000, " Transform.", 2000
                 ]}
                 wrapper="span"
                 speed={50}
                 className="font-bold text-orange-400 ml-2"
                 repeat={Infinity}
               />
            </div>
            <p className="text-lg text-slate-400 leading-relaxed">
              Empower your workflow with the next generation of PDF tools. 
              Fast, secure, and designed for modern privacy needs.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button 
              asChild 
              size="lg" 
              className="h-14 px-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-lg font-bold shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_-15px_rgba(249,115,22,0.7)] hover:scale-105 transition-all duration-300 border-0"
            >
              <Link to="/tools" className="flex items-center gap-2">
                Start Processing <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="h-14 px-10 rounded-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white text-lg font-medium backdrop-blur-sm transition-all hover:border-orange-500/50 hover:text-orange-400"
            >
              <Link to="/demo">Watch Demo</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- INFINITE SCROLL TICKER --- */}
      <section className="py-8 relative z-10 border-y border-white/5 bg-[#0f172a]/90 backdrop-blur-md overflow-hidden">
        <div className="flex overflow-hidden w-full mask-image-linear-gradient-to-r from-transparent via-black to-transparent">
          <motion.div 
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear"
            }}
            className="flex items-center whitespace-nowrap"
          >
            {[...companies, ...companies, ...companies, ...companies].map((co, idx) => (
               <div key={idx} className="flex items-center gap-3 mx-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 group cursor-default shrink-0">
                  <co.icon className="w-6 h-6 text-orange-500" />
                  <span className="text-xl font-bold text-slate-300 tracking-widest uppercase group-hover:text-white transition-colors">{co.name}</span>
               </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- ESSENTIAL PDF TOOLS --- */}
      <section className="py-24 relative z-10">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Essential <span className="text-orange-500">PDF Tools</span></h2>
            <p className="text-slate-400">Everything you need to manage your documents securely.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfTools.map((tool, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group relative"
              >
                <div className="relative h-full p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-orange-500/30 transition-all duration-500 overflow-hidden group-hover:-translate-y-1 group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                   <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${tool.gradient} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                   
                   <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className={`p-3 rounded-xl bg-slate-800/80 ${tool.color} ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300`}>
                         <tool.icon size={24} />
                      </div>
                      <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </div>
                   </div>
                   
                   <h3 className="text-xl font-bold text-slate-200 group-hover:text-white mb-2 relative z-10">{tool.title}</h3>
                   <p className="text-slate-400 text-sm leading-relaxed relative z-10">{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CORE FEATURES (Glowing Cards) --- */}
      <section className="py-20 relative z-10 bg-slate-900/30">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Core <span className="text-orange-500">Advantages</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Built for speed, security, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className={`
                  group relative p-8 rounded-3xl 
                  bg-slate-900/80
                  border border-white/5 ${feature.border}
                  backdrop-blur-sm overflow-hidden
                  hover:-translate-y-2 transition-all duration-500
                  ${feature.glow} hover:shadow-[0_0_50px_-10px_rgba(251,146,60,0.2)]
                `}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-white/5 to-transparent`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- IMMERSIVE GRAPHIC SECTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0f172a]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#fb923c15_0%,transparent_40%)]" />
        
        <div className="container px-6 mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
             
             <div className="flex-1 w-full relative perspective-1000">
                <motion.div
                  initial={{ rotateX: 5, rotateY: -5, opacity: 0 }}
                  whileInView={{ rotateX: 0, rotateY: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative z-10"
                >
                   <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
                            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
                         </div>
                         <div className="px-3 py-1 rounded-full bg-slate-900/80 text-xs text-orange-400 font-mono border border-orange-500/20">
                            SECURE_CORE_ACTIVE
                         </div>
                      </div>

                      <div className="space-y-4">
                         {[
                           { icon: FileStack, name: "contract_final.pdf", size: "2.4 MB" },
                           { icon: Lock, name: "financial_report.enc", size: "Encrypted" },
                           { icon: Signature, name: "nda_signed.pdf", size: "Signed" }
                         ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-orange-500/30 transition-colors group">
                               <div className="flex items-center gap-4">
                                  <div className="p-2 rounded-lg bg-slate-800 text-orange-400 group-hover:text-orange-300 transition-colors group-hover:bg-orange-500/10">
                                     <item.icon size={18}/>
                                  </div>
                                  <div className="text-sm">
                                     <div className="text-slate-200 font-medium">{item.name}</div>
                                     <div className="text-slate-500 text-xs">{item.size}</div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded ${i === 1 ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                                     {i === 1 ? <Lock size={10} /> : <CheckCircle2 size={10} />}
                                     {i === 1 ? 'LOCKED' : 'READY'}
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                      
                      <div className="mt-8">
                        <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
                           <span>PROCESSING BATCH</span>
                           <span className="text-orange-400 animate-pulse">ACTIVE</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: "65%" }}
                              transition={{ duration: 1.5, ease: "circOut" }}
                              className="h-full bg-gradient-to-r from-orange-600 via-red-500 to-amber-500 relative" 
                           >
                             <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]" />
                           </motion.div>
                        </div>
                      </div>
                   </div>

                   <motion.div 
                      animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-6 -right-6 bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl border border-orange-500/20 shadow-2xl shadow-orange-900/20"
                   >
                      <Cpu className="w-8 h-8 text-orange-400" />
                   </motion.div>
                   
                   <motion.div 
                      animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -bottom-8 -left-4 bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl border border-red-500/20 shadow-2xl shadow-red-900/20"
                   >
                      <Shield className="w-8 h-8 text-red-400" />
                   </motion.div>
                </motion.div>
             </div>

             <div className="flex-1 space-y-8">
               <div className="inline-flex items-center gap-2 text-orange-500 font-semibold tracking-wider text-sm uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                 <Rocket className="w-4 h-4" />
                 <span>Seamless Integration</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                 Documents <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Reimagined.</span>
               </h2>
               <p className="text-lg text-slate-400">
                 Whether you're merging huge reports or securing sensitive contracts, our tools adapt to your needs. 
                 Intuitive, responsive, and incredibly powerful.
               </p>
               <ul className="space-y-5 mt-4">
                 {[
                   {text: 'Client-Side Encryption (Zero-Knowledge)', color: 'text-red-400'}, 
                   {text: 'Instant Offline Availability', color: 'text-orange-400'}, 
                   {text: 'Cross-Platform Compatibility', color: 'text-amber-400'}
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                     <div className={`w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shadow-inner`}>
                       <CheckCircle2 className={`w-3.5 h-3.5 ${item.color}`} />
                     </div>
                     {item.text}
                   </li>
                 ))}
               </ul>
             </div>

          </div>
        </div>
      </section>

      {/* --- PREMIUM PRICING SECTION --- */}
      <section className="py-24 relative z-10">
        <div className="container px-6 mx-auto max-w-7xl">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-20"
          >
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Crown size={14} /> Unlocked Potential
             </div>
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Premium Plans</span></h2>
             <p className="text-slate-400 max-w-2xl mx-auto text-lg">
               Scale your document security with plans designed for speed and power.
             </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
             {pricingPlans.map((plan, idx) => (
                <motion.div
                   key={idx}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className={`relative p-8 rounded-3xl border transition-all duration-300 
                     ${plan.highlight 
                       ? 'bg-slate-900 border-orange-500/50 shadow-[0_0_60px_-15px_rgba(249,115,22,0.3)] scale-105 z-10' 
                       : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                     }
                   `}
                >
                   {plan.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                         {plan.badge}
                      </div>
                   )}

                   <h3 className={`text-xl font-bold mb-2 ${plan.color}`}>{plan.name}</h3>
                   <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-slate-500">{plan.period}</span>}
                   </div>
                   <p className="text-slate-400 text-sm mb-8">{plan.description}</p>

                   <ul className="space-y-4 mb-8">
                      {plan.features.map((feat, i) => (
                         <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                            <Check className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-orange-500' : 'text-slate-500'}`} />
                            {feat}
                         </li>
                      ))}
                   </ul>

                   <Button 
                      className={`w-full h-12 rounded-xl font-bold transition-all 
                        ${plan.highlight 
                           ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:scale-105' 
                           : 'bg-white/5 text-white hover:bg-white/10'
                        }
                      `}
                   >
                      {plan.cta}
                   </Button>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* --- REPLACED CTA SECTION --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="container max-w-6xl mx-auto relative z-10">
           <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-orange-500/30 shadow-[0_0_80px_-20px_rgba(249,115,22,0.3)] p-12 md:p-24 text-center">
              {/* Animated Background Mesh */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-900 to-slate-900 z-0" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />
              
              {/* Floating Icons */}
              <motion.div 
                 animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-10 left-10 text-orange-500/10"
              >
                 <Shield size={120} />
              </motion.div>
              <motion.div 
                 animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
                 transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute bottom-10 right-10 text-red-500/10"
              >
                 <Lock size={120} />
              </motion.div>

              <div className="relative z-10 max-w-3xl mx-auto">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold mb-6">
                    <Sparkles size={14} />
                    <span>Limited Time Offer</span>
                 </div>
                 
                 <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                    Start for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Free.</span> <br/>
                    Scale Securely.
                 </h2>
                 
                 <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                    No credit card required. Get instant access to our core PDF tools and experience the speed of client-side processing.
                 </p>

                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="h-16 px-8 text-lg rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 transition-all hover:scale-105">
                       <Link to="/auth" className="flex items-center gap-2">
                          Create Free Account <ArrowRight size={20} />
                       </Link>
                    </Button>
                    <Button size="lg" className="h-16 px-8 text-lg rounded-full bg-orange-700 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 transition-all hover:scale-105">
                       <Link to="/contact">Talk to Sales</Link>
                    </Button>
                 </div>
                 
                 <p className="mt-8 text-sm text-slate-500">
                    Trusted by developers and businesses worldwide.
                 </p>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}