"use client";
import { useState, useEffect } from "react";
import API from "@/utils/api";
import toast from "react-hot-toast";
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUser, FiMail, FiLock, FiShield, FiActivity } from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "employee";
    isActive: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Confirm state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"admin" | "employee">("employee");
    const [isActive, setIsActive] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/users");
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch users error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("employee");
        setIsActive(true);
        setEditId(null);
        setIsEditing(false);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditId(user._id);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setIsActive(user.isActive);
        setPassword(""); // Don't show password
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData: any = { name, email, role, isActive };
            if (password) userData.password = password;

            if (isEditing && editId) {
                await API.put(`/users/${editId}`, userData);
                toast.success("User updated successfully");
            } else {
                await API.post("/users", userData);
                toast.success("User added successfully");
            }
            fetchUsers();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/users/${deleteId}`);
            toast.success("User deleted successfully");
            fetchUsers();
            setDeleteId(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Deletion failed");
        }
    };

    return (
        <div className="animate-fade-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter text-foreground mb-3 leading-none">Internal Registry</h1>
                    <p className="text-text-dim font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                        <FiShield className="text-accent" /> Secure User Management & Permissions
                    </p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    <FiPlus size={18} /> Add User
                </button>
            </header>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {users.map((user) => (
                        <div key={user._id} className="bg-card-bg p-8 rounded-[3rem] border border-foreground/5 shadow-sm group hover:shadow-2xl hover:border-accent/20 transition-all relative overflow-hidden">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-accent/10 flex items-center justify-center text-accent font-black text-xl shadow-inner uppercase">
                                        {user.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-foreground uppercase tracking-tight truncate max-w-[150px]">{user.name}</h3>
                                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest opacity-60">{user.role}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${user.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    {user.isActive ? 'Active' : 'Disabled'}
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-text-dim font-bold text-xs">
                                    <FiMail className="text-accent/50" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-dim font-bold text-[9px] uppercase tracking-widest">
                                    <FiActivity className="text-accent/50" />
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-foreground/5">
                                <button
                                    onClick={() => handleOpenEditModal(user)}
                                    className="flex-1 py-3 bg-foreground/[0.03] text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <FiEdit2 size={12} /> Edit
                                </button>
                                <button
                                    onClick={() => confirmDelete(user._id)}
                                    className="px-4 py-3 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Premium User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 md:p-8 bg-white/80 backdrop-blur-xl animate-fade-in   pt-10 md:pt-22 ">
                    <div className="bg-white w-full max-w-xl rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-zoom-in relative min-h-[600px]">
                        <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-200/50">
                                    <FiUser size={24} />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                                    {isEditing ? "Modify Credentials" : "Issue Access"}
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all hover:rotate-90 duration-300 border border-slate-200/50"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-10">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">FullName</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-12 py-4 text-sm font-bold text-foreground transition-all outline-none"
                                            placeholder="e.g. John Doe"
                                            required
                                        />
                                        <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim/40" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Email </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-12 py-4 text-sm font-bold text-foreground transition-all outline-none"
                                            placeholder="name@company.com"
                                            required
                                        />
                                        <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim/40" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">
                                        {isEditing ? "Enter New password" : "Password"}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 focus:bg-background rounded-2xl px-12 py-4 text-sm font-bold text-foreground transition-all outline-none"
                                            placeholder="••••••••••••"
                                            required={!isEditing}
                                        />
                                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim/40" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Admin</label>
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value as any)}
                                            className="w-full bg-foreground/[0.03] border-2 border-transparent focus:border-accent/30 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground transition-all outline-none cursor-pointer"
                                        >
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                </div>
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
                                    className="flex-[2] bg-slate-900 text-white font-black py-6 rounded-[1.8rem] uppercase tracking-widest text-[11px] hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <FiCheck size={18} className="text-accent" />
                                    <span>{isEditing ? "Update " : "Create"}</span>
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
                title="Delete User?"
                message="Are you sure you want to revoke this user&apos;s registry access? They will no longer be able to manage the portfolio."
            />
        </div>
    );
}
