"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, Facebook, Twitter, Instagram, Linkedin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import API from "@/api/axios"

export default function ContactPage() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            await API.post("/messages", formData)
            alert("Message sent successfully!")
            setFormData({
                name: "",
                phone: "",
                email: "",
                subject: "",
                message: ""
            })
        } catch (error: any) {
            console.error("Error sending message:", error)
            alert(error.response?.data?.message || "Failed to send message. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pt-20">
            {/* Header */}
            <div className="py-12 md:py-20 text-center space-y-2 relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="uppercase text-primary text-xs font-bold tracking-widest">Contact</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-2">Contact With Me</h1>
                    <div className="flex justify-center gap-2 text-sm text-muted-foreground mt-4">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="text-primary">{'>'}</span>
                        <span className="text-primary font-medium">Contact</span>
                    </div>
                </motion.div>
            </div>

            <div className="container mx-auto px-4 md:px-8 mb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <div className="h-full p-8 rounded-2xl bg-background shadow-neu flex flex-col justify-between">
                            <div>
                                <div className="mb-6 rounded-2xl overflow-hidden h-48 w-full relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&auto=format&fit=crop&q=60"
                                        alt="Contact"
                                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">Mohamud Mohamed Adan</h2>
                                <p className="text-muted-foreground mb-4">
                                    Senior Creative Visual Producer & Multimedia Specialist
                                </p>
                                <p className="text-muted-foreground mb-8">
                                    Let’s create something powerful together. I am available for freelance work. Connect with me via and call in to my account.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                        <Phone className="w-5 h-5 text-primary" />
                                        <span>+123 456 7890</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                        <Mail className="w-5 h-5 text-primary" />
                                        <span>faysalmaxameddahir@gmail.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span>Mogadishu, Somalia</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <span className="uppercase text-xs font-bold text-muted-foreground mb-4 block">Find me on</span>
                                <div className="flex gap-4">
                                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                        <div key={i} className="w-12 h-12 rounded-lg bg-background shadow-neu flex items-center justify-center text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all cursor-pointer">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="h-full p-8 rounded-2xl bg-background shadow-neu">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Your Name</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-background border-none shadow-neu-pressed h-12 focus-visible:ring-primary/20"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Phone Number</label>
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="bg-background border-none shadow-neu-pressed h-12 focus-visible:ring-primary/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Email</label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-background border-none shadow-neu-pressed h-12 focus-visible:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Subject</label>
                                    <Input
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="bg-background border-none shadow-neu-pressed h-12 focus-visible:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Message</label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="bg-background border-none shadow-neu-pressed min-h-[200px] resize-none focus-visible:ring-primary/20 p-4"
                                        required
                                    />
                                </div>

                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full md:w-auto bg-background text-primary border border-primary/20 hover:bg-primary hover:text-white shadow-neu-active py-6 px-12 text-lg rounded-xl transition-all uppercase tracking-widest font-bold mt-4 min-w-[200px]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
