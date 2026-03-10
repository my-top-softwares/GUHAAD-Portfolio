"use client";
import { useState, useEffect, useRef } from "react";
import API from "@/utils/api";
import {
    FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiExternalLink,
    FiImage, FiVideo, FiLayers, FiPlusCircle, FiUploadCloud,
    FiInfo, FiMonitor, FiCode, FiBriefcase, FiStar
} from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";

interface Category {
    _id: string;
    name: string;
}

interface MediaItem {
    url: string;
    type: "image" | "video";
}

interface Project {
    _id: string;
    title: string;
    description: string;
    mainMedia: MediaItem;
    link: string;
    category: Category;
    technologies: string[];
    gallery: MediaItem[];
    inGallery: boolean;
    createdAt: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Confirm state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [link, setLink] = useState("");
    const [techString, setTechString] = useState("");
    const [inGallery, setInGallery] = useState(false);

    // Media States
    const [mainMediaFile, setMainMediaFile] = useState<File | null>(null);
    const [mainMediaPreview, setMainMediaPreview] = useState<string | null>(null);
    const [mainMediaType, setMainMediaType] = useState<"image" | "video">("image");
    const [mainMediaUrl, setMainMediaUrl] = useState(""); // For cases where user wants to use a URL

    const [galleryItems, setGalleryItems] = useState<{ file: File | null, url: string, type: "image" | "video" }[]>([]);

    const mainFileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projectsRes, categoriesRes] = await Promise.all([
                API.get("/projects"),
                API.get("/categories")
            ]);
            setProjects(projectsRes.data);
            setCategories(categoriesRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch data error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategory("");
        setLink("");
        setTechString("");
        setMainMediaFile(null);
        setMainMediaPreview(null);
        setMainMediaType("image");
        setMainMediaUrl("");
        setGalleryItems([]);
        setEditId(null);
        setInGallery(false);
        setSubmitting(false);
    };

    const handleMainMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMainMediaFile(file);
            setMainMediaPreview(URL.createObjectURL(file));
            setMainMediaType(file.type.startsWith("video/") ? "video" : "image");
        }
    };

    const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newItems = Array.from(files).map(file => ({
                file,
                url: URL.createObjectURL(file),
                type: file.type.startsWith("video/") ? "video" as const : "image" as const
            }));
            setGalleryItems([...galleryItems, ...newItems]);
        }
    };

    const removeGalleryItem = (index: number) => {
        setGalleryItems(galleryItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("link", link);
            formData.append("inGallery", String(inGallery));
            formData.append("technologies", JSON.stringify(techString.split(",").map(t => t.trim()).filter(t => t !== "")));

            if (mainMediaFile) {
                formData.append("mainMediaFile", mainMediaFile);
            } else if (mainMediaUrl) {
                formData.append("mainMediaUrl", mainMediaUrl);
            }

            // Separating existing gallery (URLs) from new files
            const existingGallery = galleryItems.filter(item => !item.file).map(item => ({ url: item.url, type: item.type }));
            formData.append("existingGallery", JSON.stringify(existingGallery));

            galleryItems.forEach(item => {
                if (item.file) {
                    formData.append("galleryFiles", item.file);
                }
            });

            if (editId) {
                await API.put(`/projects/${editId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await API.post("/projects", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            setModalOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            console.error("Submit project error:", error);
            const msg = error.response?.data?.message || error.message || "An error occurred";
            alert(`Error: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (project: Project) => {
        resetForm();
        setEditId(project._id);
        setTitle(project.title);
        setDescription(project.description);
        setCategory(project.category?._id || "");
        setLink(project.link || "");
        setTechString(project.technologies?.join(", ") || "");
        setMainMediaPreview(project.mainMedia?.url || null);
        setMainMediaType(project.mainMedia?.type || "image");
        setInGallery(project.inGallery || false);

        const existingGalleryItems = project.gallery?.map(item => ({
            file: null,
            url: item.url,
            type: item.type
        })) || [];
        setGalleryItems(existingGalleryItems);

        setModalOpen(true);
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/projects/${deleteId}`);
            fetchData();
        } catch (error) {
            console.error("Delete project error:", error);
        }
    };

    return (
        <div className="animate-fade-up">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 text-accent mb-4">
                        <FiMonitor size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Project Management</span>
                    </div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter text-foreground leading-[0.8] mb-4">Portfolio</h1>
                    <p className="text-text-dim font-bold text-[11px] uppercase tracking-widest max-w-md leading-relaxed opacity-60">
                        Create and organize your visual stories. Elevate your brand with high-quality media presentations.
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
                        <FiPlusCircle size={18} />
                        Create Project
                    </div>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-card-bg h-[450px] rounded-[3.5rem] border border-foreground/5 animate-pulse"></div>
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project._id} className="group relative bg-card-bg rounded-[3.5rem] border border-foreground/5 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col">
                            {/* Visual Preview */}
                            <div className="h-64 relative overflow-hidden bg-foreground/5">
                                {project.mainMedia?.type === "video" ? (
                                    <video src={project.mainMedia.url} className="w-full h-full object-cover" controls />
                                ) : (
                                    <img src={project.mainMedia?.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                )}
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <span className="bg-background/80 backdrop-blur-xl px-4 py-1.5 rounded-full border border-foreground/10 text-[9px] font-black uppercase tracking-widest text-accent">
                                        {project.category?.name || "Other"}
                                    </span>
                                    {project.inGallery && (
                                        <span className="bg-slate-900/80 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                                            <FiStar size={10} className="text-accent" /> Featured
                                        </span>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-accent transition-all shadow-xl"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(project._id)}
                                            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 transition-all shadow-xl"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-3 truncate">{project.title}</h3>
                                <p className="text-[11px] text-text-dim font-medium leading-relaxed mb-6 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-foreground/5 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {project.technologies?.slice(0, 3).map((tech, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-accent/10 border-2 border-card-bg flex items-center justify-center text-[8px] font-black text-accent uppercase">
                                                {tech[0]}
                                            </div>
                                        ))}
                                        {project.technologies?.length > 3 && (
                                            <div className="w-8 h-8 rounded-full bg-foreground/5 border-2 border-card-bg flex items-center justify-center text-[8px] font-black text-text-dim uppercase">
                                                +{project.technologies.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-text-dim/40 italic">
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 bg-card-bg rounded-[4rem] border border-dashed border-foreground/10">
                    <FiLayers size={80} className="mx-auto text-text-dim/10 mb-8" />
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-2">No Projects Found</h3>
                    <p className="text-xs text-text-dim font-bold uppercase tracking-widest">Start by adding your first masterpiece</p>
                </div>
            )}

            {/* Premium Project Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 md:p-8 bg-white/80 backdrop-blur-xl animate-fade-in  pt-10 md:pt-22 ">
                    <div className="bg-white w-full max-w-6xl rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-zoom-in relative min-h-[600px]">
                        {/* Modal Header */}
                        <div className="px-16 py-12 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-200/50">
                                    <FiBriefcase size={28} />
                                </div>
                                <div>
                                    <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">
                                        {editId ? "Refine Creation" : "New Creation"}
                                    </h2>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-3">
                                        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
                                        Project Registry System
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all hover:rotate-90 duration-500 border border-slate-200/50"
                            >
                                <FiX size={28} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                                {/* Left Column: Media & Visuals */}
                                <div className="lg:col-span-5 space-y-12">

                                    {/* Main Media Upload Area */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                            <FiImage /> Primary Visualization
                                        </label>
                                        <div
                                            onClick={() => mainFileInputRef.current?.click()}
                                            className="relative aspect-[4/3] rounded-[3rem] border-4 border-dashed border-foreground/5 bg-foreground/[0.02] flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/[0.04] transition-all group overflow-hidden"
                                        >
                                            {mainMediaPreview ? (
                                                <div className="absolute inset-0">
                                                    {mainMediaType === "video" ? (
                                                        <video src={mainMediaPreview} className="w-full h-full object-cover" muted loop autoPlay controls />
                                                    ) : (
                                                        <img src={mainMediaPreview} className="w-full h-full object-cover" alt="Preview" />
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
                                                    <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest leading-loose max-w-xs mx-auto">
                                                        Video or High-Res Image <br /> (Max 50MB)
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                ref={mainFileInputRef}
                                                className="hidden"
                                                accept="image/*,video/*"
                                                onChange={handleMainMediaChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Gallery Management */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                                <FiLayers /> Media Gallery
                                            </label>
                                            <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">
                                                {galleryItems.length} Items Selected
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {galleryItems.map((item, idx) => (
                                                <div key={idx} className="relative group aspect-video rounded-3xl overflow-hidden bg-foreground/5 border border-foreground/10">
                                                    {item.type === "video" ? (
                                                        <video src={item.url} className="w-full h-full object-cover" controls />
                                                    ) : (
                                                        <img src={item.url} className="w-full h-full object-cover" alt="" />
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryItem(idx)}
                                                        className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="aspect-video rounded-3xl border-2 border-dashed border-foreground/10 flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/5 transition-all text-text-dim hover:text-accent">
                                                <FiPlus size={20} />
                                                <span className="text-[8px] font-black uppercase tracking-widest mt-2">Add</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    multiple
                                                    accept="image/*,video/*"
                                                    onChange={handleGalleryAdd}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Details & Taxonomy */}
                                <div className="lg:col-span-7 space-y-10">

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="col-span-2 space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Project Identifier</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Cinematic Brand Identity"
                                                className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-3xl px-8 py-6 text-base font-black text-foreground transition-all outline-none"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-2">Classification Segment</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-8 py-6 text-sm font-bold text-foreground transition-all outline-none appearance-none cursor-pointer"
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    required
                                                >
                                                    <option value="" disabled>Select Segment</option>
                                                    {categories.map(cat => (
                                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <FiLayers className="absolute right-8 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="col-span-2 space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Creative Synopsis</label>
                                            <textarea
                                                rows={5}
                                                placeholder="Describe the challenges, solutions, and creative direction..."
                                                className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-[2.5rem] px-8 py-6 text-sm font-medium text-foreground transition-all outline-none resize-none leading-relaxed"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <div
                                                onClick={() => setInGallery(!inGallery)}
                                                className={`group relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between ${inGallery ? 'bg-accent/5 border-accent/20 shadow-inner' : 'bg-foreground/[0.02] border-transparent hover:bg-foreground/[0.04]'}`}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${inGallery ? 'bg-accent text-white' : 'bg-foreground/5 text-text-dim group-hover:bg-foreground/10'}`}>
                                                        <FiStar size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Feature in Gallery</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Display this project in the "Selected Works" section</p>
                                                    </div>
                                                </div>
                                                <div className={`w-14 h-8 rounded-full relative transition-all duration-500 flex items-center px-1.5 ${inGallery ? 'bg-accent shadow-lg shadow-accent/20' : 'bg-foreground/10'}`}>
                                                    <div className={`w-5 h-5 rounded-full bg-white transition-all duration-500 shadow-sm ${inGallery ? 'translate-x-6' : 'translate-x-0'}`}></div>
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
                                            Discard Changes
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-[2] bg-slate-900 text-white py-7 rounded-[2.2rem] font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
                                        >
                                            {submitting ? (
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <FiCheck size={22} className="text-accent" />
                                            )}
                                            {submitting ? "Processing Hub..." : editId ? "Update Portfolio" : "Create Portfolio"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Project?"
                message="Are you sure you want to permanently delete this project? This action cannot be undone."
            />
        </div>
    );
}
