import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Upload, Download, ArrowLeft, X, FileText, Image, Type, Bold, Italic, Underline } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export default function WatermarkPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("text");
  const [position, setPosition] = useState<Position>('middle-center');
  const [isMosaic, setIsMosaic] = useState(false);
  const [transparency, setTransparency] = useState("1");
  const [rotation, setRotation] = useState("0");
  const [pageFrom, setPageFrom] = useState(1);
  const [pageTo, setPageTo] = useState(10);
  const [layer, setLayer] = useState("over");
  const { toast } = useToast();
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({ title: "File uploaded", description: `${e.target.files[0].name} ready` });
    }
  };

  const handleWatermark = () => {
    if (!file) { toast({ title: "Error", variant: "destructive" }); return; }
    toast({ title: "Watermarking PDF", description: "Processing..." });
  };

  const PositionGrid = () => (
    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/50 rounded-lg border border-slate-700 w-fit">
      {(['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'] as Position[]).map((pos) => (
        <Button key={pos} variant="ghost" size="icon" className={`h-9 w-9 rounded-md hover:bg-slate-700 ${position === pos ? 'bg-orange-600 hover:bg-orange-700' : ''}`} onClick={() => setPosition(pos)}>
          <div className={`h-3 w-3 rounded-full ${position === pos ? 'bg-white' : 'bg-slate-500'}`} />
        </Button>
      ))}
    </div>
  );

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-50 overflow-x-hidden">
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" />
        <motion.div animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={() => console.log("Logout")} />
        <main className="flex-1 py-16">
          <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            <Link to="/tools" className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-4 w-4 text-slate-400" /><span className="text-slate-300">Back</span>
            </Link>

            {!file ? (
               <div className="space-y-8">
                 <div className="text-center space-y-3">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float"><Download className="h-8 w-8 text-orange-400" /></div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500">Watermark PDF</h1>
                    <p className="text-lg text-slate-400">Add a text or image watermark to your PDF file</p>
                 </div>
                 <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 max-w-4xl mx-auto">
                    <CardHeader><CardTitle className="text-white">Upload PDF File</CardTitle><CardDescription className="text-slate-400">Select a single PDF file</CardDescription></CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-700 hover:border-orange-500/50 transition-colors bg-slate-900/50">
                        <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                        <label htmlFor="file-upload" className="cursor-pointer"><span className="text-orange-400 font-semibold">Choose file</span> <span className="text-slate-400">or drag and drop</span><input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} /></label>
                      </div>
                    </CardContent>
                 </Card>
               </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10">
                    <CardContent className="p-4 flex justify-between items-center"><div className="flex items-center gap-2"><FileText className="h-5 w-5 text-orange-400" /><span className="font-medium text-white">{file.name}</span></div><Button variant="ghost" size="icon" onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400"><X className="h-4 w-4" /></Button></CardContent>
                  </Card>
                  <div className="w-full h-[600px] bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center"><p className="text-slate-500">PDF Page Previews</p></div>
                </div>

                <Card className="w-full lg:w-96 bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 h-fit">
                  <CardHeader><CardTitle className="text-white">Watermark options</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-slate-800 text-slate-400">
                        <TabsTrigger value="text" className="data-[state=active]:bg-slate-950 data-[state=active]:text-white"><Type className="h-4 w-4 mr-2" />Text</TabsTrigger>
                        <TabsTrigger value="image" className="data-[state=active]:bg-slate-950 data-[state=active]:text-white"><Image className="h-4 w-4 mr-2" />Image</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="text" className="space-y-4 pt-4">
                        <div className="space-y-2"><Label className="text-slate-300">Text</Label><Input placeholder="iLovePDF" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="bg-slate-950 border-slate-700 text-white" /></div>
                        <div className="space-y-2"><Label className="text-slate-300">Format</Label><ToggleGroup type="multiple" className="justify-start"><ToggleGroupItem value="bold" className="text-slate-300 data-[state=on]:bg-slate-700"><Bold className="h-4 w-4" /></ToggleGroupItem><ToggleGroupItem value="italic" className="text-slate-300 data-[state=on]:bg-slate-700"><Italic className="h-4 w-4" /></ToggleGroupItem><ToggleGroupItem value="underline" className="text-slate-300 data-[state=on]:bg-slate-700"><Underline className="h-4 w-4" /></ToggleGroupItem></ToggleGroup></div>
                        <div className="space-y-2"><Label className="text-slate-300">Position</Label><PositionGrid /><div className="flex items-center space-x-2 pt-2"><Checkbox id="mosaic-text" checked={isMosaic} onCheckedChange={(c) => setIsMosaic(c === true)} className="border-slate-500 data-[state=checked]:bg-orange-500" /><Label htmlFor="mosaic-text" className="text-slate-300">Mosaic</Label></div></div>
                      </TabsContent>
                      
                      <TabsContent value="image" className="space-y-4 pt-4">
                        <Button asChild variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"><label className="cursor-pointer"><Image className="h-4 w-4 mr-2" /> Upload Image <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setWatermarkImage(e.target.files[0])} /></label></Button>
                        {watermarkImage && <p className="text-xs text-slate-400">Selected: {watermarkImage.name}</p>}
                        <div className="space-y-2"><Label className="text-slate-300">Position</Label><PositionGrid /><div className="flex items-center space-x-2 pt-2"><Checkbox id="mosaic-img" checked={isMosaic} onCheckedChange={(c) => setIsMosaic(c === true)} className="border-slate-500 data-[state=checked]:bg-orange-500" /><Label htmlFor="mosaic-img" className="text-slate-300">Mosaic</Label></div></div>
                        <div className="space-y-2"><Label className="text-slate-300">Transparency</Label><Select value={transparency} onValueChange={setTransparency}><SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800 text-white"><SelectItem value="1">No transparency</SelectItem><SelectItem value="0.5">50%</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label className="text-slate-300">Rotation</Label><Select value={rotation} onValueChange={setRotation}><SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800 text-white"><SelectItem value="0">Do not rotate</SelectItem><SelectItem value="45">45°</SelectItem></SelectContent></Select></div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter><Button onClick={handleWatermark} disabled={!file} className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6 rounded-xl font-semibold"><Download className="mr-2 h-5 w-5" /> Add watermark</Button></CardFooter>
                </Card>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}