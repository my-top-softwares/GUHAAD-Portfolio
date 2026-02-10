"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/projects" }, // Renamed to Portfolio but keeping /projects route for now as per structure
    { name: "Contact", href: "/contact" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()

    // Close mobile menu when route changes
    React.useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return (
        <nav className="fixed top-0 z-50 w-full bg-white/90 dark:bg-background/90 backdrop-blur-md border-b border-gray-100 dark:border-border/40 transition-colors duration-300">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8 relative">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group z-20">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <span className="font-bold text-lg">G</span>
                    </div>
                    <span className="font-bold text-2xl text-emerald-800 dark:text-emerald-400 tracking-tight group-hover:text-emerald-600 transition-colors">
                        GUHAAD
                    </span>
                </Link>

                {/* Desktop Navigation - Centered */}
                <div className="hidden md:flex md:items-center md:space-x-8 absolute left-1/2 -translate-x-1/2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-all duration-300 relative py-1 hover:text-emerald-600 dark:hover:text-emerald-400",
                                pathname === item.href
                                    ? "text-emerald-700 dark:text-emerald-400 font-bold"
                                    : "text-gray-600 dark:text-gray-300"
                            )}
                        >
                            {item.name}
                            {pathname === item.href && (
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right Side - Mode Toggle & Mobile Menu */}
                <div className="flex items-center gap-4 z-20">
                    <div className="hidden md:block">
                        <Link href="/contact">
                            <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                                Get in Touch
                            </Button>
                        </Link>
                    </div>
                    <div className="pl-2">
                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 cursor-pointer active:scale-95 transition-transform"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b bg-white dark:bg-background overflow-hidden shadow-xl"
                    >
                        <div className="container mx-auto px-4 py-6 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "block px-4 py-3 text-base font-medium transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg",
                                        pathname === item.href
                                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                                            : "text-gray-600 dark:text-gray-300"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
