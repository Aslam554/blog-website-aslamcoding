import { auth } from "@/auth";
import SignupPage from "@/components/auth/signup-page";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return <SignupPage />;
}
