"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { toggleCommentLike } from "@/actions/like-comment";
import CommentForm from "./comment-form";
import { cn } from "@/lib/utils";

type CommentItemProps = {
  comment: {
    id: string;
    body: string;
    createdAt: Date;
    author: {
      name: string;
      email: string;
      imageUrl: string | null;
    };
    likes: { userId: string }[];
    replies?: any[];
  };
  articleId: string;
  currentUserId?: string;
  depth?: number;
};

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  articleId,
  currentUserId,
  depth = 0,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const isLiked = comment.likes.some((like) => like.userId === currentUserId);

  const handleLike = async () => {
    try {
      await toggleCommentLike(comment.id, articleId);
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  return (
    <div className={cn("space-y-4", depth > 0 && "ml-4 md:ml-10 border-l border-border/50 pl-4 md:pl-6")}>
      <div className="group relative flex gap-4">
        <Avatar className="h-10 w-10 border border-border/50 shadow-sm transition-transform group-hover:scale-105">
          <AvatarImage src={comment.author.imageUrl as string} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {comment.author.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-outfit font-bold text-foreground">
                {comment.author.name}
              </span>
              <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            {comment.body}
          </p>

          <div className="flex items-center gap-4 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-full gap-1.5 px-3 transition-colors",
                isLiked ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "hover:bg-primary/10"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span className="text-xs font-bold">{comment.likes.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-full gap-1.5 px-3 hover:bg-primary/10 group/reply"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-4 w-4 transition-transform group-hover/reply:-translate-x-0.5" />
              <span className="text-xs font-bold">Reply</span>
            </Button>

            {comment.replies && comment.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full gap-1.5 px-3 hover:bg-muted/50"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="text-xs font-bold">{comment.replies.length} Replies</span>
              </Button>
            )}
          </div>
          
          {isReplying && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
               <CommentForm 
                  articleId={articleId} 
                  parentId={comment.id} 
                  onSuccess={() => setIsReplying(false)}
               />
            </div>
          )}
        </div>
      </div>

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-6 mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
