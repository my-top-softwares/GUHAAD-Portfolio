"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { FiMoon, FiSun } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const links = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Gallery", href: "/gallery" },
        { name: "Services", href: "/services" },
        { name: "Contact", href: "/contact" },
    ];

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] md:w-[85%] lg:w-[75%] z-[100] px-8 py-4 flex justify-between items-center glass rounded-3xl border border-white/5 shadow-2xl overflow-hidden transition-colors duration-500">

                <Link href="/">
                    <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2 select-none">GUHAAD</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wide">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`${pathname === link.href ? "text-accent" : "text-text-dim"
                                } relative transition-all hover:text-foreground hover:translate-y-[-2px] ${pathname === link.href ? "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-accent" : ""
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Toggle Theme"
                        suppressHydrationWarning
                    >
                        {mounted && theme === 'dark' ? <FiMoon size={20} /> : <FiSun size={20} className="text-amber-500" />}
                    </button>

                    <Link href="/contact" className="btn-secondary text-xs py-3 px-6 rounded-xl hover:shadow-accent/40 shadow-lg">START TALKING</Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Toggle Theme"
                        suppressHydrationWarning
                    >
                        {mounted && theme === 'dark' ? <FiMoon size={20} /> : <FiSun size={20} className="text-amber-500" />}
                    </button>
                    <button onClick={toggleMobileMenu} className="text-foreground p-2">
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[99] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-10 duration-300">
                    <div className="flex flex-col items-center gap-8 text-xl font-black uppercase tracking-widest">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`${pathname === link.href ? "text-accent" : "text-text-dim"
                                    } hover:text-foreground transition-colors`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="btn-primary text-[12px] py-4 px-8 rounded-xl mt-8"
                        >
                            START TALKING
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
