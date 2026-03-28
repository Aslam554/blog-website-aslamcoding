import { Mail, Linkedin, Github, Twitter, Heart } from "lucide-react";
import Link from "next/link";

export function BlogFooter() {
  return (
    <footer className="mt-20 border-t border-border/20 bg-background pt-10 pb-10">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5 items-start">
          {/* Branding Section */}
          <div className="md:col-span-2 lg:col-span-2 space-y-8">
            <Link href="/" className="inline-block group">
              <span className="text-4xl font-outfit font-black tracking-tight">
                <span className="gradient-text tracking-tighter">&lt; Aslam</span>
                <span className="text-foreground transition-all group-hover:text-primary"> Coding /&gt;</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-sm opacity-80">
              Empowering the next generation of developers through high-quality masterclasses, in-depth technical blogs, and a thriving community.
            </p>
            
            <div className="flex gap-5">
              {[
                { icon: Twitter, href: "https://twitter.com/aslamcoding", color: "hover:text-sky-400" },
                { icon: Github, href: "https://github.com/aslamcoding", color: "hover:text-white" },
                { icon: Linkedin, href: "https://linkedin.com/in/aslamcoding", color: "hover:text-blue-500" },
                { icon: Mail, href: "mailto:contact@aslamcoding.com", color: "hover:text-primary" },
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center rounded-2xl h-14 w-14 glass border border-border/50 transition-all ${social.color} hover:bg-muted/50 hover:translate-y-[-6px] shadow-2xl hover:shadow-primary/20 backdrop-blur-xl group`}
                >
                  <social.icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="text-xl font-outfit font-black text-foreground uppercase tracking-widest text-sm opacity-60">Platform</h3>
            <ul className="space-y-5">
              {[
                { name: "Masterclasses", href: "/tutorials" },
                { name: "Technical Blogs", href: "/articles" },
                { name: "Roadmaps", href: "/tutorials/roadmaps" },
                { name: "DSA Sheets", href: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all group font-bold">
                    <span className="h-1.5 w-1.5 bg-primary/20 group-hover:bg-primary transition-all duration-300 rounded-full" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-8">
            <h3 className="text-xl font-outfit font-black text-foreground uppercase tracking-widest text-sm opacity-60">Resources</h3>
            <ul className="space-y-5">
              {[
                { name: "Admin Dashboard", href: "/dashboard" },
                { name: "Source Code", href: "#" },
                { name: "YouTube Channel", href: "#" },
                { name: "Community", href: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all group font-bold">
                    <span className="h-1.5 w-1.5 bg-primary/20 group-hover:bg-primary transition-all duration-300 rounded-full" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Support */}
          <div className="space-y-8">
            <h3 className="text-xl font-outfit font-black text-foreground uppercase tracking-widest text-sm opacity-60">Company</h3>
            <ul className="space-y-5">
              {["Privacy Policy", "Terms of Use", "Cooke Policy", "Contact Us"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all group font-bold">
                     <span className="h-1.5 w-1.5 bg-primary/20 group-hover:bg-primary transition-all duration-300 rounded-full" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="mt-24 pt-12 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-muted-foreground font-bold flex items-center gap-2 text-sm">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> by 
            <span className="text-foreground tracking-tight">&lt;AslamCoding /&gt;</span>
          </p>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
             © {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}