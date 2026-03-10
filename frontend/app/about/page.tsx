"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaDownload, FaBriefcase, FaArrowRight, FaGraduationCap, FaCode, FaPaintBrush, FaVideo, FaLayerGroup } from "react-icons/fa";
import {
    SiAdobephotoshop,
    SiAdobepremierepro,
    SiAdobeaftereffects,
    SiFigma,
    SiBlender,
    SiAdobexd,
    SiCanva,
    SiDavinciresolve
} from "react-icons/si";
import API from "@/utils/api";

interface ResumeItem {
    _id: string;
    title: string;
    organization: string;
    duration: string;
    description: string;
    type: 'experience' | 'education';
    order: number;
}

export default function AboutPage() {
    const [resumeData, setResumeData] = useState<ResumeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const { data } = await API.get("/resume");
                setResumeData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching resume:", error);
                setLoading(false);
            }
        };
        fetchResume();
    }, []);

    const experiences = resumeData.filter(item => item.type === "experience").sort((a, b) => a.order - b.order);
    const education = resumeData.filter(item => item.type === "education").sort((a, b) => a.order - b.order);

    return (
        <main className="relative min-h-screen pt-32 pb-40 overflow-hidden bg-background">
            {/* Background Branding */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Hero Section */}
            <section className="px-6 md:px-12 lg:px-24 mb-60">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24 lg:gap-32 w-full">
                    {/* About Image Group */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative w-80 h-80 md:w-[480px] md:h-[480px] mx-auto">
                            {/* Rotating Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-2 rounded-full blur-3xl opacity-20 "></div>
                            
                            {/* Circular Image Container */}
                            <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-tr from-accent via-accent-2 to-accent ">
                                <div className="w-full h-full rounded-full overflow-hidden bg-background p-1.5">
                                    <div className="w-full h-full rounded-full overflow-hidden relative group grayscale hover:grayscale-0 transition-all duration-1000">
                                        <Image
                                            src="/image.jpeg"
                                            alt="About Profile"
                                            fill
                                            className="object-cover brightness-105 contrast-110 transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent mix-blend-overlay"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute -top-6 -right-6 glass p-8 rounded-[40px] z-20 shadow-2xl border border-accent/20 animate-float">
                                <div className="text-4xl font-black text-accent mb-1 tracking-tighter">8+</div>
                                <p className="text-[10px] text-text-dim uppercase font-black tracking-widest leading-none">Years Of<br/>Mastery</p>
                            </div>

                            <div className="absolute -bottom-6 -left-6 glass p-8 rounded-[40px] z-20 shadow-2xl border border-accent-2/20 animate-float [animation-delay:2s]">
                                <div className="text-4xl font-black text-foreground mb-1 tracking-tighter">150+</div>
                                <p className="text-[10px] text-text-dim uppercase font-black tracking-widest leading-none">Global<br/>Clients</p>
                            </div>
                        </div>
                    </div>

                    {/* About Text */}
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass mb-8 border border-foreground/5 shadow-sm">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Multimedia Specialist</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-tight text-foreground uppercase">
                            CRAFTING <br /> <span className="text-accent italic underline underline-offset-8 decoration-accent/30">VISIONARY</span> <br /> SOLUTIONS.
                        </h2>

                        <p className="text-text-dim mb-10 text-lg font-medium leading-relaxed max-w-xl">
                            I am a Senior Multimedia Artist & UI/UX Designer who blends technical precision with creative flair. I help brands navigate the digital landscape through immersive motion graphics, intuitive interface design, and high-impact visual storytelling.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/contact" className="btn-primary flex-1 flex items-center justify-center gap-4 group py-6">
                                START A PROJECT <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <button className="flex-1 glass flex items-center justify-center gap-4 group py-6 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-accent transition-all">
                                DOWNLOAD CV <FaDownload className="group-hover:translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience & Education Section (Dynamic) */}
            <section className="px-6 md:px-12 lg:px-24 mb-60 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-20">
                        {/* Experience Column */}
                        <div className="flex-1">
                            <div className="flex items-center gap-6 mb-16 animate-fade-up">
                                <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent text-3xl shadow-lg shadow-accent/5">
                                    <FaBriefcase />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground italic">Professional Experience</h3>
                            </div>

                            <div className="space-y-16 border-l-2 border-foreground/5 pl-10 ml-8 relative">
                                {loading ? (
                                    <div className="text-text-dim animate-pulse uppercase font-black text-xs tracking-widest">Synchronizing records...</div>
                                ) : experiences.map((exp, i) => (
                                    <div key={exp._id} className="relative group animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className="absolute -left-[51.5px] top-4 w-5 h-5 rounded-full bg-accent border-4 border-background shadow-lg shadow-accent/20 group-hover:scale-150 transition-all duration-500"></div>
                                        <span className="text-xs font-black text-accent uppercase tracking-widest mb-2 block">{exp.duration}</span>
                                        <h4 className="text-2xl font-black text-foreground mb-1 uppercase tracking-tight">{exp.title}</h4>
                                        <p className="text-xs text-text-dim font-black uppercase tracking-[0.2em] mb-4 italic leading-none">{exp.organization}</p>
                                        <p className="text-sm text-text-dim font-medium leading-relaxed max-w-md">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education Column */}
                        <div className="flex-1">
                            <div className="flex items-center gap-6 mb-16 animate-fade-up">
                                <div className="w-16 h-16 rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground/40 text-3xl">
                                    <FaGraduationCap />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground italic">Academic History</h3>
                            </div>

                            <div className="space-y-16 border-l-2 border-foreground/5 pl-10 ml-8 relative">
                                {loading ? (
                                    <div className="text-text-dim animate-pulse uppercase font-black text-xs tracking-widest">Synchronizing records...</div>
                                ) : education.map((edu, i) => (
                                    <div key={edu._id} className="relative group animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className="absolute -left-[51.5px] top-4 w-5 h-5 rounded-full bg-foreground/10 border-4 border-background group-hover:bg-accent group-hover:scale-150 transition-all duration-500 shadow-sm"></div>
                                        <span className="text-xs font-black text-text-dim uppercase tracking-widest mb-2 block">{edu.duration}</span>
                                        <h4 className="text-2xl font-black text-foreground mb-1 uppercase tracking-tight">{edu.title}</h4>
                                        <p className="text-xs text-text-dim font-black uppercase tracking-[0.2em] mb-4 italic leading-none">{edu.organization}</p>
                                        <p className="text-sm text-text-dim font-medium leading-relaxed max-w-md">{edu.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills & Tech Stack */}
            <section className="px-6 md:px-12 lg:px-24 mb-60">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 animate-fade-up">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-accent/20 shadow-lg mb-8">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Mastery Toolkit</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                            SKILLS &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2">TECH STACK.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <FaLayerGroup />,
                                title: "UI/UX Design",
                                skills: ["Wireframing", "Prototyping", "User Research"],
                                color: "from-cyan-500 to-blue-600",
                                glow: "rgba(6,182,212,0.15)"
                            },
                            {
                                icon: <FaVideo />,
                                title: "Motion Graphics",
                                skills: ["Video Editing", "3D Animation", "VFX"],
                                color: "from-violet-500 to-purple-700",
                                glow: "rgba(139,92,246,0.15)"
                            },
                            {
                                icon: <FaCode />,
                                title: "Web Development",
                                skills: ["Next.js", "TypeScript", "Tailwind"],
                                color: "from-emerald-400 to-teal-600",
                                glow: "rgba(52,211,153,0.15)"
                            },
                            {
                                icon: <FaPaintBrush />,
                                title: "Branding",
                                skills: ["Logo Design", "Style Guides", "Typography"],
                                color: "from-rose-500 to-pink-600",
                                glow: "rgba(244,63,94,0.15)"
                            }
                        ].map((skill, i) => (
                            <div
                                key={i}
                                className="glass group p-10 rounded-[48px] border border-white/5 hover:border-white/10 transition-all duration-700 hover:-translate-y-6 hover:shadow-2xl animate-fade-up relative overflow-hidden"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {/* Card glow bg */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[48px] pointer-events-none"
                                    style={{ background: `radial-gradient(circle at 50% 0%, ${skill.glow}, transparent 70%)` }}
                                ></div>

                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-10 text-white text-xl shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                    {skill.icon}
                                </div>

                                <h4 className="text-xl font-black uppercase tracking-tighter mb-6 text-foreground relative z-10">{skill.title}</h4>
                                <ul className="space-y-3">
                                    {skill.skills.map((s, j) => (
                                        <li key={j} className="text-[10px] text-text-dim font-black uppercase tracking-[0.2em] flex items-center gap-3 relative z-10">
                                            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${skill.color} shrink-0`}></span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Tech Stack Icons */}
                    <div className="mt-24 glass rounded-[48px] border border-white/5 p-10 md:p-16">
                        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-text-dim mb-12">Tools I Work With</p>
                        <div className="flex flex-wrap justify-center gap-12">
                            {[
                                { Icon: SiAdobephotoshop, label: "Photoshop", color: "#31A8FF" },
                                { Icon: SiAdobepremierepro, label: "Premiere", color: "#9999FF" },
                                { Icon: SiAdobeaftereffects, label: "After FX", color: "#9999FF" },
                                { Icon: SiFigma, label: "Figma", color: "#F24E1E" },
                                { Icon: SiBlender, label: "Blender", color: "#E87D0D" },
                                { Icon: SiAdobexd, label: "Adobe XD", color: "#FF61F6" },
                                { Icon: SiCanva, label: "Canva", color: "#00C4CC" },
                                { Icon: SiDavinciresolve, label: "DaVinci", color: "#F4A261" },
                            ].map(({ Icon, label, color }, i) => (
                                <div key={i} className="group flex flex-col items-center gap-3 cursor-default">
                                    <div
                                        className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-white/20 group-hover:-translate-y-2 transition-all duration-500 shadow-lg"
                                        style={{ '--tw-shadow-color': color } as any}
                                    >
                                        <Icon size={28} style={{ color }} className="group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-text-dim group-hover:text-foreground transition-colors">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Software Mastery Section */}
            <section className="px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto glass rounded-[80px] p-16 md:p-24 border border-white/5 relative overflow-hidden shadow-2xl animate-fade-up">
                    {/* Glow orbs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-2/10 blur-[100px] rounded-full -ml-10 -mb-10 pointer-events-none"></div>

                    <div className="flex flex-col lg:flex-row gap-24 items-center">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-text-dim mb-8">Workflow Excellence</div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-8">
                                Tools &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2 italic">Software.</span>
                            </h2>
                            <p className="text-text-dim text-lg font-medium leading-relaxed mb-12">
                                I leverage industry-standard software to bring complex creative visions to life. From high-fidelity design to cinematic post-production, I optimize every stage of the creative cycle.
                            </p>
                            <Link href="/portfolio" className="btn-primary group px-12 inline-flex items-center gap-4">
                                VIEW MY WORKFLOW <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            {[
                                { name: "Adobe Creative Cloud", icon: <SiAdobephotoshop />, desc: "Primary Visual Suite", color: "#31A8FF" },
                                { name: "Figma", icon: <SiFigma />, desc: "UI/UX & Prototyping", color: "#F24E1E" },
                                { name: "Blender", icon: <SiBlender />, desc: "3D Modeling & Rendering", color: "#E87D0D" },
                                { name: "After Effects", icon: <SiAdobeaftereffects />, desc: "Cinematic Motion", color: "#9999FF" }
                            ].map((tool, i) => (
                                <div key={i} className="glass border border-white/5 p-10 rounded-[40px] hover:border-white/15 transition-all duration-500 cursor-default group flex flex-col items-center text-center relative overflow-hidden">
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                        style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color}18, transparent 65%)` }}
                                    ></div>
                                    <div className="text-5xl mb-8 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1" style={{ color: tool.color }}>
                                        {tool.icon}
                                    </div>
                                    <h5 className="font-black text-foreground mb-2 uppercase tracking-tighter text-base">{tool.name}</h5>
                                    <p className="text-[10px] text-text-dim uppercase font-black tracking-[0.2em] italic">{tool.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
