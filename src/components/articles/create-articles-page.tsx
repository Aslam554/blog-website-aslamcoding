"use client";
import { FormEvent, startTransition, useActionState, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import "react-quill-new/dist/quill.snow.css";
import { createArticles } from "@/actions/create-article";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image as ImageIcon, Video, Send, X, Wand2, Loader2, PenTool, Type, FileText } from "lucide-react";
import { generateAIContent } from "@/actions/generate-ai-content";
import { toast } from "sonner";
import Image from "next/image";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ ...props }: any) => <RQ {...props} />;
  },
  { ssr: false }
);

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ 'color': [] }, { 'background': [] }],
    ["link", "image", "video", "code-block"],
    ["clean"],
  ],
};

export function CreateArticlePage() {
  const [content, setContent] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI Generation State
  const [aiTopic, setAiTopic] = useState("");
  const [aiBrief, setAiBrief] = useState("");
  const [writingStyle, setWritingStyle] = useState("professional");
  const [shouldGenerateImage, setShouldGenerateImage] = useState(true);
  const [aiSuggestedImage, setAiSuggestedImage] = useState<string | null>(null);

  const router = useRouter();

  const [formState, action, isPending] = useActionState(createArticles, {
    errors: {},
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("content", content);

    startTransition(() => {
      action(formData);
    });
  };

  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold my-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold my-6">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black my-8">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n/gim, '<br />');
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim() || !aiBrief.trim()) {
      toast.error("Please provide both a topic and a brief description.");
      return;
    }
    
    setIsGenerating(true);
    const fullPrompt = `Topic: ${aiTopic}\nBrief: ${aiBrief}\nStyle: ${writingStyle}\n\nPlease generate a full, engaging blog article based on the above information. Use Markdown formatting. Ensure it's insightful and high-quality.`;
    
    try {
      const generated = await generateAIContent(fullPrompt, "content");
      if (generated) {
        // Convert the AI Markdown to HTML for the Quill editor
        const htmlContent = markdownToHtml(generated);
        setContent((prev) => prev + (prev ? "<br><br>" : "") + htmlContent);

        // Handle Image Suggestion
        if (shouldGenerateImage) {
          const imageKeyword = await generateAIContent(aiTopic, "image");
          if (imageKeyword) {
             const cleanKeyword = encodeURIComponent(imageKeyword.trim().replace(/\s+/g, ','));
             const betterImageUrl = `https://source.unsplash.com/featured/1280x720?${cleanKeyword},technology,aesthetic`;
             setAiSuggestedImage(betterImageUrl);
             toast.info(`AI discovered a premium "${imageKeyword}" visual.`);
          }
        }
        
        setIsAiModalOpen(false);
        setAiTopic("");
        setAiBrief("");
        toast.success("AI Masterpiece generated successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12 md:py-20 lg:px-4">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4"
      >
        <div className="mb-12 space-y-3 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                    Editor Studio
                </span>
                <h1 className="text-4xl md:text-6xl font-outfit font-black tracking-tight text-foreground leading-tight">
                    Craft Your <span className="gradient-text italic">Masterpiece</span>
                </h1>
                <p className="text-muted-foreground text-lg font-medium max-w-xl">
                    Experience the future of writing with our professional AI-powered editor.
                </p>
            </div>
            
            <Button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="h-14 px-10 rounded-3xl bg-primary/10 text-primary hover:bg-primary hover:text-white border-2 border-primary/20 transition-all duration-300 gap-3 font-black text-lg group shadow-xl shadow-primary/5"
            >
                <Sparkles className="h-6 w-6 group-hover:animate-spin" />
                Write with AI
            </Button>
        </div>

        <Card className="glass-card border-none overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] bg-background/60 backdrop-blur-3xl">
          <CardContent className="p-10 md:p-16">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid gap-10 md:grid-cols-2">
                {/* Title Input */}
                <div className="space-y-4">
                  <Label htmlFor="title" className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Type className="h-4 w-4 text-primary" />
                    Article Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Master Leetcode in 30 Days"
                    className="h-16 rounded-[24px] bg-muted/30 border-border/50 focus:ring-primary/20 text-xl font-bold px-8 shadow-inner"
                  />
                  <AnimatePresence>
                    {formState.errors.title && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="font-bold text-xs text-destructive block pl-2"
                      >
                        {formState.errors.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category Selection */}
                <div className="space-y-4">
                  <Label htmlFor="category" className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    Niche / Category
                  </Label>
                  <div className="relative group">
                    <select
                      id="category"
                      name="category"
                      className="flex h-16 w-full rounded-[24px] border border-border/50 bg-muted/30 px-8 py-2 text-xl font-bold ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer shadow-inner pr-12"
                    >
                      <option value="">Select Category</option>
                      <option value="leetcode">Leetcode Problems</option>
                      <option value="codeforces">Codeforces Problems</option>
                      <option value="cs-fundamentals">CS Fundamentals</option>
                      <option value="system-design">System Design</option>
                      <option value="programming">Programming</option>
                      <option value="technology">Technology</option>
                      <option value="web-development">Web Development</option>
                      <option value="ai">Artificial Intelligence</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                      <Send className="h-5 w-5 rotate-90" />
                    </div>
                  </div>
                  <AnimatePresence>
                    {formState.errors.category && (
                        <motion.span 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="font-bold text-xs text-destructive block pl-2"
                        >
                          {formState.errors.category}
                        </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Featured Image Upload */}
              <div className="space-y-4">
                <Label htmlFor="featuredImage" className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Visual Identity (Cover Photo)
                </Label>
                <div className="relative group">
                    <Input
                        id="featuredImage"
                        name="featuredImage"
                        type="file"
                        accept="image/*"
                        className="h-24 rounded-[28px] bg-muted/30 border-dashed border-2 border-border/50 group-hover:border-primary/50 transition-all cursor-pointer file:hidden text-transparent flex items-center justify-center p-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/60 gap-4 group-hover:text-primary transition-all">
                        <ImageIcon className="h-8 w-8 transition-transform group-hover:scale-110" />
                        <span className="font-bold text-lg">
                          {aiSuggestedImage ? "Change selected image" : "Click to select a high-fidelity banner"}
                        </span>
                    </div>
                </div>

                {/* AI Suggested Image Preview */}
                {aiSuggestedImage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-[32px] overflow-hidden border-4 border-primary/20 bg-muted group aspect-video max-w-2xl mx-auto"
                  >
                    <img 
                      src={aiSuggestedImage} 
                      alt="AI Suggested" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                       <span className="text-white font-bold flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          AI Suggested Cover
                       </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAiSuggestedImage(null)}
                      className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center hover:bg-destructive transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <input type="hidden" name="featuredImageUrl" value={aiSuggestedImage} />
                  </motion.div>
                )}
                <AnimatePresence>
                    {formState.errors.featuredImage && (
                        <motion.span 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="font-bold text-xs text-destructive block pl-4"
                        >
                            {formState.errors.featuredImage}
                        </motion.span>
                    )}
                </AnimatePresence>
              </div>

              {/* Editor Workspace */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Editor Workspace</Label>
                </div>
                <div className="rounded-[32px] overflow-hidden border border-border/50 bg-background/40 backdrop-blur-xl min-h-[500px] shadow-inner premium-editor-container">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    className="premium-quill h-full"
                    placeholder="Start writing or use the AI Assistant to generate content..."
                  />
                </div>
                <AnimatePresence>
                    {formState.errors.content && (
                        <motion.span 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="font-bold text-xs text-destructive block pl-4"
                        >
                            {formState.errors.content[0]}
                        </motion.span>
                    )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-end gap-6 pt-12 border-t border-border/30">
                <Button 
                    type="button" 
                    variant="ghost" 
                    className="rounded-full h-16 px-12 text-lg font-bold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
                    onClick={() => router.back()}
                >
                  Discard
                </Button>
                <Button 
                    disabled={isPending} 
                    type="submit"
                    className="rounded-full h-16 px-14 text-lg bg-primary text-primary-foreground shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.6)] hover:translate-y-[-4px] transition-all duration-300 font-black tracking-tight"
                >
                  {isPending ? (
                    <span className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Launching...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                        Publish Article
                        <Send className="h-6 w-6" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Assistant Modal - UPDATED MODAL FLOW */}
      <AnimatePresence>
        {isAiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAiModalOpen(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-2xl glass-card p-10 rounded-[48px] shadow-3xl overflow-hidden bg-background/80 backdrop-blur-3xl border-none"
            >
                <div className="absolute -top-10 -right-10 p-12 opacity-5 rotate-12">
                    <Sparkles className="h-48 w-48 text-primary" />
                </div>
                
                <div className="relative z-10 space-y-10">
                    <div className="space-y-3">
                        <h2 className="text-4xl font-outfit font-black text-foreground flex items-center gap-4">
                            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                              <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            AI Mastermind
                        </h2>
                        <p className="text-muted-foreground font-semibold text-lg max-w-sm">
                            Just provide the context, and I'll handle the heavy lifting.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                           <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Article Topic / Title</Label>
                           <Input
                              value={aiTopic}
                              onChange={(e) => setAiTopic(e.target.value)}
                              placeholder="e.g. Solving Leetcode's 'Two Sum' Like a Senior Engineer"
                              className="h-14 rounded-2xl bg-muted/50 border-border/50 font-bold px-6"
                           />
                        </div>

                        <div className="space-y-4">
                           <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Brief Context / Brief</Label>
                           <textarea
                                value={aiBrief}
                                onChange={(e) => setAiBrief(e.target.value)}
                                placeholder="Explain the key situation or insights you want to cover... (e.g. focusing on time complexity, edge cases, and optimization using HashMaps)"
                                className="w-full h-36 rounded-[24px] bg-muted/50 border border-border/50 p-6 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                            />
                        </div>

                        <div className="space-y-4">
                           <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Writing Strategy</Label>
                           <div className="flex gap-4">
                              {["Professional", "Enthusiastic", "Technical", "Minimalist"].map((style) => (
                                <button
                                  key={style}
                                  onClick={() => setWritingStyle(style.toLowerCase())}
                                  className={`flex-1 h-12 rounded-xl text-xs font-bold transition-all ${
                                    writingStyle === style.toLowerCase()
                                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                  }`}
                                >
                                  {style}
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="flex items-center gap-4 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                            <input 
                              type="checkbox" 
                              id="autoImage"
                              checked={shouldGenerateImage}
                              onChange={(e) => setShouldGenerateImage(e.target.checked)}
                              className="h-6 w-6 rounded-lg text-primary focus:ring-primary/20 transition-all cursor-pointer"
                            />
                            <Label htmlFor="autoImage" className="font-bold text-foreground cursor-pointer flex-1">
                                Automatically research and suggest a matching cover image
                            </Label>
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <Button
                                variant="ghost"
                                onClick={() => setIsAiModalOpen(false)}
                                className="rounded-full px-8 h-12 font-bold text-muted-foreground"
                            >
                                Back to Editor
                            </Button>
                            <Button
                                onClick={handleGenerateAI}
                                disabled={isGenerating || !aiTopic.trim() || !aiBrief.trim()}
                                className="rounded-full px-12 h-14 bg-primary shadow-2xl shadow-primary/30 transition-all font-black gap-3 group text-lg"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Thinking...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="h-5 w-5 group-hover:rotate-45 transition-transform" />
                                        Generate Full Article
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .premium-editor-container .ql-toolbar {
          border: none !important;
          border-bottom: 3px solid hsl(var(--border) / 0.5) !important;
          background: hsl(var(--muted) / 0.4) !important;
          padding: 1.5rem 2rem !important;
          border-radius: 32px 32px 0 0 !important;
        }
        .premium-quill .ql-container {
          border: none !important;
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.25rem !important;
          line-height: 1.8 !important;
        }
        .premium-quill .ql-editor {
          padding: 3rem !important;
          min-height: 500px !important;
          color: hsl(var(--foreground)) !important;
        }
        .premium-quill .ql-editor.ql-blank::before {
          left: 3rem !important;
          top: 3rem !important;
          font-weight: 500 !important;
          color: hsl(var(--muted-foreground) / 0.4) !important;
          font-style: normal !important;
        }
        .ql-snow .ql-picker { font-weight: 700 !important; }
        .gradient-text {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
