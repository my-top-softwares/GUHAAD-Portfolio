import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "GUHAAD | Creatives",
    description: "Personal portfolio of Guhaad, a passionate Creatives based in the Philippines.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <body className="antialiased font-outfit overflow-x-hidden transition-colors duration-500" suppressHydrationWarning>
                <ThemeProvider>
                    <Toaster position="top-center" reverseOrder={false} />
                    {/* Global Background Decorations - Adjust for theme sensitivity if needed */}
                    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
                        <div className="absolute top-[10%] right-[-10%] w-[800px] h-[800px] bg-accent/20 rounded-full blur-[160px] animate-pulse"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px]"></div>
                    </div>

                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </ThemeProvider>
            </body>
        </html>
    );
}
