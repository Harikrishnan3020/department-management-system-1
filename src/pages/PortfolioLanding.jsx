import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Database, Shield, Zap, Layers, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioLanding = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
    const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

    return (
        <div className="min-h-screen relative overflow-hidden text-slate-300">

            {/* Dynamic Backgrounds (Parallax) */}
            <motion.div style={{ y: y1 }} className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-electric-blue/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
            <motion.div style={{ y: y2 }} className="absolute top-[20%] -right-40 w-[600px] h-[600px] bg-royal-purple/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-card border-b border-glass-border px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-emerald-glow flex items-center justify-center shadow-glow-blue cursor-pointer">
                        <span className="text-xl font-black text-white tracking-widest">D</span>
                    </div>
                    <span className="text-2xl font-extrabold tracking-tighter text-white">DMS <span className="text-electric-blue">Pro</span></span>
                </div>
                <div className="hidden md:flex flex-1 justify-center space-x-8 text-sm font-semibold tracking-wide text-slate-400">
                    <a href="#features" className="hover:text-white transition-colors">Platform</a>
                    <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
                    <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
                    <a href="#preview" className="hover:text-white transition-colors">Interface</a>
                    <a href="#team" className="hover:text-white transition-colors">Company</a>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="hidden sm:block px-5 py-2 text-sm font-bold text-white hover:text-electric-blue transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <motion.section
                style={{ opacity: opacityHero }}
                className="relative pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center z-10 min-h-screen"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, type: "spring", stiffness: 100 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="inline-flex items-center space-x-2 bg-glass-bg border border-glass-border rounded-full px-4 py-1.5 mb-8 shadow-glass-card">
                        <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">v2.0 Beta is Live</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-8 leading-[1.1]">
                        Next Generation <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue via-royal-purple to-emerald-glow animate-gradient-x text-glow">
                            Academic OS.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                        A beautifully designed, deeply integrated workspace for forward-thinking educational institutions. Experience zero-latency administration.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-white text-slate-900 rounded-full font-extrabold text-lg flex items-center space-x-3 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] w-full sm:w-auto justify-center"
                        >
                            <span>Explore Platform</span>
                            <ArrowRight size={20} />
                        </button>
                        <button className="px-8 py-4 glass-card border border-glass-border text-white rounded-full font-bold text-lg flex items-center space-x-3 hover:bg-white/10 transition-colors w-full sm:w-auto justify-center group">
                            <Play className="text-emerald-glow group-hover:scale-110 transition-transform" size={20} fill="currentColor" />
                            <span>Watch Keynote</span>
                        </button>
                    </div>
                </motion.div>

                {/* 3D Dashboard Mockup Presentation */}
                <motion.div
                    initial={{ opacity: 0, y: 150, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1.5, delay: 0.2, type: "spring" }}
                    className="mt-24 relative w-full max-w-6xl rounded-[2.5rem] p-4 glass-card border border-glass-border shadow-[0_30px_100px_rgba(0,0,0,0.8)] perspective-1000 mx-auto group"
                >
                    {/* Animated border line */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-electric-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-700 relative aspect-video flex items-center justify-center">
                        {/* Realistically, this would be an image or video, but we use a sleek UI mockup */}
                        <div className="absolute inset-0 bg-slate-950 flex flex-col">
                            {/* Fake topbar */}
                            <div className="h-12 border-b border-white/5 flex items-center px-4 space-x-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="flex-1 flex p-4 space-x-4">
                                {/* Fake Sidebar */}
                                <div className="w-48 bg-slate-900/50 rounded-xl border border-white/5 p-4 space-y-4 pb-20">
                                    <div className="w-full h-8 bg-slate-800 rounded-lg"></div>
                                    <div className="w-3/4 h-4 bg-slate-800 rounded-md"></div>
                                    <div className="w-5/6 h-4 bg-slate-800 rounded-md"></div>
                                    <div className="w-full h-4 bg-royal-purple/50 rounded-md shadow-glow-purple"></div>
                                </div>
                                {/* Fake main */}
                                <div className="flex-1 flex flex-col space-y-4">
                                    <div className="h-24 flex space-x-4">
                                        <div className="flex-1 bg-electric-blue/10 rounded-xl border border-electric-blue/20 p-4"></div>
                                        <div className="flex-1 bg-emerald-glow/10 rounded-xl border border-emerald-glow/20 p-4"></div>
                                        <div className="flex-1 bg-luxury-gold/10 rounded-xl border border-luxury-gold/20 p-4"></div>
                                    </div>
                                    <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/5 flex p-4 space-x-4">
                                        <div className="flex-1 rounded-xl bg-slate-800/50 relative overflow-hidden">
                                            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-electric-blue/20 to-transparent"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6 bg-slate-950/50 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-sm font-black text-electric-blue tracking-widest uppercase mb-4">Core Architecture</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white text-glow mb-6">Designed for scale. <br /> Engineered for speed.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Real-time Sync", desc: "Global state management pushing instant updates across all active department portals.", icon: Zap, color: "electric-blue" },
                            { title: "Military-grade Security", desc: "End-to-end encrypted databases safeguarding sensitive student academic records.", icon: Shield, color: "emerald-glow" },
                            { title: "Distributed Cloud Data", desc: "Serverless architecture ensuring 99.99% uptime during heavy registration periods.", icon: Globe, color: "royal-purple" },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                className="glass-card p-10 rounded-[2rem] border border-glass-border shadow-glass-card hover:bg-white/5 transition-colors group"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-${f.color}/10 flex items-center justify-center text-${f.color} mb-8 shadow-glow-${f.color.split('-')[1] || 'blue'} group-hover:scale-110 transition-transform duration-500`}>
                                    <f.icon size={32} />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-4">{f.title}</h4>
                                <p className="text-slate-400 leading-relaxed font-medium">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="py-32 px-6 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-sm font-black text-electric-blue tracking-widest uppercase mb-4">User Feedback</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white text-glow mb-6">What people are saying</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Dr. Sarah Jenkins", role: "Head of IT", text: "The new DMS Pro has completely transformed how we handle attendance and faculty management. Truly a masterpiece.", avatar: "https://i.pravatar.cc/150?u=sarah" },
                            { name: "Michael Chen", role: "Senior Faculty", text: "Coursera integration and Google forms in one place? It saves me hours every week. The interface is incredibly premium.", avatar: "https://i.pravatar.cc/150?u=michael" },
                            { name: "Emily Rogers", role: "Student Council", text: "Marking attendance with geolocation is so cool! The whole platform feels like something out of a sci-fi movie. I love it.", avatar: "https://i.pravatar.cc/150?u=emily" }
                        ].map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                className="glass-card p-8 rounded-[2rem] border border-glass-border shadow-glass-card hover:border-electric-blue/30 transition-colors flex flex-col"
                            >
                                <div className="flex text-amber-400 mb-6 space-x-1">
                                    {[1, 2, 3, 4, 5].map(star => <span key={star}>★</span>)}
                                </div>
                                <p className="text-slate-300 font-medium leading-relaxed mb-8 flex-1 italic">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center space-x-4 border-t border-white/10 pt-6">
                                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-electric-blue" />
                                    <div>
                                        <h4 className="text-white font-bold">{review.name}</h4>
                                        <span className="text-xs text-electric-blue uppercase tracking-wider font-semibold">{review.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ultra Premium CTA */}
            <section className="py-32 px-6 relative z-20 border-t border-glass-border">
                <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 via-transparent to-royal-purple/10 pointer-events-none mix-blend-screen animate-pulse duration-1000"></div>

                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 relative z-10">
                        Ready to upgrade your institution?
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium relative z-10">
                        Join the ranks of elite universities running on DMS Pro. Deploy your custom workspace in minutes, not months.
                    </p>
                    <div className="relative z-10">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-10 py-5 bg-white text-slate-900 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                        >
                            Start Your Free Trial
                        </button>
                    </div>
                </div>
            </section>

            <footer className="py-8 border-t border-glass-border bg-slate-950 text-center relative z-20">
                <p className="text-slate-500 font-semibold tracking-wide">&copy; 2026 Department Management System. Crafted with precision.</p>
            </footer>
        </div>
    );
};

export default PortfolioLanding;
