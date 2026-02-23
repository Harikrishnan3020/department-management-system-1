import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, GraduationCap, BookOpen, Bell } from 'lucide-react';
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
    const { currentUser, notifications, setNotifications, setAttendance, departments, faculty, students, courses, attendance } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    // Use real data from context
    const todayDate = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === todayDate);
    const presentToday = todayAttendance.filter(a => a.status === 'Present').length;

    const stats = [
        { title: 'Departments', value: departments.length, icon: Building2, color: 'electric-blue' },
        { title: 'Faculty Members', value: faculty.length, icon: Users, color: 'royal-purple' },
        { title: 'Enrolled Students', value: students.length, icon: GraduationCap, color: 'emerald-glow' },
        { title: 'Active Courses', value: courses.length, icon: BookOpen, color: 'luxury-gold' },
    ];

    const handleApproveOD = (notifIndex, studentId) => {
        // Find attendance record and update
        setAttendance(prev => prev.map(a => (a.studentId === studentId && a.status === 'OD Pending') ? { ...a, status: 'OD Approved' } : a));
        // Remove notification and add one for student
        setNotifications(prev => [
            { type: 'OD Approved', to: studentId, message: 'Your OD request has been approved by the Faculty/HOD.' },
            ...prev.filter((_, i) => i !== notifIndex)
        ]);
        alert('OD Request Approved');
    };

    const handleRejectOD = (notifIndex, studentId) => {
        setAttendance(prev => prev.map(a => (a.studentId === studentId && a.status === 'OD Pending') ? { ...a, status: 'Absent' } : a));
        setNotifications(prev => [
            { type: 'OD Denied', to: studentId, message: 'Your OD request was denied. Attendance marked as absent.' },
            ...prev.filter((_, i) => i !== notifIndex)
        ]);
        alert('OD Request Rejected');
    };

    // Filter notifications: Admins/Faculty see incoming requests (no 'to', or specific types like 'OD Request', 'Form Completed').
    // Students see personal ones ('to' === their ID) and broadcasted 'General' or 'Google Form'.
    const userNotifications = isAuthorized
        ? notifications.filter(n => !n.to || n.type === 'Form Completed' || n.type === 'OD Request')
        : notifications.filter(n => n.to === currentUser?.id || n.type === 'General' || n.type === 'Google Form' || n.type === 'Coursera Assignment');

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } } };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-extrabold text-white text-glow mb-2">Platform Overview</h1>
                    <p className="text-slate-400 font-medium">Real-time system metrics from your data.</p>
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
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-4xl font-black text-white mb-1"><CountUp to={stat.value} duration={1.5} /></h3>
                                <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">{stat.title}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className={`grid grid-cols-1 ${isAuthorized ? 'lg:grid-cols-3' : 'lg:grid-cols-3'} gap-8`}>
                {/* Notifications Panel (Action Center) */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6 flex flex-col h-96">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                            <Bell className="text-luxury-gold" size={20} />
                            <span>Notifications</span>
                        </h2>
                        {userNotifications.length > 0 && (
                            <span className="px-2 py-0.5 bg-luxury-gold/20 text-luxury-gold rounded-full text-xs font-black">{userNotifications.length}</span>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {userNotifications.length === 0 ? (
                            <div className="text-center text-slate-500 py-8">No new notifications.</div>
                        ) : (
                            userNotifications.map((notif, i) => {
                                // Provide the actual index in the global notifications array for handlers
                                const actualIndex = notifications.indexOf(notif);
                                return (
                                    <div key={i} className="bg-slate-900/60 border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${notif.type.includes('OD') ? 'bg-electric-blue' : notif.type.includes('Absent') ? 'bg-rose-500' : notif.type.includes('Coursera') ? 'bg-emerald-500' : 'bg-luxury-gold'}`}></span>
                                            <h4 className="text-white font-bold text-sm">{notif.type}</h4>
                                        </div>
                                        <p className="text-xs text-slate-400 pl-4">{notif.message}</p>

                                        {isAuthorized && notif.type === 'OD Request' && (
                                            <div className="flex space-x-2 mt-3 pl-4">
                                                <button onClick={() => handleApproveOD(actualIndex, notif.from)} className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 text-xs font-bold transition border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Approve</button>
                                                <button onClick={() => handleRejectOD(actualIndex, notif.from)} className="px-4 py-1.5 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/30 text-xs font-bold transition border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]">Deny</button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </motion.div>

                {/* Analytics */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 w-full h-96 glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-royal-purple/5 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h2 className="text-2xl font-bold text-white">Attendance Overview (Last 7 Days)</h2>
                        <div className="flex space-x-2">
                            {['1W', '1M', '3M', '1Y'].map((t) => (
                                <button key={t} className="px-3 py-1 text-sm rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition font-medium">
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 border border-glass-border/50 rounded-xl relative flex items-end justify-around p-4 bg-slate-900/20">
                        {/* Show attendance bar chart for last 7 days */}
                        {(() => {
                            const bars = [];
                            for (let i = 6; i >= 0; i--) {
                                const d = new Date();
                                d.setDate(d.getDate() - i);
                                const dateStr = d.toISOString().split('T')[0];
                                const dayRecords = attendance.filter(a => a.date === dateStr);
                                const pct = students.length > 0 ? Math.round((dayRecords.filter(a => a.status === 'Present').length / students.length) * 100) : 0;
                                const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
                                bars.push({ pct: pct || 2, label: dayLabel, dateStr });
                            }
                            return bars.map((b, i) => (
                                <div key={i} className="flex flex-col items-center flex-1">
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${b.pct}%` }} transition={{ delay: 0.5 + i * 0.05, type: 'spring' }} className="w-10 sm:w-12 rounded-t-lg bg-gradient-to-t from-electric-blue/20 to-electric-blue border-t border-electric-blue/50 relative group" style={{ minHeight: '8px' }}>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none whitespace-nowrap">
                                            {b.pct}%
                                        </div>
                                    </motion.div>
                                    <span className="text-[10px] text-slate-500 mt-2 font-bold">{b.label}</span>
                                </div>
                            ));
                        })()}
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
