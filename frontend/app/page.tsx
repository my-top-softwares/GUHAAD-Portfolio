"use client";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaMousePointer, FaAward, FaUsers, FaRocket, FaGithub, FaDribbble, FaLinkedinIn, FaBehance } from "react-icons/fa";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import GallerySection from "@/components/GallerySection";

export default function Home() {

    return (
        <div className="relative">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-fu    ll blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-32 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 w-full relative z-10">
                    {/* Hero Content */}
                    <div className="lg:w-3/5 text-center lg:text-left">
                        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full glass mb-8 animate-bounce transition-all hover:border-accent/40">
                            <span className="w-2 h-2 bg-accent rounded-full animate-ping"></span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Available for New Projects</span>
                        </div>

                        <h1 className="text-6xl font-bold ">
                            CRAFTING <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2">VISIONS</span> INTO <br />
                            REALITY.
                        </h1>

                        <p className="text-text-dim max-w-xl mb-8 text-base md:text-lg leading-relaxed font-normal mx-auto lg:mx-0">
                            I am <span className="text-foreground font-bold">Mohamud</span>, a Senior <span className="text-accent italic">Multimedia Specialist</span> specialized in high-end video production, immersive motion design, and professional voice narration.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start">
                            <Link href="/portfolio" className="btn-primary flex items-center gap-4 group">
                                EXPLORE CREATIONS
                                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </Link>

                            <div className="flex items-center gap-4">
                                {[FaBehance, FaDribbble, FaLinkedinIn].map((Icon, i) => (
                                    <a key={i} href="#" className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:border-accent hover:text-accent transition-all hover:-translate-y-1 text-foreground">
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hero Image Group */}
                    <div className="w-full max-w-md lg:max-w-none lg:w-2/5 relative mx-auto lg:mx-0">
                        <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
                            {/* Rotating Background Glow */}
                            <div className=" bg-gradient-to-tr from-accent to-accent-2 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                            
                            {/* Circular Image Container */}
                            <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-tr from-accent via-accent-2 to-accent ">
                                <div className="w-full h-full rounded-full overflow-hidden bg-background p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden relative group">
                                        <Image
                                            src="/Image.jpeg"
                                            alt="Mohamud - Multimedia Specialist"
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent mix-blend-overlay"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badges */}
                            <div className="absolute -left-6 top-1/4 glass px-6 py-4 rounded-2xl animate-float shadow-2xl border border-accent/20">
                                <h4 className="text-3xl font-black text-accent">50+</h4>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-text-dim">Projects</p>
                            </div>

                            <div className="absolute -right-10 bottom-1/4 glass px-6 py-4 rounded-2xl animate-float [animation-delay:2s] shadow-2xl border border-accent-2/20">
                                <div className="flex -space-x-3 mb-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary overflow-hidden">
                                            <Image src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="client" width={32} height={32} />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-text-dim">Global Clients</p>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full border border-white/5 whitespace-nowrap">
                                <span className="text-[10px] font-bold tracking-tighter text-accent uppercase">Top Rated Specialist</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h4 className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-3">My Expertise</h4>
                            <h2 className="text-6xl font-bold ">
                                What i do
                            </h2>
                        </div>
                        <p className="text-text-dim max-w-sm mb-4 font-medium leading-relaxed text-base">
                            Transforming raw concepts into cinematic experiences using industry-leading tools and narrative techniques.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Web Design",
                                icon: FaUsers,
                                desc: "Professional web design and digital experiences built to convert.",
                                gradient: "from-cyan-500 to-blue-600",
                                glow: "rgba(6,182,212,0.12)"
                            },
                            {
                                title: "Video Editing",
                                icon: FaRocket,
                                desc: "Seamless storytelling with high-end color grading and sound design.",
                                gradient: "from-violet-500 to-purple-700",
                                glow: "rgba(139,92,246,0.12)"
                            },
                            {
                                title: "Motion Design",
                                icon: FaMousePointer,
                                desc: "Dynamic animations that bring static graphics to life with fluid motion.",
                                gradient: "from-emerald-400 to-teal-600",
                                glow: "rgba(52,211,153,0.12)"
                            },
                            {
                                title: "Graphic Design",
                                icon: FaAward,
                                desc: "Powerful visual identities and marketing assets that stand out.",
                                gradient: "from-rose-500 to-pink-600",
                                glow: "rgba(244,63,94,0.12)"
                            }
                        ].map((s, i) => (
                            <div
                                key={i}
                                className="group relative p-10 rounded-[40px] border border-foreground/8 bg-card-bg shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-5 overflow-hidden"
                                style={{
                                    boxShadow: `0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.08)`
                                }}
                            >
                                {/* Hover glow bg */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[40px]"
                                    style={{ background: `radial-gradient(circle at 30% 20%, ${s.glow}, transparent 65%)` }}
                                ></div>

                                {/* Gradient top-edge on hover */}
                                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    <s.icon className="text-white text-2xl" />
                                </div>

                                <h3 className="text-lg font-black mb-3 tracking-tight uppercase leading-snug text-foreground relative z-10">{s.title}</h3>
                                <p className="text-text-dim text-sm leading-relaxed mb-8 font-normal relative z-10">{s.desc}</p>

                                <Link
                                    href="/portfolio"
                                    className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] px-5 py-2.5 rounded-full bg-gradient-to-r ${s.gradient} text-white shadow-lg group-hover:gap-4 group-hover:pr-6 transition-all duration-500 relative z-10`}
                                >
                                    View Projects <FaArrowRight className="text-[8px]" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <TestimonialsSlider />

            {/* Gallery Section */}
            <GallerySection />

            {/* CTA Section */}
            <section className="py-20 md:py-40 px-6">
                <div className="max-w-7xl mx-auto glass rounded-[60px] md:rounded-[80px] p-12 md:p-24 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-accent/5 -z-10 group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-12 leading-[0.8]">
                            LET&apos;S <br /> CREATE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2 italic">IMPACT.</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <Link href="/contact" className="btn-primary px-12 py-6 rounded-2xl text-xs font-bold uppercase tracking-wide transition-all hover:px-16">START A PROJECT</Link>
                            <a href="mailto:guhaadcreatives@gmail.com" className="text-base font-bold uppercase tracking-wide text-text-dim hover:text-foreground transition-colors border-b border-foreground/10 hover:border-accent pb-1">guhaadcreatives@gmail.com</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
