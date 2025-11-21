import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Lock, Bell, Shield, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-50 font-sans selection:bg-orange-500/30 selection:text-orange-100">
      <Header isAuthenticated onLogout={() => console.log("Logout")} />
      
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
        <div className="absolute -top-[20%] left-[20%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="flex-1 container mx-auto py-32 px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Profile Settings</h1>
            <p className="text-slate-400 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Profile Information */}
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><User className="w-5 h-5 text-orange-400" /> Profile Information</CardTitle>
              <CardDescription className="text-slate-400">Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-orange-500/20 shadow-lg shadow-orange-900/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white">JD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-orange-400">Change Avatar</Button>
                  <p className="text-sm text-slate-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              <div className="grid gap-6 max-w-xl">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" className="bg-black/20 border-white/10 text-white focus:border-orange-500 h-11" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" className="bg-black/20 border-white/10 text-white focus:border-orange-500 h-11" />
                </div>
                <Button className="w-fit bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg shadow-orange-900/20">
                   <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Lock className="w-5 h-5 text-red-400" /> Security</CardTitle>
              <CardDescription className="text-slate-400">Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-xl">
              <div className="grid gap-2">
                <Label htmlFor="current-password" className="text-slate-300">Current Password</Label>
                <Input id="current-password" type="password" className="bg-black/20 border-white/10 text-white focus:border-red-500 h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password" className="text-slate-300">New Password</Label>
                <Input id="new-password" type="password" className="bg-black/20 border-white/10 text-white focus:border-red-500 h-11" />
              </div>
              <Button className="w-fit bg-white/5 hover:bg-red-500/10 text-red-400 border border-red-500/30">Update Password</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Bell className="w-5 h-5 text-amber-400" /> Notifications</CardTitle>
              <CardDescription className="text-slate-400">Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: "Email Notifications", desc: "Receive email updates about your documents" },
                { title: "Processing Alerts", desc: "Get notified when document processing is complete" },
                { title: "Marketing Emails", desc: "Receive updates about new features and tips" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                  <div>
                    <p className="font-medium text-slate-200">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-orange-500" defaultChecked={i < 2} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}