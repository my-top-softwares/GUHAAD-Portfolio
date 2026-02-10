"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Facebook, Instagram, Linkedin, Figma, Code2, Database, Star, ArrowRight, CheckCircle2, Video, PenTool, Layers, Mic, Clapperboard, Monitor, Palette } from "lucide-react"
import Link from "next/link"
import React from "react"
import { Button } from "@/components/ui/button"
import { PortfolioSection } from "@/components/PortfolioSection"
import API from "@/api/axios"
const MyImage = "/perfect.png"

interface Service {
  _id: string
  title: string
  description: string
  icon: string
}

interface Testimonial {
  _id: string
  name: string
  position?: string
  company?: string
  message: string
  rating: number
  image?: string
  createdAt: string
}


export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, testimonialsRes] = await Promise.all([
          API.get("/services"),
          API.get("/testimonials")
        ])
        setServices(servicesRes.data)
        setTestimonials(testimonialsRes.data)
      } catch (error) {
        console.error("Error fetching homepage data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ux': return <Palette className="w-8 h-8" />;
      case 'app': return <Monitor className="w-8 h-8" />;
      case 'web': return <Video className="w-8 h-8" />;
      case 'video-production': return <Clapperboard className="w-8 h-8" />;
      case 'ui': return <PenTool className="w-8 h-8" />;
      case 'system': return <Layers className="w-8 h-8" />;
      case 'wireframe': return <Mic className="w-8 h-8" />;
      default: return <Code2 className="w-8 h-8" />;
    }
  }

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#" },
    { icon: <Instagram className="w-5 h-5" />, href: "#" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#" },
  ]

  const skills = [
    { icon: <Video className="w-5 h-5" />, name: "Premiere Pro" },
    { icon: <PenTool className="w-5 h-5" />, name: "Photoshop" },
    { icon: <Layers className="w-5 h-5" />, name: "After Effects" },
  ]

  return (
    <div className="relative min-h-screen pt-32 pb-10 overflow-hidden bg-background">
      {/* Cool Animated Background Lines */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />

        {/* Moving Lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent w-full"
            style={{ top: `${(i + 1) * 20}%` }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent h-full"
            style={{ left: `${(i + 1) * 20}%` }}
            animate={{
              y: ["-100%", "100%"],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">

        {/* HERO SECTION - REDESIGNED */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24 mb-32 min-h-[85vh] justify-center">
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-20">
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="uppercase tracking-[0.3em] text-sm font-bold text-[#ff014f] bg-[#ff014f]/10 px-4 py-2 rounded-full inline-block mb-2 border border-[#ff014f]/20 backdrop-blur-sm"
            >
              Welcome to my creative world
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-foreground"
            >
              Hi, I'm <span className="text-[#ff014f] relative inline-block">
                Guhaad
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                  className="absolute w-full h-4 -bottom-2 left-0 text-[#ff014f] opacity-60"
                  viewBox="0 0 200 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.00025 6.99997C25.7501 9.75 84.9 6.75 105 7C140 7.5 175 6 197 2.25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </span> <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground block mt-6 tracking-normal"
              >
                Professional Multimedia👋
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light"
            >
              I use animation and design as a third dimension to simplify experiences. I don't just add motion to spruce things up; I create visual narratives that <span className="text-foreground font-semibold border-b border-primary/50">captivate & convert</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col md:flex-row gap-12 justify-center lg:justify-start pt-8 items-center lg:items-start"
            >
              <div className="space-y-4">
                <span className="uppercase text-xs font-bold tracking-widest text-muted-foreground block text-center lg:text-left">Connect with me</span>
                <div className="flex gap-4">
                  {socialLinks.map((item, i) => (
                    <Link key={i} href={item.href}>
                      <motion.div
                        whileHover={{ y: -5, scale: 1.1, boxShadow: "0 10px 30px -10px rgba(var(--primary-rgb), 0.5)" }} // Fallback shadow if var not set
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted/50 shadow-neu flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer border border-white/5"
                      >
                        {item.icon}
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="w-px h-20 bg-border/50 hidden md:block" />

              <div className="space-y-4">
                <span className="uppercase text-xs font-bold tracking-widest text-muted-foreground block text-center lg:text-left">Best skills</span>
                <div className="flex gap-4">
                  {skills.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5, scale: 1.1 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted/50 shadow-neu flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 cursor-default border border-white/5"
                      title={item.name}
                    >
                      {item.icon}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Image - Premium Look (Redesigned) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            className="flex-1 relative w-full flex justify-center lg:justify-end z-10"
          >
            <div className="relative w-full max-w-[500px] aspect-[4/5]">
              {/* Main Card Frame */}
              <div className="relative w-full h-full bg-white dark:bg-[#1e2024] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] p-4 rotate-3 border border-white/20 transition-transform duration-500 hover:rotate-0">
                <div className="w-full h-full bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] overflow-hidden relative group">
                  <img
                    src={MyImage}
                    alt="Guhaad Portfolio"
                    className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:scale-105"
                  />

                  {/* Floating Badge */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-[#1e2024]/90 backdrop-blur-md shadow-xl p-4 rounded-2xl flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#ff014f] flex items-center justify-center text-white shadow-lg shadow-pink-500/30 shrink-0">
                      <ArrowRight className="w-5 h-5 -rotate-45" />
                    </div>
                    <div>
                      <p className="font-extrabold text-2xl leading-none text-foreground">150+</p>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mt-1">Projects Done</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-10 -right-10 w-24 h-24 bg-[#ff014f]/10 rounded-full blur-2xl" />
              <div className="absolute -z-10 -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Services Section (New Dark/Gradient Style) */}
        <div className="mt-32 pt-20 pb-10">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-medium tracking-widest uppercase">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold">My Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive digital solutions tailored to your business needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : services.length > 0 ? (
              services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-8 rounded-2xl bg-[#212428] dark:bg-[#1e2024] border border-white/5 overflow-hidden hover:-translate-y-2 transition-transform duration-500"
                >
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-lg shadow-primary/10">
                      {getIcon(service.icon)}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-20">
                No services found.
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Section */}
        <PortfolioSection />

        {/* Who We Are / Real People Section */}
        <div className="mt-32 pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Image Side */}
            <div className="flex-1 relative">
              {/* Blob Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[morph_8s_ease-in-out_infinite] -z-10" />

              <div className="relative rounded-[50px_20px_50px_20px] overflow-hidden shadow-2xl border-4 border-white dark:border-[#212428]">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60"
                  alt="Team Meeting"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Experience Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                className="absolute -top-6 -left-6 md:top-10 md:-left-10 w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-[#1e2024] rounded-full shadow-xl flex flex-col items-center justify-center text-center p-4 border-4 border-primary/20"
              >
                <span className="text-3xl md:text-4xl font-bold text-primary">25+</span>
                <span className="text-xs md:text-sm font-medium text-muted-foreground">Years of Experience</span>
              </motion.div>
            </div>

            {/* Right Content Side */}
            <div className="flex-1 space-y-8 relative">
              {/* Decorative Curved Arrow */}
              <div className="absolute -top-10 -left-10 hidden lg:block opacity-30 text-primary">
                <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
                  <path d="M10 50 C 30 10, 70 10, 90 30" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#arrow)" />
                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>
              </div>

              <div>
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Who We Are</span>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Real people delivering <br /> real results.
                </h2>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                Phasellus ornare consequent el ligula facilisis habitasse pretium sollicitudin natoque. Omare parturient hendrerit vulputate mi potenti per justo. Commodo eros amet ipsum himenaeos tincidunt.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Marketing Agency</h4>
                    <p className="text-sm text-muted-foreground">Ligula mattis mollis felis euismod diam convallis facilisi quam efficitur senectus luctus.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">SEO Services</h4>
                    <p className="text-sm text-muted-foreground">Ligula mattis mollis felis euismod diam convallis facilisi quam efficitur senectus luctus.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Reasons To Choose Us Section */}
        <div className="mt-32 pt-10 pb-20">
          <div className="text-center mb-20 pointer-events-none">
            <h2 className="text-3xl md:text-5xl font-bold">3 Reasons To Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
            {[
              { title: "24/7 Support", desc: "Lorem ipsum is simply dummy text of the printing and typesetting industry.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg> },
              { title: "Top Guide", desc: "Lorem ipsum is simply dummy text of the printing and typesetting industry.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
              { title: "Best Course", desc: "Lorem ipsum is simply dummy text of the printing and typesetting industry.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><path d="M10 8l5 3-5 3v-6z" /></svg> }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8 bg-white dark:bg-[#1e2024] rounded-[2rem] shadow-xl group hover:-translate-y-2 transition-transform duration-300"
              >
                {/* Custom Corner Borders (Bracket Effect) */}
                <div className="absolute top-0 right-0 w-24 h-24 border-t-[6px] border-r-[6px] border-[#212428] dark:border-white rounded-tr-[2rem] transition-colors" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[6px] border-l-[6px] border-[#212428] dark:border-white rounded-bl-[2rem] transition-colors" />

                <div className="relative z-10 flex flex-col items-start h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                    {item.desc}
                  </p>
                  <button className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all hover:text-primary">
                    Read More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Testimonial Slider Section */}
      <div className="mt-32 pb-20 border-t border-border/40 pt-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Read reviews, <br /> ride with confidence.</h2>
            <div className="flex items-center justify-center gap-4 text-sm font-medium">
              <span className="text-lg font-bold">4.2/5</span>
              <div className="flex items-center gap-1 text-[#00b67a]">
                <Star className="w-6 h-6 fill-current" />
                <span className="text-lg font-bold text-foreground">Trustpilot</span>
              </div>
              <span className="text-muted-foreground">Based on 5210 reviews</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Header Block */}
            <div className="lg:w-1/3 p-8">
              <div className="text-6xl text-gray-300 md:mb-6">❝</div>
              <h3 className="text-4xl font-bold leading-tight mb-8">What our <br /> customers are <br /> saying</h3>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full border border-gray-300 hover:border-black dark:hover:border-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <button className="w-12 h-12 rounded-full border border-gray-300 hover:border-black dark:hover:border-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Horizontal Slider (Framer Motion) */}
            <div className="lg:w-2/3 overflow-hidden cursor-grab active:cursor-grabbing">
              <motion.div
                className="flex gap-6"
                drag="x"
                dragConstraints={{ right: 0, left: -600 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center w-full py-20">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : testimonials.length > 0 ? (
                  testimonials.map((review, i) => (
                    <div key={review._id} className="min-w-[320px] md:min-w-[350px] bg-white dark:bg-[#1e2024] p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                      <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed min-h-[120px]">
                        {review.message}
                      </p>
                      <div className="flex gap-1 text-[#00b67a] mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        {review.image ? (
                          <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {review.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm">{review.name}</h4>
                          <span className="text-xs text-muted-foreground">{review.position || review.company}</span>
                        </div>
                      </div>
                    </div>

                  ))
                ) : (
                  <div className="flex items-center justify-center w-full py-20 text-muted-foreground">
                    No testimonials found.
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
