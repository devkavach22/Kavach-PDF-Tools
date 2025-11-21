import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileImage,
  ArrowLeft,
  GripVertical,
  X,
  Download,
  Plus,
  Image as ImageIcon,
  Minimize,
  Maximize,
  RectangleHorizontal,
  RectangleVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// --- State Types ---
type SortableFile = {
  id: string;
  file: File;
  url: string;
};

type PageOrientation = "portrait" | "landscape";
type PageMargin = "no" | "small" | "big";
type PageSize = "a4" | "letter";

// --- New Sortable Image Item Component ---
function SortableImageItem({
  id,
  file,
  url,
  removeFile,
}: {
  id: string;
  file: File;
  url: string;
  removeFile: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group w-full aspect-square border border-slate-700 rounded-xl overflow-hidden shadow-sm bg-slate-800"
    >
      <img
        src={url}
        alt={file.name}
        className="w-full h-full object-cover"
      />
      {/* Overlay for file name */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-white text-xs truncate">
        {file.name}
      </div>
      {/* Drag Handle */}
      <button
        {...listeners}
        {...attributes}
        className="absolute top-1 left-1 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:bg-orange-600"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {/* Remove Button */}
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
        onClick={removeFile}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function ImageToPDF() {
  const [files, setFiles] = useState<SortableFile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [margin, setMargin] = useState<PageMargin>("no");

  const { toast } = useToast();
  const isAuthenticated = true;
  const isAdmin = false;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fileIds = useMemo(() => files.map((f) => f.id), [files]);
  const activeFile = useMemo(() => files.find((f) => f.id === activeId), [files, activeId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: SortableFile[] = Array.from(e.target.files).map(
        (file) => ({
          id: self.crypto.randomUUID(),
          file: file,
          url: URL.createObjectURL(file),
        })
      );
      setFiles((currentFiles) => [...currentFiles, ...newFiles]);
      toast({ title: "Files added", description: `${newFiles.length} image(s) added` });
      e.target.value = "";
    }
  };

  const removeFile = (id: string) => {
    setFiles((currentFiles) => {
      const fileToRemove = currentFiles.find(file => file.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.url);
      return currentFiles.filter((file) => file.id !== id);
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleConvert = () => {
    if (files.length === 0) {
      toast({ title: "Error", description: "Please select images first", variant: "destructive" });
      return;
    }
    toast({ title: "Converting to PDF", description: `Combining ${files.length} image(s)...` });
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
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={() => console.log("Logout")} />
        
        <main className="flex-1 flex-col py-16">
          <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            
             <Link
              to="/tools"
              className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">Back to Tools</span>
            </Link>

            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                <FileImage className="h-8 w-8 text-orange-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">Image to PDF</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Combine JPG, PNG, and other images into a single PDF file
              </p>
            </div>

            {files.length === 0 ? (
              // --- UPLOAD STATE ---
              <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 max-w-4xl mx-auto mt-8">
                <CardHeader>
                  <CardTitle className="text-white">Upload Image Files</CardTitle>
                  <CardDescription className="text-slate-400">
                    Select one or more images to combine into a PDF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-700 hover:border-orange-500/50 transition-colors bg-slate-900/50">
                    <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                       <span className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Choose files</span>
                      {" "}<span className="text-slate-400">or drag and drop</span>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileSelect}
                        multiple
                      />
                    </label>
                    <p className="text-sm text-slate-500 mt-2">.jpg, .png, .webp files only</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // --- EDIT STATE ---
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={(e) => setActiveId(e.active.id as string)}
                    onDragEnd={handleDragEnd}
                    onDragCancel={() => setActiveId(null)}
                  >
                    <SortableContext items={fileIds} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {files.map((fileItem) => (
                          <SortableImageItem
                            key={fileItem.id}
                            id={fileItem.id}
                            file={fileItem.file}
                            url={fileItem.url}
                            removeFile={() => removeFile(fileItem.id)}
                          />
                        ))}
                        <label 
                          htmlFor="file-upload-more"
                          className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-orange-500/50 hover:bg-slate-800/50 transition-colors"
                        >
                          <Plus className="h-10 w-10 text-slate-500 group-hover:text-orange-400" />
                          <span className="text-sm font-medium text-slate-400 mt-2">Add more</span>
                          <input
                            id="file-upload-more"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileSelect}
                            multiple
                          />
                        </label>
                      </div>
                    </SortableContext>
                    <DragOverlay>
                      {activeFile ? (
                        <div className="relative group w-full aspect-square border border-orange-500 rounded-xl overflow-hidden shadow-2xl cursor-grabbing" style={{ transform: 'scale(1.05)' }}>
                           <img src={activeFile.url} alt={activeFile.file.name} className="w-full h-full object-cover" />
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>

                {/* --- Right Sidebar --- */}
                <div className="md:col-span-1">
                  <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-white">Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      <div className="space-y-2">
                        <label className="font-medium text-slate-300">Orientation</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={orientation === "portrait" ? "default" : "outline"}
                            className={cn("w-full", orientation === "portrait" ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800")}
                            onClick={() => setOrientation("portrait")}
                          >
                            <RectangleVertical className="mr-2 h-4 w-4" /> Portrait
                          </Button>
                          <Button
                            variant={orientation === "landscape" ? "default" : "outline"}
                             className={cn("w-full", orientation === "landscape" ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800")}
                            onClick={() => setOrientation("landscape")}
                          >
                            <RectangleHorizontal className="mr-2 h-4 w-4" /> Landscape
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="font-medium text-slate-300">Size</label>
                        <Select value={pageSize} onValueChange={(val: PageSize) => setPageSize(val)}>
                          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="a4">A4 (210x297 mm)</SelectItem>
                            <SelectItem value="letter">Letter (216x279 mm)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium text-slate-300">Margin</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['no', 'small', 'big'].map((m) => (
                            <Button
                            key={m}
                            variant={margin === m ? "default" : "outline"}
                            className={cn("w-full capitalize text-xs px-1", margin === m ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800")}
                            onClick={() => setMargin(m as PageMargin)}
                          >
                             {m}
                          </Button>
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={handleConvert} 
                        disabled={files.length === 0}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6 rounded-xl font-semibold transition-colors mt-4"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Convert PDF
                      </Button>

                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}