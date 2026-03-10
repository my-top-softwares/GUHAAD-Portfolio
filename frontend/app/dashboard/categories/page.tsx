"use client";
import { useState, useEffect } from "react";
import API from "@/utils/api";
import { FiPlus, FiTrash2, FiEdit2, FiType, FiDroplet, FiX, FiCheck } from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";

interface Category {
    _id: string;
    name: string;
    description: string;
    color: string;
    createdAt: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "#3b82f6"
    });

    // Custom confirm modal state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/categories");
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch categories error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await API.put(`/categories/${editId}`, formData);
            } else {
                await API.post("/categories", formData);
            }
            setModalOpen(false);
            setEditId(null);
            setFormData({ name: "", description: "", color: "#3b82f6" });
            fetchCategories();
        } catch (error) {
            console.error("Submit category error:", error);
            alert("An error occurred");
        }
    };

    const handleEdit = (category: Category) => {
        setFormData({
            name: category.name,
            description: category.description || "",
            color: category.color || "#3b82f6"
        });
        setEditId(category._id);
        setModalOpen(true);
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/categories/${deleteId}`);
            fetchCategories();
            setDeleteId(null);
        } catch (error) {
            console.error("Delete category error:", error);
            alert("An error occurred");
        }
    };

    return (
        <div className="animate-fade-up">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter text-foreground mb-3 leading-none">Project Categories</h1>
                    <p className="text-text-dim font-black text-[10px] uppercase tracking-[0.3em]">Organize your portfolio masefully</p>
                </div>
                <button
                    onClick={() => {
                        setEditId(null);
                        setFormData({ name: "", description: "", color: "#3b82f6" });
                        setModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-accent/20 border-b-4 border-black/20 active:translate-y-1 active:border-b-0"
                >
                    <FiPlus /> Add New Category
                </button>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-card-bg h-48 rounded-[2.5rem] border border-foreground/5 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category._id} className="bg-card-bg p-8 rounded-[2.5rem] border border-foreground/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            {/* Color Accent */}
                            <div
                                className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                                style={{ backgroundColor: category.color }}
                            ></div>

                            <div className="flex justify-between items-start mb-6">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                                    style={{ backgroundColor: category.color }}
                                >
                                    <FiType />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-text-dim hover:bg-blue-500 hover:text-white transition-all"
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(category._id)}
                                        className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-text-dim hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-2">{category.name}</h3>
                            <p className="text-[11px] text-text-dim font-medium leading-relaxed line-clamp-2 mb-4">
                                {category.description || "No description provided."}
                            </p>

                            <div className="pt-4 border-t border-foreground/5 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-text-dim/50">
                                <span>Projects: ?</span>
                                <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 md:p-8 bg-white/80 backdrop-blur-xl animate-fade-in  pt-20 md:pt-32">
                    <div className="bg-white w-full max-w-lg rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-zoom-in relative min-h-[500px]">
                        <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                                    {editId ? "Update Category" : "New Category"}
                                </h2>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                    Define your project type
                                </p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all hover:rotate-90 duration-300 border border-slate-200/50"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                                    <FiType className="text-accent" /> Category Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., UI/UX Design"
                                    className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/20 focus:bg-background rounded-2xl p-5 text-sm font-bold text-foreground transition-all outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Briefly describe what this category covers..."
                                    className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/20 focus:bg-background rounded-2xl p-5 text-sm font-bold text-foreground transition-all outline-none resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-5 pt-8 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-6 rounded-[1.8rem] font-black uppercase tracking-widest text-[11px] text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200/50 text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-slate-900 py-6 rounded-[1.8rem] font-black uppercase tracking-widest text-[11px] text-white flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] active:scale-95 transition-all"
                                >
                                    <FiCheck className="text-accent" /> {editId ? "Update" : "Save"} Category
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
                title="Delete Category?"
                message="Are you sure you want to remove this category? This action could impact projects linked to it."
            />
        </div>
    );
}
