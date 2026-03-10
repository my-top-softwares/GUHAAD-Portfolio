"use client";
import Link from "next/link";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram, FaArrowRight, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { useTheme } from "./ThemeProvider";



export default function Footer() {
    const { theme, toggleTheme } = useTheme();
    return (
        <footer className="relative text-foreground py-24 w-full overflow-hidden flex flex-col items-center border-t border-white/5" style={{background: 'var(--primary)'}}>
            {/* Gradient orbs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-2/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 pb-4">
                {/* Left Side: Branding & Info */}
                <div>
                    <h1 className="text-3xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2">GUHAAD</h1>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-2">CREATIVES</p>

                    <p className="text-text-dim text-base font-medium leading-relaxed mb-12 max-w-sm">
                        Empowering brands with advanced multi-modal solutions to improve digital presence and user outcomes.
                    </p>

                    <div className="flex gap-5 mb-16">
                        {[FaTwitter, FaLinkedin, FaGithub, FaInstagram].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-text-dim hover:bg-gradient-to-br hover:from-accent hover:to-accent-2 hover:text-white hover:-translate-y-1 transition-all duration-500 border border-white/5">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                    <div className="w-full pt-8 border-t border-white/5">
                        <p className="text-text-dim text-xs font-normal uppercase tracking-widest">
                            © 2026 GUHAAD Creatives. All Rights Reserved.
                        </p>
                    </div>
                </div>

                {/* Right Side: Navigation Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                    <div>
                        <h5 className="font-bold uppercase tracking-wide text-xs mb-8 text-foreground">Site Map</h5>
                        <ul className="space-y-5 text-text-dim font-bold text-[13px] tracking-wide">
                            <li><Link href="/" className="hover:text-foreground transition-all block">Project Home</Link></li>
                            <li><Link href="/about" className="hover:text-foreground transition-all block">The Story</Link></li>
                            <li><Link href="/portfolio" className="hover:text-foreground transition-all block">Case Studies</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold uppercase tracking-wide text-xs mb-8 text-foreground">Legal</h5>
                        <ul className="space-y-5 text-text-dim font-bold text-[13px] tracking-wide">
                            <li><Link href="#" className="hover:text-foreground transition-all block">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-all block">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-all block">Media Kit</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold uppercase tracking-wide text-xs mb-8 text-foreground">Solutions</h5>
                        <ul className="space-y-5 text-text-dim font-bold text-[13px] tracking-wide">
                            <li><Link href="/portfolio" className="hover:text-foreground transition-all block">Video Production</Link></li>
                            <li><Link href="/portfolio" className="hover:text-foreground transition-all block">Motion Design</Link></li>
                            <li><Link href="/portfolio" className="hover:text-foreground transition-all block">Voice Narration</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
