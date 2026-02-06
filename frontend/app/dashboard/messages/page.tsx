"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { DeleteModal } from "@/components/Modal"
import { Mail, Trash2, User, Phone, Calendar, Eye, EyeOff, Loader2, Search } from "lucide-react"
import API from "@/api/axios"

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

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                        <p className="text-muted-foreground">Manage and view all incoming contact form submissions.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e2024] focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium">No messages found</h3>
                        <p className="text-gray-500">When people contact you, their messages will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`group p-6 rounded-2xl border transition-all duration-200 hover:shadow-lg ${msg.isRead
                                    ? "bg-white dark:bg-[#1e2024] border-gray-100 dark:border-gray-800"
                                    : "bg-primary/5 dark:bg-primary/5 border-primary/20 shadow-sm"}`}
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {!msg.isRead && (
                                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                    )}
                                                    <h3 className="text-xl font-bold">{msg.subject}</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="w-4 h-4" />
                                                        {msg.name}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-4 h-4" />
                                                        {msg.email}
                                                    </div>
                                                    {msg.phone && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone className="w-4 h-4" />
                                                            {msg.phone}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => toggleReadStatus(msg)}
                                                    className={`p-2 rounded-lg transition-colors ${msg.isRead
                                                        ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                                                        : "hover:bg-primary/10 text-primary"}`}
                                                    title={msg.isRead ? "Mark as unread" : "Mark as read"}
                                                >
                                                    {msg.isRead ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedMessage(msg)
                                                        setIsDeleteModalOpen(true)
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                                                    title="Delete message"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative p-4 rounded-xl bg-gray-50 dark:bg-[#17181c] border border-gray-100 dark:border-gray-800">
                                            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedMessage(null)
                }}
                onConfirm={handleDelete}
                isLoading={submitting}
                title="Delete Message"
                message={`Are you sure you want to delete this message from "${selectedMessage?.name}"? This action cannot be undone.`}
            />
        </DashboardLayout>
    )
}
