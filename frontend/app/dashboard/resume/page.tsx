"use client";
import { useState, useEffect } from "react";
import API from "@/utils/api";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiFileText, FiCalendar, FiMapPin, FiBriefcase, FiBook } from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";

interface ResumeItem {
    _id: string;
    title: string;
    organization: string;
    duration: string;
    description: string;
    type: 'experience' | 'education';
    order: number;
}

export default function ResumePage() {
    const [items, setItems] = useState<ResumeItem[]>([]);
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
    const [title, setTitle] = useState("");
    const [organization, setOrganization] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<'experience' | 'education'>('experience');
    const [order, setOrder] = useState(0);

    useEffect(() => {
        fetchResumeItems();
    }, []);

    const fetchResumeItems = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/resume");
            setItems(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch resume items");
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setOrganization("");
        setDuration("");
        setDescription("");
        setType('experience');
        setOrder(0);
        setIsEditing(false);
        setCurrentId("");
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEdit = (item: ResumeItem) => {
        setTitle(item.title);
        setOrganization(item.organization);
        setDuration(item.duration);
        setDescription(item.description);
        setType(item.type);
        setOrder(item.order);
        setCurrentId(item._id);
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
            await API.delete(`/resume/${deleteId}`);
            setItems(items.filter(i => i._id !== deleteId));
            setDeleteId(null);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete item");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const itemData = { title, organization, duration, description, type, order };

        try {
            if (isEditing) {
                const { data } = await API.put(`/resume/${currentId}`, itemData);
                setItems(items.map(i => i._id === currentId ? data : i));
            } else {
                const { data } = await API.post("/resume", itemData);
                setItems([...items, data]);
            }
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const experiences = items.filter(i => i.type === 'experience');
    const education = items.filter(i => i.type === 'education');

    if (loading && items.length === 0) {
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
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Resume</h1>
                    <p className="text-text-dim font-medium">Manage your professional experience and education.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="btn-primary flex items-center gap-2 self-start md:self-auto"
                >
                    <FiPlus className="text-lg" />
                    <span>ADD RESUME ITEM</span>
                </button>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl mb-8 font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Experience Column */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                            <FiBriefcase className="text-xl" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Work Experience</h2>
                    </div>

                    <div className="space-y-6">
                        {experiences.length > 0 ? experiences.map((item) => (
                            <ResumeCard key={item._id} item={item} onEdit={handleEdit} confirmDelete={confirmDelete} />
                        )) : (
                            <div className="p-8 border border-dashed border-foreground/10 rounded-3xl text-center text-text-dim italic">
                                No work experience added yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Education Column */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                            <FiBook className="text-xl" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Education</h2>
                    </div>

                    <div className="space-y-6">
                        {education.length > 0 ? education.map((item) => (
                            <ResumeCard key={item._id} item={item} onEdit={handleEdit} confirmDelete={confirmDelete} />
                        )) : (
                            <div className="p-8 border border-dashed border-foreground/10 rounded-3xl text-center text-text-dim italic">
                                No education history added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 md:p-8 bg-white/80 backdrop-blur-xl animate-fade-in  pt-10 md:pt-22 ">
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-zoom-in relative">
                        <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                                {isEditing ? "Refine Entry" : "New Entry"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all hover:rotate-90 duration-300 border border-slate-200/50"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-10">
                            {/* Type Selector - Dropdown */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-accent ml-1 flex items-center gap-2">
                                    <FiBriefcase size={12} /> Entry Classification
                                </label>
                                <div className="relative">
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as 'experience' | 'education')}
                                        className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest text-foreground transition-all outline-none appearance-none cursor-pointer hover:bg-foreground/[0.05]"
                                        required
                                    >
                                        <option value="experience">💼 Work Experience</option>
                                        <option value="education">🎓 Education & Learning</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-dim">
                                        <FiPlus size={16} className="rotate-45" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Position / Degree</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-6 py-4 text-sm font-bold text-foreground transition-all outline-none"
                                        placeholder="e.g. Senior Designer"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Organization / School</label>
                                    <input
                                        type="text"
                                        value={organization}
                                        onChange={(e) => setOrganization(e.target.value)}
                                        className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-6 py-4 text-sm font-bold text-foreground transition-all outline-none"
                                        placeholder="e.g. Google"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Timeframe</label>
                                    <input
                                        type="text"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-6 py-4 text-sm font-bold text-foreground transition-all outline-none"
                                        placeholder="e.g. 2022 - Present"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Display Order</label>
                                    <input
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(Number(e.target.value))}
                                        className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-6 py-4 text-sm font-bold text-foreground transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Accomplishments</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-[2rem] px-6 py-5 text-sm font-medium text-foreground transition-all outline-none min-h-[150px] resize-none leading-relaxed"
                                    placeholder="Describe your role and impact..."
                                    required
                                />
                            </div>

                            <div className="pt-8 flex gap-5 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-6 rounded-[1.8rem] font-black uppercase tracking-widest text-[11px] text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200/50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-slate-900 text-white font-black py-6 rounded-[1.8rem] uppercase tracking-widest text-[11px] hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] active:scale-95 transition-all"
                                >
                                    {isEditing ? "Update Entry" : "Save Entry"}
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
                title="Delete Entry?"
                message="Are you sure you want to remove this entry from your professional record?"
            />
        </div>
    );
}

function ResumeCard({ item, onEdit, confirmDelete }: { item: ResumeItem, onEdit: (i: ResumeItem) => void, confirmDelete: (id: string) => void }) {
    return (
        <div className="bg-card-bg p-6 rounded-3xl border border-foreground/5 shadow-sm group hover:shadow-xl hover:border-accent/10 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{item.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-widest">
                            <FiMapPin className="text-[10px]" />
                            {item.organization}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-dim uppercase tracking-widest">
                            <FiCalendar className="text-[10px]" />
                            {item.duration}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-foreground hover:bg-accent hover:text-white transition-all text-sm">
                        <FiEdit2 />
                    </button>
                    <button onClick={() => confirmDelete(item._id)} className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm border border-red-500/10">
                        <FiTrash2 />
                    </button>
                </div>
            </div>
            <p className="text-sm text-text-dim leading-relaxed font-medium">
                {item.description}
            </p>
        </div>
    );
}
