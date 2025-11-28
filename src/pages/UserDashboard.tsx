import React, { useState, useEffect, useRef } from "react";
import Instance from "@/lib/axiosInstance";
import { Header } from "@/components/Header"; 
import { Footer } from "@/components/Footer"; 
import {
  FileText, Clock, Download, Trash2, FileDown, Rows, Lock,
  FileImage, ScissorsIcon, Folder, UploadCloud, X, ArrowLeft,
  Plus, LayoutGrid, HardDrive, Search, MoreVertical,
  Activity, Zap, PieChart as PieIcon, Sparkles, File as FileIcon,
  Loader2, Eye, Brain, CheckCircle2, ChevronLeft, ChevronRight,
  MoreHorizontal, FileCode, Film, Music, Edit, Calendar, 
  BarChart3, ShieldCheck, TrendingUp, FolderPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell
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

// --- API FUNCTION ---
export const createUser = async (payload: any) => {
  try {
    const res = await Instance.post("/create-user", payload);
    return res.data;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

// --- HELPER: GET FILE ICON & COLOR ---
const getFileStyle = (ext: string) => {
  const e = ext ? ext.toLowerCase() : "file";
  if (['pdf'].includes(e)) return { icon: FileText, color: "text-red-500", bg: "bg-red-50", fill: "#ef4444" };
  if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(e)) return { icon: FileImage, color: "text-blue-500", bg: "bg-blue-50", fill: "#3b82f6" };
  if (['doc', 'docx', 'txt'].includes(e)) return { icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50", fill: "#4f46e5" };
  if (['xls', 'xlsx', 'csv'].includes(e)) return { icon: Rows, color: "text-green-600", bg: "bg-green-50", fill: "#16a34a" };
  if (['js', 'ts', 'tsx', 'html', 'css', 'py'].includes(e)) return { icon: FileCode, color: "text-yellow-500", bg: "bg-yellow-50", fill: "#eab308" };
  if (['mp4', 'mov'].includes(e)) return { icon: Film, color: "text-purple-500", bg: "bg-purple-50", fill: "#a855f7" };
  return { icon: FileIcon, color: "text-slate-400", bg: "bg-slate-50", fill: "#94a3b8" };
};

const getFileIconByExtension = (ext: string, className: string = "h-6 w-6") => {
  const style = getFileStyle(ext);
  const Icon = style.icon;
  return <Icon className={cn(style.color, className)} />;
};

// --- COMPONENT: SPOTLIGHT CARD ---
const SpotlightCard = ({ children, className = "" }: any) => {
  return (
    <div className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group hover:shadow-lg hover:border-orange-200",
        className
      )}
    >
      <div className="relative h-full">{children}</div>
    </div>
  );
};

// --- TYPES ---
type FolderType = { 
    id: string; 
    name: string; 
    desc?: string; 
    fileCount: number; 
    createdAt: string; 
    theme: string;
    userId?: string; 
};

type FileType = { 
  id: string; 
  name: string; 
  extension: string; 
  size: number; 
  pageCount: string | number; 
  publicPath?: string;
  extractedText?: string;
  folderId?: string; 
  userId?: string; 
}; 

// --- COMPONENT: FILE VIEWER OVERLAY ---
const FileViewerOverlay = ({ file, onClose }: { file: FileType; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<"preview" | "ocr">("preview");

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: -20 }}
        className="w-full max-w-4xl h-[85vh] mx-4 flex flex-col rounded-xl overflow-hidden bg-white border border-slate-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-white border border-slate-200 rounded-lg">{getFileIconByExtension(file.extension, "h-8 w-8")}</div>
             <div>
                <h3 className="text-xl font-bold text-slate-900 truncate max-w-[300px]">{file.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{formatBytes(file.size)} • {file.pageCount} Pages</p>
             </div>
          </div>
          <Button onClick={onClose} variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-slate-200 text-slate-500 hover:text-slate-900">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-200 bg-white">
           <button onClick={() => setActiveTab("preview")} className={cn("flex-1 py-3 text-sm font-medium transition-colors relative", activeTab === "preview" ? "text-orange-600 bg-orange-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50")}>
             <span className="flex items-center justify-center gap-2"><Eye className="h-4 w-4" /> Preview</span>
             {activeTab === "preview" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
           </button>
           <button onClick={() => setActiveTab("ocr")} className={cn("flex-1 py-3 text-sm font-medium transition-colors relative", activeTab === "ocr" ? "text-orange-600 bg-orange-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50")}>
             <span className="flex items-center justify-center gap-2"><Brain className="h-4 w-4" /> Extracted Text (OCR)</span>
             {activeTab === "ocr" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
           </button>
        </div>
        
        <div className="flex-1 p-0 overflow-hidden bg-slate-50 relative">
          {activeTab === "preview" ? (
             <div className="h-full w-full p-8 overflow-y-auto flex flex-col items-center justify-center text-center">
                <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white space-y-6 max-w-lg w-full">
                   <div className="mx-auto w-fit">{getFileIconByExtension(file.extension, "h-12 w-12")}</div>
                   <div>
                       <p className="text-xl font-semibold text-slate-900 mb-2">File Preview</p>
                       <p className="text-sm text-slate-500">Preview is not available for this file type in the dashboard.</p>
                   </div>
                   {file.publicPath && (
                       <div className="pt-4 border-t border-slate-200 w-full">
                           <a href={`http://localhost:8080${file.publicPath}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors font-medium text-sm">
                              <Download className="h-4 w-4" /> Open / Download File
                           </a>
                       </div>
                   )}
                </div>
             </div>
          ) : (
             <div className="h-full w-full p-6 overflow-y-auto">
                <div className="bg-white border border-slate-200 rounded-lg p-6 min-h-full shadow-sm">
                   {file.extractedText ? (
                      <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{file.extractedText}</pre>
                   ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                         <Brain className="h-12 w-12 mb-4 opacity-20" />
                         <p>No text extracted or OCR processing pending.</p>
                      </div>
                   )}
                </div>
             </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- CUSTOM TOOLTIP FOR CHART ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
        <p className="text-sm font-bold text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs text-slate-600 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium">{entry.name}:</span>
            <span>{entry.value} files</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- MAIN DASHBOARD COMPONENT ---
export default function UserDashboard() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);
  const [currentView, setCurrentView] = useState<"folders" | "files" | "reports">("folders");
  
  // User State
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Data State
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState(""); 
  const [isCreating, setIsCreating] = useState(false);
  
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  
  // File States
  const [folderFiles, setFolderFiles] = useState<Record<string, FileType[]>>({});
  const [allFiles, setAllFiles] = useState<FileType[]>([]); 
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  
  // Stats & Chart State
  const [stats, setStats] = useState({
      processed: 0,
      storage: 0,
      storageUnit: 'MB',
      hoursSaved: 0,
      extensionCounts: {} as Record<string, number>
  });
  const [chartData, setChartData] = useState<any[]>([]);

  // UI State
  const [fileSearchTerm, setFileSearchTerm] = useState("");
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [filePage, setFilePage] = useState(1);
  const filesPerPage = 6;
  const [activeMenu, setActiveMenu] = useState("folders");
  const [activeFolderMenu, setActiveFolderMenu] = useState<string | null>(null);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("Uploading..."); 
  const [isDragging, setIsDragging] = useState(false);
  
  const [viewingFile, setViewingFile] = useState<FileType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- INITIALIZATION: GET USER ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
            setCurrentUser(parsedUser);
        }
      } catch (e) { 
        console.error("Failed to parse user data", e); 
      }
    }
  }, []);

  // --- CHART GENERATION LOGIC (UPDATED FOR BAR CHART) ---
  const generateChartData = (files: FileType[]) => {
      // 1. Identify top extensions from real data
      const extCounts: Record<string, number> = {};
      files.forEach(f => {
          const ext = f.extension.toLowerCase();
          extCounts[ext] = (extCounts[ext] || 0) + 1;
      });
      // Get top 3-4 extensions
      const topExts = Object.keys(extCounts).sort((a,b) => extCounts[b] - extCounts[a]).slice(0, 3);
      if (topExts.length === 0) topExts.push('pdf', 'jpg', 'doc');

      // 2. Mock 7 days of data
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      
      const data = days.map((day, i) => {
          const dayData: any = { day };
          let totalForDay = 0;
          topExts.forEach(ext => {
              // Create a curve effect for visual appeal
              const val = Math.floor(Math.random() * 5) + (i % 3);
              dayData[ext] = val;
              totalForDay += val;
          });
          dayData['total'] = totalForDay;
          return dayData;
      });
      return { data, keys: topExts };
  };

  // --- STATS CALCULATION ---
  const calculateDashboardStats = (files: FileType[]) => {
      const totalFiles = files.length;
      
      const totalBytes = files.reduce((acc, file) => acc + (file.size || 0), 0);
      let storageValue = totalBytes / (1024 * 1024); // MB
      let storageUnit = 'MB';
      
      if (storageValue > 1024) {
          storageValue = storageValue / 1024;
          storageUnit = 'GB';
      }

      const hoursSaved = totalFiles * 0.25; 

      // Extension Breakdown
      const extCounts = files.reduce((acc: Record<string, number>, file) => {
          const ext = file.extension ? file.extension.toUpperCase() : "UNKNOWN";
          acc[ext] = (acc[ext] || 0) + 1;
          return acc;
      }, {});

      setStats({
          processed: totalFiles,
          storage: parseFloat(storageValue.toFixed(2)),
          storageUnit,
          hoursSaved: parseFloat(hoursSaved.toFixed(1)),
          extensionCounts: extCounts
      });
      
      // Generate Graph Data
      const chartInfo = generateChartData(files);
      setChartData(chartInfo.data);
  };

  // --- FETCHING LOGIC ---
  const fetchAllFiles = async () => {
    if (!currentUser) return [];
    
    setIsLoadingFiles(true);
    try {
        const response = await Instance.get(`/auth/files`); 
        const filesData = response.data.files || response.data;
        
        if (Array.isArray(filesData)) {
            const mappedFiles: FileType[] = filesData.map((f: any) => ({
                id: f._id || f.id, 
                name: f.originalName || f.name || "Unknown File",
                extension: f.extension || (f.originalName || "").split('.').pop() || "file",
                size: f.size || 0, 
                pageCount: f.pageCount || 'N/A', 
                publicPath: f.publicPath || "",
                extractedText: f.extractedText || undefined,
                folderId: f.folderId || f.folder,
                userId: f.userId || f.user 
            }));

            const userFiles = mappedFiles.filter(f => !f.userId || f.userId === currentUser._id || f.userId === currentUser.id);
            const sortedFiles = userFiles.reverse();

            setAllFiles(sortedFiles);
            return sortedFiles;
        }
        return [];
    } catch (error) { 
        console.error("Error fetching all files:", error); 
        return [];
    } 
    finally { setIsLoadingFiles(false); }
  };

  const fetchFolders = async () => {
    if (!currentUser) return; 
    
    setIsLoadingFolders(true);
    try {
      const files = await fetchAllFiles(); // Get fresh files first
      
      const response = await Instance.get(`/auth/folders`); 
      const folderData = response.data.folders || response.data;
      
      if (Array.isArray(folderData)) {
        const themes = ["orange", "red", "amber", "slate"];
        
        const mappedFolders: FolderType[] = folderData
            .map((f: any, index: number) => ({
                id: f._id || f.id, 
                name: f.name, 
                desc: f.desc,
                fileCount: 0,
                createdAt: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "Recently",
                theme: themes[index % themes.length],
                userId: f.userId || f.user
            }))
            .filter(f => !f.userId || f.userId === currentUser._id || f.userId === currentUser.id);

        const foldersWithCounts = mappedFolders.map(folder => ({
            ...folder,
            fileCount: files.filter(file => file.folderId === folder.id).length
        }));

        setFolders(foldersWithCounts);
        calculateDashboardStats(files);
      } else { setFolders([]); }
    } catch (error: any) { console.error("Error fetching folders:", error); } 
    finally { setIsLoadingFolders(false); }
  };

  const fetchFolderFiles = async (folderId: string) => {
    if (!folderId || !currentUser) return;
    setIsLoadingFiles(true);
    try {
        const files = allFiles.length > 0 ? allFiles : await fetchAllFiles();
        const folderSpecificFiles = files.filter(f => f.folderId === folderId);
        setFolderFiles((prev) => ({ ...prev, [folderId]: folderSpecificFiles }));
    } catch (error) { console.error("Error fetching files:", error); } 
    finally { setIsLoadingFiles(false); }
  };

  useEffect(() => { 
      if (isOverlayOpen && currentUser) {
          fetchFolders(); 
      }
  }, [isOverlayOpen, currentUser]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !currentUser) return;
    setIsCreating(true);
    try {
      const payload = { 
          "name": newFolderName, 
          "desc": newFolderDesc || "Project Folder",
          "userId": currentUser._id || currentUser.id
      };
      await Instance.post(`/auth/folder/create`, payload);
      await fetchFolders(); 
      setNewFolderName(""); setNewFolderDesc("");
    } catch (error: any) { console.error("Error creating folder:", error); } 
    finally { setIsCreating(false); }
  };

  const handleOpenFolder = (folder: FolderType) => { 
      setSelectedFolder(folder); 
      setCurrentView("files"); 
      setActiveMenu("folders"); 
      setFileSearchTerm(""); 
      fetchFolderFiles(folder.id); 
  };
  
  const handleBackToFolders = () => { setCurrentView("folders"); setSelectedFolder(null); if(currentUser) fetchFolders(); };
  const handleViewFile = (file: FileType) => { setViewingFile(file); };
  const handleCloseViewer = () => { setViewingFile(null); };

  const handleUploadFiles = async (files: FileList) => {
    if (!selectedFolder || !currentUser) {
        alert("Please select a folder and ensure you are logged in.");
        return;
    }
    
    setIsUploading(true);
    setUploadStatus("Uploading & Initializing OCR...");

    const data = new FormData();
    Array.from(files).forEach((file) => data.append('files', file));
    data.append('userId', currentUser._id || currentUser.id);
    
    try {
      setUploadStatus("Extracting Text via OCR...");
      await Instance.post(`/auth/upload/${selectedFolder.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchFolders(); 
    } catch (error) { console.error("Error uploading files:", error); } 
    finally { setIsUploading(false); setUploadStatus("Uploading..."); }
  };

  const handleDragEnter = (e: any) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: any) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: any) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDrop = (e: any) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); if (e.dataTransfer.files.length) handleUploadFiles(e.dataTransfer.files); };

  const getCurrentFolderFiles = () => {
      let files: FileType[] = [];
      if (selectedFolder) {
          files = allFiles.filter(f => f.folderId === selectedFolder.id);
      } else if (activeMenu === 'files') {
          files = allFiles;
      }
      if (!fileSearchTerm) return files;
      return files.filter(f => f.name.toLowerCase().includes(fileSearchTerm.toLowerCase()));
  };

  const currentFilesList = getCurrentFolderFiles();
  const indexOfLastFile = filePage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentPaginatedFiles = currentFilesList.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(currentFilesList.length / filesPerPage);

  const handleNextPage = () => { if (filePage < totalPages) setFilePage(prev => prev + 1); };
  const handlePrevPage = () => { if (filePage > 1) setFilePage(prev => prev - 1); };

  const handleMenuClick = (menuId: string) => {
      setActiveMenu(menuId);
      if (menuId === 'folders') {
          handleBackToFolders();
      } else if (menuId === 'files') {
          setCurrentView('files');
          setSelectedFolder(null); 
          fetchAllFiles(); 
      } else {
          setCurrentView(menuId as any);
      }
  };

  const displayName = currentUser ? (currentUser.name || currentUser.firstName || "User") : "User";
  
  // Get Chart Keys for Bar Chart
  const chartKeys = chartData.length > 0 ? Object.keys(chartData[0]).filter(k => k !== 'day' && k !== 'total') : [];

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      {/* VIEWER OVERLAY */}
      <AnimatePresence>{viewingFile && <FileViewerOverlay file={viewingFile} onClose={handleCloseViewer} />}</AnimatePresence>

      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(20px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[95%] h-[92vh] flex rounded-[24px] overflow-hidden border border-slate-700 bg-white shadow-2xl relative"
            >
              
              {/* --- SIDEBAR MENU --- */}
              <div className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
                  <div className="p-6 border-b border-slate-800">
                      <div className="flex items-center gap-2 text-orange-500 font-bold text-xl">
                          <LayoutGrid className="h-6 w-6" /> <span>Workspace</span>
                      </div>
                  </div>
                  
                  {currentUser && (
                      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Logged in as</p>
                          <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center text-sm font-bold">
                                  {displayName.charAt(0).toUpperCase()}
                              </div>
                              <p className="text-sm font-medium text-white truncate max-w-[140px]">{displayName}</p>
                          </div>
                      </div>
                  )}

                  <div className="p-4 space-y-2 flex-1">
                      {[
                          { id: "folders", icon: Folder, label: "My Folders" },
                          { id: "files", icon: FileText, label: "My Files" },
                      ].map(menu => (
                          <button 
                            key={menu.id} 
                            onClick={() => handleMenuClick(menu.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                activeMenu === menu.id ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                          >
                              <menu.icon className="h-5 w-5" /> {menu.label}
                          </button>
                      ))}
                  </div>
                  <div className="p-4 border-t border-slate-800">
                       <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => setIsOverlayOpen(false)}>
                           <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                       </Button>
                  </div>
              </div>

              {/* --- MAIN CONTENT AREA --- */}
              <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
                
                {/* Header */}
                <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20 shadow-sm">
                   <div className="flex items-center gap-4">
                       {currentView === "files" && selectedFolder && (
                           <Button onClick={handleBackToFolders} variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                               <ChevronLeft className="h-5 w-5 text-slate-600" />
                           </Button>
                       )}
                       <h2 className="text-xl font-bold text-slate-800">
                           {currentView === "folders" ? "Project Folders" : (selectedFolder?.name || "All Files")}
                       </h2>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                   
                   {/* VIEW 1: FOLDERS GRID */}
                   {currentView === "folders" && (
                      <div className="space-y-8 max-w-6xl mx-auto">
                           {/* Create Folder Section */}
                           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end md:items-center">
                               <div className="flex-1 w-full space-y-1">
                                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">New Folder Name</label>
                                   <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="e.g. Legal Documents 2024" className="bg-slate-50 border-slate-200" />
                               </div>
                               <div className="flex-1 w-full space-y-1">
                                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description (Optional)</label>
                                   <Input value={newFolderDesc} onChange={(e) => setNewFolderDesc(e.target.value)} placeholder="Project details..." className="bg-slate-50 border-slate-200" />
                               </div>
                               <Button onClick={handleCreateFolder} disabled={isCreating || !newFolderName} className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm min-w-[120px] font-medium transition-all">
                                   {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Create</>}
                               </Button>
                           </div>

                           {/* Folders Grid */}
                           {isLoadingFolders ? (
                               <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-orange-500 animate-spin" /></div>
                           ) : (
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {folders.length === 0 ? (
                                        <div className="col-span-full py-20 text-center text-slate-400">
                                            <Folder className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                            <p className="text-lg font-medium">No folders found for {displayName}.</p>
                                            <p className="text-sm">Create a new folder to get started.</p>
                                        </div>
                                   ) : (
                                       folders
                                         .filter(f => f.name.toLowerCase().includes(menuSearchTerm.toLowerCase()))
                                         .map((folder, idx) => (
                                           <motion.div 
                                              key={folder.id} 
                                              initial={{ opacity: 0, y: 20 }} 
                                              animate={{ opacity: 1, y: 0 }} 
                                              transition={{ delay: idx * 0.05 }}
                                              className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer"
                                              onClick={() => handleOpenFolder(folder)}
                                           >
                                               <div className={`absolute top-0 right-0 p-20 rounded-full bg-${folder.theme}-50 blur-[50px] opacity-50 group-hover:opacity-100 transition-opacity`} />
                                               
                                               <div className="relative z-10 flex justify-between items-start mb-4">
                                                   <div className={`h-12 w-12 rounded-xl bg-${folder.theme}-50 text-${folder.theme}-600 flex items-center justify-center border border-${folder.theme}-100 group-hover:scale-110 transition-transform`}>
                                                       <Folder className="h-6 w-6" />
                                                   </div>
                                                   
                                                   <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                       <Button 
                                                           variant="ghost" 
                                                           size="icon" 
                                                           className="h-8 w-8 text-slate-400 hover:text-slate-900"
                                                           onClick={() => setActiveFolderMenu(activeFolderMenu === folder.id ? null : folder.id)}
                                                       >
                                                           <MoreHorizontal className="h-5 w-5" />
                                                       </Button>
                                                   </div>
                                               </div>
                                               
                                               <div className="relative z-10">
                                                   <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">{folder.name}</h3>
                                                   <p className="text-xs text-slate-500 mb-4 line-clamp-1">{folder.desc || "No description provided"}</p>
                                                   <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-4 border-t border-slate-100">
                                                       <span>{folder.fileCount} Files</span>
                                                       <span>{folder.createdAt}</span>
                                                   </div>
                                               </div>
                                           </motion.div>
                                       ))
                                   )}
                               </div>
                           )}
                      </div>
                   )}

                   {/* VIEW 2: FILES VIEW */}
                   {currentView === "files" && (
                       <div className="h-full flex flex-col lg:flex-row gap-6">
                           
                           {/* LEFT SIDE: UPLOAD AREA */}
                           {selectedFolder && (
                               <div className="w-full lg:w-1/2 flex flex-col h-full min-h-[400px]">
                                   <input type="file" ref={fileInputRef} onChange={(e) => { if(e.target.files) handleUploadFiles(e.target.files); }} multiple className="hidden" />
                                   <div 
                                        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} 
                                        onClick={() => !isUploading && fileInputRef.current?.click()}
                                        className={cn(
                                            "flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden",
                                            isDragging ? "border-orange-500 bg-orange-50" : "border-slate-300 bg-slate-50/50 hover:border-orange-400 hover:bg-white",
                                            isUploading && "pointer-events-none opacity-80"
                                        )}
                                   >
                                       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply pointer-events-none" />
                                       
                                       <div className="relative z-10 p-8 space-y-6">
                                           <div className="mx-auto h-24 w-24 rounded-full bg-white shadow-xl shadow-slate-200 flex items-center justify-center">
                                                {isUploading ? <Loader2 className="h-10 w-10 text-orange-500 animate-spin" /> : <UploadCloud className="h-10 w-10 text-orange-500" />}
                                           </div>
                                           <div>
                                               <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                                   {isUploading ? uploadStatus : "Upload Documents"}
                                               </h3>
                                               <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
                                                   {isUploading ? "Please wait while we process your files..." : "Drag & drop files here, or click to browse your computer."}
                                               </p>
                                           </div>
                                           {!isUploading && (
                                               <div className="flex gap-2 justify-center pt-4">
                                                   <Badge variant="secondary" className="bg-slate-200 text-slate-600">PDF</Badge>
                                                   <Badge variant="secondary" className="bg-slate-200 text-slate-600">JPG</Badge>
                                                   <Badge variant="secondary" className="bg-slate-200 text-slate-600">PNG</Badge>
                                               </div>
                                           )}
                                       </div>
                                   </div>
                               </div>
                           )}

                           {/* RIGHT SIDE: FILE LIST */}
                           <div className={cn("flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden", selectedFolder ? "w-full lg:w-1/2" : "w-full")}>
                               {/* File Search Bar */}
                               <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-2">
                                   <div className="relative flex-1">
                                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                       <Input 
                                           value={fileSearchTerm} 
                                           onChange={(e) => { setFileSearchTerm(e.target.value); setFilePage(1); }}
                                           placeholder="Search files..." 
                                           className="pl-10 bg-white border-slate-200"
                                       />
                                   </div>
                               </div>

                               {/* File List Table */}
                               <div className="flex-1 overflow-y-auto">
                                   {isLoadingFiles ? (
                                       <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 text-slate-400 animate-spin" /></div>
                                   ) : currentFilesList.length === 0 ? (
                                       <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                           <FileIcon className="h-12 w-12 mb-2 opacity-20" />
                                           <p>No files found.</p>
                                       </div>
                                   ) : (
                                       <table className="w-full text-left border-collapse">
                                           <thead className="bg-slate-50 sticky top-0 z-10">
                                               <tr>
                                                   <th className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">File Name</th>
                                                   <th className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Type</th>
                                                   <th className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                               </tr>
                                           </thead>
                                           <tbody className="divide-y divide-slate-100">
                                               {currentPaginatedFiles.map((file) => (
                                                   <tr key={file.id} className="hover:bg-slate-50/80 transition-colors group">
                                                       <td className="px-2 py-1">
                                                           <div className="flex items-center gap-3">
                                                               {getFileIconByExtension(file.extension)}
                                                               <div className="min-w-0">
                                                                   <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{file.name}</p>
                                                                   <p className="text-[10px] text-slate-400 font-mono">{formatBytes(file.size)}</p>
                                                               </div>
                                                           </div>
                                                       </td>
                                                       <td className="px-2 py-1 text-center">
                                                           <div className="flex justify-center">{getFileIconByExtension(file.extension, "h-5 w-5")}</div>
                                                       </td>
                                                       <td className="px-2 py-1 text-right">
                                                           <div className="flex items-center justify-end gap-1">
                                                               <Button onClick={() => handleViewFile(file)} size="sm" variant="ghost" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                                   <Eye className="h-4 w-4 mr-1" /> View
                                                               </Button>
                                                               <a href={`http://localhost:8080${file.publicPath}`} download target="_blank" rel="noopener noreferrer">
                                                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50">
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                               </a>
                                                           </div>
                                                       </td>
                                                   </tr>
                                               ))}
                                           </tbody>
                                       </table>
                                   )}
                               </div>

                               {/* Pagination */}
                               <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                                   <p className="text-xs text-slate-500">
                                       Showing {indexOfFirstFile + 1}-{Math.min(indexOfLastFile, currentFilesList.length)} of {currentFilesList.length}
                                   </p>
                                   <div className="flex gap-2">
                                       <Button size="icon" variant="outline" className="h-8 w-8" onClick={handlePrevPage} disabled={filePage === 1}>
                                           <ChevronLeft className="h-4 w-4" />
                                       </Button>
                                       <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleNextPage} disabled={filePage === totalPages}>
                                           <ChevronRight className="h-4 w-4" />
                                       </Button>
                                   </div>
                               </div>
                           </div>
                       </div>
                   )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div animate={{ filter: isOverlayOpen ? "blur(4px)" : "blur(0px)", scale: isOverlayOpen ? 0.98 : 1 }} transition={{ duration: 0.5 }} className="flex-1 flex flex-col relative z-10">
        <Header isAuthenticated={true} />
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-24 right-8 z-50">
           <Button onClick={() => setIsOverlayOpen(true)} className="h-12 px-6 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-500 hover:scale-105 transition-all shadow-lg shadow-orange-500/30 border border-orange-400/50">
              <LayoutGrid className="h-4 w-4 mr-2" /> OPEN WORKSPACE
           </Button>
        </motion.div>

        <main className="flex-1 container mx-auto pt-24 pb-12 px-4 sm:px-8 space-y-10">
          <div className="flex flex-col gap-1">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 animate-gradient-x">{displayName}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-600 text-lg">Your production metrics are looking <span className="text-orange-600 font-semibold">exceptional</span> today.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {/* STAT 1: Processed */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                 <SpotlightCard className="group bg-white">
                      <CardContent className="p-6 relative z-10">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl border bg-orange-50 text-orange-600 border-slate-100"><FileText className="h-6 w-6" /></div>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 font-mono text-xs">+12%</Badge>
                         </div>
                         <div><h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tighter">{stats.processed}</h3><p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Documents Processed</p></div>
                      </CardContent>
                   </SpotlightCard>
             </motion.div>
             
             {/* STAT 2: Storage */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                 <SpotlightCard className="group bg-white">
                      <CardContent className="p-6 relative z-10">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl border bg-amber-50 text-amber-600 border-slate-100"><HardDrive className="h-6 w-6" /></div>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 font-mono text-xs">Used</Badge>
                         </div>
                         <div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tighter">
                                {stats.storage.toFixed(1)} <span className="text-lg text-slate-400">{stats.storageUnit}</span>
                            </h3>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Active Storage</p>
                        </div>
                      </CardContent>
                   </SpotlightCard>
             </motion.div>
             
             {/* STAT 3: Hours Saved */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                 <SpotlightCard className="group bg-white">
                      <CardContent className="p-6 relative z-10">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl border bg-red-50 text-red-600 border-slate-100"><Clock className="h-6 w-6" /></div>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 font-mono text-xs">+5%</Badge>
                         </div>
                         <div>
                           <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tighter">{stats.hoursSaved}</h3>
                           <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Hours Saved</p>
                         </div>
                      </CardContent>
                   </SpotlightCard>
             </motion.div>
             
             {/* STAT 4: Distribution */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                 <SpotlightCard className="group bg-white h-full">
                      <CardContent className="p-6 relative z-10 h-full flex flex-col justify-between">
                         <div className="flex justify-between items-start mb-2">
                            <div className="p-3 rounded-xl border bg-slate-100 text-slate-700 border-slate-200"><PieIcon className="h-6 w-6" /></div>
                         </div>
                         <div>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-2">File Breakdown</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(stats.extensionCounts).length > 0 ? (
                                    Object.entries(stats.extensionCounts).slice(0, 4).map(([ext, count], i) => (
                                        <Badge key={ext} variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
                                            {ext}: <span className="font-bold ml-1">{count}</span>
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400">No data</span>
                                )}
                            </div>
                         </div>
                      </CardContent>
                   </SpotlightCard>
             </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
             
             {/* CHART AREA: UPDATED TO MODERN BAR CHART */}
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-8 h-[400px] lg:h-full">
                <SpotlightCard className="h-full bg-white">
                   <CardHeader className="border-b border-slate-100 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-orange-500" /> Weekly Activity
                        </CardTitle>
                        <div className="flex gap-2">
                            {chartKeys.map((key) => {
                                const style = getFileStyle(key);
                                return (
                                    <div key={key} className="flex items-center gap-1 text-xs text-slate-500">
                                        <div className={`w-2 h-2 rounded-full ${style.bg.replace('bg-', 'bg-').replace('50', '500')}`} />
                                        <span className="uppercase">{key}</span>
                                    </div>
                                )
                            })}
                        </div>
                      </div>
                   </CardHeader>
                   <CardContent className="pt-8 h-[calc(100%-70px)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barSize={40}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                           <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                           <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                           {chartKeys.map((key, index) => {
                               const style = getFileStyle(key);
                               // Using first key for main bar, others stacked or grouped
                               return (
                                   <Bar 
                                      key={key}
                                      dataKey={key} 
                                      stackId="a"
                                      fill={style.fill} 
                                      radius={[4, 4, 0, 0]}
                                   />
                               );
                           })}
                        </BarChart>
                      </ResponsiveContainer>
                   </CardContent>
                </SpotlightCard>
             </motion.div>

             <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                {/* RIGHT COLUMN: REPLACED LATEST UPLOAD WITH QUICK ACTIONS & STORAGE */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 h-full">
                   <SpotlightCard className="h-full flex flex-col bg-slate-50/50">
                      <CardHeader className="pb-2 border-b border-slate-100 bg-white">
                          <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-orange-500" /> Insights & Actions
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                         
                         {/* ELEMENT 1: QUICK ACTIONS (REPLACED LATEST UPLOAD) */}
                         <div className="grid grid-cols-2 gap-3">
                             <button onClick={() => setIsOverlayOpen(true)} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-orange-400 hover:shadow-md transition-all group">
                                 <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                                     <UploadCloud className="h-5 w-5" />
                                 </div>
                                 <span className="text-xs font-bold text-slate-700">Upload File</span>
                             </button>
                             <button onClick={() => { setIsOverlayOpen(true); setCurrentView("folders"); }} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group">
                                 <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                                     <FolderPlus className="h-5 w-5" />
                                 </div>
                                 <span className="text-xs font-bold text-slate-700">New Folder</span>
                             </button>
                         </div>

                         {/* ELEMENT 2: STORAGE HEALTH */}
                         <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-700 uppercase">Storage Health</span>
                                <span className="text-[10px] text-slate-400">75% Healthy</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <p className="text-[10px] text-slate-500">You have plenty of space left for new documents.</p>
                         </div>

                         {/* ELEMENT 3: COMPOSITION BAR */}
                         <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                             <div className="flex justify-between items-center mb-3">
                                 <p className="text-xs font-bold text-slate-700 uppercase">File Composition</p>
                                 <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">Top 3</span>
                             </div>
                             <div className="space-y-3">
                                 {Object.entries(stats.extensionCounts).sort(([,a], [,b]) => b - a).slice(0,3).map(([ext, count], i) => {
                                     const percentage = Math.round((count / (stats.processed || 1)) * 100);
                                     const style = getFileStyle(ext);
                                     return (
                                         <div key={ext} className="space-y-1">
                                             <div className="flex justify-between text-xs">
                                                 <span className="font-medium text-slate-600 flex items-center gap-1">
                                                     <div className={`w-2 h-2 rounded-full ${style.bg.replace('bg-', 'bg-').replace('50', '500')}`} /> {ext}
                                                 </span>
                                                 <span className="text-slate-400">{percentage}%</span>
                                             </div>
                                             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                 <motion.div 
                                                    initial={{ width: 0 }} 
                                                    animate={{ width: `${percentage}%` }} 
                                                    className={`h-full ${style.bg.replace('bg-', 'bg-').replace('50', '500')}`} 
                                                 />
                                             </div>
                                         </div>
                                     );
                                 })}
                             </div>
                         </div>

                         {/* ELEMENT 4: SYSTEM STATUS */}
                         <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                             <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                                 <ShieldCheck className="h-4 w-4" />
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-slate-800">System Secure</p>
                                 <p className="text-[10px] text-slate-500">Encrypted Connection</p>
                             </div>
                         </div>

                      </CardContent>
                   </SpotlightCard>
                </motion.div>
             </div>
          </div>
        </main>
        <Footer />
      </motion.div>
    </div>
  );
}