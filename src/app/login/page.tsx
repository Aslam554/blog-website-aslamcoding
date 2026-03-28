import { auth } from "@/auth";
import LoginPage from "@/components/auth/login-page";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return <LoginPage />;
}
