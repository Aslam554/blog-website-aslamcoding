"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, Chrome, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

import PremiumBackground from "@/components/shared/premium-background";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background font-outfit">
      <PremiumBackground />

      <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 px-4 py-12">
        {/* Left Side: Brand & Social Proof */}
        <div className="flex-1 max-w-xl text-center lg:text-left space-y-8 hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Link href="/" className="inline-block mb-4">
              <span className="text-4xl font-black tracking-tighter">
                <span className="gradient-text">&lt; Aslam</span>
                <span className="text-foreground transition-colors hover:text-primary"> Coding /&gt;</span>
              </span>
            </Link>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Elevate Your <span className="gradient-text">Writing</span> Experience.
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              Join a community of elite developers sharing high-impact technical insights. 
              Start your journey from zero to hero today.
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4, duration: 0.8 }}
             className="grid grid-cols-2 gap-6 pt-8"
          >
            {[
              { icon: ShieldCheck, title: "Auth Secure", desc: "Enterprise-grade protection" },
              { icon: Zap, title: "AI Powered", desc: "Automated article drafts" },
              { icon: Globe, title: "Global Reach", desc: "Connect with developers" },
              { icon: ArrowRight, title: "Fast Setup", desc: "One-click social login" },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-1 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                   <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[450px]"
        >
          <Card className="glass-card border-none bg-background/40 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[48px] overflow-hidden p-2">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
            
            <CardHeader className="pt-12 pb-8 px-8 text-center">
              <div className="lg:hidden mb-6 flex justify-center">
                <span className="text-3xl font-black tracking-tighter">
                  <span className="gradient-text">&lt; Aslam</span>
                  <span className="text-foreground"> Coding /&gt;</span>
                </span>
              </div>
              <CardTitle className="text-3xl font-black tracking-tight mb-3">Welcome Back</CardTitle>
              <CardDescription className="text-base font-medium">
                Choose your preferred way to continue your journey.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 space-y-4">
              <Button 
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full h-14 rounded-2xl bg-white border border-border/50 text-black hover:bg-gray-50 hover:border-primary/20 transition-all font-bold gap-3 shadow-sm flex items-center justify-center p-0 overflow-hidden group"
              >
                <div className="h-full px-4 border-r border-border/50 flex items-center bg-gray-50/50 group-hover:bg-primary/5 transition-colors">
                  <Chrome className="h-5 w-5" />
                </div>
                <span className="flex-1">Continue with Google</span>
              </Button>

              <Button 
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="w-full h-14 rounded-2xl bg-[#24292e] text-white hover:bg-[#2b3137] transition-all font-bold gap-3 shadow-lg shadow-black/10 flex items-center justify-center p-0 overflow-hidden group"
              >
                 <div className="h-full px-4 border-r border-white/10 flex items-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <Github className="h-5 w-5" />
                </div>
                <span className="flex-1">Continue with GitHub</span>
              </Button>

              <div className="relative py-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-bold">
                  <span className="bg-transparent px-4 text-muted-foreground">Admin Portal Access</span>
                </div>
              </div>

              <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10 text-center">
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                  By continuing, you agree to our <Link href="#" className="underline hover:text-primary transition-colors">Terms of Service</Link> and <Link href="#" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
                </p>
              </div>
            </CardContent>

            <CardFooter className="pb-12 pt-4 px-8 flex justify-center">
                <p className="text-sm font-bold text-muted-foreground">
                    Don't have an account? <Link href="/signup" className="text-primary hover:underline italic">Create One</Link>
                </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
