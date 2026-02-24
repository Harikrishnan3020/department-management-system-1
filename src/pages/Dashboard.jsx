import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, GraduationCap, BookOpen, Bell, FileText, CheckCircle, XCircle, Eye, X, AlertTriangle, Clock } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const CountUp = ({ to, duration = 2 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseInt(to, 10);
        if (!end) return;
        let inc = Math.max(10, Math.abs(Math.floor((duration * 1000) / end)));
        const timer = setInterval(() => {
            start += Math.ceil(end / (duration * 100));
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
        }, inc);
        return () => clearInterval(timer);
    }, [to, duration]);
    return <span>{count.toLocaleString()}</span>;
};

// ── File viewer modal ────────────────────────────────────────────
const FileViewer = ({ notif, onClose }) => {
    if (!notif.fileData) return null;
    const isPDF = notif.fileName?.toLowerCase().endsWith('.pdf');
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 rounded-[2rem] border border-white/10 shadow-glass-card overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-950/60">
                    <div className="flex items-center space-x-3">
                        <FileText size={20} className="text-electric-blue" />
                        <span className="text-white font-bold truncate max-w-xs">{notif.fileName || 'Document'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <a href={notif.fileData} download={notif.fileName}
                            className="px-4 py-1.5 bg-electric-blue/20 text-electric-blue rounded-lg text-sm font-bold border border-electric-blue/30 hover:bg-electric-blue/30 transition">
                            Download
                        </a>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 70px)' }}>
                    {isPDF ? (
                        <iframe src={notif.fileData} className="w-full h-[75vh]" title="Document Preview" />
                    ) : (
                        <img src={notif.fileData} alt="Uploaded document" className="w-full h-auto object-contain p-4" />
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ── Single notification card for Admin/Faculty ───────────────────
const AdminNotifCard = ({ notif, actualIndex, onApproveOD, onDenyOD, onAcknowledgeAbsent, onViewFile }) => {
    const isOD = notif.type === 'OD Request';
    const isAbsent = notif.type === 'Absent Alert';
    const isActedOn = notif.status === 'approved' || notif.status === 'denied' || notif.acknowledged;

    const accentColor = isOD ? 'electric-blue' : isAbsent ? 'rose-500' : 'luxury-gold';
    const accentClass = isOD ? 'bg-electric-blue/10 border-electric-blue/20 text-electric-blue'
        : isAbsent ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            : 'bg-luxury-gold/10 border-luxury-gold/20 text-luxury-gold';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`rounded-2xl border p-4 transition-all ${isActedOn
                    ? 'bg-slate-900/30 border-white/5 opacity-60'
                    : 'bg-slate-900/60 border-white/10 hover:bg-white/5'
                }`}
        >
            {/* Header row */}
            <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                    <span className={`shrink-0 w-2 h-2 rounded-full ${isOD ? 'bg-electric-blue' : isAbsent ? 'bg-rose-500' : 'bg-luxury-gold'}`} />
                    <span className={`shrink-0 text-xs font-black px-2 py-0.5 rounded-lg border ${accentClass}`}>{notif.type}</span>
                    <span className="text-white font-bold text-sm truncate">{notif.studentName || notif.from}</span>
                </div>
                <span className="shrink-0 text-xs text-slate-600 font-mono">{notif.date}</span>
            </div>

            {/* Message */}
            <p className="text-xs text-slate-400 pl-4 mb-3 leading-relaxed">{notif.message}</p>

            {/* OD date range */}
            {isOD && notif.start && (
                <div className="pl-4 mb-3">
                    <span className="text-xs font-semibold bg-electric-blue/10 text-electric-blue px-2 py-0.5 rounded border border-electric-blue/20">
                        {notif.start} → {notif.end}
                    </span>
                </div>
            )}

            {/* Action buttons */}
            {!isActedOn && (
                <div className="pl-4 flex flex-wrap gap-2 mt-2">
                    {/* View file button */}
                    {notif.fileData && (
                        <button onClick={() => onViewFile(notif)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold border border-white/10 transition">
                            <Eye size={13} /><span>View Letter</span>
                        </button>
                    )}
                    {notif.fileName && !notif.fileData && (
                        <span className="flex items-center space-x-1 text-xs text-slate-500 px-2 py-1">
                            <FileText size={12} /><span>{notif.fileName}</span>
                        </span>
                    )}

                    {/* OD approve / deny */}
                    {isOD && (
                        <>
                            <button onClick={() => onApproveOD(actualIndex, notif.from)}
                                className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/30 transition shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                                <CheckCircle size={13} /><span>Approve</span>
                            </button>
                            <button onClick={() => onDenyOD(actualIndex, notif.from)}
                                className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-xs font-bold border border-rose-500/30 transition">
                                <XCircle size={13} /><span>Deny</span>
                            </button>
                        </>
                    )}

                    {/* Absent acknowledge */}
                    {isAbsent && (
                        <button onClick={() => onAcknowledgeAbsent(actualIndex)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-bold border border-white/10 transition">
                            <CheckCircle size={13} /><span>Acknowledge</span>
                        </button>
                    )}
                </div>
            )}

            {/* Status badge when acted on */}
            {isActedOn && (
                <div className={`pl-4 mt-1 text-xs font-bold ${notif.status === 'approved' ? 'text-emerald-400' :
                        notif.status === 'denied' ? 'text-rose-400' :
                            'text-slate-500'
                    }`}>
                    {notif.status === 'approved' ? '✓ OD Approved'
                        : notif.status === 'denied' ? '✗ OD Denied'
                            : '✓ Acknowledged'}
                </div>
            )}
        </motion.div>
    );
};

// ── Dashboard ────────────────────────────────────────────────────
const Dashboard = () => {
    const { currentUser, notifications, setNotifications, setAttendance, departments, faculty, students, courses, attendance } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [viewingFile, setViewingFile] = useState(null); // notif whose file to show

    const todayDate = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === todayDate);
    const presentToday = todayAttendance.filter(a => a.status === 'Present').length;

    const stats = [
        { title: 'Departments', value: departments.length, icon: Building2, color: 'electric-blue' },
        { title: 'Faculty Members', value: faculty.length, icon: Users, color: 'royal-purple' },
        { title: 'Enrolled Students', value: students.length, icon: GraduationCap, color: 'emerald-glow' },
        { title: 'Active Courses', value: courses.length, icon: BookOpen, color: 'luxury-gold' },
    ];

    // ── Admin notification handlers ──────────────────────────────
    const handleApproveOD = (actualIndex, studentId) => {
        setAttendance(prev => prev.map(a =>
            a.studentId === studentId && a.status === 'OD Pending' ? { ...a, status: 'OD Approved' } : a
        ));
        setNotifications(prev => {
            const updated = [...prev];
            updated[actualIndex] = { ...updated[actualIndex], status: 'approved' };
            // Add a notification for the student
            return [
                { id: Date.now(), type: 'OD Approved', to: studentId, message: 'Your OD request has been approved by the Faculty/Admin.' },
                ...updated,
            ];
        });
    };

    const handleDenyOD = (actualIndex, studentId) => {
        setAttendance(prev => prev.map(a =>
            a.studentId === studentId && a.status === 'OD Pending' ? { ...a, status: 'Absent' } : a
        ));
        setNotifications(prev => {
            const updated = [...prev];
            updated[actualIndex] = { ...updated[actualIndex], status: 'denied' };
            return [
                { id: Date.now(), type: 'OD Denied', to: studentId, message: 'Your OD request was denied. Attendance marked as Absent.' },
                ...updated,
            ];
        });
    };

    const handleAcknowledgeAbsent = (actualIndex) => {
        setNotifications(prev => {
            const updated = [...prev];
            updated[actualIndex] = { ...updated[actualIndex], acknowledged: true };
            return updated;
        });
    };

    // ── Notification filtering ───────────────────────────────────
    const ADMIN_TYPES = ['OD Request', 'Absent Alert', 'Form Completed'];
    const STUDENT_TYPES = ['OD Approved', 'OD Denied', 'General', 'Google Form', 'Coursera Assignment'];

    const userNotifications = isAuthorized
        ? notifications.filter(n => ADMIN_TYPES.includes(n.type) || (!n.to && !STUDENT_TYPES.includes(n.type)))
        : notifications.filter(n => n.to === currentUser?.id || STUDENT_TYPES.includes(n.type));

    const pendingCount = isAuthorized
        ? userNotifications.filter(n => n.type === 'OD Request' && n.status !== 'approved' && n.status !== 'denied').length
        : 0;

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300 } } };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-extrabold text-white text-glow mb-2">Platform Overview</h1>
                    <p className="text-slate-400 font-medium">Real-time system metrics from your data.</p>
                </motion.div>
                {isAuthorized && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-glow/10 border border-emerald-glow/20 rounded-xl text-sm">
                        <span className="w-2 h-2 bg-emerald-glow rounded-full animate-pulse" />
                        <span className="text-emerald-400 font-bold">{presentToday}</span>
                        <span className="text-slate-400">present today</span>
                    </motion.div>
                )}
            </div>

            {/* Stats */}
            <motion.div variants={containerVariants} initial="hidden" animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={index} variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }}
                            className="relative p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card overflow-hidden group">
                            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`p-3 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20 text-${stat.color}`}>
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

            {/* Main body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── Notifications Panel ────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card flex flex-col"
                    style={{ minHeight: '28rem', maxHeight: '32rem' }}>

                    {/* Panel header */}
                    <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                            <Bell className="text-luxury-gold" size={20} />
                            <span>{isAuthorized ? 'Leave & OD Requests' : 'Notifications'}</span>
                        </h2>
                        <div className="flex items-center space-x-2">
                            {pendingCount > 0 && (
                                <span className="flex items-center space-x-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-black border border-amber-500/30">
                                    <Clock size={10} /><span>{pendingCount} pending</span>
                                </span>
                            )}
                            {userNotifications.length > 0 && (
                                <span className="px-2 py-0.5 bg-luxury-gold/20 text-luxury-gold rounded-full text-xs font-black">
                                    {userNotifications.length}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Notification list */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        <AnimatePresence>
                            {userNotifications.length === 0 ? (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-center text-slate-500 py-12 flex flex-col items-center space-y-2">
                                    <Bell size={32} className="text-slate-700" />
                                    <p className="text-sm">No notifications yet.</p>
                                </motion.div>
                            ) : isAuthorized ? (
                                userNotifications.map((notif, i) => {
                                    const actualIndex = notifications.indexOf(notif);
                                    return (
                                        <AdminNotifCard key={notif.id || i}
                                            notif={notif}
                                            actualIndex={actualIndex}
                                            onApproveOD={handleApproveOD}
                                            onDenyOD={handleDenyOD}
                                            onAcknowledgeAbsent={handleAcknowledgeAbsent}
                                            onViewFile={setViewingFile}
                                        />
                                    );
                                })
                            ) : (
                                userNotifications.map((notif, i) => (
                                    <motion.div key={notif.id || i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                        className="bg-slate-900/60 border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${notif.type.includes('OD') ? 'bg-electric-blue' :
                                                    notif.type.includes('Absent') ? 'bg-rose-500' :
                                                        notif.type.includes('Coursera') ? 'bg-emerald-500' : 'bg-luxury-gold'
                                                }`} />
                                            <h4 className="text-white font-bold text-sm">{notif.type}</h4>
                                        </div>
                                        <p className="text-xs text-slate-400 pl-4">{notif.message}</p>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ── Attendance Bar Chart ──────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="lg:col-span-2 glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-8 flex flex-col relative overflow-hidden"
                    style={{ minHeight: '28rem' }}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-royal-purple/5 blur-[100px] rounded-full pointer-events-none" />
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h2 className="text-2xl font-bold text-white">Attendance Overview (Last 7 Days)</h2>
                        <div className="flex space-x-2">
                            {['1W', '1M', '3M', '1Y'].map(t => (
                                <button key={t} className="px-3 py-1 text-sm rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition font-medium">{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 border border-glass-border/50 rounded-xl relative flex items-end justify-around p-4 bg-slate-900/20">
                        {(() => {
                            const bars = [];
                            for (let i = 6; i >= 0; i--) {
                                const d = new Date();
                                d.setDate(d.getDate() - i);
                                const dateStr = d.toISOString().split('T')[0];
                                const dayRecs = attendance.filter(a => a.date === dateStr);
                                const pct = students.length > 0 ? Math.round((dayRecs.filter(a => a.status === 'Present').length / students.length) * 100) : 0;
                                bars.push({ pct: pct || 2, label: d.toLocaleDateString('en-US', { weekday: 'short' }), dateStr });
                            }
                            return bars.map((b, i) => (
                                <div key={i} className="flex flex-col items-center flex-1">
                                    <motion.div
                                        initial={{ height: 0 }} animate={{ height: `${b.pct}%` }}
                                        transition={{ delay: 0.5 + i * 0.05, type: 'spring' }}
                                        className="w-10 sm:w-12 rounded-t-lg bg-gradient-to-t from-electric-blue/20 to-electric-blue border-t border-electric-blue/50 relative group"
                                        style={{ minHeight: '8px' }}>
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

            {/* ── File viewer modal ─────────────────────────────────────── */}
            <AnimatePresence>
                {viewingFile && (
                    <FileViewer notif={viewingFile} onClose={() => setViewingFile(null)} />
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Dashboard;
