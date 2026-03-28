"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Save, Loader2 } from "lucide-react";
import { updateUser } from "@/actions/update-user";
import { toast } from "sonner";

interface SettingsFormProps {
    user: {
        name?: string | null;
        email?: string | null;
    };
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                await updateUser(formData);
                toast.success("Profile updated successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to update profile");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-1">
                <h3 className="text-2xl font-black">Personal Information</h3>
                <p className="text-sm text-muted-foreground">This information will be displayed on your public articles.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Full Name</Label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input 
                            id="name" 
                            name="name"
                            defaultValue={user?.name || ""} 
                            className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 text-base" 
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Email Address</Label>
                    <div className="relative group opacity-60">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="email" 
                            defaultValue={user?.email || ""} 
                            disabled 
                            className="h-14 pl-12 rounded-2xl bg-muted/30 border-none text-base cursor-not-allowed" 
                        />
                    </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                    <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Biography</Label>
                    <textarea 
                        id="bio"
                        name="bio"
                        rows={4} 
                        className="w-full p-6 pt-4 rounded-[32px] bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 outline-none text-base resize-none transition-all placeholder:text-muted-foreground/50"
                        placeholder="Share a little bit about yourself and your coding journey..."
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                <p className="text-xs text-muted-foreground italic">
                    Last updated recently.
                </p>
                <Button 
                    type="submit"
                    disabled={isPending}
                    className="h-14 px-10 rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all font-black gap-2"
                >
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
