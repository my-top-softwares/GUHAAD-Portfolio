"use client";
import { useState, useEffect } from "react";
import API from "@/utils/api";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiStar, FiImage, FiUser, FiZap } from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";
import { FaQuoteLeft } from "react-icons/fa";
import Image from "next/image";

interface Testimonial {
    _id: string;
    name: string;
    position: string;
    company: string;
    message: string;
    rating: number;
    image: string;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form and Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState("");

    // Confirm state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [company, setCompany] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [image, setImage] = useState("");

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/testimonials");
            setTestimonials(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch testimonials");
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setPosition("");
        setCompany("");
        setMessage("");
        setRating(5);
        setImage("");
        setIsEditing(false);
        setCurrentId("");
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEdit = (testi: Testimonial) => {
        setName(testi.name);
        setPosition(testi.position || "");
        setCompany(testi.company || "");
        setMessage(testi.message);
        setRating(testi.rating || 5);
        setImage(testi.image || "");
        setCurrentId(testi._id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/testimonials/${deleteId}`);
            setTestimonials(testimonials.filter(t => t._id !== deleteId));
            setDeleteId(null);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete testimonial");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const testimonialData = { name, position, company, message, rating, image };

        try {
            if (isEditing) {
                const { data } = await API.put(`/testimonials/${currentId}`, testimonialData);
                setTestimonials(testimonials.map(t => t._id === currentId ? data : t));
            } else {
                const { data } = await API.post("/testimonials", testimonialData);
                setTestimonials([...testimonials, data]);
            }
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    if (loading && testimonials.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Testimonials</h1>
                    <p className="text-text-dim font-medium">Manage client feedback and social proof.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="btn-primary flex items-center gap-2 self-start md:self-auto"
                >
                    <FiPlus className="text-lg" />
                    <span>ADD TESTIMONIAL</span>
                </button>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl mb-8 font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testi) => (
                    <div key={testi._id} className="bg-card-bg p-8 rounded-[2.5rem] border border-foreground/5 shadow-sm hover:shadow-xl hover:border-accent/10 transition-all group relative overflow-hidden flex flex-col">
                        {/* Quote Decor */}
                        <FaQuoteLeft className="absolute top-6 right-8 text-accent/10 text-4xl group-hover:text-accent/20 transition-colors" />

                        <div className="flex items-center gap-1 text-accent mb-6">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <FiStar key={s} className={s <= testi.rating ? "fill-accent" : "text-foreground/10 fill-none"} />
                            ))}
                        </div>

                        <p className="text-text-dim leading-relaxed mb-10 font-medium line-clamp-4 flex-grow italic">
                            "{testi.message}"
                        </p>

                        <div className="flex items-center gap-4 pt-6 border-t border-foreground/5">
                            <div className="w-14 h-14 rounded-2xl bg-foreground/5 overflow-hidden filter grayscale hover:grayscale-0 transition-all border border-foreground/10 shrink-0">
                                {testi.image ? (
                                    <img src={testi.image} alt={testi.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-dim">
                                        <FiUser className="text-xl" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{testi.name}</h4>
                                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-0.5">
                                    {testi.position} @ {testi.company}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(testi)} className="p-2 rounded-lg bg-foreground/5 text-foreground hover:bg-accent hover:text-white transition-all">
                                    <FiEdit2 className="text-xs" />
                                </button>
                                <button onClick={() => confirmDelete(testi._id)} className="p-2 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10">
                                    <FiTrash2 className="text-xs" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {!loading && testimonials.length === 0 && (
                <div className="bg-card-bg p-12 rounded-3xl border border-dashed border-foreground/10 flex flex-col items-center justify-center text-center">
                    <FaQuoteLeft className="text-5xl text-accent/20 mb-6" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No testimonials found</h3>
                    <p className="text-text-dim max-w-xs mb-8">Gather and publish feedback from your satisfied clients to build trust.</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 md:p-8 bg-white/80 backdrop-blur-xl animate-fade-in  pt-10 md:pt-22 ">
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-zoom-in relative">
                        <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                                {isEditing ? "Refine Feedback" : "New Feedback"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all hover:rotate-90 duration-300 border border-slate-200/50"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Client Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 transition-all outline-none shadow-sm"
                                        placeholder="e.g. Sarah J. Johnson"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Professional Position</label>
                                    <input
                                        type="text"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-6 py-4 text-sm font-bold text-foreground transition-all outline-none"
                                        placeholder="e.g. CMO"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Company / Organization</label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-6 py-4 text-sm font-bold text-foreground transition-all outline-none"
                                        placeholder="e.g. Netflix"
                                    />
                                </div>

                                <div className="md:col-span-1 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1 flex items-center gap-2">
                                        Client Satisfaction
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${rating >= star ? 'bg-accent/10 text-accent shadow-sm border border-accent/20' : 'bg-foreground/[0.03] text-text-dim hover:bg-foreground/[0.05]'}`}
                                            >
                                                <FiStar className={rating >= star ? 'fill-accent' : ''} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-1 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Client Avatar (URL)</label>
                                    <input
                                        type="text"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-6 py-4 text-sm font-mono text-foreground transition-all outline-none"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">The Experience / Review</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-[2rem] px-6 py-5 text-sm font-medium text-foreground transition-all outline-none min-h-[160px] resize-none leading-relaxed"
                                        placeholder="What did they say about your work?"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-8 flex gap-5 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200/50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-slate-900 text-white font-black py-6 rounded-[1.5rem] uppercase tracking-widest text-[11px] hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <FiZap size={18} className="text-accent" />
                                    <span>{isEditing ? "Update Feedback" : "Publish Feedback"}</span>
                                </button>
                            </div>
                            <div className="h-4"></div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Feedback?"
                message="Are you sure you want to remove this testimonial from your public profile?"
            />
        </div>
    );
}
