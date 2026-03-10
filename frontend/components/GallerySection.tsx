"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import API from "@/utils/api";

interface GalleryItem {
    _id: string;
    title: string;
    category: string;
    media: {
        url: string;
        type: "image" | "video";
    };
    featured: boolean;
}

export default function GallerySection() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await API.get("/gallery");
                // Only show featured items on home page, up to 6 for the layout
                const featured = data.filter((item: any) => item.featured).slice(0, 6);
                setItems(featured);
            } catch (error) {
                console.error("Home gallery fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const getLayoutClasses = (index: number) => {
        switch (index) {
            case 0: return "md:row-span-2 lg:row-span-2"; // Large Vertical
            case 3: return "lg:col-span-2"; // Medium Horizontal
            case 4: return "lg:col-span-2"; // Medium Horizontal
            default: return ""; // Small
        }
    };

    if (loading) {
        return (
            <section className="py-8 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="rounded-[40px] bg-foreground/5 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (items.length === 0) return null;

    return (
        <section className="py-8 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h4 className="text-accent text-xs font-semibold uppercase tracking-wider mb-4">Visual Showcase</h4>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase mb-6">Selected Works.</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] mb-20">
                    {items.map((item, index) => (
                        <div
                            key={item._id}
                            className={`group relative rounded-[40px] overflow-hidden glass hover:border-accent/40 transition-all duration-700 ${getLayoutClasses(index)}`}
                        >
                            {item.media.type === "video" ? (
                                <video
                                    src={item.media.url}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <Image
                                    src={item.media.url}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-all duration-1000"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10">
                                <span className="text-accent text-xs font-semibold uppercase tracking-wide mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                    {item.category}
                                </span>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-700 [transition-delay:100ms]">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/gallery" className="btn-primary px-16 py-8 rounded-full group inline-flex items-center gap-6">
                        SEE FULL GALLERY
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
