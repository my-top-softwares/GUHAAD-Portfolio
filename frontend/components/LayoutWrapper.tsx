"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Also exclude register page from navbar/footer
    const isDashboard = pathname.startsWith("/dashboard") || 
                       pathname === "/login" || 
                       pathname === "/register";

    if (!mounted) return <div className="min-h-screen">{children}</div>;

    return (
        <>
            {!isDashboard && <Navbar />}
            <main className={`${!isDashboard ? "min-h-screen" : ""}`}>
                {children}
            </main>
            {!isDashboard && <Footer />}
        </>
    );
}

