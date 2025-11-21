import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Upload, Download, ArrowLeft, X, FileText, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

// Define state for permissions
type Permissions = {
  printing: boolean;
  copying: boolean;
  modifying: boolean;
  commenting: boolean;
  accessibility: boolean;
};

export default function LockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showUserPass, setShowUserPass] = useState(false);
  const [showOwnerPass, setShowOwnerPass] = useState(false);
  const [encryption, setEncryption] = useState("AES-256");
  const [outputFilename, setOutputFilename] = useState("");
  const [permissions, setPermissions] = useState<Permissions>({
    printing: false,
    copying: false,
    modifying: false,
    commenting: false,
    accessibility: true,
  });

  const { toast } = useToast();

  // Auth placeholders
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const name = selectedFile.name.endsWith('.pdf') 
        ? selectedFile.name.replace(/\.pdf$/, '') 
        : selectedFile.name;
      setOutputFilename(`locked_${name}.pdf`);
      
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} ready to protect`,
      });
    }
  };
  
  const removeFile = () => {
    setFile(null);
    setUserPassword("");
    setOwnerPassword("");
    setOutputFilename("");
  }

  const handlePermissionChange = (perm: keyof Permissions) => {
    setPermissions(prev => ({ ...prev, [perm]: !prev[perm] }));
  };

  const handleLockPDF = () => {
    if (!file) {
      toast({ title: "Error", description: "Please select a PDF file first", variant: "destructive" });
      return;
    }
    if (!ownerPassword) {
      toast({ title: "Error", description: "An Owner Password is required to set permissions", variant: "destructive" });
      return;
    }

    toast({
      title: "Protecting PDF",
      description: "Your file is being encrypted and locked...",
    });
    
    console.log({
      file: file.name,
      userPassword,
      ownerPassword,
      permissions,
      encryption,
      outputFilename,
    });
  };
  
  const PasswordInput = ({ id, label, value, onChange, show, onToggle }: any) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-200">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="pr-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500/50"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-7 w-7 text-slate-400 hover:text-orange-400 hover:bg-transparent"
          onClick={onToggle}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

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
      
        <main className="flex-1 py-16">
          <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
          
            <Link
              to="/tools"
              className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">Back to Tools</span>
            </Link>

            {/* === CONDITIONAL UI: SHOW UPLOAD OR EDITOR === */}
            {!file ? (
              /* === UPLOAD UI === */
              <div className="space-y-12">
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                    <Lock className="h-8 w-8 text-orange-400" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">
                      Protect PDF File
                    </span>
                  </h1>
                  <p className="text-lg text-slate-400 max-w-xl mx-auto">
                    Encrypt and add passwords or permissions to your PDF
                  </p>
                </div>

                <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-white">Upload PDF File</CardTitle>
                    <CardDescription className="text-slate-400">
                      Select a single PDF file to protect
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
              /* === EDITOR UI (FILE UPLOADED) === */
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* === Main Content (Left) === */}
                <div className="flex-1 space-y-4">
                  <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                          <FileText className="h-5 w-5 text-orange-400" />
                        </div>
                        <span className="font-medium text-slate-200">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeFile} className="text-slate-400 hover:text-red-400 hover:bg-red-400/10">
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Placeholder for PDF preview */}
                  <div className="w-full h-[600px] bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                    <p className="text-slate-500">PDF Preview Area</p>
                  </div>
                </div>

                {/* === Sidebar (Right) === */}
                <Card className="w-full lg:w-96 bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 h-fit">
                  <CardHeader>
                    <CardTitle className="text-white">Protection Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* === Password Settings === */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-orange-400">Password Settings</h3>
                      <PasswordInput
                        id="user-password"
                        label="User Password (open)"
                        value={userPassword}
                        onChange={(e: any) => setUserPassword(e.target.value)}
                        show={showUserPass}
                        onToggle={() => setShowUserPass(!showUserPass)}
                      />
                      <PasswordInput
                        id="owner-password"
                        label="Owner Password (permissions)"
                        value={ownerPassword}
                        onChange={(e: any) => setOwnerPassword(e.target.value)}
                        show={showOwnerPass}
                        onToggle={() => setShowOwnerPass(!showOwnerPass)}
                      />
                      <p className="text-xs text-slate-500">
                        An Owner Password is required to set permissions.
                      </p>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* === Permissions === */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-orange-400">Permissions</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {(Object.keys(permissions) as Array<keyof Permissions>).map((perm) => (
                          <div key={perm} className="flex items-center space-x-3">
                            <Checkbox
                              id={perm}
                              checked={permissions[perm]}
                              onCheckedChange={() => handlePermissionChange(perm)}
                              disabled={!ownerPassword}
                              className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                            <Label htmlFor={perm} className="capitalize text-sm font-normal text-slate-300 cursor-pointer">
                              Allow {perm}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* === Encryption & Output === */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="encryption-type" className="text-slate-200">Encryption Type</Label>
                        <Select value={encryption} onValueChange={setEncryption}>
                          <SelectTrigger id="encryption-type" className="bg-slate-900/50 border-slate-700 text-white">
                            <SelectValue placeholder="Select encryption" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="AES-128">AES-128</SelectItem>
                            <SelectItem value="AES-256">AES-256 (Recommended)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="output-filename" className="text-slate-200">Output Filename</Label>
                        <Input
                          id="output-filename"
                          value={outputFilename}
                          onChange={(e) => setOutputFilename(e.target.value)}
                          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                    
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 pt-2">
                    <Button 
                      onClick={handleLockPDF} 
                      disabled={!file || !ownerPassword}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6 rounded-xl font-semibold transition-colors"
                    >
                      <Lock className="mr-2 h-5 w-5" />
                      Lock PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                      disabled={true}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Locked PDF
                    </Button>
                  </CardFooter>
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