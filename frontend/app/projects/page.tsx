"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, Heart, Layers, Image as ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// Categories
const CATEGORIES = ["All", "Video Animations", "Full Branding", "Graphic Designs"]

// Placeholder Data
const projects = [
    {
        id: 1,
        title: "Product Launch Animation",
        category: "Video Animations",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60",
        likes: 124,
        description: "3D product animation for a new tech gadget launch."
    },
    {
        id: 2,
        title: "Corporate Identity Pack",
        category: "Full Branding",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&auto=format&fit=crop&q=60",
        likes: 89,
        description: "Complete branding for a finance startup including logo, stationary, and guidelines."
    },
    {
        id: 3,
        title: "Social Media Campaign",
        category: "Graphic Designs",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60",
        likes: 215,
        description: "A series of high-conversion social media graphics for a retail brand."
    },
    {
        id: 4,
        title: "Explainer Video",
        category: "Video Animations",
        image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=60",
        likes: 95,
        description: "2D animated explainer video for a SaaS platform."
    },
    {
        id: 5,
        title: "Restaurant Rebrand",
        category: "Full Branding",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
        likes: 150,
        description: "Modern rebrand for a popular downtown restaurant chain."
    },
    {
        id: 6,
        title: "Event Poster Series",
        category: "Graphic Designs",
        image: "https://images.unsplash.com/photo-1558655146-d09347e0b7a9?w=800&auto=format&fit=crop&q=60",
        likes: 110,
        description: "Typographic poster series for a music festival."
    }
]

export default function ProjectsPage() {
    const [activeCategory, setActiveCategory] = useState("All")

    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.category === activeCategory)

    return (
        <div className="min-h-screen bg-background pt-20">
            {/* Header */}
            <div className="py-12 md:py-20 text-center space-y-2 relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="uppercase text-primary text-xs font-bold tracking-widest">Portfolio</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-2">My Portfolio</h1>
                    <div className="flex justify-center gap-2 text-sm text-muted-foreground mt-4">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="text-primary">{'>'}</span>
                        <span className="text-primary font-medium">Portfolio</span>
                    </div>
                </motion.div>
            </div>

            <div className="container mx-auto px-4 md:px-8 mb-32">
                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`
                                px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-neu
                                ${activeCategory === category
                                    ? "text-primary shadow-neu-pressed"
                                    : "text-muted-foreground hover:text-primary hover:-translate-y-1"
                                }
                            `}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="group p-6 rounded-3xl bg-background shadow-neu cursor-pointer hover:-translate-y-2 transition-transform duration-500 h-full flex flex-col">
                                    <div className="rounded-2xl overflow-hidden mb-6 aspect-[4/3] relative">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Hover Icon */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-300">
                                            {project.category === "Video Animations" ? <Video className="w-5 h-5" /> :
                                                project.category === "Full Branding" ? <Layers className="w-5 h-5" /> :
                                                    <ImageIcon className="w-5 h-5" />}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                                        <span>{project.category}</span>
                                        <span className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                                            <Heart className="w-4 h-4" />
                                            {project.likes}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}
