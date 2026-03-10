"use client";
import { useState, useEffect } from "react";
import API from "@/utils/api";
import { FiSettings, FiMail, FiLock, FiBell, FiCheck, FiRefreshCw, FiAlertCircle } from "react-icons/fi";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [formData, setFormData] = useState({
        emailUser: "",
        emailPass: "",
        notificationEmail: ""
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const { data } = await API.get("/settings");
                if (data && data._id) {
                    setFormData({
                        emailUser: data.emailUser || "",
                        emailPass: data.emailPass || "",
                        notificationEmail: data.notificationEmail || ""
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error("Fetch settings error:", error);
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage({ type: "", text: "" });
            await API.post("/settings", formData);
            setMessage({ type: "success", text: "Settings updated successfully!" });
            setSaving(false);
        } catch (error) {
            console.error("Save settings error:", error);
            setMessage({ type: "error", text: "Failed to update settings." });
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-up max-w-4xl">
            <header className="mb-12">
                <h1 className="text-5xl font-black uppercase tracking-tighter text-foreground mb-3 leading-none">Global Settings</h1>
                <p className="text-text-dim font-black text-[10px] uppercase tracking-[0.3em]">Configure your system architecture</p>
            </header>

            {message.text && (
                <div className={`mb-8 p-6 rounded-2xl flex items-center gap-4 animate-fade-in ${message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                    {message.type === "success" ? <FiCheck /> : <FiAlertCircle />}
                    <span className="text-xs font-bold uppercase tracking-widest">{message.text}</span>
                </div>
            )}

            <div className="bg-white p-12 rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.1)] relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Email Configuration Section */}
                        <div className="md:col-span-2 flex items-center gap-4 pb-4 border-b border-foreground/5">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                <FiMail size={20} />
                            </div>
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">SMTP Configuration</h3>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="name@domain.com"
                                className="w-full bg-foreground/5 border-2 border-transparent focus:border-accent/20 rounded-2xl p-5 text-sm font-bold text-foreground transition-all outline-none"
                                value={formData.emailUser}
                                onChange={(e) => setFormData({ ...formData, emailUser: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                                App Password / Secret
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="w-full bg-foreground/5 border-2 border-transparent focus:border-accent/20 rounded-2xl p-5 text-sm font-bold text-foreground transition-all outline-none pr-12"
                                    value={formData.emailPass}
                                    onChange={(e) => setFormData({ ...formData, emailPass: e.target.value })}
                                    required
                                />
                                <FiLock className="absolute right-5 top-1/2 -translate-y-1/2 text-text-dim/30" />
                            </div>
                        </div>

                        {/* Notification Section */}
                        <div className="md:col-span-2 flex items-center gap-4 pb-4 border-b border-foreground/5 mt-6">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                <FiBell size={20} />
                            </div>
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Notification Channels</h3>
                        </div>

                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                                Forward Inquiries To
                            </label>
                            <input
                                type="email"
                                placeholder="admin@domain.com"
                                className="w-full bg-foreground/5 border-2 border-transparent focus:border-accent/20 rounded-2xl p-5 text-sm font-bold text-foreground transition-all outline-none"
                                value={formData.notificationEmail}
                                onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
                                required
                            />
                            <p className="text-[9px] text-text-dim font-medium italic mt-2 ml-1">
                                All new messages from the contact form will be forwarded to this address.
                            </p>
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col md:flex-row gap-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-accent text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-accent/20 border-b-6 border-black/20 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {saving ? <FiRefreshCw className="animate-spin" /> : <FiCheck />}
                            {saving ? "Deploying..." : "Sync Systems"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-12 p-10 bg-accent/5 rounded-[2.5rem] border border-accent/10">
                <div className="flex items-start gap-4">
                    <FiSettings className="text-accent text-xl mt-1" />
                    <div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight mb-2">Technical Note</h4>
                        <p className="text-xs text-text-dim font-medium leading-relaxed">
                            These settings control the backend core. Ensure SMTP credentials are correct to enable automatic email delivery for visitors who use your contact portal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
