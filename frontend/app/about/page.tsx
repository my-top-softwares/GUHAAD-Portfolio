"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Figma, Video, PenTool, Mic, Clapperboard, Layers, Briefcase, GraduationCap, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<"experience" | "education">("experience")

    const skills = [
        { icon: <PenTool className="w-6 h-6" />, name: "Graphic Designer", percent: 95 },
        { icon: <Layers className="w-6 h-6" />, name: "Motion Graphic", percent: 90 },
        { icon: <Video className="w-6 h-6" />, name: "Video Editor", percent: 92 },
        { icon: <Figma className="w-6 h-6" />, name: "Content Writer", percent: 85 },
        { icon: <Mic className="w-6 h-6" />, name: "Voice Over", percent: 80 },
        { icon: <Clapperboard className="w-6 h-6" />, name: "Multimedia", percent: 88 },
    ]

    const experience = [
        {
            role: "Senior Creative Visual Producer",
            company: "Deero Advert",
            period: "2021 - Present",
            description: "Leading creative visual production and managing branding & video projects. Overseeing a team of designers and editors to deliver high-quality content."
        },
        {
            role: "CEO & Founder",
            company: "Guhaad Creatives & Advertisement Agency",
            period: "2019 - Present",
            description: "Founded and currently managing a creative agency focused on digital marketing, branding, and multimedia production for various clients."
        },
        {
            role: "Multimedia Specialist",
            company: "Freelance",
            period: "2018 - 2020",
            description: "Worked with multiple clients to produce engaging video content, motion graphics, and comprehensive brand identity packages."
        }
    ]

    // Placeholder Education Data
    const education = [
        {
            degree: "Bachelor of Multimedia Arts",
            school: "University of Creative Arts",
            period: "2015 - 2019",
            description: "Specialized in visual communication, digital media, and interactive design."
        },
        {
            degree: "Certified Digital Marketer",
            school: "Google Digital Garage",
            period: "2020",
            description: "Comprehensive certification in online marketing strategies, SEO, and analytics."
        }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white pt-20">
            {/* Header / Breadcrumb */}
            <div className="py-12 md:py-20 text-center space-y-2 relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">About Me</h1>
                    <div className="flex justify-center gap-2 text-sm text-muted-foreground mt-4">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="text-primary">{'>'}</span>
                        <span className="text-primary font-medium">About Me</span>
                    </div>
                </motion.div>
                {/* Decorative Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
                </div>
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-4 md:px-8 mb-32">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 relative"
                    >
                        <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] mx-auto">
                            <div className="absolute inset-0 bg-background shadow-neu rounded-full z-10" />
                            <div className="relative z-20 w-full h-full rounded-full border-8 border-background overflow-hidden shadow-neu-pressed">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60"
                                    alt="Mohamud Mohamed Adan"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content */}
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="inline-block px-4 py-1 rounded-full shadow-neu text-xs font-bold text-primary uppercase tracking-widest mb-4">
                                Visit my portfolio & Hire me
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                                Mohamud Mohamed Adan <br />
                                <span className="text-primary">(Guhaad)</span>
                            </h2>
                            <h3 className="text-xl md:text-2xl font-medium text-muted-foreground mb-6">
                                Senior Creative Visual Producer & <br /> Multimedia Specialist
                            </h3>
                            <p className="text-muted-foreground leading-relaxed max-w-xl text-lg">
                                I am Mohamud Mohamed Adan (Guhaad), a Multimedia Specialist with over 4 years of professional experience in the creative industry. I currently work as a Senior Creative Visual Producer at Deero Advert and I am also the CEO & Founder of Guhaad Creatives & Advertisement Agency.
                            </p>

                            <div className="flex flex-wrap gap-4 mt-8">
                                <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/25 px-8 py-6 text-lg transition-transform hover:-translate-y-1">
                                    Contact Me
                                </Button>
                                <Button variant="ghost" className="shadow-neu bg-background text-foreground hover:text-primary rounded-lg px-8 py-6 text-lg">
                                    Download Resume <Download className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="container mx-auto px-4 md:px-8 mb-32">
                <div className="text-center mb-16">
                    <span className="text-primary uppercase tracking-widest text-sm font-bold">Expertise</span>
                    <h2 className="text-3xl md:text-5xl font-bold mt-2">My Skills & <span className="text-primary">Roles</span></h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-background rounded-2xl p-8 shadow-neu hover:shadow-neu-pressed transition-all duration-300 group cursor-default"
                        >
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="p-4 rounded-full bg-background shadow-neu text-primary group-hover:scale-110 transition-transform duration-300">
                                    {skill.icon}
                                </div>
                                <h3 className="font-bold text-lg md:text-xl">{skill.name}</h3>
                                <div className="w-full bg-muted h-3 rounded-full overflow-hidden relative shadow-inner">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-destructive rounded-full"
                                        style={{ width: `${skill.percent}%` }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground">{skill.percent}%</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Experience & Education Section */}
            <div className="container mx-auto px-4 md:px-8 mb-32">
                <div className="text-center mb-16">
                    <span className="text-primary uppercase tracking-widest text-sm font-bold">Resume</span>
                    <h2 className="text-3xl md:text-5xl font-bold mt-2">Experience & <span className="text-primary">Education</span></h2>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="flex space-x-1 p-1 bg-background shadow-neu rounded-xl">
                        {["experience", "education"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as "experience" | "education")}
                                className={`
                                    relative px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300
                                    ${activeTab === tab
                                        ? "text-primary shadow-neu-pressed"
                                        : "text-muted-foreground hover:text-primary"
                                    }
                                `}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-transparent rounded-lg"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === "experience" ? (
                            <motion.div
                                key="experience"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                                    <div className="p-3 bg-background shadow-neu rounded-full text-primary">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Job Experience</h3>
                                </div>
                                <div className="space-y-8 border-l-2 border-primary/20 pl-8 ml-4 md:ml-0">
                                    {experience.map((job, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative group"
                                        >
                                            <div className="absolute -left-[41px] top-0 w-5 h-5 bg-background border-4 border-primary rounded-full group-hover:scale-125 transition-transform duration-300" />
                                            <div className="p-8 bg-background shadow-neu rounded-2xl hover:shadow-neu-pressed transition-all duration-300">
                                                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{job.role}</h4>
                                                        <span className="text-sm text-primary font-medium mt-1 block">{job.company}</span>
                                                    </div>
                                                    <span className="px-3 py-1 bg-background shadow-neu rounded text-xs font-bold text-muted-foreground whitespace-nowrap">{job.period}</span>
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {job.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="education"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                                    <div className="p-3 bg-background shadow-neu rounded-full text-primary">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Education Quality</h3>
                                </div>
                                <div className="space-y-8 border-l-2 border-primary/20 pl-8 ml-4 md:ml-0">
                                    {education.map((edu, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative group"
                                        >
                                            <div className="absolute -left-[41px] top-0 w-5 h-5 bg-background border-4 border-primary rounded-full group-hover:scale-125 transition-transform duration-300" />
                                            <div className="p-8 bg-background shadow-neu rounded-2xl hover:shadow-neu-pressed transition-all duration-300">
                                                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{edu.degree}</h4>
                                                        <span className="text-sm text-primary font-medium mt-1 block">{edu.school}</span>
                                                    </div>
                                                    <span className="px-3 py-1 bg-background shadow-neu rounded text-xs font-bold text-muted-foreground whitespace-nowrap">{edu.period}</span>
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {edu.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
