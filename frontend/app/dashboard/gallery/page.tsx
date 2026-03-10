"use client";
import { useState, useEffect, useRef } from "react";
import API from "@/utils/api";
import {
    FiPlus, FiTrash2, FiEdit2, FiX, FiCheck,
    FiImage, FiVideo, FiUploadCloud,
    FiGrid, FiStar, FiFilter, FiMoreVertical
} from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";

interface GalleryItem {
    _id: string;
    title: string;
    category: string;
    media: {
        url: string;
        type: "image" | "video";
    };
    featured: boolean;
    createdAt: string;
}

export default function GalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Confirm state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form States
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [featured, setFeatured] = useState(false);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video">("image");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/gallery");
            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch gallery error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setTitle("");
        setCategory("");
        setFeatured(false);
        setMediaFile(null);
        setMediaPreview(null);
        setMediaType("image");
        setEditId(null);
        setSubmitting(false);
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
            setMediaType(file.type.startsWith("video/") ? "video" : "image");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", category);
            formData.append("featured", String(featured));

            if (mediaFile) {
                formData.append("mediaFile", mediaFile);
            }

            if (editId) {
                await API.put(`/gallery/${editId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await API.post("/gallery", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            setModalOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            console.error("Submit gallery error:", error);
            alert(`Error: ${error.response?.data?.message || "Something went wrong"}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item: GalleryItem) => {
        resetForm();
        setEditId(item._id);
        setTitle(item.title);
        setCategory(item.category || "");
        setFeatured(item.featured || false);
        setMediaPreview(item.media.url);
        setMediaType(item.media.type);
        setModalOpen(true);
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/gallery/${deleteId}`);
            fetchData();
        } catch (error) {
            console.error("Delete gallery error:", error);
        }
    };

    return (
        <div className="animate-fade-up">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 text-accent mb-4">
                        <FiGrid size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Visual Assets Hub</span>
                    </div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter text-foreground leading-[0.8] mb-4">Gallery</h1>
                    <p className="text-text-dim font-bold text-[11px] uppercase tracking-widest max-w-md leading-relaxed opacity-60">
                        Manage your stand-alone visual collection. High-resolution images and cinematic reels.
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setModalOpen(true);
                    }}
                    className="group relative overflow-hidden bg-accent text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl shadow-accent/40 active:scale-95 border-b-8 border-black/20"
                >
                    <div className="relative z-10 flex items-center gap-3">
                        <FiPlus size={18} />
                        Add Asset
                    </div>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
            </header>

            {/* Gallery Table */}
            <div className="bg-white rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-text-dim">Preview</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-text-dim">Asset Details</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-text-dim text-center">Featured</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-text-dim">Added On</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-text-dim text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/5">
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-10 py-8"><div className="w-20 h-20 bg-foreground/5 rounded-2xl"></div></td>
                                        <td className="px-10 py-8"><div className="h-4 w-40 bg-foreground/5 rounded-md mb-2"></div><div className="h-3 w-20 bg-foreground/5 rounded-md"></div></td>
                                        <td className="px-10 py-8 text-center"><div className="w-6 h-6 bg-foreground/5 rounded-full mx-auto"></div></td>
                                        <td className="px-10 py-8"><div className="h-4 w-24 bg-foreground/5 rounded-md"></div></td>
                                        <td className="px-10 py-8"></td>
                                    </tr>
                                ))
                            ) : items.length > 0 ? (
                                items.map((item) => (
                                    <tr key={item._id} className="group hover:bg-foreground/[0.01] transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/5">
                                                {item.media.type === "video" ? (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                                        <FiVideo className="text-white" />
                                                    </div>
                                                ) : (
                                                    <img src={item.media.url} className="w-full h-full object-cover" alt="" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <h4 className="text-base font-black text-foreground uppercase tracking-tight mb-1">{item.title}</h4>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                                                {item.category || "General"}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <div className="flex justify-center">
                                                {item.featured ? (
                                                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shadow-inner">
                                                        <FiStar size={18} fill="currentColor" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-foreground/5 text-text-dim/20 flex items-center justify-center italic">
                                                        <FiStar size={18} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-accent hover:text-white transition-all flex items-center justify-center border border-slate-200"
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(item._id)}
                                                    className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-slate-200"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <p className="text-xs font-bold text-text-dim uppercase tracking-widest">No assets found in the gallery.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Asset Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-white/80 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-zoom-in relative">
                        {/* Modal Header */}
                        <div className="px-16 py-12 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">
                                    {editId ? "Refine Asset" : "New Asset"}
                                </h2>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
                                    Visual Vault Register
                                </p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all hover:rotate-90 duration-500 border border-slate-200/50"
                            >
                                <FiX size={28} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-16 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {/* Left: Media */}
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                        <FiImage /> Asset Content
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative aspect-square rounded-[3rem] border-4 border-dashed border-foreground/5 bg-foreground/[0.02] flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/[0.04] transition-all group overflow-hidden"
                                    >
                                        {mediaPreview ? (
                                            <div className="absolute inset-0">
                                                {mediaType === "video" ? (
                                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                        <FiVideo size={40} className="text-white opacity-20" />
                                                        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-white uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">Video Uploaded</span>
                                                    </div>
                                                ) : (
                                                    <img src={mediaPreview} className="w-full h-full object-cover" alt="Preview" />
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                    <FiUploadCloud size={40} className="mb-4" />
                                                    <span className="text-xs font-black uppercase tracking-widest">Replace Media</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-10">
                                                <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-6 text-text-dim group-hover:scale-110 group-hover:text-accent transition-all duration-500">
                                                    <FiUploadCloud size={30} />
                                                </div>
                                                <h4 className="text-sm font-black text-foreground uppercase tracking-tight mb-2">Drop media here</h4>
                                                <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest leading-loose max-w-xs mx-auto text-center">
                                                    Image or Video (Max 50MB)
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*,video/*"
                                            onChange={handleMediaChange}
                                        />
                                    </div>
                                </div>

                                {/* Right: Details */}
                                <div className="space-y-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Asset Label</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Minimalist Architecture"
                                            className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-3xl px-8 py-6 text-base font-black text-foreground transition-all outline-none"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Asset Category</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Photography, Motion"
                                            className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-3xl px-8 py-6 text-base font-black text-foreground transition-all outline-none"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        />
                                    </div>

                                    <div
                                        onClick={() => setFeatured(!featured)}
                                        className={`group relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between ${featured ? 'bg-accent/5 border-accent/20' : 'bg-foreground/[0.02] border-transparent hover:bg-foreground/[0.04]'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${featured ? 'bg-accent text-white' : 'bg-foreground/5 text-text-dim'}`}>
                                                <FiStar size={24} fill={featured ? "currentColor" : "none"} />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Highlight Asset</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pin to featured dashboard collection</p>
                                            </div>
                                        </div>
                                        <div className={`w-14 h-8 rounded-full relative transition-all duration-500 flex items-center px-1.5 ${featured ? 'bg-accent' : 'bg-foreground/10'}`}>
                                            <div className={`w-5 h-5 rounded-full bg-white transition-all duration-500 shadow-sm ${featured ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-12 flex flex-col sm:flex-row gap-6 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-7 rounded-[2.2rem] font-black uppercase tracking-widest text-[11px] text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200/50"
                                >
                                    Cancel Request
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] bg-slate-900 text-white py-7 rounded-[2.2rem] font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale shadow-2xl"
                                >
                                    {submitting ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <FiCheck size={22} className="text-accent" />
                                    )}
                                    {submitting ? "Encrypting Asset..." : editId ? "Update Asset" : "Register Asset"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Asset?"
                message="Are you sure you want to permanently remove this asset from your visual vault? This action is irreversible."
            />
        </div>
    );
}
