"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Calendar, Briefcase, ExternalLink, Heart } from "lucide-react"
import API from "@/api/axios"
import Link from "next/link"

interface Category {
    _id: string
    name: string
    color: string
}

interface Project {
    _id: string
    title: string
    description: string
    image: string
    link?: string
    technologies?: string[]
    likes: number
    category?: Category
    createdAt: string
    gallery?: string[]
}

export default function ProjectDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await API.get(`/projects/${params.id}`)
                setProject(data)
            } catch (error) {
                console.error("Error fetching project:", error)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchProject()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4 bg-background">
                <h2 className="text-2xl font-bold">Project Not Found</h2>
                <Link href="/" className="text-primary hover:underline">
                    Back to Home
                </Link>
            </div>
        )
    }

    const isVideo = (url: string) => {
        return url.toLowerCase().includes('.mp4') ||
            url.includes('youtube.com') ||
            url.includes('vimeo.com') ||
            url.startsWith('data:video');
    }

    const isAudio = (url: string) => {
        return url.toLowerCase().includes('.mp3') ||
            url.toLowerCase().includes('.wav') ||
            url.toLowerCase().includes('.ogg') ||
            url.startsWith('data:audio');
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </button>

                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            {project.category && (
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                                    style={{
                                        backgroundColor: project.category.color + "20",
                                        color: project.category.color,
                                    }}
                                >
                                    {project.category.name}
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-muted-foreground text-sm">
                                <Heart className="w-4 h-4 fill-current text-primary" /> {project.likes} Likes
                            </span>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold leading-tight"
                        >
                            {project.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground leading-relaxed"
                        >
                            {project.description}
                        </motion.p>

                        <div className="flex flex-wrap gap-4 pt-6">
                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-primary/90 transition-all hover:-translate-y-1"
                                >
                                    View Live Project <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        <div className="border-t border-border/50 pt-8 mt-8 grid grid-cols-2 gap-8">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground block mb-2">Technologies</span>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies?.map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-muted rounded-md text-xs font-medium">{tech}</span>
                                    )) || <span className="text-sm">N/A</span>}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground block mb-2">Date Created</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl bg-muted aspect-video md:aspect-[4/3] group"
                    >
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">No Preview Image</div>
                        )}
                    </motion.div>
                </div>

                {/* Gallery Section */}
                {project.gallery && project.gallery.length > 0 && (
                    <div className="mt-20">
                        <h3 className="text-3xl font-bold mb-8">Project Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {project.gallery.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative rounded-2xl overflow-hidden shadow-lg bg-black aspect-video hover:shadow-2xl transition-all duration-300 flex items-center justify-center p-2"
                                >
                                    {isVideo(item) ? (
                                        <video controls className="w-full h-full object-cover">
                                            <source src={item} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : isAudio(item) ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-xl">
                                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                                            </div>
                                            <audio controls className="w-4/5">
                                                <source src={item} />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    ) : (
                                        <img
                                            src={item}
                                            alt={`${project.title} gallery ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
