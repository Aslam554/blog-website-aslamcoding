"use client";
import React, { FormEvent, startTransition, useActionState, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { updateArticles } from "@/actions/update-article";
import { deleteArticle } from "@/actions/delete-article";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image as ImageIcon, Send, Wand2, Loader2, PenTool, Save, Trash2 } from "lucide-react";
import { generateAIContent } from "@/actions/generate-ai-content";
import { toast } from "sonner";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    const QuillComponent = (props: React.ComponentProps<typeof RQ>) => <RQ {...props} />;
    QuillComponent.displayName = "ReactQuillEditor";
    return QuillComponent;
  },
  { ssr: false }
);

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

type EditPropsPage = {
  article: {
    id: string;
    title: string;
    content: string;
    category: string;
    featuredImage: string;
  };
};

const EditArticlePage: React.FC<EditPropsPage> = ({ article }) => {
  const [content, setContent] = useState(article.content);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const [formState, action, isPending] = useActionState(
    updateArticles.bind(null, article.id),
    { errors: {} }
  );

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
        setIsDeleting(true);
        try {
            await deleteArticle(article.id);
            toast.success("Article deleted successfully");
            router.push("/dashboard");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to delete article");
        } finally {
            setIsDeleting(false);
        }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("content", content);

    startTransition(() => {
      action(formData);
    });
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateAIContent(aiPrompt);
      if (generated) {
        setContent((prev) => prev + (prev ? "\n\n" : "") + generated);
        setIsAiModalOpen(false);
        setAiPrompt("");
        toast.success("Content generated successfully!");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12 md:py-20">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto px-4"
      >
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-foreground text-glow-sm">
                    Refine Your <span className="gradient-text">Creation</span>
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                    Editing: <span className="text-foreground italic">&quot;{article.title}&quot;</span>
                </p>
            </div>
            <div className="flex items-center gap-3">
               <Button 
                onClick={handleDelete}
                disabled={isDeleting}
                variant="outline" 
                className="rounded-full h-12 px-6 border-border/50 font-bold hover:bg-destructive/10 hover:text-destructive group transition-all"
               >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2 group-hover:shake" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete Article"}
               </Button>
            </div>
        </div>

        <Card className="glass-card border-none overflow-hidden shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Title Input */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-primary" />
                    Article Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={article.title}
                    placeholder="Enter article title"
                    className="h-14 rounded-2xl bg-muted/50 border-border/50 focus:ring-primary/20 text-lg px-6"
                    required
                  />
                  <AnimatePresence>
                    {formState.errors.title && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="font-medium text-sm text-destructive block"
                      >
                        {formState.errors.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category Selection */}
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    Category
                  </Label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={article.category}
                    className="flex h-14 w-full rounded-2xl border border-border/50 bg-muted/50 px-6 py-2 text-lg ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="technology">Technology</option>
                    <option value="programming">Programming</option>
                    <option value="web-development">Web Development</option>
                    <option value="design">Design</option>
                    <option value="ai">Artificial Intelligence</option>
                  </select>
                  <AnimatePresence>
                    {formState.errors.category && (
                        <motion.span 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="font-medium text-sm text-destructive block"
                        >
                          {formState.errors.category}
                        </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Featured Image Management */}
              <div className="space-y-4">
                <Label htmlFor="featuredImage" className="text-base font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Update Banner
                </Label>
                
                <div className="grid md:grid-cols-[240px_1fr] gap-6 items-center bg-muted/30 p-6 rounded-3xl border border-border/50">
                    {article.featuredImage && (
                        <div className="relative group overflow-hidden rounded-2xl aspect-video w-full shadow-lg">
                            <Image
                                src={article.featuredImage}
                                alt="Current cover"
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Current Banner</span>
                            </div>
                        </div>
                    )}
                    <div className="space-y-2 flex-1">
                        <Input
                            id="featuredImage"
                            name="featuredImage"
                            type="file"
                            accept="image/*"
                            className="h-14 rounded-2xl bg-background border-border/50 file:bg-primary file:text-primary-foreground file:border-none file:px-4 file:h-full file:mr-4 file:rounded-xl file:cursor-pointer hover:border-primary/50 transition-all"
                        />
                        <p className="text-sm text-muted-foreground font-medium pl-2">
                            Leave empty to keep current banner. New uploads will overwrite.
                        </p>
                    </div>
                </div>
                
                <AnimatePresence>
                    {formState.errors.featuredImage && (
                        <motion.span 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="font-medium text-sm text-destructive block"
                        >
                            {formState.errors.featuredImage}
                        </motion.span>
                    )}
                </AnimatePresence>
              </div>

              {/* Content Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                        <PenTool className="h-4 w-4 text-primary" />
                        Article Body
                    </Label>
                    <Button
                        type="button"
                        onClick={() => setIsAiModalOpen(true)}
                        className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all gap-2 px-6 h-10 font-bold group shadow-lg shadow-primary/5"
                    >
                        <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                        Refine with AI
                    </Button>
                </div>
                <div className="rounded-2xl overflow-hidden border border-border/50 bg-muted/20 min-h-[450px]">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    className="premium-quill h-full"
                  />
                </div>
                <AnimatePresence>
                    {formState.errors.content && (
                        <motion.span 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="font-medium text-sm text-destructive block"
                        >
                            {formState.errors.content[0]}
                        </motion.span>
                    )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-end gap-4 pt-8">
                <Button 
                    type="button" 
                    variant="outline" 
                    className="rounded-full h-14 px-10 text-lg border-border/50 hover:bg-muted font-bold transition-all"
                    onClick={() => window.history.back()}
                >
                  Discard Changes
                </Button>
                <Button 
                    disabled={isPending} 
                    type="submit"
                    className="rounded-full h-14 px-12 text-lg bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] transition-all font-bold gap-2"
                >
                  {isPending ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                    </>
                  ) : (
                    <>
                        <Save className="h-5 w-5" />
                        Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Assistant Modal (Same as Create Page) */}
      <AnimatePresence>
        {isAiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAiModalOpen(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl glass-card p-8 rounded-[32px] shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="h-24 w-24" />
                </div>
                
                <div className="relative z-10 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-outfit font-bold text-foreground flex items-center gap-3">
                            <Sparkles className="h-8 w-8 text-primary" />
                            AI Refinement
                        </h2>
                        <p className="text-muted-foreground font-medium">
                            Need help expanding or refining your thoughts? Just ask.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g. Rewrite the last paragraph to be more professional..."
                            className="w-full h-44 rounded-2xl bg-muted/50 border border-border/50 p-6 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                        />
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => setIsAiModalOpen(false)}
                                className="rounded-full px-6 hover:bg-muted font-bold"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleGenerateAI}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className="rounded-full px-8 bg-primary shadow-lg shadow-primary/20 transition-all font-bold gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Refining...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Enhance
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
        .premium-quill .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid hsl(var(--border) / 0.5) !important;
          background: hsl(var(--muted) / 0.3) !important;
          padding: 1.25rem !important;
          border-radius: 1rem 1rem 0 0 !important;
        }
        .premium-quill .ql-container {
          border: none !important;
          font-family: var(--font-inter) !important;
          font-size: 1.125rem !important;
          color: hsl(var(--foreground)) !important;
        }
        .premium-quill .ql-editor {
          padding: 2.5rem !important;
          min-height: 450px !important;
          line-height: 1.7 !important;
        }
        .premium-quill .ql-editor.ql-blank::before {
          left: 2.5rem !important;
          color: hsl(var(--muted-foreground) / 0.4) !important;
          font-style: normal !important;
        }
        .premium-quill .ql-editor h1, .premium-quill .ql-editor h2, .premium-quill .ql-editor h3 {
          font-family: var(--font-outfit) !important;
          font-weight: 700 !important;
          margin-top: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
      `}</style>
    </div>
  );
};
export default EditArticlePage;
