"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaPlay, FaXmark } from "react-icons/fa6";
import API from "@/utils/api";

interface GalleryItem {
    _id: string;
    title: string;
    category: string;
    media: {
        url: string;
        type: "image" | "video";
    };
}

export default function PublicGalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await API.get("/gallery");
                setItems(data);
            } catch (error) {
                console.error("Gallery page fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen py-40 px-6 md:px-12 lg:px-24 relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                <header className="mb-24 text-center animate-fade-up">
                    <span className="text-accent text-xs font-semibold uppercase tracking-[0.4em] mb-4 block">Visual Vault</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground mb-6">
                        GALLERY <br /> <span className="text-accent italic">REEL.</span>
                    </h1>
                    <p className="text-text-dim max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
                        A curated collection of visual storytelling, motion design, and cinematic capture.
                    </p>
                </header>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 animate-fade-up stagger-1">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => setSelectedItem(item)}
                            className="relative rounded-[2.5rem] overflow-hidden group cursor-pointer border border-foreground/5 shadow-lg glass break-inside-avoid shadow-black/5"
                        >
                            {item.media.type === "video" ? (
                                <div className="relative aspect-video">
                                    <video
                                        src={item.media.url}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        muted
                                        loop
                                        playsInline
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 group-hover:scale-125 transition-transform duration-500">
                                            <FaPlay />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={item.media.url}
                                    alt={item.title}
                                    className="w-full h-auto group-hover:scale-110 transition-transform duration-1000"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                <span className="text-accent text-[10px] font-black uppercase tracking-widest mb-1">{item.category}</span>
                                <h3 className="text-white text-lg font-black uppercase tracking-tight">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 animate-fade-in"
                    onClick={() => setSelectedItem(null)}
                >
                    <button
                        className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all z-10"
                        onClick={() => setSelectedItem(null)}
                    >
                        <FaXmark size={24} />
                    </button>

                    <div className="relative w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden shadow-2xl animate-zoom-in group" onClick={e => e.stopPropagation()}>
                        {selectedItem.media.type === "video" ? (
                            <video
                                src={selectedItem.media.url}
                                className="w-full h-full object-contain"
                                controls
                                autoPlay
                            />
                        ) : (
                            <img
                                src={selectedItem.media.url}
                                className="w-full h-full object-contain"
                                alt={selectedItem.title}
                            />
                        )}
                        <div className="absolute bottom-10 left-10 p-8 glass rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-accent text-xs font-black uppercase tracking-widest mb-2 block">{selectedItem.category}</span>
                            <h2 className="text-white text-3xl font-black uppercase tracking-tight">{selectedItem.title}</h2>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
