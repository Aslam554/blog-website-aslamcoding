import React from "react";
import { CommentItem } from "./comment-item";

type CommentListProps = {
  comments: any[];
  articleId: string;
  currentUserId?: string;
};

const CommentList: React.FC<CommentListProps> = ({ comments, articleId, currentUserId }) => {
  // Organize comments into a hierarchy
  const commentMap = new Map();
  const rootComments: any[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id);
    if (comment.parentId && commentMap.has(comment.parentId)) {
      commentMap.get(comment.parentId).replies.push(commentWithReplies);
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
