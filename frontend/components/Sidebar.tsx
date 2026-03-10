"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    FiGrid,
    FiMail,
    FiBriefcase,
    FiFileText,
    FiSettings,
    FiUsers,
    FiStar,
    FiLayers,
    FiLogOut,
    FiHome
} from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState("Admin");

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setUserName(JSON.parse(userInfo).name);
        }
    }, []);

    const menuItems = [
        { name: "Overview", icon: FiHome, href: "/dashboard" },
        { name: "Categories", icon: FiLayers, href: "/dashboard/categories" },
        { name: "Messages", icon: FiMail, href: "/dashboard/messages" },
        { name: "Projects", icon: FiBriefcase, href: "/dashboard/projects" },
        { name: "Gallery", icon: FiGrid, href: "/dashboard/gallery" },
        { name: "Resume", icon: FiFileText, href: "/dashboard/resume" },
        { name: "Services", icon: FiGrid, href: "/dashboard/services" },
        { name: "Testimonials", icon: FiStar, href: "/dashboard/testimonials" },
        { name: "Users", icon: FiUsers, href: "/dashboard/users" },
        { name: "Settings", icon: FiSettings, href: "/dashboard/settings" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        router.push("/login");
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-black/[0.05] flex flex-col z-[150] shadow-sm">
            <div className="p-8">
                <Link href="/" className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-accent">GUHAAD</h1>
                </Link>
            </div>

            <div className="flex-1 px-4 ">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? "bg-accent/10 text-accent font-bold border border-accent/20 shadow-sm"
                                    : "text-text-dim hover:bg-accent/5 hover:text-accent"
                                    }`}
                            >
                                <Icon className={`text-xl transition-colors ${isActive ? "text-accent" : "group-hover:text-accent"}`} />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 border-t border-foreground/5">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-black text-xs">
                        {userName[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground truncate w-32">{userName}</span>
                        <span className="text-[10px] text-text-dim uppercase tracking-widest">Administrator</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold"
                >
                    <FiLogOut className="text-xl" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
