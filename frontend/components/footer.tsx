import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
    return (
        <footer className="bg-white pt-32 pb-10 relative">
            <div className="container mx-auto px-4">

                {/* Floating Newsletter Banner */}
                <div className="absolute -top-24 left-4 right-4 md:left-8 md:right-8 bg-[#0f3d3e] dark:bg-[#0f3d3e] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 text-center md:text-left max-w-lg">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Subscribe our newsletter</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Subscribe to our newsletter and be the first to receive insights, updates, and expert tips on optimizing your financial management.
                        </p>
                    </div>

                    <div className="relative z-10 w-full max-w-md space-y-2">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 h-12 rounded-xl focus:bg-white/20 transition-all"
                            />
                            <Button className="h-12 px-8 rounded-xl bg-[#c5f82a] hover:bg-[#bceb26] text-[#0f3d3e] font-bold">
                                Subscribe
                            </Button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center sm:text-left">
                            By subscribing you agree to our <Link href="#" className="underline hover:text-white">Privacy Policy</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 md:pt-24 border-b border-border/40 pb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">P</div>
                            <span className="text-xl font-bold">payable</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Make your complicated finance more simple.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                                <Github className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground">Features</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Payment</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Card</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Help</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Services</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Payable. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
