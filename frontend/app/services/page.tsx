"use client"

import { useState, useEffect } from "react"

import { motion } from "framer-motion"
import { Palette, Layers, Video, Mic, Check, Monitor, PenTool, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import API from "@/api/axios"

interface Service {
    _id: string
    title: string
    description: string
    price: number
    features: string[]
    icon: string
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await API.get("/services")
                setServices(data)
            } catch (error) {
                console.error("Error fetching services:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchServices()
    }, [])

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'ux': return <Palette className="w-10 h-10" />;
            case 'app': return <Monitor className="w-10 h-10" />;
            case 'web': return <Video className="w-10 h-10" />;
            case 'ui': return <PenTool className="w-10 h-10" />;
            case 'system': return <Layers className="w-10 h-10" />;
            case 'wireframe': return <Mic className="w-10 h-10" />;
            default: return <Palette className="w-10 h-10" />;
        }
    }

    const handleOrderWhatsApp = (service: Service) => {
        const message = `Hi, I want to order the *${service.title}* package ($${service.price})`
        const whatsappUrl = `https://wa.me/252618240346?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }
    return (
        <div className="min-h-screen bg-background pt-20 mt-16">

            {/* Services Grid */}
            <div className="container mx-auto px-4 md:px-8 mb-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : services.length > 0 ? (
                        services.map((service, index) => (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group"
                            >
                                <div className="h-full p-6 md:p-8 rounded-[2rem] bg-background shadow-neu hover:shadow-neu-pressed transition-all duration-500 flex flex-col items-center text-center">
                                    <div className="mb-6 p-5 rounded-full bg-background shadow-neu text-primary group-hover:scale-110 transition-transform duration-300">
                                        {getIcon(service.icon)}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-foreground leading-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted-foreground text-base leading-relaxed line-clamp-4">
                                        {service.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No services available.
                        </div>
                    )}
                </div>
            </div>

            {/* Pricing Section */}
            <div className="container mx-auto px-4 md:px-8 mb-32">
                <div className="text-center mb-16">
                    <span className="uppercase text-primary text-xs font-bold tracking-widest">Pricing</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">Packages & Pricing</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-10">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : services.length > 0 ? (
                        services.map((pkg, index) => (
                            <motion.div
                                key={pkg._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="items-center text-center h-full border-none shadow-neu hover:shadow-neu-pressed transition-all duration-300 bg-background">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold text-muted-foreground uppercase tracking-wider">{pkg.title} PACKAGE</CardTitle>
                                        <div className="text-4xl font-bold text-primary py-4">${pkg.price}</div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-4 text-left inline-block">
                                            {pkg.features?.map((feat, i) => (
                                                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                                    <Check className="w-5 h-5 text-primary" />
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter className="justify-center pb-8">
                                        <Button
                                            onClick={() => handleOrderWhatsApp(pkg)}
                                            className="bg-background text-primary border border-primary/20 hover:bg-primary hover:text-white shadow-neu-active w-full py-6 text-lg rounded-xl transition-all"
                                        >
                                            ORDER NOW
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No packages available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
