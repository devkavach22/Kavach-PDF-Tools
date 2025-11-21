import React, { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  FileText, Scissors, Lock, Unlock, FileImage, FileDown, RotateCw, Wand2,
  LucideFile, File, LucidePresentation, FileSpreadsheet, Droplet, Image,
  FileSignature, FilePenLine, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/badge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(249, 115, 22, 0.15)", onClick }: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef} onClick={onClick} onMouseMove={handleMouseMove} onMouseEnter={() => setOpacity(1)} onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-xl transition-all duration-300 group hover:shadow-orange-500/10 hover:border-orange-500/30",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)` }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

// --- DATA ---
const allTools = [
  // Organize & Optimize
  { title: "Merge PDF", description: "Combine multiple PDF files into one document seamlessly", icon: FileText, href: "/tools/merge", category: "Organize" },
  { title: "Split PDF", description: "Split your PDF into individual pages or extract specific pages", icon: Scissors, href: "/tools/split", category: "Organize" },
  { title: "Compress PDF", description: "Reduce PDF file size while maintaining quality", icon: FileDown, href: "/tools/compress", category: "Optimize" },
  { title: "Rotate PDF", description: "Rotate PDF pages to the correct orientation", icon: RotateCw, href: "/tools/rotate", category: "Organize" },
  { title: "Optimize PDF", description: "Optimize PDF for web viewing and faster loading", icon: Wand2, href: "/tools/optimize", category: "Optimize" },
  // Convert
  { title: "PDF to Word", description: "Convert your PDF files to editable Word documents", icon: LucideFile, href: "/tools/pdf-word", category: "Convert" },
  { title: "PDF to PPT", description: "Convert PDFs into easy-to-edit PPT slides", icon: LucidePresentation, href: "/tools/pdf-ppt", category: "Convert" },
  { title: "PDF to Excel", description: "Extract data from PDFs into Excel spreadsheets", icon: FileSpreadsheet, href: "/tools/pdf-excel", category: "Convert" },
  { title: "PDF to Image", description: "Convert PDF pages to high-quality images", icon: FileImage, href: "/tools/pdf-image", category: "Convert" },
  // Create
  { title: "Word to PDF", description: "Convert Word documents to professional PDF files", icon: File, href: "/tools/word-pdf", category: "Create" },
  { title: "Image to PDF", description: "Convert JPG, PNG, and other images to a PDF file", icon: Image, href: "/tools/image-pdf", category: "Create" },
  // Edit & Security
  { title: "Edit PDF", description: "Add text, shapes, comments and highlights to your PDF", icon: FilePenLine, href: "/tools/edit-pdf", category: "Edit" },
  { title: "PDF Signature", description: "Sign your PDF documents electronically", icon: FileSignature, href: "/tools/pdf-sign", category: "Security" },
  { title: "Watermark PDF", description: "Add a text or image watermark to your PDF documents", icon: Droplet, href: "/tools/pdf-watermark", category: "Security" },
  { title: "Lock PDF", description: "Protect your PDF with password encryption", icon: Lock, href: "/tools/pdf-lock", category: "Security" },
  { title: "Unlock PDF", description: "Remove password protection from PDF files", icon: Unlock, href: "/tools/pdf-unlock", category: "Security" }
];

export default function Tools() {
  const isAuthenticated = true; 
  const isAdmin = false; 
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "Organize": return "text-orange-400";
      case "Optimize": return "text-amber-400";
      case "Convert": return "text-red-400";
      case "Security": return "text-slate-200";
      default: return "text-orange-300";
    }
  };

  const getCategoryBg = (category: string) => {
    switch(category) {
      case "Organize": return "bg-orange-500/10 border-orange-500/20";
      case "Optimize": return "bg-amber-500/10 border-amber-500/20";
      case "Convert": return "bg-red-500/10 border-red-500/20";
      case "Security": return "bg-slate-500/10 border-slate-500/20";
      default: return "bg-orange-500/10 border-orange-500/20";
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-50 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">
      
       {/* --- AMBIENT BACKGROUND --- */}
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" />
        <motion.div animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[120px]" />
        <motion.div animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1], rotate: [0, -5, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-[10%] right-[0%] w-[50vw] h-[50vw] bg-red-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={() => console.log("Logout clicked")} />
        
        <main className="flex-1 container mx-auto py-24 px-4 sm:px-8">
          <div className="text-center space-y-6 mb-20">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
               <Badge variant="outline" className="bg-orange-950/30 text-orange-400 border-orange-500/30 px-4 py-1 text-xs uppercase tracking-widest">Suite v2.0</Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold tracking-tight">
              Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">PDF Tools</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Choose from our comprehensive suite of advanced utilities to process, convert, and secure your documents.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allTools.map((tool, index) => (
              <motion.a href={tool.href} key={tool.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="block h-full">
                <SpotlightCard className="h-full flex flex-col justify-between p-6 cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-colors duration-300 border", getCategoryBg(tool.category || ""))}>
                            <tool.icon className={cn("h-6 w-6", getCategoryColor(tool.category || ""))} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{tool.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                     <span className="text-xs font-mono text-slate-500 uppercase tracking-wider group-hover:text-slate-300 transition-colors">{tool.category || "Utility"}</span>
                     <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-orange-400 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                     </div>
                  </div>
                </SpotlightCard>
              </motion.a>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}