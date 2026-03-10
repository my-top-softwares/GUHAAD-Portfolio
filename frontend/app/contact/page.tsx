import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaArrowRight } from "react-icons/fa";

export default function ContactPage() {
    return (
        <main className="relative min-h-screen pt-40 pb-40 overflow-hidden bg-background">
            {/* Super Large Background Text */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0 select-none">
                <h2 className="text-[80px] md:text-[150px] font-bold uppercase tracking-tight text-white/[0.02] leading-none">
                    CONTACT.
                </h2>
            </div>

            {/* Ambient Background Orbs */}
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Headline & Status */}
                    <div className="lg:col-span-12 mb-20">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass mb-10 border border-white/5 shadow-lg">
                            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Open for New Partnerships</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
                            HAVE A PROJECT <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2 italic">IN MIND?</span>
                        </h1>
                    </div>

                    {/* Left Side: Info Tiles (Bento Style) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                            {[
                                { icon: FaEnvelope, label: "Shoot an Email", val: "guhaadcreatives@gmail.com", border: "border-cyan-400/30", glow: "bg-cyan-400/10" },
                                { icon: FaMapMarkerAlt, label: "Current Location", val: "Mogadishu, Somalia", border: "border-rose-400/30", glow: "bg-rose-400/10" },
                                { icon: FaPhoneAlt, label: "Direct Support", val: "+252 61 8240346", border: "border-emerald-400/30", glow: "bg-emerald-400/10" }
                            ].map((item, i) => (
                                <div key={i} className={`glass p-10 rounded-[40px] border ${item.border} hover:scale-[1.02] transition-all duration-500 group cursor-pointer relative overflow-hidden`}>
                                    <div className={`absolute inset-0 ${item.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700"></div>
                                    <item.icon className="text-accent text-2xl mb-6 relative z-10" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim mb-2 relative z-10">{item.label}</p>
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors relative z-10">{item.val}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Social Connect Tile */}
                        <div className="glass p-10 rounded-[40px] border border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim mb-6">Social Ecosystem</p>
                            <div className="flex flex-wrap gap-4">
                                {[FaTwitter, FaLinkedin, FaGithub, FaInstagram].map((Icon, i) => (
                                    <a key={i} href="#" className="w-14 h-14 glass flex items-center justify-center rounded-2xl text-foreground hover:bg-gradient-to-br hover:from-accent hover:to-accent-2 hover:text-white hover:-translate-y-1 transition-all duration-500 border border-white/5">
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: High-End Form */}
                    <div className="lg:col-span-7">
                        <div className="glass p-12 md:p-16 rounded-[60px] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent/10 to-accent-2/5 rounded-full translate-x-20 -translate-y-20 pointer-events-none"></div>
                            <div className="mb-12 relative z-10">
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">Send a Transmission</h3>
                                <p className="text-text-dim text-sm font-normal">Expected response time: <span className="text-accent font-bold">Under 24 hours.</span></p>
                            </div>

                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative group">
                                        <input type="text" className="w-full bg-transparent border-b border-foreground/10 py-4 outline-none focus:border-accent transition-all peer font-normal text-base text-foreground" placeholder="Full Name" />
                                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-focus-within:w-full"></div>
                                    </div>
                                    <div className="relative group">
                                        <input type="email" className="w-full bg-transparent border-b border-foreground/10 py-4 outline-none focus:border-accent transition-all peer font-normal text-base text-foreground" placeholder="Email Address" />
                                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-focus-within:w-full"></div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <input type="text" className="w-full bg-transparent border-b border-foreground/10 py-4 outline-none focus:border-accent transition-all peer font-normal text-base text-foreground" placeholder="Interested In" />
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-focus-within:w-full"></div>
                                </div>

                                <div className="relative group">
                                    <textarea rows={4} className="w-full bg-transparent border-b border-foreground/10 py-4 outline-none focus:border-accent transition-all peer font-normal text-base resize-none text-foreground" placeholder="Message Details"></textarea>
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-focus-within:w-full"></div>
                                </div>

                                <button className="group mt-8 btn-primary w-full py-6 rounded-full font-bold tracking-wide uppercase overflow-hidden relative shadow-2xl">
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        ENGAGE PROJECT <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
