import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
    return (
        <footer className="bg-[#0c2b2c] pt-48 pb-10 relative mt-32">
            <div className="container mx-auto px-4 text-white">

                {/* Floating Newsletter Banner */}
                <div className="absolute -top-24 left-4 right-4 md:left-8 md:right-8 bg-[#0f3d3e] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5f82a]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

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
                                className="bg-[#1a4a4b] border-transparent text-white placeholder:text-gray-400 h-14 rounded-xl focus:bg-[#235e5f] transition-all focus:ring-1 focus:ring-[#c5f82a]"
                            />
                            <Button className="h-14 px-8 rounded-xl bg-[#c5f82a] hover:bg-[#bceb26] text-[#0f3d3e] font-bold text-lg shadow-lg shadow-[#c5f82a]/20">
                                Subscribe
                            </Button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center sm:text-left">
                            By subscribing you agree to our <Link href="#" className="underline hover:text-[#c5f82a]">Privacy Policy</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/10 pb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-white">GUHAAD</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Professional multimedia and video production services crafted to help brands communicate and stand out.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-[#ff014f] hover:text-white hover:border-[#ff014f] transition-all duration-300">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-[#ff014f] hover:text-white hover:border-[#ff014f] transition-all duration-300">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-[#ff014f] hover:text-white hover:border-[#ff014f] transition-all duration-300">
                                <Github className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-white text-lg">Services</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-[#ff014f] transition-colors">Motion Graphics</Link></li>
                            <li><Link href="#" className="hover:text-[#ff014f] transition-colors">Web Design</Link></li>
                            <li><Link href="#" className="hover:text-[#ff014f] transition-colors">Video Editing</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-white text-lg">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-[#ff014f] transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-[#ff014f] transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-[#ff014f] transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-white text-lg">Contact</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="mailto:info@guhaad.com" className="hover:text-[#ff014f] transition-colors">info@guhaad.com</a></li>
                            <li><a href="tel:+1234567890" className="hover:text-[#ff014f] transition-colors">+123 456 7890</a></li>
                            <li className="text-gray-500">Mogadishu, Somalia</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
                    <p>&copy; {new Date().getFullYear()} Guhaad. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
