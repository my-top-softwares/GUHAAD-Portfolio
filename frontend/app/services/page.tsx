"use client"

import { motion } from "framer-motion"
import { Palette, Layers, Video, Mic, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const services = [
    {
        icon: <Palette className="w-10 h-10 text-primary" />,
        title: "Graphic Design",
        description: "Creative designs for Social Media, Posters, and wide-ranging Marketing Creatives that capture attention."
    },
    {
        icon: <Layers className="w-10 h-10 text-primary" />,
        title: "Branding & Identity",
        description: "Complete Brand Systems, Logos, and Guidelines to establish a strong and memorable market presence."
    },
    {
        icon: <Video className="w-10 h-10 text-primary" />,
        title: "Motion Graphics & Video",
        description: "High-quality video production and motion graphics that bring your stories to life."
    },
    {
        icon: <Mic className="w-10 h-10 text-primary" />,
        title: "Content & Voice Over",
        description: "Professional Content Writing and Voice Over Production to convey your message clearly."
    },
]

const pricing = [
    {
        name: "Starter Package",
        price: "$120",
        features: ["Social Media Kit", "5 Revisions", "Standard Support"]
    },
    {
        name: "Professional Package",
        price: "$300",
        features: ["Complete Branding", "Unlimited Revisions", "Priority Support", "Logo Design"]
    },
    {
        name: "Business Package",
        price: "$600",
        features: ["Full Brand Identity", "Marketing Collateral", "24/7 Support", "Source Files"]
    },
    {
        name: "Basic Animation",
        price: "$150",
        features: ["30s Animation", "Background Music", "HD 1080p Export"]
    },
    {
        name: "Advanced Animation",
        price: "$400",
        features: ["60s+ Animation", "Voice Over", "4K Export", "Scriptwriting"]
    },
]

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background pt-20">
            {/* Header */}
            <div className="py-12 md:py-20 text-center space-y-2 relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="uppercase text-primary text-xs font-bold tracking-widest">My Expertise</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-2">What I Do</h1>
                    <div className="flex justify-center gap-2 text-sm text-muted-foreground mt-4">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="text-primary">{'>'}</span>
                        <span className="text-primary font-medium">Services</span>
                    </div>
                </motion.div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-4 md:px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group"
                        >
                            <div className="h-full p-8 md:p-10 rounded-2xl bg-background shadow-neu hover:shadow-neu-pressed transition-all duration-300">
                                <div className="mb-6 p-4 w-fit rounded-full bg-background shadow-neu text-primary group-hover:scale-110 transition-transform duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-foreground">
                                    {service.title}
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <div className="container mx-auto px-4 md:px-8 mb-32">
                <div className="text-center mb-16">
                    <span className="uppercase text-primary text-xs font-bold tracking-widest">Pricing</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">Packages & Pricing</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {pricing.map((pkg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="items-center text-center h-full border-none shadow-neu hover:shadow-neu-pressed transition-all duration-300 bg-background">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-muted-foreground uppercase tracking-wider">{pkg.name}</CardTitle>
                                    <div className="text-4xl font-bold text-primary py-4">{pkg.price}</div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4 text-left inline-block">
                                        {pkg.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                                <Check className="w-5 h-5 text-primary" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="justify-center pb-8">
                                    <Button className="bg-background text-primary border border-primary/20 hover:bg-primary hover:text-white shadow-neu-active w-full py-6 text-lg rounded-xl transition-all">
                                        ORDER NOW
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
