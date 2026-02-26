import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, GraduationCap, BookOpen, TrendingUp, Activity, Bell, CheckCircle, XCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const CountUp = ({ to, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(to, 10);
        if (start === end) return;

        let incrementTime = Math.abs(Math.floor((duration * 1000) / end));
        if (incrementTime < 10) incrementTime = 10;

        let timer = setInterval(() => {
            start += Math.ceil(end / (duration * 100));
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [to, duration]);

    return <span>{count.toLocaleString()}</span>;
};

const Dashboard = () => {
    const { currentUser, notifications, setNotifications, setAttendance } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const stats = [
        { title: 'Total Departments', value: 12, icon: Building2, color: 'electric-blue', trend: '+2%' },
        { title: 'Faculty Members', value: 248, icon: Users, color: 'royal-purple', trend: '+5%' },
        { title: 'Enrolled Students', value: 4500, icon: GraduationCap, color: 'emerald-glow', trend: '+12%' },
        { title: 'Active Courses', value: 312, icon: BookOpen, color: 'luxury-gold', trend: '+8%' },
    ];

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } } };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-extrabold text-white text-glow mb-2">Platform Overview</h1>
                    <p className="text-slate-400 font-medium">Real-time system metrics and intelligence.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <button className="glass-card hover:bg-electric-blue/20 transition-all border border-electric-blue/30 text-electric-blue px-6 py-2 rounded-xl flex items-center space-x-2 shadow-glow-blue">
                        <Activity size={18} />
                        <span className="font-semibold">Live Feed</span>
                    </button>
                </motion.div>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={index} variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="relative p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card overflow-hidden group">
                            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`p-3 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20 text-${stat.color} shadow-glow-${stat.color.split('-')[1] || 'blue'}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex items-center space-x-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg text-xs font-bold border border-emerald-400/20">
                                    <TrendingUp size={14} />
                                    <span>{stat.trend}</span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-4xl font-black text-white mb-1"><CountUp to={stat.value} duration={1.5} /></h3>
                                <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">{stat.title}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="w-full">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full h-96 glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-glow/5 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Weekly Attendance Overview</h2>
                            <p className="text-sm font-medium text-slate-400">Visualization of average student attendance percentage across the week.</p>
                        </div>
                        <div className="flex space-x-2">
                            <span className="px-3 py-1 text-sm rounded-lg bg-emerald-glow/10 border border-emerald-glow/20 text-emerald-glow font-bold">
                                This Week
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 border border-glass-border/50 rounded-xl relative flex items-end justify-between p-4 px-8 bg-slate-900/20">
                        {[
                            { day: 'Mon', percentage: 92 },
                            { day: 'Tue', percentage: 88 },
                            { day: 'Wed', percentage: 95 },
                            { day: 'Thu', percentage: 85 },
                            { day: 'Fri', percentage: 90 },
                            { day: 'Sat', percentage: 76 },
                        ].map((data, i) => (
                            <div key={i} className="flex flex-col items-center justify-end h-full flex-1">
                                <motion.div initial={{ height: 0 }} animate={{ height: `${data.percentage}%` }} transition={{ delay: 0.5 + i * 0.05, type: 'spring' }} className="w-12 sm:w-16 rounded-t-lg bg-gradient-to-t from-emerald-glow/10 to-emerald-glow/80 border-t border-emerald-glow/50 relative group mb-2">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-emerald-glow/20 pointer-events-none text-white font-bold whitespace-nowrap">
                                        {data.percentage}%
                                    </div>
                                </motion.div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{data.day}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Dashboard;
