"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard") || pathname === "/login";

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
