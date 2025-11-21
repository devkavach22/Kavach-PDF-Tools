import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileSignature, ArrowLeft, Users, Building, Paintbrush, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// --- Modals ---
function WhoSignsStepModal({ open, onOpenChange, file, onSelectOnlyMe, onSelectSeveralPeople }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-8 bg-slate-900 border border-white/10 text-slate-50">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-2xl font-bold text-white">
            Who will sign this document?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col items-center p-6 border border-slate-700 rounded-xl shadow-sm hover:bg-slate-800/50 transition-colors">
            <User className="w-24 h-24 text-slate-500 mb-4" />
            <Button onClick={onSelectOnlyMe} className="bg-orange-600 hover:bg-orange-700 w-full rounded-lg">
              Only me
            </Button>
            <p className="text-sm text-slate-400 mt-2">Sign this document</p>
          </div>
          <div className="flex-1 flex flex-col items-center p-6 border border-slate-700 rounded-xl shadow-sm hover:bg-slate-800/50 transition-colors">
            <Users className="w-24 h-24 text-slate-500 mb-4" />
            <Button onClick={onSelectSeveralPeople} className="bg-orange-600 hover:bg-orange-700 w-full rounded-lg">
              Several people
            </Button>
            <p className="text-sm text-slate-400 mt-2">Invite others to sign</p>
          </div>
        </div>
        <p className="text-center text-sm text-slate-400 mt-4">
          Uploaded: <span className="font-medium text-orange-400">{file?.name}</span>
        </p>
      </DialogContent>
    </Dialog>
  );
}

function SignatureDetailsModal({ open, onOpenChange, onApply }: any) {
  const [stampFile, setStampFile] = useState<File | null>(null);
  const handleStampFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setStampFile(e.target.files[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 bg-slate-900 border border-white/10 text-slate-50">
        <DialogHeader className="flex-row items-center justify-between border-b border-white/10 p-4">
          <DialogTitle className="text-lg font-semibold text-white">Set your signature details</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
              <User className="h-8 w-8 text-orange-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-slate-300">Full name:</Label>
              <Input id="full-name" placeholder="Your name" className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initials" className="text-slate-300">Initials:</Label>
              <Input id="initials" placeholder="Your initials" className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600" />
            </div>
          </div>

          <Tabs defaultValue="signature">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 text-slate-400">
              <TabsTrigger value="signature" className="data-[state=active]:bg-slate-950 data-[state=active]:text-white"><Paintbrush className="w-4 h-4 mr-2" />Signature</TabsTrigger>
              <TabsTrigger value="initials" className="data-[state=active]:bg-slate-950 data-[state=active]:text-white">Initials</TabsTrigger>
              <TabsTrigger value="company-stamp" className="data-[state=active]:bg-slate-950 data-[state=active]:text-white"><Building className="w-4 h-4 mr-2" />Stamp</TabsTrigger>
            </TabsList>

            <TabsContent value="signature" className="pt-4 space-y-2">
              {['Signature', 'Signature', 'Signature'].map((text, i) => (
                 <Label key={i} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800/50 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/10 transition-all">
                    <span className={`${i===0?'font-serif italic':i===1?'font-mono':'font-sans font-semibold'} text-2xl text-white`}>{text}</span>
                    <RadioGroupItem value={`style-${i+1}`} className="text-orange-500 border-slate-500" />
                 </Label>
              ))}
            </TabsContent>

            <TabsContent value="initials" className="pt-4 space-y-2">
               {['Initials', 'Initials'].map((text, i) => (
                 <Label key={i} className="flex items-center gap-4 p-4 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800/50 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/10 transition-all">
                    <RadioGroupItem value={`init-style-${i+1}`} className="text-orange-500 border-slate-500" />
                    <span className="font-serif text-2xl text-white">{text}</span>
                 </Label>
              ))}
            </TabsContent>

            <TabsContent value="company-stamp" className="pt-4">
              <Label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-orange-500/50 hover:bg-slate-800/50 transition-all">
                  <Button type="button" variant="outline" className="bg-transparent border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white mb-4">Upload Stamp</Button>
                  <p className="text-xs text-slate-500">PNG, JPG, SVG</p>
                  <input type="file" className="hidden" onChange={handleStampFileChange} />
              </Label>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="border-t border-white/10 p-4">
          <Button onClick={onApply} className="bg-orange-600 hover:bg-orange-700 text-white w-full">Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SignaturePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [showWhoSigns, setShowWhoSigns] = useState(false);
  const [showSignatureDetails, setShowSignatureDetails] = useState(false);
  const { toast } = useToast();
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({ title: "File uploaded", description: `${e.target.files[0].name} ready to sign` });
      setShowWhoSigns(true);
    }
  };

  const handleApplySignature = () => {
    toast({ title: "Signature Applied", description: "Your signature has been set." });
    setShowSignatureDetails(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-50 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">
       {/* Background Effects */}
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" />
        <motion.div animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={() => console.log("Logout")} />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
            <Link to="/tools" className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-4 w-4 text-slate-400" /><span className="text-slate-300">Back</span>
            </Link>

            <div className="text-center space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                <FileSignature className="h-10 w-10 text-orange-400" />
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500">Sign PDF</h1>
              <p className="text-xl text-slate-400">Add your electronic signature to a PDF document</p>
            </div>

            <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Upload PDF File</CardTitle>
                <CardDescription className="text-slate-400">Select a PDF file to add your signature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-700 hover:border-orange-500/50 transition-colors bg-slate-900/50">
                  <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-orange-400 font-semibold hover:text-orange-300">Choose file</span> <span className="text-slate-400">or drag and drop</span>
                    <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                  </label>
                  <p className="text-sm text-slate-500 mt-2">PDF files only</p>
                </div>
                {file && <div className="p-4 rounded-xl border bg-slate-800/60 border-orange-500/20"><p className="font-medium text-white">Selected: {file.name}</p></div>}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
      
      <WhoSignsStepModal open={showWhoSigns} onOpenChange={setShowWhoSigns} file={file} onSelectOnlyMe={() => { setShowWhoSigns(false); setShowSignatureDetails(true); }} onSelectSeveralPeople={() => { toast({ title: "Coming Soon" }); setShowWhoSigns(false); }} />
      <SignatureDetailsModal open={showSignatureDetails} onOpenChange={setShowSignatureDetails} onApply={handleApplySignature} />
    </div>
  );
}