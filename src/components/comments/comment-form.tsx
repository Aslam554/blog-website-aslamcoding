"use client";
import React, { useActionState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createComments } from "@/actions/create-comment";

type CommentFormProps = {
    articleId: string;
    parentId?: string;
    onSuccess?: () => void;
    userImage?: string | null;
}

const CommentForm: React.FC<CommentFormProps> = ({ articleId, parentId, onSuccess, userImage }) => {
  const [formState, action, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (parentId) {
        formData.append("parentId", parentId);
      }
      const res = await createComments(articleId, prevState, formData);
      if (Object.keys(res.errors).length === 0 && onSuccess) {
        onSuccess();
      }
      return res;
    },
    { errors: {} }
  );

  return (
    <form action={action} className="mb-4">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 border border-border/50">
          <AvatarImage src={userImage || ""} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {userImage ? "U" : "Y"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <div className="relative group/input">
            <Input 
              placeholder={parentId ? "Write a reply..." : "Add to the discussion..."} 
              name="body" 
              className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:ring-primary/20 text-base px-6 pr-24 transition-all" 
            />
            <Button 
                disabled={isPending} 
                type="submit"
                className="absolute right-2 top-2 rounded-xl h-10 px-6 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:translate-y-[-1px] transition-all"
            >
              {isPending ? "Posting..." : "Post"}
            </Button>
          </div>
          {formState.errors.body && <p className="text-destructive text-sm font-semibold">{formState.errors.body}</p>}
          {formState.errors.formErrors && (
            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-semibold">
              {formState.errors.formErrors[0]}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
