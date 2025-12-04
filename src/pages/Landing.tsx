import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { 
  Brain, 
  Search, 
  FileBarChart, 
  Database, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Activity, 
  Network, 
  Cpu, 
  Layers, 
  Globe,
  Fingerprint,
  Menu,
  X,
  MessageSquare,
  Command,
  Share2,
  ShieldCheck,
  Bot
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- HOOKS ---
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  return mousePosition;
};

// --- INLINE COMPONENTS ---

// const Header = ({ isAuthenticated = false }) => {
//   const navigate = useNavigate();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header 
//       className={cn(
//         "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
//         isScrolled 
//           ? "h-16 bg-white/90 backdrop-blur-md border-orange-200/50 shadow-sm" 
//           : "h-20 bg-transparent border-transparent"
//       )}
//     >
//       <div className="container mx-auto px-6 h-full flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
//           <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
//             <Bot className="w-5 h-5 fill-current" />
//           </div>
//           <span className="font-bold text-xl tracking-tight text-slate-900">
//             Data<span className="text-orange-600">Sense</span>
//           </span>
//         </div>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
//           {["Capabilities", "The Engine", "Solutions"].map((item) => (
//             <a 
//               key={item} 
//               href={`#${item.toLowerCase().replace(" ", "-")}`} 
//               className="relative px-2 py-1 hover:text-orange-600 transition-colors group"
//             >
//               {item}
//               <span className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
//             </a>
//           ))}
//         </nav>

//         {/* Auth Buttons */}
//         <div className="hidden md:flex items-center gap-3">
//           <button onClick={() => navigate('/auth')} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors">
//             Log In
//           </button>
//           <button 
//             onClick={() => navigate('/auth')}
//             className="px-5 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-slate-900/20 hover:shadow-orange-500/30"
//           >
//             Get Access
//           </button>
//         </div>

//         {/* Mobile Menu Toggle */}
//         <button className="md:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-md transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//           {mobileMenuOpen ? <X /> : <Menu />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="absolute top-full left-0 right-0 bg-white border-b border-orange-100 p-6 shadow-xl md:hidden flex flex-col gap-4"
//         >
//           <a href="#capabilities" className="text-slate-600 font-medium p-2 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
//           <a href="#the-engine" className="text-slate-600 font-medium p-2 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>The Engine</a>
//           <button className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg" onClick={() => navigate('/auth')}>Get Started</button>
//         </motion.div>
//       )}
//     </header>
//   );
// };

// const Footer = () => (
//   <footer className="bg-white border-t border-orange-100 pt-20 pb-10 px-6 relative overflow-hidden">
//     <div className="container mx-auto max-w-7xl relative z-10">
//       <div className="grid md:grid-cols-5 gap-12 mb-16">
//         <div className="col-span-1 md:col-span-2 space-y-4">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
//                <Zap className="w-5 h-5 fill-current" />
//             </div>
//             <span className="font-bold text-xl text-slate-900">DataSense</span>
//           </div>
//           <p className="text-slate-500 max-w-xs font-medium leading-relaxed">
//             Pioneering the future of semantic search and automated business intelligence with ethical AI.
//           </p>
//           <div className="flex gap-4 pt-2">
//             {[Share2, Globe, MessageSquare].map((Icon, i) => (
//               <div key={i} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-orange-100 hover:text-orange-600 transition-colors cursor-pointer">
//                 <Icon size={14} />
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {["Product", "Resources", "Company"].map((col, idx) => (
//           <div key={idx}>
//             <h4 className="font-bold text-slate-900 mb-6">{col}</h4>
//             <ul className="space-y-3 text-sm text-slate-500 font-medium">
//               {[1, 2, 3].map((item) => (
//                 <li key={item}>
//                   <a href="#" className="hover:text-orange-600 transition-colors flex items-center gap-1 group">
//                     <span className="w-1 h-1 rounded-full bg-orange-300 opacity-0 group-hover:opacity-100 transition-opacity"/>
//                     Link Item {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
      
//       <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
//         <p>© 2024 DataSense AI Technologies. All rights reserved.</p>
//         <div className="flex gap-6">
//           <a href="#" className="hover:text-orange-600">Privacy Policy</a>
//           <a href="#" className="hover:text-orange-600">Terms of Service</a>
//           <a href="#" className="hover:text-orange-600">Security</a>
//         </div>
//       </div>
//     </div>
//   </footer>
// );

// --- VISUAL COMPONENTS ---

const TiltCard = ({ children, className }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragElastic={0.12}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      whileTap={{ cursor: "grabbing" }}
      className={cn("cursor-grab perspective-1000", className)}
    >
      {children}
    </motion.div>
  );
};

const GlowButton = ({ children, className, onClick, to, variant = "primary" }: any) => {
  const Component = to ? Link : motion.button;
  const isPrimary = variant === "primary";
  
  return (
    <Component
      to={to}
      onClick={onClick}
      className={cn(
        "relative group px-8 py-3.5 rounded-xl font-bold overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]",
        isPrimary 
          ? "bg-slate-900 text-white shadow-xl shadow-orange-900/10" 
          : "bg-white text-slate-900 border border-slate-200 hover:border-orange-300 hover:text-orange-600 shadow-sm",
        className
      )}
    >
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[length:200%_auto] animate-gradient-x" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </Component>
  );
};

// Neural Network Canvas
const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const nodes: any[] = [];
    const nodeCount = 45; // Amount of nodes

    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4; // Slower, calmer movement
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          this.x += dx * 0.01;
          this.y += dy * 0.01;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 115, 22, 0.4)"; // Orange nodes
        ctx.fill();
      }
    }

    for (let i = 0; i < nodeCount; i++) nodes.push(new Node());

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      
      // Draw Connections
      nodes.forEach((node, index) => {
        node.update();
        node.draw();
        
        // Connect to nearby nodes
        for (let j = index + 1; j < nodes.length; j++) {
          const node2 = nodes[j];
          const dx = node.x - node2.x;
          const dy = node.y - node2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.12 - dist / 1500})`; // Faint orange web
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />;
};

const TypewriterText = ({ text, className }: { text: string, className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}<span className="animate-pulse text-orange-500">|</span></span>;
};

// --- MAIN PAGE ---
export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-[#FFFBF6] text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden flex flex-col">
      
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 origin-left z-50" />
      
      <NeuralBackground />
      
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-orange-300/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-amber-300/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />

      <div className="relative z-50">
        <Header isAuthenticated={false} />
      </div>

      <main className="relative z-10 pt-32 pb-20 flex-grow">
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 py-12 lg:py-24 overflow-visible">
          <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-white/80 backdrop-blur-sm text-orange-600 text-xs font-bold uppercase tracking-widest shadow-sm cursor-default"
              >
                <Sparkles size={14} className="fill-orange-600" />
                <span>NLP Engine v2.4 Live</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-900">
                Data speaks. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500">
                   We listen.
                </span>
              </h1>
              
              <div className="h-20 md:h-24">
                 <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                   Transform unstructured text into <TypewriterText text="structured insights using ElasticSearch & Transformers." className="text-slate-900 font-bold" />
                 </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <GlowButton onClick={() => navigate('/dashboard')} variant="primary">
                  Start Analysis <ArrowRight className="w-5 h-5" />
                </GlowButton>
                <GlowButton onClick={() => navigate('/demo')} variant="outline">
                   <Command className="w-4 h-4" /> View Demo
                </GlowButton>
              </div>

              <div className="flex items-center gap-6 pt-8 text-sm font-semibold text-slate-500">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs overflow-hidden shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                        </div>
                    ))}
                 </div>
                 <div className="flex flex-col">
                    <div className="flex text-yellow-500"><Sparkles size={12} fill="currentColor"/><Sparkles size={12} fill="currentColor"/><Sparkles size={12} fill="currentColor"/><Sparkles size={12} fill="currentColor"/><Sparkles size={12} fill="currentColor"/></div>
                    <span>Trusted by 10,000+ analysts</span>
                 </div>
              </div>
            </motion.div>

            {/* 3D Dashboard Graphic */}
            <div className="relative flex justify-center perspective-1000">
               <TiltCard className="relative z-10 w-full max-w-lg">
                  <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-orange-500/10 overflow-hidden group">
                     {/* Dashboard Header */}
                     <div className="h-14 border-b border-slate-100 flex items-center px-6 justify-between bg-white/50">
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-400" />
                           <div className="w-3 h-3 rounded-full bg-amber-400" />
                           <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">query_time: 12ms</div>
                     </div>
                     
                     {/* Dashboard Content */}
                     <div className="p-6 space-y-6">
                        <div className="flex gap-4">
                           <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-orange-200 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                 <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Activity size={18} /></div>
                                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                              </div>
                              <div className="text-2xl font-black text-slate-800">98.2</div>
                              <div className="text-xs text-slate-400 font-bold uppercase">Sentiment Index</div>
                           </div>
                           <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-orange-200 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Database size={18} /></div>
                              </div>
                              <div className="text-2xl font-black text-slate-800">4.2M</div>
                              <div className="text-xs text-slate-400 font-bold uppercase">Vectors Stored</div>
                           </div>
                        </div>

                        {/* Search Input Simulation */}
                        <div className="relative">
                           <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                              <Search size={16} />
                           </div>
                           <input disabled placeholder="Search semantic entities..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" />
                           <div className="absolute right-3 top-3 text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">⌘K</div>
                        </div>

                        {/* Chart Area */}
                        <div className="h-32 w-full bg-gradient-to-b from-orange-50/50 to-transparent rounded-xl border border-dashed border-orange-200 relative overflow-hidden flex items-end justify-between px-2 pb-0 pt-8">
                            {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                               <motion.div 
                                  key={i}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${h}%` }}
                                  transition={{ delay: 0.5 + (i * 0.1), duration: 1, type: "spring" }}
                                  className="w-[10%] bg-orange-400 rounded-t-sm opacity-80"
                               />
                            ))}
                        </div>
                     </div>
                  </div>

                  {/* Floating 3D Elements */}
                  <motion.div 
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl border border-orange-100 shadow-xl shadow-orange-500/10 flex flex-col items-center"
                  >
                     <Brain className="w-8 h-8 text-orange-500 mb-1" />
                     <span className="text-[10px] font-bold text-slate-500">NLP MODEL</span>
                  </motion.div>
               </TiltCard>
            </div>
          </div>
        </section>

        {/* --- BENTO GRID FEATURES --- */}
        <section id="capabilities" className="py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                 Intelligence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Unboxed.</span>
               </h2>
               <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                 Our features are designed to modularize your data workflow.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
               
               {/* Feature 1: Large Box */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="md:col-span-2 md:row-span-2 rounded-[32px] bg-white border border-slate-200 p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden group"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Search size={200} className="text-orange-500" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                     <div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                           <Search size={24} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">Semantic Search</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">
                           Don't just match keywords. Understand the <i>intent</i> behind the query. Our vector-based engine retrieves contextually relevant results even when terms don't exactly match.
                        </p>
                     </div>
                     <div className="mt-8">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 font-mono text-xs text-slate-600">
                           <span className="text-orange-600">{`>`}</span> vector.similarity(query, doc) <br/>
                           <span className="text-green-600">{`>`}</span> Score: 0.9842
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Feature 2: Wide Box */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="md:col-span-2 rounded-[32px] bg-slate-900 text-white p-8 relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-10" />
                  <div className="relative z-10 flex items-center justify-between h-full">
                     <div className="flex-1 pr-6">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              <Brain size={20} className="text-orange-400" />
                           </div>
                           <h3 className="text-xl font-bold">Neural Analysis</h3>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">
                           Real-time entity extraction and sentiment classification running at the edge.
                        </p>
                     </div>
                     <div className="hidden md:block w-32 h-20 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm relative">
                        {/* Abstract visual */}
                        <div className="absolute inset-2 flex items-center justify-center gap-1">
                           <motion.div animate={{ height: [10, 30, 15] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 bg-orange-500 rounded-full" />
                           <motion.div animate={{ height: [20, 10, 25] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2 bg-amber-500 rounded-full" />
                           <motion.div animate={{ height: [15, 25, 10] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-2 bg-yellow-500 rounded-full" />
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Feature 3: Small Box */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="md:col-span-1 rounded-[32px] bg-white border border-slate-200 p-8 shadow-lg shadow-slate-200/50 flex flex-col justify-between group"
               >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                     <ShieldCheck size={24} />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-slate-900 mb-2">Role Security</h3>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Enterprise Grade</p>
                  </div>
               </motion.div>

               {/* Feature 4: Small Box */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="md:col-span-1 rounded-[32px] bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-8 shadow-lg shadow-orange-500/5 flex flex-col justify-between"
               >
                  <div className="w-12 h-12 rounded-2xl bg-white text-orange-600 flex items-center justify-center mb-4 shadow-sm">
                     <FileBarChart size={24} />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-slate-900 mb-2">Auto Reports</h3>
                     <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-orange-500" />
                     </div>
                     <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-400">
                        <span>Generating...</span>
                        <span>65%</span>
                     </div>
                  </div>
               </motion.div>

            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        {/* <section className="py-20 px-6">
           <div className="container mx-auto max-w-4xl">
              <div className="rounded-[48px] bg-slate-900 relative overflow-hidden p-12 md:p-24 text-center">
                 {/* Background FX */}
                 {/* <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                 <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-orange-600/30 blur-[150px] rounded-full pointer-events-none" />
                 <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-amber-600/30 blur-[150px] rounded-full pointer-events-none" />

                 <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                       Ready to process <br/>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                          Millions of docs?
                       </span>
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                       <button className="px-10 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
                          Get Started Free
                       </button>
                       <button className="px-10 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
                          Contact Sales
                       </button>
                    </div>
                 </div>
              </div>
           </div> */}
        {/* </section> */}

      </main>

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}