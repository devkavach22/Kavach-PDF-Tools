import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FilePen, ArrowLeft, Download, FileText, Image, Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function EditPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Auth placeholders (matching CompressPDF)
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsEditing(false);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} ready to edit`,
      });
    }
  };

  const handleEdit = () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a PDF file first",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Opening Editor",
      description: "Loading your PDF into the editor...",
    });
    setIsEditing(true);
  };

  const handleDownload = () => {
    toast({
      title: "Downloading PDF",
      description: "Your edited PDF is being generated...",
    });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-50 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" />
        <motion.div 
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1], rotate: [0, 5, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1], rotate: [0, -5, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute -bottom-[10%] right-[0%] w-[50vw] h-[50vw] bg-red-600/10 rounded-full blur-[100px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={() => console.log("Logout clicked")} />

        <main className="flex-1 flex-col py-16">
          <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            
            {/* === VIEW: EDITOR MODE === */}
            {isEditing && file ? (
              <div className="space-y-6">
                {/* Toolbar Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-6 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">Back to Upload</span>
                  </Button>
                  
                  <h1 className="text-xl md:text-2xl font-bold text-slate-200 truncate max-w-md">
                    Editing: <span className="text-orange-400">{file.name}</span>
                  </h1>

                  <Button
                    onClick={handleDownload}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 px-8 rounded-xl shadow-lg shadow-orange-900/20"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Result
                  </Button>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  {/* Tools Panel */}
                  <div className="col-span-12 md:col-span-3">
                    <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 sticky top-24">
                      <CardHeader>
                        <CardTitle className="text-white">Tools</CardTitle>
                        <CardDescription className="text-slate-400">Select an action</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="ghost" className="w-full justify-start gap-2 text-slate-300 hover:text-orange-400 hover:bg-white/5 border border-transparent hover:border-white/10">
                          <Type className="h-4 w-4" /> Add Text
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-slate-300 hover:text-orange-400 hover:bg-white/5 border border-transparent hover:border-white/10">
                          <Image className="h-4 w-4" /> Add Image
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-slate-300 hover:text-orange-400 hover:bg-white/5 border border-transparent hover:border-white/10">
                          <FilePen className="h-4 w-4" /> Add Signature
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Pages Grid */}
                  <div className="col-span-12 md:col-span-9">
                    <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 min-h-[600px]">
                      <CardHeader>
                        <CardTitle className="text-white">Pages</CardTitle>
                        <CardDescription className="text-slate-400">
                          Click on a page to add edits.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {Array.from({ length: 5 }, (_, i) => i + 1).map((pageNum) => (
                            <div
                              key={pageNum}
                              className="group relative border border-slate-700 bg-slate-800/50 rounded-xl aspect-[3/4] flex flex-col justify-center items-center cursor-pointer hover:border-orange-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                            >
                              <FileText className="h-12 w-12 text-slate-600 group-hover:text-orange-500/80 transition-colors" />
                              <p className="font-medium mt-4 text-slate-400 group-hover:text-slate-200">Page {pageNum}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              
              /* === VIEW: UPLOAD MODE === */
              <>
                <Link
                  to="/tools"
                  className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300">Back to Tools</span>
                </Link>

                {/* Title Section */}
                <div className="text-center space-y-3 mb-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                    <FilePen className="h-8 w-8 text-orange-400" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">
                      Edit PDF
                    </span>
                  </h1>
                  <p className="text-lg text-slate-400 max-w-xl mx-auto">
                    Add text, shapes, annotations, and signatures to your PDF
                  </p>
                </div>

                {/* How it works section */}
                <div className="space-y-8 py-6 mb-8">
                  <div className="relative">
                    <div className="absolute left-0 right-0 top-6 h-0.5 border-t-2 border-dashed border-white/10 -z-10 hidden md:block" />
                    <div className="flex flex-col md:flex-row gap-6 justify-between">
                      {[
                        { step: 1, title: "Upload PDF", desc: "Select file to edit" },
                        { step: 2, title: "Edit Pages", desc: "Add text & images" },
                        { step: 3, title: "Download", desc: "Save your changes" }
                      ].map((item) => (
                        <div key={item.step} className="flex flex-col items-center text-center flex-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border-2 border-orange-500/30 text-orange-400 font-bold text-lg flex-shrink-0 z-10 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                            {item.step}
                          </div>
                          <h4 className="font-semibold mb-1 mt-3 text-white">{item.title}</h4>
                          <p className="text-sm text-slate-400 px-2">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upload Card */}
                <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-white">Upload PDF File</CardTitle>
                    <CardDescription className="text-slate-400">
                      Select a PDF file to open in the editor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-700 hover:border-orange-500/50 transition-colors bg-slate-900/50">
                      <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Choose file</span>
                        {" "}<span className="text-slate-400">or drag and drop</span>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="text-sm text-slate-500 mt-2">PDF files only</p>
                    </div>

                    {file && (
                      <div className="p-4 rounded-xl border bg-slate-800/60 border-orange-500/20">
                        <p className="font-medium text-white">Selected: {file.name}</p>
                        <p className="text-sm text-slate-400">
                          Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}

                    <Button 
                      onClick={handleEdit} 
                      disabled={!file}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-base py-6 rounded-xl font-semibold disabled:opacity-50 disabled:pointer-events-none transition-colors"
                    >
                      <FilePen className="mr-2 h-5 w-5" />
                      Open PDF Editor
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
            
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}