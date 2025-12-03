import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header"; 
import { Footer } from "@/components/Footer";
import { TypeAnimation } from "react-type-animation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Lottie from "lottie-react";

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
} from "lucide-react";

// --- UTILS (Shared with FileManagement) ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- COMPONENT: GLASS CARD (Shared Style) ---
const GlassCard = ({ children, className = "", onClick, hoverEffect = true }: any) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hoverEffect ? { y: -5, boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.25)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-orange-100/60 bg-white/60 backdrop-blur-xl shadow-xl shadow-orange-900/5 transition-all duration-300",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

// --- DATA ---
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
    color: "text-orange-600",
    bg: "bg-orange-100",
    route: "/tools/pdf-signature"
  },
  {
    title: "PDF to Word",
    desc: "Convert docs with perfect formatting.",
    icon: FileText,
    color: "text-red-600",
    bg: "bg-red-100",
    route: "/tools/pdf-word"
  },
  {
    title: "Optimize PDF",
    desc: "Compress file size without quality loss.",
    icon: Minimize2,
    color: "text-amber-600",
    bg: "bg-amber-100",
    route: "/tools/optimize"
  },
  {
    title: "Merge PDF",
    desc: "Combine multiple files into one.",
    icon: Combine,
    color: "text-orange-600",
    bg: "bg-orange-50",
    route: "/tools/merge"
  },
  {
    title: "Split PDF",
    desc: "Extract pages or split documents.",
    icon: Split,
    color: "text-red-600",
    bg: "bg-red-50",
    route: "/tools/split"
  },
  {
    title: "PDF to JPG",
    desc: "Turn pages into high-res images.",
    icon: ImageIcon,
    color: "text-amber-600",
    bg: "bg-amber-50",
    route: "/tools/pdf-image"
  },
];

const features = [
  {
    icon: Shield,
    title: "Military-Grade Security",
    description: "AES-256 encryption. We build the shield, you hold the key.",
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    icon: Zap,
    title: "Blazing Fast Engine",
    description: "Powered by WebAssembly. Zero uploads, instant processing.",
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    icon: Globe,
    title: "Universal Access",
    description: "Works entirely offline once loaded. True freedom for your files.",
    color: "text-amber-600",
    bg: "bg-amber-100",
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
    color: "text-slate-700"
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
    color: "text-orange-600"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Scalable security for large teams.",
    features: ["API Access", "SSO Integration", "Dedicated Server Instance", "Audit Logs", "24/7 Dedicated Support"],
    cta: "Contact Sales",
    highlight: false,
    color: "text-slate-700"
  }
];

// Animation Variants
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

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

  // Lottie Data (Optional Hero Effect)
  const [lottieHeroData, setLottieHeroData] = useState<any>(null);
  useEffect(() => {
    // Reusing the hero lottie from FileManagement for consistency
    fetch("https://lottie.host/b083b4c1-6548-43b6-96b6-52c676751268/K35Z3w3Qc0.json")
      .then(r => r.json())
      .then(setLottieHeroData);
  }, []);

  const handleToolClick = (route: string) => {
    const isAuthenticated = localStorage.getItem("user_uid"); 
    if (isAuthenticated) {
      navigate(route);
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8F0] font-sans text-slate-900 overflow-x-hidden selection:bg-orange-200 selection:text-orange-900">
      
      {/* --- BACKGROUND EFFECTS (Matched to FileManagement) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-gradient-to-r from-orange-200 to-amber-100 rounded-full blur-[140px] opacity-50" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light"></div>
      </div>

      <div className="relative z-50">
        <Header isAuthenticated={false} isAdmin={false} />
      </div>

      <main className="relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 px-6 overflow-visible">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="container max-w-7xl mx-auto text-center relative"
          >
            {/* Background Lottie Element */}
            <div className="absolute top-0 right-10 w-64 h-64 opacity-20 pointer-events-none md:block hidden">
                 {lottieHeroData && <Lottie animationData={lottieHeroData} loop={true} />}
            </div>

            <motion.div variants={fadeInUp} className="flex justify-center mb-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-orange-200 shadow-lg shadow-orange-500/10 backdrop-blur-md cursor-pointer"
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="text-sm font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Kavach 2.0: Ultimate Defense
                </span>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative mb-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-slate-900 drop-shadow-sm">
                Redefining PDF <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 animate-gradient-x">
                  Security & Speed.
                </span>
              </h1>
              
              <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute -top-10 left-0 lg:left-10 opacity-30 pointer-events-none">
                <FileStack className="w-24 h-24 text-orange-300 rotate-[-15deg]" />
              </motion.div>
              <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute top-20 right-0 lg:right-10 opacity-30 pointer-events-none">
                <Shield className="w-32 h-32 text-red-300 rotate-[15deg]" />
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="max-w-2xl mx-auto space-y-8 mb-12">
              <div className="text-xl md:text-2xl text-slate-500 font-light">
                The complete toolkit to
                <TypeAnimation
                  sequence={[
                    " Protect.", 2000, " Optimize.", 2000, " Organize.", 2000, " Transform.", 2000
                  ]}
                  wrapper="span"
                  speed={50}
                  className="font-bold text-orange-600 ml-2"
                  repeat={Infinity}
                />
              </div>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Empower your workflow with the next generation of PDF tools. 
                Fast, secure, and designed for modern privacy needs.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Button 
                asChild 
                className="rounded-full px-10 h-14 bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 text-lg font-bold"
              >
                <Link to="/tools" className="flex items-center gap-2">
                  Start Processing <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="h-14 px-10 rounded-full border-orange-200 bg-white/50 backdrop-blur-sm text-slate-700 text-lg font-medium transition-all hover:bg-orange-50 hover:text-orange-600 shadow-sm"
              >
                <Link to="/demo">Watch Demo</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* --- INFINITE SCROLL TICKER --- */}
        <section className="py-8 relative z-10 border-y border-orange-100/50 bg-white/40 backdrop-blur-md overflow-hidden">
          <div className="flex overflow-hidden w-full mask-image-linear-gradient-to-r from-transparent via-black to-transparent">
            <motion.div 
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center whitespace-nowrap"
            >
              {[...companies, ...companies, ...companies, ...companies].map((co, idx) => (
                <div key={idx} className="flex items-center gap-3 mx-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 group cursor-default shrink-0">
                    <co.icon className="w-6 h-6 text-orange-500" />
                    <span className="text-xl font-bold text-slate-400 tracking-widest uppercase group-hover:text-slate-900 transition-colors">{co.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* --- ESSENTIAL PDF TOOLS --- */}
        <section className="py-24 relative z-10">
          <div className="container px-6 mx-auto max-w-7xl">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-block p-3 bg-orange-100 rounded-2xl text-orange-600 mb-2">
                 <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">
                Essential <span className="text-orange-600">PDF Tools</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg">Everything you need to manage your documents securely.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfTools.map((tool, idx) => (
                <GlassCard
                  key={idx}
                  onClick={() => handleToolClick(tool.route)}
                  className="cursor-pointer group h-full"
                >
                  <div className="p-8 h-full flex flex-col items-start relative z-10">
                    <div className="flex justify-between w-full mb-6">
                      <div className={`p-4 rounded-2xl ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                         <tool.icon size={28} />
                      </div>
                      <div className="p-2 rounded-full bg-orange-50 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="w-5 h-5 text-orange-400" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 mb-3 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {tool.desc}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* --- CORE FEATURES --- */}
        <section className="py-20 relative z-10">
          <div className="container px-6 mx-auto max-w-7xl">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">
                Core <span className="text-orange-600">Advantages</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                Built for speed, security, and reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <GlassCard
                  key={idx}
                  hoverEffect={false}
                  className="p-8 group hover:-translate-y-2 transition-transform duration-500"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* --- GRAPHIC SECTION --- */}
        <section className="py-24 relative overflow-hidden">
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
                    <GlassCard className="p-8 border-orange-200 bg-white/80">
                        <div className="flex items-center justify-between mb-8 border-b border-orange-100 pb-6">
                          <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-red-400" />
                              <div className="w-3 h-3 rounded-full bg-amber-400" />
                              <div className="w-3 h-3 rounded-full bg-orange-400" />
                          </div>
                          <div className="px-3 py-1 rounded-full bg-orange-50 text-xs text-orange-600 font-mono border border-orange-100">
                              SECURE_CORE_ACTIVE
                          </div>
                        </div>

                        <div className="space-y-4">
                          {[
                            { icon: FileStack, name: "contract_final.pdf", size: "2.4 MB" },
                            { icon: Lock, name: "financial_report.enc", size: "Encrypted" },
                            { icon: Signature, name: "nda_signed.pdf", size: "Signed" }
                          ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-white text-orange-500 border border-orange-100 shadow-sm group-hover:text-orange-600 transition-colors">
                                      <item.icon size={18}/>
                                    </div>
                                    <div className="text-sm">
                                      <div className="text-slate-800 font-bold">{item.name}</div>
                                      <div className="text-slate-400 text-xs font-medium">{item.size}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded ${i === 1 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                      {i === 1 ? <Lock size={10} /> : <CheckCircle2 size={10} />}
                                      {i === 1 ? 'LOCKED' : 'READY'}
                                    </div>
                                </div>
                              </div>
                          ))}
                        </div>
                        
                        <div className="mt-8">
                          <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                            <span>PROCESSING BATCH</span>
                            <span className="text-orange-500 animate-pulse">ACTIVE</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "65%" }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 relative" 
                            >
                              <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]" />
                            </motion.div>
                          </div>
                        </div>
                    </GlassCard>

                    {/* Floating Elements */}
                    <motion.div 
                        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-6 -right-6 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-orange-100 shadow-xl shadow-orange-500/10"
                    >
                        <Cpu className="w-8 h-8 text-orange-500" />
                    </motion.div>
                    
                    <motion.div 
                        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-8 -left-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-red-100 shadow-xl shadow-red-500/10"
                    >
                        <Shield className="w-8 h-8 text-red-500" />
                    </motion.div>
                  </motion.div>
              </div>

              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 text-orange-600 font-bold tracking-wider text-sm uppercase bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  <Rocket className="w-4 h-4" />
                  <span>Seamless Integration</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                  Documents <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Reimagined.</span>
                </h2>
                <p className="text-lg text-slate-600 font-medium">
                  Whether you're merging huge reports or securing sensitive contracts, our tools adapt to your needs. 
                  Intuitive, responsive, and incredibly powerful.
                </p>
                <ul className="space-y-5 mt-4">
                  {[
                    {text: 'Client-Side Encryption (Zero-Knowledge)', color: 'text-red-500'}, 
                    {text: 'Instant Offline Availability', color: 'text-orange-500'}, 
                    {text: 'Cross-Platform Compatibility', color: 'text-amber-500'}
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                      <div className={`w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm`}>
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider mb-4">
                  <Crown size={14} /> Unlocked Potential
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Premium Plans</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                Scale your document security with plans designed for speed and power.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {pricingPlans.map((plan, idx) => (
                  <GlassCard
                    key={idx}
                    hoverEffect={false}
                    className={`p-8 cursor-pointer ${plan.highlight ? 'border-orange-400/50 shadow-orange-500/20 scale-105 z-10 bg-white/80' : 'bg-white/40'}`}
                    onClick={() => navigate("/pricing")}
                  >
                    {plan.highlight && (
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 to-red-600" />
                    )}
                    {plan.highlight && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-orange-100 text-orange-700 border border-orange-200 text-[10px] font-bold uppercase tracking-widest rounded-full">
                          {plan.badge}
                        </div>
                    )}

                    <h3 className={`text-xl font-bold mb-2 ${plan.color}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className={`text-4xl font-black ${plan.highlight ? 'text-slate-900' : 'text-slate-800'}`}>{plan.price}</span>
                        {plan.period && <span className="text-slate-400 font-medium">{plan.period}</span>}
                    </div>
                    <p className="text-slate-500 text-sm mb-8 font-medium">{plan.description}</p>

                    <ul className="space-y-4 mb-8">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                              <Check className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-orange-500' : 'text-slate-400'}`} />
                              {feat}
                          </li>
                        ))}
                    </ul>

                    <Button 
                        className={`w-full h-12 rounded-xl font-bold transition-all 
                          ${plan.highlight 
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                            : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-600'
                          }
                        `}
                    >
                        {plan.cta}
                    </Button>
                  </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-24 px-6 relative overflow-visible">
          <div className="container max-w-6xl mx-auto relative z-10">
            <GlassCard className="p-12 md:p-24 text-center bg-gradient-to-br from-white/80 to-orange-50/50">
                {/* Floating Icons */}
                <motion.div 
                  animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 left-10 text-orange-100 hidden md:block"
                >
                  <Shield size={120} />
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-10 right-10 text-red-100 hidden md:block"
                >
                  <Lock size={120} />
                </motion.div>

                <div className="relative z-10 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-600 text-sm font-bold mb-6 shadow-sm">
                      <Sparkles size={14} />
                      <span>Limited Time Offer</span>
                  </div>
                  
                  <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">
                      Start for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Free.</span> <br/>
                      Scale Securely.
                  </h2>
                  
                  <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                      No credit card required. Get instant access to our core PDF tools and experience the speed of client-side processing.
                  </p>
                  
                  <Button 
                    asChild 
                    className="rounded-full px-12 h-16 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xl font-bold shadow-2xl shadow-orange-500/30 hover:scale-105 transition-all"
                  >
                    <Link to="/auth">Get Started Now</Link>
                  </Button>

                  <p className="mt-8 text-sm text-slate-400 font-medium">
                      Trusted by developers and businesses worldwide.
                  </p>
                </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}