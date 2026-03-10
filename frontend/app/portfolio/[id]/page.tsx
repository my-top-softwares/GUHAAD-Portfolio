"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import API from "@/utils/api";

type Params = Promise<{ id: string }>;

export default function ProjectDetailPage({ params }: { params: Params }) {
    const { id } = use(params);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/projects/${id}`);
                setProject(data);
                setLoading(false);
            } catch (error) {
                console.error("Fetch project error:", error);
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h1 className="text-2xl font-black uppercase mb-4 text-foreground">Project Not Found</h1>
                <Link href="/portfolio" className="text-accent font-bold uppercase tracking-widest text-xs">Back to Portfolio</Link>
            </div>
        );
    }

    const allMedia = [
        project.mainMedia,
        ...(project.gallery || [])
    ].filter(item => item && item.url);

    return (
        <main className="min-h-screen bg-background py-40 px-6 md:px-12 lg:px-24 relative overflow-hidden">
            {/* Background glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-2/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Back link */}
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-dim hover:text-accent transition-colors mb-20 group"
                >
                    <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Collection
                </Link>

                {/* Header */}
                <div className="text-center mb-24 animate-fade-up">
                    {project.category?.name && (
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-accent/20 shadow-lg mb-8">
                            <span className="w-2 h-2 bg-accent rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                                {project.category.name}
                            </span>
                        </div>
                    )}
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2">
                            {project.title}
                        </span>
                    </h1>
                    <div className="w-40 h-1 bg-gradient-to-r from-accent to-accent-2 mx-auto rounded-full"></div>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allMedia.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            className="aspect-[4/3] relative rounded-[2rem] overflow-hidden group glass border border-white/5 hover:border-accent/20 transition-all duration-700 animate-fade-up shadow-2xl"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {item.type === "video" ? (
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    controls
                                    playsInline
                                />
                            ) : (
                                <Image
                                    src={item.url}
                                    alt={`${project.title} ${idx}`}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    ))}
                </div>

                {/* Project Details Footer */}
                <div className="mt-32 max-w-3xl mx-auto text-center animate-fade-up">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 text-foreground">
                        {project.title}
                    </h2>
                    <p className="text-lg text-text-dim font-medium leading-relaxed mb-12">
                        {project.description}
                    </p>

                    {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {project.technologies.map((tech: string, i: number) => (
                                <span
                                    key={i}
                                    className="px-6 py-2 glass rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-text-dim border border-white/5 hover:border-accent/30 hover:text-accent transition-all duration-300"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform shadow-2xl"
                        >
                            Launch Project <FiExternalLink />
                        </a>
                    )}
                </div>
            </div>
        </main>
    );
}
