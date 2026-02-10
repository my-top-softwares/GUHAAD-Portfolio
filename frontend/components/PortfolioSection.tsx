"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import API from "@/api/axios"

interface Category {
    _id: string
    name: string
    color: string
}

interface Portfolio {
    _id: string
    title: string
    description: string
    image?: string
    category?: Category
    likes: number
    gallery?: string[]
}

export function PortfolioSection() {
    const router = useRouter()
    const [portfolios, setPortfolios] = useState<Portfolio[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [portfoliosRes, categoriesRes] = await Promise.all([
                API.get("/projects"),
                API.get("/categories"),
            ])

            setPortfolios(portfoliosRes.data)
            setCategories(categoriesRes.data)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredPortfolios = selectedCategory === "ALL"
        ? portfolios
        : portfolios.filter(p => p.category?.name === selectedCategory)

    return (
        <div className="mt-32 border-t border-border/40 pt-20">
            <div className="space-y-4 mb-12 text-center">
                <span className="uppercase text-primary text-xs font-medium tracking-widest">
                    VISIT MY PORTFOLIO AND KEEP YOUR FEEDBACK
                </span>
                <h2 className="text-4xl md:text-5xl font-bold">My Portfolio</h2>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory("ALL")}
                    className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${selectedCategory === "ALL"
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "bg-white dark:bg-[#1e2024] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800"
                        }`}
                >
                    All
                </motion.button>

                {categories.map((category) => (
                    <motion.button
                        key={category._id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${selectedCategory === category.name
                            ? "text-white shadow-lg"
                            : "bg-white dark:bg-[#1e2024] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800"
                            }`}
                        style={
                            selectedCategory === category.name
                                ? { backgroundColor: category.color, boxShadow: `0 10px 30px -10px ${category.color}80` }
                                : {}
                        }
                    >
                        {category.name}
                    </motion.button>
                ))}
            </div>

            {/* Portfolio Grid */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-20"
                    >
                        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="mt-4 text-gray-500">Loading portfolios...</p>
                    </motion.div>
                ) : filteredPortfolios.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-20"
                    >
                        <p className="text-gray-500">No portfolios found in this category.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredPortfolios.map((item, i) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                    duration: 0.4,
                                    delay: i * 0.1,
                                    layout: { duration: 0.3 }
                                }}
                                whileHover={{ y: -8 }}
                                onClick={() => router.push(`/projects/${item._id}`)}
                                className="group p-6 rounded-3xl bg-background shadow-neu cursor-pointer transition-all duration-500 hover:shadow-2xl"
                            >
                                <div className="rounded-2xl overflow-hidden mb-6 aspect-[4/3] relative bg-gray-200 dark:bg-gray-800">
                                    {item.image ? (
                                        <motion.img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                                    />

                                    {/* Hover Arrow Effect */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileHover={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="7" y1="17" x2="17" y2="7" />
                                            <polyline points="7 7 17 7 17 17" />
                                        </svg>
                                    </motion.div>
                                </div>

                                <div className="flex justify-between items-center mb-3">
                                    {item.category && (
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
                                            style={{
                                                backgroundColor: item.category.color + "20",
                                                color: item.category.color,
                                            }}
                                        >
                                            {item.category.name}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                                        <Heart className="w-4 h-4" />
                                        {item.likes}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
