import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; 
import { Header } from "@/components/Header"; 
import { Footer } from "@/components/Footer"; 
import {
  FileText, Clock, Download, Star, Share2, Trash2, FileDown, Rows, Lock,
  FileImage, ScissorsIcon, FolderPlus, Folder, UploadCloud, X, ArrowLeft,
  CheckCircle2, Plus, LayoutGrid, ChevronRight, HardDrive, Search, MoreVertical,
  Activity, Zap, PieChart as PieIcon, BarChart3, Sparkles, File as FileIcon,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)) + ' ' + ['Bytes', 'KB', 'MB', 'GB', 'TB'][i];
}

// --- COMPONENT: SPOTLIGHT CARD (Updated Color) ---
const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(249, 115, 22, 0.15)" }: any) => {
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
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-xl transition-all duration-300 group hover:shadow-orange-500/10 hover:border-orange-500/30",
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

// --- STATIC DATA (Colors Updated) ---
const userStats = [
  { title: "Documents Processed", value: 47, icon: FileText, trend: "+15.3%", color: "text-orange-400", border: "group-hover:border-orange-500/50" },
  { title: "Hours Saved", value: 12.5, icon: Clock, trend: "+8.7%", color: "text-red-400", border: "group-hover:border-red-500/50" },
  { title: "Active Storage", value: "89GB", icon: HardDrive, trend: "78% Used", color: "text-amber-400", border: "group-hover:border-amber-500/50" },
  { title: "Efficiency Score", value: "98.5", icon: Zap, trend: "Top 5%", color: "text-slate-200", border: "group-hover:border-slate-500/50" }
];

const recentFiles = [
  { id: 1, name: "Contract_merged.pdf", tool: "Merge PDF", date: "2h ago", size: "2.4 MB", type: "pdf" },
  { id: 2, name: "Report_annual.pdf", tool: "Compress", date: "5h ago", size: "1.2 MB", type: "pdf" },
  { id: 3, name: "Invoice_Q3.pdf", tool: "Split PDF", date: "1d ago", size: "856 KB", type: "pdf" },
  { id: 4, name: "Blueprint_v2.pdf", tool: "Lock PDF", date: "2d ago", size: "3.1 MB", type: "pdf" },
];

const weeklyActivityData = [
  { day: "Mon", processed: 4, active: 2 },
  { day: "Tue", processed: 7, active: 3 },
  { day: "Wed", processed: 5, active: 4 },
  { day: "Thu", processed: 10, active: 8 },
  { day: "Fri", processed: 8, active: 6 },
  { day: "Sat", processed: 3, active: 2 },
  { day: "Sun", processed: 6, active: 3 },
];

const toolUsageData = [
  { name: "Merge", value: 400 },
  { name: "Compress", value: 300 },
  { name: "Split", value: 300 },
  { name: "Convert", value: 200 },
];

// Updated Pie Colors to match theme
const PIE_COLORS = ["#f97316", "#ef4444", "#f59e0b", "#64748b"]; // Orange, Red, Amber, Slate

type FolderType = { id: string; name: string; desc?: string; fileCount: number; createdAt: string; theme: string };
type FileType = { id: string; name: string; extension: string; size: number; pageCount: string | number; path?: string; };
const API_URL = "http://localhost:5000/api/auth";

export default function UserDashboard() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);
  const [currentView, setCurrentView] = useState<"folders" | "files">("folders");
  const [userName, setUserName] = useState<string>("User");
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState(""); 
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [folderFiles, setFolderFiles] = useState<Record<string, FileType[]>>({});
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(typeof parsedUser === 'object' ? (parsedUser.name || parsedUser.firstName || "User") : String(parsedUser));
      } catch (e) { setUserName(storedUser); }
    }
  }, []);

  const fetchFolders = async () => {
    setIsLoadingFolders(true);
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get(`${API_URL}/folders`, { headers: { 'Authorization': token } });
      const folderData = response.data.folders || response.data;
      if (Array.isArray(folderData)) {
        const themes = ["orange", "red", "amber", "slate"];
        const mappedFolders: FolderType[] = folderData.map((f: any, index: number) => ({
          id: f._id || f.id, name: f.name, desc: f.desc,
          fileCount: f.files ? f.files.length : 0, createdAt: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "Recently",
          theme: themes[index % themes.length] 
        }));
        setFolders(mappedFolders);
      } else { setFolders([]); }
    } catch (error: any) { if (error.response?.status === 401) handleLogout(); } 
    finally { setIsLoadingFolders(false); }
  };

  const fetchFolderFiles = async (folderId: string) => {
    if (!folderId) return;
    setIsLoadingFiles(true);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/files/${folderId}`, { headers: { 'Authorization': token } });
        const filesData = response.data.files || response.data;
        if (Array.isArray(filesData)) {
            const mappedFiles: FileType[] = filesData.map((f: any) => ({
                id: f._id || f.id, name: f.originalName || f.name || "Unknown File",
                extension: (f.originalName || f.name || "").split('.').pop()?.toUpperCase() || "FILE",
                size: f.size || 0, pageCount: f.pageCount || 'N/A', path: f.path
            }));
            setFolderFiles((prev) => ({ ...prev, [folderId]: mappedFiles }));
        }
    } catch (error) { console.error(error); } finally { setIsLoadingFiles(false); }
  };

  useEffect(() => { if (isOverlayOpen) fetchFolders(); }, [isOverlayOpen]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setIsCreating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/folder/create`, { "name": newFolderName, "desc": newFolderDesc || "Project Folder" }, { headers: { 'Authorization': token } });
      await fetchFolders(); setNewFolderName(""); setNewFolderDesc("");
    } catch (error: any) { if (error.response?.status === 401) handleLogout(); } finally { setIsCreating(false); }
  };

  const handleOpenFolder = (folder: FolderType) => { setSelectedFolder(folder); setCurrentView("files"); fetchFolderFiles(folder.id); };
  const handleBackToFolders = () => { setCurrentView("folders"); setSelectedFolder(null); fetchFolders(); };

  const handleUploadFiles = async (files: FileList) => {
    if (!selectedFolder) return;
    setIsUploading(true);
    const data = new FormData();
    Array.from(files).forEach((file) => data.append('files', file));
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/upload/${selectedFolder.id}`, data, { headers: { 'Authorization': token } });
      await fetchFolderFiles(selectedFolder.id);
    } catch (error) { console.error(error); } finally { setIsUploading(false); }
  };

  const handleDragEnter = (e: any) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: any) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: any) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDrop = (e: any) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); if (e.dataTransfer.files.length) handleUploadFiles(e.dataTransfer.files); };
  const handleFileSelect = (e: any) => { if (e.target.files.length) handleUploadFiles(e.target.files); if (fileInputRef.current) fileInputRef.current.value = ''; };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-50 selection:bg-orange-500/30 selection:text-orange-100 overflow-x-hidden perspective-1000">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" />
        <motion.div animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[120px]" />
        <motion.div animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1], rotate: [0, -5, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-[10%] right-[0%] w-[50vw] h-[50vw] bg-red-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(20px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-7xl h-[92vh] mx-4 flex flex-col rounded-[32px] overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-orange-900/20 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-50 rounded-[32px]" />
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/5 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                   <Button onClick={currentView === "folders" ? () => setIsOverlayOpen(false) : handleBackToFolders} variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-white/10 text-slate-400 hover:text-white">
                      <ArrowLeft className="h-5 w-5" />
                   </Button>
                   <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                      {currentView === "folders" ? "Project Workspace" : selectedFolder?.name}
                   </h2>
                </div>
                <div className="relative group">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
                     <Input className="bg-black/50 border-white/10 pl-10 w-64 focus:w-80 transition-all duration-300 focus:ring-orange-500/50" placeholder="Search database..." />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-grid-white/[0.02] p-8">
                 {currentView === "folders" ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                       <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex-1 space-y-1">
                             <label className="text-xs font-mono text-slate-400 ml-1">PROJECT NAME</label>
                             <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="e.g. Project Alpha" className="bg-black/40 border-white/10 focus:border-orange-500 w-full md:w-64" />
                          </div>
                          <div className="flex-1 space-y-1">
                             <label className="text-xs font-mono text-slate-400 ml-1">DESCRIPTION</label>
                             <Input value={newFolderDesc} onChange={(e) => setNewFolderDesc(e.target.value)} placeholder="e.g. Important documents" className="bg-black/40 border-white/10 focus:border-orange-500 w-full md:w-96" />
                          </div>
                          <Button onClick={handleCreateFolder} disabled={isCreating || !newFolderName} className="bg-orange-600 hover:bg-orange-500 text-white mt-5 md:mt-0">
                             {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create
                          </Button>
                       </div>
                       {isLoadingFolders ? (
                         <div className="flex items-center justify-center h-64 text-slate-500"><Loader2 className="h-8 w-8 animate-spin mb-2" /><span className="ml-2">Synchronizing database...</span></div>
                       ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {folders.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No folders found. Create one to get started.</div>}
                            {folders.map((folder, idx) => (
                               <motion.div key={folder.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} onClick={() => handleOpenFolder(folder)}
                                 className="group cursor-pointer relative h-48 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/5 p-6 hover:border-orange-500/30 transition-all duration-300 overflow-hidden"
                               >
                                  <div className={`absolute top-0 right-0 p-20 rounded-full bg-${folder.theme}-500/20 blur-[60px] group-hover:bg-${folder.theme}-500/30 transition-colors`} />
                                  <div className="relative z-10 flex flex-col h-full justify-between">
                                     <div className="flex justify-between items-start">
                                       <div className={`p-3 rounded-xl bg-${folder.theme}-500/10 text-${folder.theme}-400 border border-${folder.theme}-500/20`}><Folder className="h-6 w-6" /></div>
                                       <MoreVertical className="h-5 w-5 text-slate-600 hover:text-white transition-colors" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{folder.name}</h3>
                                        {folder.desc && <p className="text-xs text-slate-400 mb-2 line-clamp-1">{folder.desc}</p>}
                                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500"><span>{folder.fileCount} FILES</span><span className="h-1 w-1 rounded-full bg-slate-600" /><span>{folder.createdAt}</span></div>
                                     </div>
                                  </div>
                               </motion.div>
                            ))}
                         </div>
                       )}
                    </motion.div>
                 ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                       <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" />
                       <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
                         className={cn("border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500/40 hover:bg-orange-500/5 transition-all group", (isDragging || isUploading) && "border-orange-500/40 bg-orange-500/5")}
                       >
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-800 to-black border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-900/20">
                             {isUploading ? <Loader2 className="h-8 w-8 text-orange-400 animate-spin" /> : <UploadCloud className={cn("h-8 w-8 text-slate-400 group-hover:text-orange-400", isDragging && "text-orange-400")} />}
                          </div>
                          <p className="text-lg font-medium text-white">{isUploading ? "Uploading files..." : isDragging ? "Drop files to upload" : "Drag & drop files or click to select"}</p>
                          <p className="text-sm text-slate-500 font-mono mt-2">SUPPORTED: PDF, DOCX, JPG</p>
                       </div>
                       <div className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm">
                         <table className="w-full divide-y divide-white/10">
                           <thead className="bg-white/5">
                             <tr>
                               {["Name", "Extension", "Size", "Page Count", ""].map((h, i) => <th key={i} className="px-6 py-4 text-left text-xs font-mono font-medium text-slate-400 uppercase tracking-widest">{h}</th>)}
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                             {!isLoadingFiles && (folderFiles[selectedFolder?.id || ""] || []).map((file) => (
                               <tr key={file.id} className="hover:bg-white/5 transition-colors">
                                 <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><FileIcon className="h-4 w-4 text-orange-400" /><span className="text-sm font-medium text-white">{file.name}</span></div></td>
                                 <td className="px-4 py-4 whitespace-nowrap"><Badge variant="outline" className="font-mono text-xs border-slate-700 text-slate-400">{file.extension}</Badge></td>
                                 <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{formatBytes(file.size)}</td>
                                 <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{file.pageCount}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-orange-400"><Download className="h-4 w-4" /></Button><Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button></td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                    </motion.div>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div animate={{ filter: isOverlayOpen ? "blur(12px) brightness(0.5)" : "blur(0px) brightness(1)", scale: isOverlayOpen ? 0.95 : 1 }} transition={{ duration: 0.5 }} className="flex-1 flex flex-col relative z-10">
        <Header isAuthenticated={true} onLogout={handleLogout} />
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-24 right-8 z-50">
           <Button onClick={() => setIsOverlayOpen(true)} className="h-12 px-6 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(249,115,22,0.4)] border border-orange-300/50">
              <LayoutGrid className="h-4 w-4 mr-2" /> OPEN WORKSPACE
           </Button>
        </motion.div>

        <main className="flex-1 container mx-auto pt-24 pb-12 px-4 sm:px-8 space-y-10">
          <div className="flex flex-col gap-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
               <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 py-1 px-3 font-mono text-[10px] uppercase tracking-widest">
                 <span className="relative flex h-2 w-2 mr-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span> System Online
               </Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">{userName}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-400 text-lg">Your production metrics are looking <span className="text-orange-400 font-semibold">exceptional</span> today.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {userStats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (i * 0.1) }}>
                   <SpotlightCard className="group">
                      <CardContent className="p-6 relative z-10">
                         <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300", stat.color)}><stat.icon className="h-6 w-6" /></div>
                            <Badge variant="secondary" className="bg-white/5 text-white border-0 font-mono text-xs">{stat.trend}</Badge>
                         </div>
                         <div><h3 className="text-3xl font-bold text-white mb-1 tracking-tighter">{stat.value}</h3><p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.title}</p></div>
                      </CardContent>
                   </SpotlightCard>
                </motion.div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-8 h-[400px] lg:h-full">
                <SpotlightCard className="h-full bg-gradient-to-b from-slate-900/50 to-black/50">
                   <CardHeader className="border-b border-white/5 pb-4">
                      <div className="flex items-center justify-between"><CardTitle className="text-lg font-medium text-white flex items-center gap-2"><Activity className="h-4 w-4 text-orange-400" /> Processing Volume</CardTitle></div>
                   </CardHeader>
                   <CardContent className="pt-6 h-[calc(100%-70px)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyActivityData}>
                           <defs><linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                           <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                           <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '5 5' }} />
                           <Area type="monotone" dataKey="processed" stroke="#f97316" strokeWidth={3} fill="url(#colorOrange)" animationDuration={2000} />
                        </AreaChart>
                      </ResponsiveContainer>
                   </CardContent>
                </SpotlightCard>
             </motion.div>

             <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
                   <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.15)">
                      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Tools</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-2 gap-3 pt-2">
                         {[ { icon: Rows, label: "Merge", color: "text-orange-400" }, { icon: ScissorsIcon, label: "Split", color: "text-red-400" }, { icon: FileDown, label: "Compress", color: "text-amber-400" }, { icon: Lock, label: "Protect", color: "text-slate-300" } ].map((tool, i) => (
                            <button key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group text-left">
                               <div className={cn("h-8 w-8 rounded-md flex items-center justify-center bg-black/50", tool.color)}><tool.icon className="h-4 w-4" /></div>
                               <span className="text-sm font-medium text-slate-300 group-hover:text-white">{tool.label}</span>
                            </button>
                         ))}
                      </CardContent>
                   </SpotlightCard>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-[1.5]">
                   <SpotlightCard className="h-full" spotlightColor="rgba(245, 158, 11, 0.15)">
                      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Recent Output</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                         {recentFiles.slice(0, 3).map((file, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                               <div className="flex items-center gap-3">
                                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-orange-500 to-red-500" />
                                  <div><p className="text-sm font-medium text-slate-200 group-hover:text-orange-400 transition-colors">{file.name}</p><p className="text-[10px] text-slate-500 font-mono">{file.date} • {file.size}</p></div>
                               </div>
                               <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"><Download className="h-4 w-4 text-slate-400" /></Button>
                            </div>
                         ))}
                      </CardContent>
                   </SpotlightCard>
                </motion.div>
             </div>
          </div>

           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SpotlightCard className="md:col-span-1 bg-black/40">
                 <CardHeader><CardTitle className="text-base text-white">Usage Distribution</CardTitle></CardHeader>
                 <CardContent className="h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie data={toolUsageData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                             {toolUsageData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><PieIcon className="h-8 w-8 text-slate-600" /></div>
                 </CardContent>
              </SpotlightCard>
              
              <SpotlightCard className="md:col-span-2 flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover opacity-80">
                  <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_30px_rgba(249,115,22,0.4)]"><Sparkles className="h-8 w-8 text-white" /></div>
                      <h3 className="text-2xl font-bold text-white">Upgrade to Pro</h3>
                      <p className="text-slate-400 max-w-md mx-auto">Unlock advanced PDF encryption, OCR capabilities, and unlimited cloud storage.</p>
                      <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">View Plans</Button>
                  </div>
              </SpotlightCard>
           </motion.div>
        </main>
        <Footer />
      </motion.div>
    </div>
  );
}