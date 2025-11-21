import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Upload, Download, ArrowLeft, Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

// Interface for the expected backend response
interface CompressedFileResponse {
  filename: string;
  originalSize?: string; // Optional, depending on what your API returns
  compressedSize?: string; // Optional
  downloadUrl?: string;
}

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<CompressedFileResponse | null>(null);
  
  const { toast } = useToast();

  // Auth placeholders
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCompressedFile(null); // Reset previous results if new file selected
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} ready to compress`,
      });
    }
  };

  const handleCompress = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    
    try {
      const formData = new FormData();
      formData.append('files', file);
      // Assuming backend accepts 'level' or similar. If not, the backend might just use defaults.
      // We append it just in case the backend logic uses it.
      formData.append('level', compressionLevel); 

      // Get token from localStorage or your auth management system
      const token = localStorage.getItem('token'); 

      const response = await axios.post('http://localhost:5000/api/pdf/compress-pdf', formData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '', // Ensure you handle the Bearer prefix if needed
          'Content-Type': 'multipart/form-data'
        }
      });

      // Assuming response.data contains the filename needed for download
      // Adjust this based on your exact API response structure
      console.log("Compression Response:", response.data);
      
      setCompressedFile(response.data); // Save the response data
      
      toast({
        title: "Success!",
        description: "PDF compressed successfully.",
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Compression Failed",
        description: "There was an error compressing your file.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = async () => {
    if (!compressedFile || !compressedFile.filename) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:5000/api/pdf/download/${compressedFile.filename}`, {
        responseType: 'blob', // Important for file downloads
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      // Create a link to download the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', compressedFile.filename); // Use the filename from the API
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your compressed file is downloading.",
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Download Failed",
        description: "Could not download the file.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setCompressedFile(null);
    // Reset file input value
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
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
            
            {/* Navigation */}
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
                <FileDown className="h-8 w-8 text-orange-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">
                  Compress PDF
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Reduce PDF file size while maintaining quality
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              
              {/* === Left Column (Upload OR Result) === */}
              <div className="lg:col-span-2">
                {!compressedFile ? (
                  // VIEW 1: Upload Card
                  <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 h-full">
                    <CardHeader>
                      <CardTitle className="text-white">Upload PDF File</CardTitle>
                      <CardDescription className="text-slate-400">
                        Select the PDF file you want to compress
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors bg-slate-900/50 ${isCompressing ? 'opacity-50 pointer-events-none border-slate-700' : 'border-slate-700 hover:border-orange-500/50'}`}>
                        <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Choose file</span>
                          {" "}<span className="text-slate-400">or drag and drop</span>
                          <input
                            id="file-upload"
                            type="file"
                            accept=".pdf"
                            disabled={isCompressing}
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                        </label>
                        <p className="text-sm text-slate-500 mt-2">PDF files only</p>
                      </div>

                      {file && (
                        <div className="p-4 rounded-xl border bg-slate-800/60 border-orange-500/20 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                            <p className="text-sm text-slate-400">
                              Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setFile(null)} disabled={isCompressing} className="text-slate-400 hover:text-red-400">
                            Remove
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  // VIEW 2: Success / Result Card
                  <Card className="bg-green-950/10 backdrop-blur-md shadow-xl border border-green-500/20 h-full relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <CardTitle className="text-white">Compression Complete!</CardTitle>
                      </div>
                      <CardDescription className="text-slate-400">
                        Your file has been successfully compressed and is ready for download.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-slate-900/60 rounded-xl p-6 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                          <span className="text-slate-400 text-sm">File Name</span>
                          <span className="text-slate-200 font-mono text-sm truncate max-w-[200px]">
                            {compressedFile.filename}
                          </span>
                        </div>
                        {/* If backend returns size data, display a comparison here */}
                        {compressedFile.originalSize && compressedFile.compressedSize && (
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                                <p className="text-xs text-slate-400 uppercase">Original</p>
                                <p className="text-lg font-bold text-slate-200">{compressedFile.originalSize}</p>
                              </div>
                              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                                <p className="text-xs text-slate-400 uppercase">Compressed</p>
                                <p className="text-lg font-bold text-green-400">{compressedFile.compressedSize}</p>
                              </div>
                           </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                         <Button 
                            onClick={handleDownload}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl font-semibold shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02]"
                         >
                            <Download className="mr-2 h-5 w-5" />
                            Download Compressed PDF
                         </Button>
                         <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 py-6 rounded-xl"
                         >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Compress Another
                         </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* === Right Column (Settings & Action) === */}
              <div className="lg:col-span-1 space-y-6">
                
                <Card className={`bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 transition-opacity duration-300 ${compressedFile ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                  <CardHeader>
                    <CardTitle className="text-white">Compression Level</CardTitle>
                    <CardDescription className="text-slate-400">
                      Choose your desired setting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={compressionLevel} 
                      onValueChange={setCompressionLevel} 
                      className="flex flex-col gap-3"
                      disabled={isCompressing}
                    >
                      {['low', 'medium', 'high'].map((level) => (
                        <Label 
                          key={level}
                          htmlFor={level} 
                          className={`flex flex-col space-y-1 p-4 border rounded-xl cursor-pointer transition-all duration-200 
                            ${compressionLevel === level
                              ? 'border-orange-500 bg-orange-500/10' 
                              : 'border-slate-700 hover:border-orange-500/50 hover:bg-white/5'
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={level} id={level} className="border-slate-400 text-orange-500" />
                            <p className={`font-medium capitalize ${compressionLevel === level ? 'text-orange-400' : 'text-slate-200'}`}>
                              {level} Compression
                            </p>
                          </div>
                          <p className="text-sm text-slate-500 pl-7">
                            {level === 'low' && "Best quality, larger file size"}
                            {level === 'medium' && "Balanced quality and size"}
                            {level === 'high' && "Smaller file size, good quality"}
                          </p>
                        </Label>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {!compressedFile && (
                  <Button
                    onClick={handleCompress}
                    disabled={!file || isCompressing}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 rounded-xl font-semibold disabled:opacity-50 disabled:pointer-events-none transition-all hover:scale-[1.02] shadow-lg shadow-orange-900/20"
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Compressing...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Compress PDF
                      </>
                    )}
                  </Button>
                )}
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}