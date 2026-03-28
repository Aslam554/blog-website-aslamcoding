import { Navbar } from "@/components/home/header/navbar";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
