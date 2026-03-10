"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaRocket, FaGem, FaCrown, FaArrowRight, FaClock } from "react-icons/fa";
import Link from "next/link";
import API from "@/utils/api";

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
    const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUALLY">("MONTHLY");
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await API.get("/services");
                setServices(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching services:", error);
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const getIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('starter')) return FaRocket;
        if (n.includes('premium')) return FaGem;
        if (n.includes('ultimate')) return FaCrown;
        return FaClock;
    };

    return (
        <section className="relative py-40 px-6 md:px-12 lg:px-24 min-h-screen bg-background">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 animate-fade-up">
                    <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass border border-white/5 shadow-lg mb-8">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Professional Packages</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 leading-none tracking-tighter uppercase">
                        CHOOSE YOUR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2 italic">STRATEGY.</span>
                    </h1>
                    <p className="text-text-dim text-lg max-w-xl mx-auto font-medium leading-relaxed">Premium packages tailored to elevate your brand with precision and creative excellence.</p>
                </div>

                {/* Plan Toggle */}
                <div className="flex justify-center mb-24 animate-fade-up stagger-1">
                    <div className="glass p-2 rounded-[40px] flex items-center gap-1 border border-white/5 shadow-2xl">
                        <button
                            onClick={() => setBillingCycle("MONTHLY")}
                            className={`px-10 py-4 font-black text-[10px] uppercase tracking-[0.2em] rounded-3xl transition-all duration-500 ${
                                billingCycle === "MONTHLY"
                                    ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-xl shadow-accent/25 scale-105"
                                    : "text-text-dim hover:text-foreground"
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle("ANNUALLY")}
                            className={`px-10 py-4 font-black text-[10px] uppercase tracking-[0.2em] rounded-3xl transition-all duration-500 ${
                                billingCycle === "ANNUALLY"
                                    ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-xl shadow-accent/25 scale-105"
                                    : "text-text-dim hover:text-foreground"
                            }`}
                        >
                            Annually <span className="text-emerald-400 text-[8px] font-black">SAVE 20%</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {services.map((plan, i) => {
                            const Icon = getIcon(plan.title);
                            const currentPrice = billingCycle === "MONTHLY" ? plan.monthlyPrice : plan.annuallyPrice;

                            return (
                                <div
                                    key={plan._id}
                                    className={`group relative bg-card-bg rounded-[48px] flex flex-col transition-all duration-700 hover:-translate-y-6 hover:shadow-2xl animate-fade-up border overflow-hidden ${
                                        plan.isPopular
                                            ? 'border-accent/40 shadow-2xl shadow-accent/10 scale-105 z-10'
                                            : 'border-white/5'
                                    }`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-2"></div>
                                    )}
                                    {plan.isPopular && (
                                        <div className="absolute top-6 right-6 bg-gradient-to-r from-accent to-accent-2 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg z-20">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <div className="p-12 pb-8 relative">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-accent/10 to-accent-2/5 rounded-bl-[80px] -z-0 group-hover:scale-110 transition-transform"></div>

                                        <div className="flex justify-between items-start mb-10 relative z-10">
                                            <div>
                                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-1 text-foreground">{plan.title}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent italic">{plan.description}</p>
                                            </div>
                                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${
                                                plan.isPopular
                                                    ? 'bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/30'
                                                    : 'bg-white/5 border border-white/10'
                                            }`}>
                                                <Icon className={`text-3xl ${plan.isPopular ? 'text-white' : 'text-accent'} group-hover:scale-110 transition-transform`} />
                                            </div>
                                        </div>

                                        <div className="flex items-baseline gap-2 mb-8 relative z-10">
                                            <span className="text-6xl font-black tracking-tighter text-foreground">
                                                ${currentPrice}
                                            </span>
                                            <span className="text-text-dim font-black text-[10px] uppercase tracking-[0.2em]">
                                                {billingCycle === "MONTHLY" ? "/Month" : "/Year"}
                                            </span>
                                        </div>
                                        <div className={`h-1 w-full rounded-full ${
                                            plan.isPopular
                                                ? 'bg-gradient-to-r from-accent to-accent-2'
                                                : 'bg-white/5'
                                        }`}></div>
                                    </div>

                                    <div className="p-12 pt-4 flex-grow">
                                        <ul className="space-y-6">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-4 text-text-dim group/item hover:text-foreground transition-colors">
                                                    <div className="w-7 h-7 rounded-xl bg-foreground/5 flex items-center justify-center group-hover/item:bg-accent/10 group-hover/item:border-accent transition-all shrink-0 border border-transparent">
                                                        <FaCheck className="text-accent text-xs" />
                                                    </div>
                                                    <span className="text-sm font-bold uppercase tracking-tight">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="p-10 text-center relative z-10">
                                        <Link
                                            href={`https://wa.me/252618240346?text=Hello, I am interested in the ${plan.title} package (${billingCycle} billing)`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-full py-5 rounded-2xl block font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 ${
                                                plan.isPopular
                                                    ? 'bg-gradient-to-r from-accent to-accent-2 text-white shadow-xl shadow-accent/30 hover:scale-[1.03] hover:shadow-accent/50'
                                                    : 'bg-white/5 text-foreground hover:bg-white/10 border border-white/10'
                                            }`}
                                        >
                                            GET STARTED <FaArrowRight className="inline ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
