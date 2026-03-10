"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import API from "@/utils/api";

export default function PortfolioPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                setLoading(true);
                const [projectsRes, categoriesRes] = await Promise.all([
                    API.get("/projects"),
                    API.get("/categories")
                ]);

                setProjects(projectsRes.data);

                // Extract category names for the filter
                const catNames = ["All", ...categoriesRes.data.map((c: any) => c.name)];
                setCategories(catNames);

                setLoading(false);
            } catch (error) {
                console.error("Portfolio fetch error:", error);
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, []);

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter(p => p.category?.name === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="relative py-40 px-6 md:px-12 lg:px-24 min-h-screen overflow-hidden">
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                    <div className="animate-fade-up">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass mb-8 border border-white/5 shadow-2xl">
                            <span className="w-2 h-2 bg-accent rounded-full animate-ping"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Selected Case Studies</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-normal">
                            CRAFTING <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2 italic decoration-accent/20 underline underline-offset-8">IMPACT.</span>
                        </h1>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2 glass p-2 rounded-[32px] border border-white/5 animate-fade-up stagger-1 shadow-2xl">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${filter === cat
                                    ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-xl shadow-accent/20 scale-105"
                                    : "text-text-dim hover:text-foreground hover:bg-white/5"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[300px]">
                    {filteredProjects.map((project, i) => (
                        <Link
                            key={project._id}
                            href={`/portfolio/${project._id}`}
                            className={`group relative glass rounded-[40px] overflow-hidden cursor-pointer transition-all duration-700 hover:border-accent/40 animate-fade-up stagger-${(i % 3) + 1} ${project.size === 'large' ? 'md:row-span-2 lg:row-span-2' :
                                project.size === 'medium' ? 'lg:col-span-2' : ''
                                }`}
                        >
                            {project.mainMedia?.type === "video" ? (
                                <video
                                    src={project.mainMedia.url}
                                    className="w-full h-full object-cover   transition-all duration-1000"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={project.mainMedia?.url || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop"}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-all duration-1000"
                                    />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10 backdrop-blur-[2px]">
                                <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-3 translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                                    {project.category?.name}
                                </span>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter translate-y-6 group-hover:translate-y-0 transition-transform duration-700 [transition-delay:100ms] leading-none">
                                    {project.title}
                                </h3>
                                <div className="mt-6 flex items-center gap-4 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] translate-y-6 group-hover:translate-y-0 transition-transform duration-700 [transition-delay:200ms]">
                                    CASE STUDY <FaArrowRight className="group-hover:translate-x-3 transition-all duration-500 text-accent" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
