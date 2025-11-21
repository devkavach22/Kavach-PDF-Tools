import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  Upload,
  LayoutDashboard,
  Image,
  Video,
  Folder,
  Menu,
  Shield,
  Bell
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Ensure these imports point to your actual component locations
import { DashboardView } from "@/components/DashboardViews";
import { DocumentsView } from "@/components/DocumentViews";
import { ImagesView } from "@/components/ImageViews";
import { VideoAudioView } from "@/components/VideoAudioViews";
import { OthersView } from "@/components/OthersViews";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const sidebarNavItems = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "documents", name: "Documents", icon: FileText },
  { id: "images", name: "Images", icon: Image },
  { id: "video", name: "Video, Audio", icon: Video },
  { id: "others", name: "Others", icon: Folder },
];

export default function FileManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  // Helper function to render the active view
  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard": return <DashboardView />;
      case "documents": return <DocumentsView />;
      case "images": return <ImagesView />;
      case "video": return <VideoAudioView />;
      case "others": return <OthersView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-100 selection:bg-orange-500/30 selection:text-orange-100 overflow-x-hidden">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] left-[10%] w-[50vw] h-[50vw] bg-orange-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
           animate={{ opacity: [0.2, 0.3, 0.2], scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
           transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] right-[0%] w-[40vw] h-[40vw] bg-red-600/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={true} isAdmin={false} />
        
        {/* Spacer for fixed header */}
        <div className="h-20 md:h-24" />

        {/* APP WORKSPACE */}
        <div className="flex-1 flex flex-col container max-w-[1600px] mx-auto px-4 md:px-6 pb-6">
            
            {/* Glass Container */}
            <div className="flex-1 flex overflow-hidden rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-black/50">
                
                {/* Sidebar */}
                <aside
                    className={cn(
                    "flex-col border-r border-white/5 bg-slate-900/40 transition-all duration-300",
                    isSidebarOpen ? "w-64 p-4 opacity-100 translate-x-0" : "w-0 p-0 opacity-0 -translate-x-4 border-none"
                    )}
                >
                    <div className="space-y-6 min-w-[220px]">
                        {/* Sidebar Header */}
                        <div className="flex items-center gap-3 px-2 mt-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-lg shadow-orange-900/20">
                                <Shield className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Vault
                            </span>
                        </div>

                        <nav className="space-y-1">
                            {sidebarNavItems.map((item) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                className={cn(
                                "w-full justify-start text-sm font-medium transition-all duration-200 mb-1",
                                activeView === item.id 
                                    ? "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300 border border-orange-500/20 shadow-[0_0_15px_-5px_rgba(249,115,22,0.3)]" 
                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                                )}
                                onClick={() => setActiveView(item.id)}
                            >
                                <item.icon className={cn(
                                "mr-3 h-4 w-4 transition-colors",
                                activeView === item.id ? "text-orange-500" : "text-slate-500 group-hover:text-slate-300"
                                )} />
                                {item.name}
                            </Button>
                            ))}
                        </nav>
                    </div>
                    
                    {/* Sidebar Footer: Storage Widget */}
                    <div className="mt-auto pt-6 px-2 min-w-[220px]">
                         <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 shadow-inner">
                             <div className="flex justify-between text-xs text-slate-400 mb-2">
                                 <span>Storage</span>
                                 <span className="text-orange-400 font-mono">75%</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full w-3/4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                             </div>
                             <div className="mt-2 text-[10px] text-slate-500">7.5GB of 10GB Used</div>
                         </div>
                    </div>
                </aside>

                {/* Inner Content Area */}
                <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    
                    {/* Top Bar */}
                    <div className="flex items-center justify-between gap-4 p-6 border-b border-white/5 bg-slate-900/20">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-white/5"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="relative flex-1 max-w-md mx-4 group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-orange-500 transition-colors" />
                            <Input
                                placeholder="Search files..."
                                className="pl-10 bg-slate-950/50 border-white/10 text-slate-200 placeholder:text-slate-600 focus-visible:ring-orange-500/50 focus-visible:border-orange-500/50 h-10 rounded-xl transition-all hover:border-white/20"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-full">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white border-0 shadow-lg shadow-orange-900/20 rounded-xl h-10 px-6 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/20">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload
                            </Button>
                        </div>
                    </div>

                    {/* View Content Container */}
                    <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent hover:scrollbar-thumb-orange-500/50">
                        {renderActiveView()}
                    </div>

                </main>
            </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}