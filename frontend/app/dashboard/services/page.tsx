"use client";
import { useState, useEffect } from "react";
import API from "@/utils/api";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiBriefcase, FiStar } from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";

interface Service {
    _id: string;
    title: string;
    description: string;
    monthlyPrice: number;
    annuallyPrice: number;
    isPopular: boolean;
    features: string[];
    icon: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [monthlyPrice, setMonthlyPrice] = useState(0);
    const [annuallyPrice, setAnnuallyPrice] = useState(0);
    const [isPopular, setIsPopular] = useState(false);
    const [icon, setIcon] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [features, setFeatures] = useState<string[]>([]);

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/services");
            setServices(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch services");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle(""); setDescription(""); setMonthlyPrice(0);
        setAnnuallyPrice(0); setIsPopular(false); setIcon("");
        setFeatures([]); setFeatureInput(""); setIsEditing(false); setCurrentId("");
    };

    const handleOpenAddModal = () => { resetForm(); setIsModalOpen(true); };

    const handleEdit = (service: Service) => {
        setTitle(service.title); setDescription(service.description);
        setMonthlyPrice(service.monthlyPrice); setAnnuallyPrice(service.annuallyPrice);
        setIsPopular(service.isPopular || false); setIcon(service.icon);
        setFeatures(service.features); setCurrentId(service._id);
        setIsEditing(true); setIsModalOpen(true);
    };

    const confirmDelete = (id: string) => { setDeleteId(id); setConfirmOpen(true); };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/services/${deleteId}`);
            setServices(services.filter(s => s._id !== deleteId));
            setDeleteId(null);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete");
        }
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFeatures([...features, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const serviceData = { title, description, monthlyPrice, annuallyPrice, features, isPopular, icon };
        try {
            if (isEditing) {
                const { data } = await API.put(`/services/${currentId}`, serviceData);
                setServices(services.map(s => s._id === currentId ? data : s));
            } else {
                const { data } = await API.post("/services", serviceData);
                setServices([...services, data]);
            }
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    if (loading && services.length === 0) {
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
                    <h1 className="text-3xl font-bold text-foreground mb-1">Services</h1>
                    <p className="text-text-dim text-sm font-medium">Manage and configure your service packages.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="btn-primary flex items-center gap-2 self-start md:self-auto"
                >
                    <FiPlus className="text-lg" />
                    <span>Add New Service</span>
                </button>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl mb-8 font-medium text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service._id}
                        className={`bg-card-bg p-8 rounded-3xl border transition-all group relative overflow-hidden ${
                            service.isPopular
                                ? "border-accent/30 shadow-xl shadow-accent/5"
                                : "border-foreground/5 shadow-sm"
                        }`}
                    >
                        {service.isPopular && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-accent-2"></div>
                        )}
                        {service.isPopular && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-accent-2 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-20 flex items-center gap-1">
                                <FiStar size={10} /> Popular
                            </div>
                        )}
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-xl mb-5 border border-accent/10">
                                <FiBriefcase />
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground tracking-tight">{service.title}</h3>
                                    <p className="text-xs font-semibold text-accent mt-0.5">{service.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-foreground">${service.monthlyPrice}<span className="text-[10px] text-text-dim">/mo</span></div>
                                    <div className="text-sm font-bold text-text-dim">${service.annuallyPrice}<span className="text-[10px]">/yr</span></div>
                                </div>
                            </div>
                            <ul className="space-y-2 mb-6 min-h-[100px]">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-text-dim">
                                        <FiCheck className="text-accent mt-0.5 shrink-0" size={13} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-3 pt-5 border-t border-foreground/5">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-foreground/5 rounded-xl text-xs font-semibold hover:bg-accent/10 hover:text-accent transition-all border border-transparent hover:border-accent/20"
                                >
                                    <FiEdit2 size={13} /> Edit
                                </button>
                                <button
                                    onClick={() => confirmDelete(service._id)}
                                    className="w-10 h-10 flex items-center justify-center bg-red-500/5 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                                >
                                    <FiTrash2 size={13} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* === Premium Modal === */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[1000] flex items-start justify-center p-4 md:p-8 pt-8 md:pt-16"
                    style={{ background: "rgba(5,7,10,0.85)", backdropFilter: "blur(20px)" }}
                >
                    <div
                        className="w-full max-w-2xl rounded-[3rem] overflow-hidden flex flex-col animate-fade-up relative"
                        style={{
                            background: "var(--card-bg)",
                            border: "1px solid var(--glass-border)",
                            boxShadow: "0 40px 120px rgba(0,0,0,0.5)"
                        }}
                    >
                        {/* Gradient bar */}
                        <div className="h-1 w-full bg-gradient-to-r from-accent via-accent-2 to-accent"></div>

                        {/* Header */}
                        <div className="px-10 py-7 flex justify-between items-center border-b border-white/5">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent mb-1">
                                    {isEditing ? "Edit Package" : "New Package"}
                                </p>
                                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                                    {isEditing ? "Update Service" : "Create Service"}
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-11 h-11 glass rounded-2xl flex items-center justify-center text-text-dim hover:text-foreground hover:border-white/20 transition-all duration-300"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Title */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">Service Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full glass rounded-2xl px-5 py-3.5 text-sm font-medium text-foreground border border-white/5 focus:border-accent/40 focus:outline-none transition-all placeholder:text-text-dim/40"
                                        placeholder="e.g. Web Design, Video Editing"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">Short Description</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full glass rounded-2xl px-5 py-3.5 text-sm font-medium text-foreground border border-white/5 focus:border-accent/40 focus:outline-none transition-all placeholder:text-text-dim/40"
                                        placeholder="e.g. Perfect for individuals and startups"
                                        required
                                    />
                                </div>

                                {/* Monthly Price */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">Monthly Price ($)</label>
                                    <input
                                        type="number"
                                        value={monthlyPrice}
                                        onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                                        className="w-full glass rounded-2xl px-5 py-3.5 text-sm font-medium text-foreground border border-white/5 focus:border-accent/40 focus:outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Annual Price */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">Annual Price ($)</label>
                                    <input
                                        type="number"
                                        value={annuallyPrice}
                                        onChange={(e) => setAnnuallyPrice(Number(e.target.value))}
                                        className="w-full glass rounded-2xl px-5 py-3.5 text-sm font-medium text-foreground border border-white/5 focus:border-accent/40 focus:outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Popular Toggle */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-4 cursor-pointer group glass px-5 py-4 rounded-2xl border border-white/5 hover:border-accent/30 transition-all">
                                        <div
                                            className={`w-10 h-6 rounded-full transition-all duration-300 relative shrink-0 ${isPopular ? "bg-gradient-to-r from-accent to-accent-2" : "bg-foreground/10"}`}
                                            onClick={() => setIsPopular(!isPopular)}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${isPopular ? "left-5" : "left-1"}`}></div>
                                        </div>
                                        <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} className="sr-only" />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Featured Package</p>
                                            <p className="text-xs text-text-dim">Show as &quot;Most Popular&quot; with special styling</p>
                                        </div>
                                        {isPopular && (
                                            <span className="ml-auto text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-accent to-accent-2 text-white shrink-0">Popular</span>
                                        )}
                                    </label>
                                </div>

                                {/* Icon */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">Icon Name <span className="normal-case italic">(e.g. Palette, Video, Layers)</span></label>
                                    <input
                                        type="text"
                                        value={icon}
                                        onChange={(e) => setIcon(e.target.value)}
                                        className="w-full glass rounded-2xl px-5 py-3.5 text-sm font-medium text-foreground border border-white/5 focus:border-accent/40 focus:outline-none transition-all placeholder:text-text-dim/40"
                                        placeholder="Palette, Video, Layers, BarChart3, Gem..."
                                    />
                                </div>

                                {/* Features */}
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">Features</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={featureInput}
                                            onChange={(e) => setFeatureInput(e.target.value)}
                                            className="flex-1 glass rounded-2xl px-5 py-3.5 text-sm font-medium text-foreground border border-white/5 focus:border-accent/40 focus:outline-none transition-all placeholder:text-text-dim/40"
                                            placeholder="Type a feature and press Add..."
                                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddFeature}
                                            className="px-6 bg-gradient-to-r from-accent to-accent-2 text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 min-h-[52px] p-4 glass rounded-2xl border border-dashed border-white/10">
                                        {features.map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent px-4 py-1.5 rounded-xl text-xs font-semibold">
                                                <span>{feat}</span>
                                                <button type="button" onClick={() => removeFeature(i)} className="hover:text-red-400 transition-colors">
                                                    <FiX size={11} />
                                                </button>
                                            </div>
                                        ))}
                                        {features.length === 0 && (
                                            <p className="text-xs text-text-dim/40 italic self-center mx-auto">No features added yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-5 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 rounded-2xl font-semibold text-sm text-text-dim glass border border-white/5 hover:border-white/15 hover:text-foreground transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-accent to-accent-2 text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                                >
                                    <FiCheck size={16} />
                                    {isEditing ? "Update Service" : "Publish Service"}
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
                title="Delete Service?"
                message="Are you sure you want to delete this service package?"
            />
        </div>
    );
}
