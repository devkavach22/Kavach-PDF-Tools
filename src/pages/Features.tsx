import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, FileText, FileSignature, Minimize2, 
  Combine, Split, ImageIcon, Layers, ArrowRight, Sparkles, 
  Stamp, X, LogIn, UserPlus 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- COMPONENT: GLASS CARD ---
const GlassCard = ({ children, className = "", onClick }: any) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-orange-100/60 bg-white/60 backdrop-blur-xl shadow-xl shadow-orange-900/5 cursor-pointer group",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-[#FFF8F0] border border-orange-100 p-8 rounded-3xl max-w-md w-full shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
            <Shield size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Authentication Required</h3>
          <p className="text-slate-600 font-medium">To access these powerful PDF tools, please login to your account or create a new one.</p>
        </div>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onLogin}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
          >
            <LogIn size={18} /> Login Existing User
          </button>
          <button 
            onClick={onRegister}
            className="w-full py-3 px-4 bg-white border border-orange-200 hover:bg-orange-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus size={18} /> Create New Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function Features() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

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
    navigate("/auth"); // Updated route
  };

  const handleRegisterRedirect = () => {
    setShowAuthModal(false);
    navigate("/auth"); // Updated route
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] text-slate-900 font-sans overflow-x-hidden relative selection:bg-orange-200 selection:text-orange-900">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-orange-200 to-amber-100 rounded-full blur-[100px] opacity-50" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light"></div>
      </div>

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
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
              Every tool to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-amber-500">Master Documents.</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
              A comprehensive ecosystem of tools designed to process, secure, and convert your documents with zero latency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map((feat, idx) => (
              <GlassCard
                key={idx}
                onClick={() => handleToolClick(feat.path)}
                className="p-8"
              >
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center mb-6 ${feat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <feat.icon size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                    {feat.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </GlassCard>
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