"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { deleteComment } from "@/actions/delete-comment";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteCommentButtonProps {
    commentId: string;
}

export default function DeleteCommentButton({ commentId }: DeleteCommentButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deleteComment(commentId);
                toast.success("Comment deleted successfully");
                setOpen(false);
            } catch (error: any) {
                toast.error(error.message || "Failed to delete comment");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px] rounded-[32px] glass-card border-none bg-background/80 backdrop-blur-3xl p-8">
                <DialogHeader className="space-y-4">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2 text-destructive">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <DialogTitle className="text-2xl font-outfit font-black text-center">Delete Comment?</DialogTitle>
                    <DialogDescription className="text-center font-medium text-base">
                        This action cannot be undone. This will permanently remove the comment from the platform.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => setOpen(false)}
                        className="flex-1 h-12 rounded-xl font-bold"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex-1 h-12 rounded-xl font-black gap-2 shadow-lg shadow-destructive/20"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
