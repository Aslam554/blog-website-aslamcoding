"use client";
import { searchAction } from "@/actions/search";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const SearchInput = () => {
  const params = useSearchParams();
  
  return (
    <form action={searchAction} className="relative group">
      <div className="relative overflow-hidden rounded-full">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="search"
          name="search"
          defaultValue={params.get("search") || ""}
          placeholder="Search articles..."
          className="pl-11 pr-4 w-44 md:w-64 h-11 bg-muted/40 border-border/50 rounded-full focus:w-72 focus:bg-background/80 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60 font-medium"
        />
      </div>
    </form>
  );
};

export default SearchInput;
