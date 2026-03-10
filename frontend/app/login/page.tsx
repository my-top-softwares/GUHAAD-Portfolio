"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/utils/api";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            router.push("/dashboard");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await API.post("/auth/login", { email, password });
            localStorage.setItem("userInfo", JSON.stringify(data));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-lg bg-white p-14 rounded-[4rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.15)] relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-gradient">Welcome Back</h1>
                    <p className="text-text-dim text-sm font-medium">Please enter your credentials to access the dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-dim mb-2 ml-1">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-4 text-foreground focus:outline-none focus:border-accent transition-all placeholder:text-text-dim/50"
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-dim mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-4 text-foreground focus:outline-none focus:border-accent transition-all placeholder:text-text-dim/50"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "AUTHENTICATING..." : "SIGN IN"}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-text-dim">
                    <Link href="/" className="hover:text-accent transition-colors font-bold uppercase tracking-widest">Return to Home</Link>
                </div>
            </div>
        </div>
    );
}
