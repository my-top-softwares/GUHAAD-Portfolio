"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, Heart, Layers, Image as ImageIcon, Video, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import API from "@/api/axios"

interface Category {
    _id: string
    name: string
    color: string
}

interface Project {
    _id: string
    title: string
    description: string
    image?: string
    category?: Category
    likes: number
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [activeCategory, setActiveCategory] = useState("All")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [projectsRes, categoriesRes] = await Promise.all([
                    API.get("/projects"),
                    API.get("/categories")
                ])
                setProjects(projectsRes.data)
                setCategories(categoriesRes.data)
            } catch (error) {
                console.error("Error fetching projects data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.category?.name === activeCategory)

    return (
        <div className="min-h-screen bg-background pt-20">
            {/* Header */}
            <div className="py-12 md:py-10 text-center  relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-2">My Portfolio</h1>

                </motion.div>
            </div>

            <div className="">
                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    <button
                        onClick={() => setActiveCategory("All")}
                        className={`
                            px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-neu
                            ${activeCategory === "All"
                                ? "text-primary shadow-neu-pressed"
                                : "text-muted-foreground hover:text-primary hover:-translate-y-1"
                            }
                        `}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => setActiveCategory(category.name)}
                            className={`
                                px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-neu
                                ${activeCategory === category.name
                                    ? "text-primary shadow-neu-pressed"
                                    : "text-muted-foreground hover:text-primary hover:-translate-y-1"
                                }
                            `}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    layout
                                    key={project._id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="group p-5 rounded-[2rem] bg-background shadow-neu cursor-pointer hover:shadow-neu-pressed transition-all duration-500 h-full flex flex-col">
                                        <div className="rounded-2xl overflow-hidden mb-6 aspect-[4/3] relative shadow-inner">
                                            {project.image ? (
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Hover Icon */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                                {project.category?.name === "Video Animations" ? <Video className="w-5 h-5" /> :
                                                    project.category?.name === "Full Branding" ? <Layers className="w-5 h-5" /> :
                                                        <ImageIcon className="w-5 h-5" />}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-primary mb-3 px-1">
                                            <span>{project.category?.name || "Uncategorized"}</span>
                                            <span className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                                                <Heart className="w-3.5 h-3.5" />
                                                {project.likes}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug mb-2 px-1">
                                            {project.title}
                                        </h3>
                                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 px-1">
                                            {project.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
