"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { DeleteModal } from "@/components/Modal"
import { Mail, Trash2, User, Phone, Calendar, Eye, EyeOff, Loader2, Search, CheckCircle2, Clock, Inbox, AlertTriangle } from "lucide-react"
import API from "@/api/axios"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
    _id: string
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    isRead: boolean
    createdAt: string
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            setLoading(true)
            const response = await API.get("/messages")
            setMessages(response.data)
        } catch (error) {
            console.error("Error fetching messages:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedMessage) return
        try {
            setSubmitting(true)
            await API.delete(`/messages/${selectedMessage._id}`)
            fetchMessages()
            setIsDeleteModalOpen(false)
            setSelectedMessage(null)
        } catch (error: any) {
            console.error("Error deleting message:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to delete message"}`)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteAll = async () => {
        try {
            setSubmitting(true)
            await API.delete("/messages")
            setMessages([])
            setIsDeleteAllModalOpen(false)
        } catch (error: any) {
            console.error("Error deleting all messages:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to delete all messages"}`)
        } finally {
            setSubmitting(false)
        }
    }

    const toggleReadStatus = async (message: Message) => {
        try {
            await API.put(`/messages/${message._id}`)
            setMessages(messages.map(m =>
                m._id === message._id ? { ...m, isRead: !m.isRead } : m
            ))
        } catch (error) {
            console.error("Error updating message status:", error)
        }
    }

    const unreadCount = messages.filter(m => !m.isRead).length
    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white dark:bg-[#1e2024] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="relative space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Inbox className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Inbox</h1>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            You have <span className="text-primary font-bold">{unreadCount}</span> unread messages out of {messages.length} total.
                        </p>
                    </div>

                    <div className="relative flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search sender or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#17181c] focus:ring-4 focus:ring-primary/10 transition-all outline-none text-base"
                            />
                        </div>
                        {messages.length > 0 && (
                            <button
                                onClick={() => setIsDeleteAllModalOpen(true)}
                                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all font-bold text-sm uppercase tracking-wider w-full sm:w-auto whitespace-nowrap"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-primary animate-pulse" />
                            </div>
                        </div>
                        <p className="text-muted-foreground animate-pulse font-medium">Synchronizing messages...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center min-h-[500px] p-12 rounded-[2.5rem] border-4 border-dashed border-gray-100 dark:border-gray-800 text-center bg-gray-50/50 dark:bg-[#1e2024]/10"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-white dark:bg-[#1e2024] shadow-xl flex items-center justify-center mb-6 transform -rotate-12">
                            <Mail className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Your inbox is clear!</h3>
                        <p className="text-gray-500 max-w-sm mb-8">No messages match your search or your inbox is empty. Sit back and relax!</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 pb-20">
                        <AnimatePresence mode="popLayout">
                            {filteredMessages.map((msg, index) => (
                                <motion.div
                                    key={msg._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`group relative p-8 rounded-3xl border transition-all duration-300 ${msg.isRead
                                        ? "bg-white dark:bg-[#1e2024] border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-black/5"
                                        : "bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 border-primary/20 shadow-xl shadow-primary/5"}`}
                                >
                                    {/* Unread Badge */}
                                    {!msg.isRead && (
                                        <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/40">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                            New
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#17181c] shadow-md flex items-center justify-center text-2xl font-bold border border-gray-50 dark:border-gray-800">
                                                        {msg.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-2xl font-black tracking-tight mb-1 ${!msg.isRead ? "text-primary" : "text-gray-900 dark:text-gray-100"}`}>
                                                            {msg.subject}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                <User className="w-4 h-4 text-primary" />
                                                                {msg.name}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer">
                                                                <Mail className="w-4 h-4 text-primary" />
                                                                {msg.email}
                                                            </div>
                                                            {msg.phone && (
                                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                                                    <Phone className="w-4 h-4 text-primary" />
                                                                    {msg.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-[#17181c] text-xs font-bold text-gray-400 border border-gray-100 dark:border-gray-800">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleReadStatus(msg)}
                                                        className={`p-3 rounded-2xl transition-all ${msg.isRead
                                                            ? "bg-gray-50 dark:bg-[#17181c] text-gray-400 hover:text-primary hover:bg-primary/5"
                                                            : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105"}`}
                                                        title={msg.isRead ? "Mark as unread" : "Mark as read"}
                                                    >
                                                        {msg.isRead ? <EyeOff className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMessage(msg)
                                                            setIsDeleteModalOpen(true)
                                                        }}
                                                        className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-transparent hover:shadow-red-500/20"
                                                        title="Delete message"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative group/content">
                                            <div className="absolute -left-8 top-0 bottom-0 w-1 bg-primary/20 rounded-full group-hover/content:bg-primary transition-colors" />
                                            <div className="p-6 rounded-2xl bg-gray-50/50 dark:bg-[#17181c]/50 border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:group-hover:bg-[#17181c] transition-all">
                                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Delete Single Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedMessage(null)
                }}
                onConfirm={handleDelete}
                isLoading={submitting}
                title="Discard Message"
                message={`This message from "${selectedMessage?.name}" will be permanently removed. Proceed?`}
            />

            {/* Delete All Modal */}
            <DeleteModal
                isOpen={isDeleteAllModalOpen}
                onClose={() => setIsDeleteAllModalOpen(false)}
                onConfirm={handleDeleteAll}
                isLoading={submitting}
                title="Wipe Entire Inbox"
                message={`CRITICAL: This will permanently delete ALL ${messages.length} messages. This action is irreversible. Are you absolutely sure?`}
            />
        </DashboardLayout>
    )
}
