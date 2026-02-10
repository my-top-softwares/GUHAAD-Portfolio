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
        <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className=" bg-background shadow-neu flex items-center justify-center text-primary font-bold text-xl group-hover:text-foreground transition-colors">
                        GUHAAD
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:space-x-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-xs font-medium uppercase tracking-widest transition-colors hover:text-primary relative py-2",
                                pathname === item.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                            {pathname === item.href && (
                                <motion.div layoutId="underline" className="absolute left-0 bottom-0 w-full h-[2px] bg-primary" />
                            )}
                        </Link>
                    ))}
                    <div className="pl-4 border-l border-border">
                        <ModeToggle />
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center md:hidden gap-4">
                    <ModeToggle />
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-10 h-10 rounded-full bg-background shadow-neu flex items-center justify-center text-primary cursor-pointer active:scale-95 transition-transform"
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                        className="md:hidden border-b bg-background overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-8 space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "block px-4 py-3 text-sm font-medium transition-all hover:text-primary rounded-lg uppercase tracking-wider",
                                        pathname === item.href
                                            ? "bg-primary/5 text-primary shadow-sm"
                                            : "text-muted-foreground"
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
