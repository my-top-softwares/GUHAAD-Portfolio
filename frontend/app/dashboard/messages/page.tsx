"use client";
import { useState, useEffect } from "react";
import API from "@/utils/api";
import { FiMail, FiTrash2, FiUser, FiClock, FiMessageSquare, FiX, FiCheckCircle } from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    // Confirm state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/messages");
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch messages error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const confirmDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/messages/${deleteId}`);
            setMessages(messages.filter(m => m._id !== deleteId));
            if (selectedMessage?._id === deleteId) setSelectedMessage(null);
            setDeleteId(null);
        } catch (error) {
            console.error("Delete message error:", error);
            alert("An error occurred");
        }
    };

    const handleMarkAsRead = async (message: Message) => {
        if (message.isRead) return;
        try {
            await API.put(`/messages/${message._id}`, { ...message, isRead: true });
            setMessages(messages.map(m => m._id === message._id ? { ...m, isRead: true } : m));
            if (selectedMessage?._id === message._id) setSelectedMessage({ ...selectedMessage, isRead: true });
        } catch (error) {
            console.error("Update message error:", error);
        }
    };

    const openMessage = (message: Message) => {
        setSelectedMessage(message);
        handleMarkAsRead(message);
    };

    return (
        <div className="animate-fade-up">
            <header className="mb-10">
                <h1 className="text-5xl font-black uppercase tracking-tighter text-foreground mb-3 leading-none">Inbound Messages</h1>
                <p className="text-text-dim font-black text-[10px] uppercase tracking-[0.3em]">Communication from your digital visitors</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-[600px]">
                {/* Messages List */}
                <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-2">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-card-bg h-24 rounded-3xl border border-foreground/5 animate-pulse"></div>
                        ))
                    ) : messages.length > 0 ? (
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                onClick={() => openMessage(msg)}
                                className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden
                                    ${selectedMessage?._id === msg._id ? "bg-accent/10 border-accent/30 shadow-lg" : "bg-card-bg border-foreground/5 hover:border-foreground/20 shadow-sm"}
                                    ${!msg.isRead && selectedMessage?._id !== msg._id ? "border-l-4 border-l-accent" : ""}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`text-sm font-black uppercase tracking-tight truncate max-w-[140px] ${!msg.isRead ? "text-foreground" : "text-text-dim"}`}>
                                        {msg.name}
                                    </h3>
                                    <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest bg-foreground/5 px-2 py-0.5 rounded-full">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold text-accent mb-2 uppercase tracking-wide truncate">{msg.subject || "No Subject"}</p>
                                <p className="text-xs text-text-dim line-clamp-1 leading-relaxed">{msg.message}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-card-bg rounded-[3rem] border border-dashed border-foreground/10">
                            <FiMail size={40} className="mx-auto text-text-dim/20 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-dim">No messages yet</p>
                        </div>
                    )}
                </div>

                {/* Message Detail View */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="bg-white p-12 rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.1)] h-full flex flex-col animate-fade-in my-auto">
                            <div className="flex justify-between items-start mb-12 pb-8 border-b border-slate-50">
                                <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 rounded-[2rem] bg-slate-900 border border-slate-700/50 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                                        {selectedMessage.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">{selectedMessage.name}</h2>
                                        <div className="flex items-center gap-4 text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em]">
                                            <FiMail className="text-accent" /> {selectedMessage.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={(e) => confirmDelete(selectedMessage._id, e)}
                                        className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-200/50"
                                    >
                                        <FiTrash2 size={24} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-200/50 lg:hidden"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8 flex-1  pr-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Subject Line</span>
                                    <h4 className="text-lg font-black text-foreground uppercase tracking-tight">{selectedMessage.subject || "N/A"}</h4>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                        <FiMessageSquare /> Original Message
                                    </span>
                                    <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200/30 leading-relaxed text-base font-medium text-slate-700 whitespace-pre-wrap shadow-inner">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
                                <span className="flex items-center gap-3">
                                    <FiClock className="text-slate-200" /> Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                                </span>
                                {selectedMessage.isRead && (
                                    <span className="flex items-center gap-3 text-emerald-500">
                                        <FiCheckCircle size={16} /> Seen
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card-bg/50 rounded-[3rem] border border-dashed border-foreground/10 h-full flex flex-col items-center justify-center text-center p-20 grayscale opacity-40">
                            <div className="w-24 h-24 rounded-[3rem] bg-foreground/5 flex items-center justify-center mb-8 border border-foreground/10">
                                <FiMail size={40} className="text-text-dim" />
                            </div>
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-2">Select a Message</h3>
                            <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest max-w-xs leading-loose">
                                Click on a conversation from the sidebar to view full details and responses.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Message?"
                message="Are you sure you want to permanently remove this communication from your archives?"
            />
        </div>
    );
}
