import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { 
  Shield, FileText, FileSignature, Minimize2, 
  Combine, Split, ImageIcon, Layers, ArrowRight, Sparkles, 
  Stamp, X, LogIn, UserPlus 
} from "lucide-react";

// Reuse the exact particle/theme config
const particlesOptions = {
  fullScreen: { enable: false, zIndex: 0 },
  background: { color: { value: "transparent" } },
  fpsLimit: 120,
  interactivity: {
    events: { onHover: { enable: true, mode: "repulse" }, resize: true },
    modes: { repulse: { distance: 150, duration: 0.4 } },
  },
  particles: {
    color: { value: ["#fb923c", "#f87171", "#fbbf24"] },
    links: { color: "#cbd5e1", distance: 150, enable: true, opacity: 0.2, width: 1 },
    move: { enable: true, speed: 1, direction: "none", random: true, outModes: { default: "bounce" } },
    number: { density: { enable: true, area: 800 }, value: 80 },
    opacity: { value: 0.5 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

const GradientBlob = ({ className }: { className?: string }) => (
  <motion.div 
    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 45, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-full blur-[90px] filter ${className}`}
  />
);

const allFeatures = [
  { title: "Merge PDF", path: "/tools/merge", desc: "Combine multiple PDFs into a single unified document instantly.", icon: Combine, color: "text-orange-500", bg: "bg-orange-50" },
  { title: "Split PDF", path: "/tools/split", desc: "Separate one page or a whole set for easy conversion.", icon: Split, color: "text-red-500", bg: "bg-red-50" },
  { title: "Compress PDF", path: "/tools/compress", desc: "Reduce file size while optimizing for maximal PDF quality.", icon: Minimize2, color: "text-amber-500", bg: "bg-amber-50" },
  { title: "PDF to Image", path: "/tools/pdf-image", desc: "Extract images from your PDF or save each page as a separate image.", icon: ImageIcon, color: "text-orange-600", bg: "bg-orange-50" },
  { title: "Sign PDF", path: "/pdf-sign", desc: "Sign yourself or request electronic signatures from others.", icon: FileSignature, color: "text-red-600", bg: "bg-red-50" },
  { title: "Edit PDF", path: "/tools/edit-pdf", desc: "Add text, shapes, comments and highlights to your PDF file.", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  { title: "Lock PDF", path: "/tools/pdf-lock", desc: "Encrypt your PDF file with a password and strong permissions.", icon: Shield, color: "text-orange-500", bg: "bg-orange-50" },
  { title: "Unlock PDF", path: "/pdf-unlock", desc: "Remove password security from secured PDF files.", icon: Layers, color: "text-red-500", bg: "bg-red-50" },
  { title: "Watermark PDF", path: "/tools/pdf-watermark", desc: "Stamp text or images over your PDF pages for copyright protection.", icon: Stamp, color: "text-amber-500", bg: "bg-amber-50" },
];

const AuthModal = ({ isOpen, onClose, onLogin, onRegister }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white border border-slate-200 p-8 rounded-2xl max-w-md w-full shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
            <Shield size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h3>
          <p className="text-slate-600">To access these powerful PDF tools, please login to your account or create a new one.</p>
        </div>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onLogin}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
          >
            <LogIn size={18} /> Login Existing User
          </button>
          <button 
            onClick={onRegister}
            className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus size={18} /> Create New Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function Features() {
  const [init, setInit] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { initParticlesEngine(async (engine) => await loadSlim(engine)).then(() => setInit(true)); }, []);

  const handleToolClick = (path: string) => {
    const isAuthenticated = localStorage.getItem("authToken"); 
    if (isAuthenticated) {
      navigate(path);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLoginRedirect = () => {
    setShowAuthModal(false);
    navigate("/login");
  };

  const handleRegisterRedirect = () => {
    setShowAuthModal(false);
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans overflow-x-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <GradientBlob className="top-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-200/40" />
        <GradientBlob className="bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-red-200/40" />
      </div>

      {init && <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"><Particles id="tsparticles" options={particlesOptions} className="h-full w-full" /></div>}

      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={14} /> Power Suite
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Every tool to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-amber-500">Master Documents.</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              A comprehensive ecosystem of tools designed to process, secure, and convert your documents with zero latency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleToolClick(feat.path)}
                className="group relative p-8 rounded-2xl bg-white border border-slate-200 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-slate-200/50 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-lg ${feat.bg} flex items-center justify-center mb-6 ${feat.color} group-hover:scale-110 transition-transform`}>
                    <feat.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    {feat.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />
                  </h3>
                  <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
            onLogin={handleLoginRedirect}
            onRegister={handleRegisterRedirect}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}