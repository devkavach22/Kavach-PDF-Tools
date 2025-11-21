import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileImage, ArrowRightLeft, ArrowLeft, Image, Check, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function PDFToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [conversionMode, setConversionMode] = useState<"page" | "extract">("page");
  const [imageQuality, setImageQuality] = useState<"normal" | "high">("normal");
  const { toast } = useToast();
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({ title: "File uploaded", description: `${e.target.files[0].name} ready to convert` });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    toast({ title: "File removed", description: "Please select a new file." });
  };

  const handleConvert = () => {
    if (!file) {
      toast({ title: "Error", description: "Please select a PDF file first", variant: "destructive" });
      return;
    }
    toast({ title: `Converting to JPG`, description: `Mode: ${conversionMode}, Quality: ${imageQuality}.` });
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
        
        <main className="flex-1 container py-16">
          <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
            
             <Link
              to="/tools"
              className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">Back to Tools</span>
            </Link>

            {!file ? (
              // === UPLOAD STATE ===
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                    <ArrowRightLeft className="h-8 w-8 text-orange-400" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">PDF to Image</span>
                  </h1>
                  <p className="text-lg text-slate-400 max-w-xl mx-auto">
                    Convert each PDF page into a high-quality image file
                  </p>
                </div>

                <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-white">Upload PDF File</CardTitle>
                    <CardDescription className="text-slate-400">
                      Select a PDF to get started
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
                  </CardContent>
                </Card>
              </div>
            ) : (
              // === OPTIONS STATE ===
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Left Column: File Preview --- */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-400"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-white">
                        <FileText className="h-5 w-5 text-orange-400" />
                        {file.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full aspect-square bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700">
                        <p className="text-slate-500">[PDF Preview Placeholder]</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* --- Right Column: Options --- */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Conversion Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <RadioGroup value={conversionMode} onValueChange={(val) => setConversionMode(val as "page" | "extract")}>
                        
                        {/* Option 1 */}
                        <Label htmlFor="page-to-jpg" className={cn(
                          "flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors bg-slate-900/50",
                          conversionMode === "page" ? "border-orange-500 bg-orange-900/10" : "border-slate-700 hover:border-slate-600"
                        )}>
                          <RadioGroupItem value="page" id="page-to-jpg" className="mt-1 border-slate-500 text-orange-500" />
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-white">PAGE TO JPG</span>
                              {conversionMode === "page" && <Check className="h-5 w-5 text-orange-500" />}
                            </div>
                            <p className="text-sm text-slate-400">
                              Convert every page to a JPG.
                            </p>
                          </div>
                        </Label>

                        {/* Option 2 */}
                        <Label htmlFor="extract-images" className={cn(
                          "flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors bg-slate-900/50",
                          conversionMode === "extract" ? "border-orange-500 bg-orange-900/10" : "border-slate-700 hover:border-slate-600"
                        )}>
                          <RadioGroupItem value="extract" id="extract-images" className="mt-1 border-slate-500 text-orange-500" />
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-white">EXTRACT IMAGES</span>
                              {conversionMode === "extract" && <Check className="h-5 w-5 text-orange-500" />}
                            </div>
                            <p className="text-sm text-slate-400">
                              Extract images inside the PDF.
                            </p>
                          </div>
                        </Label>

                      </RadioGroup>

                      {/* Image Quality */}
                      <div className="space-y-3">
                        <Label className="font-semibold text-white">Image quality</Label>
                        <RadioGroup 
                          value={imageQuality} 
                          onValueChange={(val) => setImageQuality(val as "normal" | "high")}
                          className="grid grid-cols-2 gap-2"
                        >
                          <div>
                            <RadioGroupItem value="normal" id="normal" className="peer sr-only" />
                            <Label
                              htmlFor="normal"
                              className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-700 bg-slate-900/50 p-4 hover:bg-slate-800 hover:text-white peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-400 cursor-pointer transition-all"
                            >
                              Normal
                              <span className="text-xs text-slate-400">Recommended</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="high" id="high" className="peer sr-only" />
                            <Label
                              htmlFor="high"
                              className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-700 bg-slate-900/50 p-4 hover:bg-slate-800 hover:text-white peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-400 cursor-pointer transition-all"
                            >
                              High
                              <span className="text-xs text-slate-400">Best Quality</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button 
                        onClick={handleConvert} 
                        disabled={!file}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6 rounded-xl font-semibold transition-colors"
                      >
                        <FileImage className="mr-2 h-5 w-5" />
                        Convert to JPG
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