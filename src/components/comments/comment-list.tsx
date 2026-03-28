import React from "react";
import { CommentItem } from "./comment-item";

type CommentWithAuthor = {
  id: string;
  body: string;
  parentId: string | null;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  likes: { userId: string }[];
};

type CommentListProps = {
  comments: CommentWithAuthor[];
  articleId: string;
  currentUserId?: string;
};

const CommentList: React.FC<CommentListProps> = ({ comments, articleId, currentUserId }) => {
  type CommentWithReplies = CommentWithAuthor & { replies: CommentWithReplies[] };
  // Organize comments into a hierarchy
  const commentMap = new Map<string, CommentWithReplies>();
  const rootComments: CommentWithReplies[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id);
    if (!commentWithReplies) return;

    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return (
    <div className="space-y-12">
      {rootComments.length > 0 ? (
        rootComments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            articleId={articleId} 
            currentUserId={currentUserId}
          />
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground italic">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentList;
