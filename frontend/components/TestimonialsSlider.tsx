"use client";
import { useState, useEffect } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import API from "@/utils/api";

interface Testimonial {
    _id: string;
    name: string;
    position: string;
    company: string;
    message: string;
    rating: number;
    image: string;
}

export default function TestimonialsSlider() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await API.get("/testimonials");
                setTestimonials(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (testimonials.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5500);
        return () => clearInterval(interval);
    }, [testimonials]);

    if (loading || testimonials.length === 0) return null;

    const getInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const prev = () => setActiveIndex((activeIndex - 1 + testimonials.length) % testimonials.length);
    const next = () => setActiveIndex((activeIndex + 1) % testimonials.length);

    return (
        <section className="py-40 px-6 md:px-12 lg:px-24 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left — heading & controls */}
                    <div className="animate-fade-up">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border border-accent/20 mb-8">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">Testimonials</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-normal mb-8 e">
                            WHAT THEY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2 italic">SAY</span> <br />
                            ABOUT ME.
                        </h2>

                        <p className="text-text-dim max-w-sm mb-14 text-base font-medium leading-relaxed">
                            Trusted by industry leaders worldwide to deliver excellence across digital platforms.
                        </p>

                        {/* Nav */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={prev}
                                className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-white/5 hover:border-accent/40 hover:text-accent transition-all duration-300 hover:-translate-x-1"
                            >
                                <FiChevronLeft size={22} />
                            </button>
                            <button
                                onClick={next}
                                className="w-14 h-14 bg-gradient-to-br from-accent to-accent-2 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20 hover:scale-105 transition-all duration-300"
                            >
                                <FiChevronRight size={22} />
                            </button>
                            <div className="flex items-center gap-2 ml-4">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`rounded-full transition-all duration-500 ${
                                            i === activeIndex
                                                ? "w-8 h-2 bg-gradient-to-r from-accent to-accent-2"
                                                : "w-2 h-2 bg-foreground/15 hover:bg-foreground/30"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — sliding card */}
                    <div className="relative h-[420px] flex items-center">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial._id}
                                className={`absolute inset-0 p-10 md:p-14 rounded-[56px] flex flex-col justify-between transition-all duration-1000 ${
                                    index === activeIndex
                                        ? "opacity-100 translate-x-0 scale-100 z-10"
                                        : index < activeIndex
                                        ? "opacity-0 -translate-x-16 scale-95 pointer-events-none"
                                        : "opacity-0 translate-x-16 scale-95 pointer-events-none"
                                }`}
                                style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--glass-border)",
                                    boxShadow: "0 24px 60px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.06)"
                                }}
                            >
                                <FaQuoteLeft className="text-accent/10 text-8xl absolute top-10 right-10" />

                                <div className="flex gap-1.5 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`text-lg ${
                                                i < (testimonial.rating || 5)
                                                    ? "text-amber-400"
                                                    : "text-foreground/10"
                                            }`}
                                        />
                                    ))}
                                </div>

                                <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground/80 italic flex-grow mb-8">
                                    &ldquo;{testimonial.message}&rdquo;
                                </p>

                                <div className="flex items-center gap-5 pt-8 border-t border-foreground/5">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                        {testimonial.image ? (
                                            <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                        ) : (
                                            getInitials(testimonial.name)
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="text-base font-bold text-foreground tracking-tight">{testimonial.name}</h5>
                                        <p className="text-sm font-medium text-text-dim mt-0.5">
                                            {testimonial.position}
                                            {testimonial.company && <span className="text-accent"> · {testimonial.company}</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
