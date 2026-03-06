import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, GraduationCap, BookOpen, TrendingUp, Activity, Bell, FileText, CheckCircle, XCircle, X, Calendar, Eye, FileBadge } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LetterModal } from './RequestLetter/index.jsx';

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
    const navigate = useNavigate();
    const { currentUser, notifications, setNotifications, attendance, requestLetters, setRequestLetters, students, departments, faculty, courses, setTargetCourseId } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';
    const [selectedAbsentees, setSelectedAbsentees] = useState(null);
    const [previewLetter, setPreviewLetter] = useState(null);

    const pendingRequests = requestLetters?.filter(r => r.status === 'Pending') || [];
    const uploadedCertificates = attendance?.filter(a => a.certificateUploaded === true && a.status?.includes('OD')) || [];

    const handleApproveRequest = (id) => {
        setRequestLetters(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
        setNotifications(prev => [
            { type: 'Request Letter Approved', message: `Your request letter has been approved.`, date: new Date().toISOString() },
            ...prev,
        ]);
        alert('Request approved.');
    };

    const handleRejectRequest = (id) => {
        setRequestLetters(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
        setNotifications(prev => [
            { type: 'Request Letter Rejected', message: `Your request letter has been rejected.`, date: new Date().toISOString() },
            ...prev,
        ]);
        alert('Request rejected.');
    };

    const stats = [
        { title: 'Total Departments', value: departments?.length || 0, icon: Building2, color: 'electric-blue', trend: '+2%' },
        { title: 'Faculty Members', value: faculty?.length || 0, icon: Users, color: 'royal-purple', trend: '+5%' },
        { title: 'Enrolled Students', value: students?.length || 0, icon: GraduationCap, color: 'emerald-glow', trend: '+12%' },
        { title: 'Active Courses', value: courses?.length || 0, icon: BookOpen, color: 'luxury-gold', trend: '+8%' },
    ];

    const getWeekData = () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const numDay = now.getDate();
        const start = new Date(now);
        start.setDate(numDay - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Monday
        start.setHours(0, 0, 0, 0);

        now.setHours(23, 59, 59, 999);

        const currentHour = now.getHours();
        const todayStrLocal = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return dayNames.map((name, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);

            const isFuture = d > now && d.toISOString().split('T')[0] !== todayStrLocal;

            if (isFuture) {
                return {
                    day: name,
                    dateStr: null,
                    percentage: null,
                    absentRecords: [],
                    isFuture: true
                };
            }

            const dateStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            let presentCountForDay = 0;
            const absentRecords = [];

            (students || []).forEach(student => {
                const morningRecord = attendance?.find(a => a.studentId === student.rollNo && a.date === dateStr && (!a.session || a.session === 'Morning'));
                const afternoonRecord = attendance?.find(a => a.studentId === student.rollNo && a.date === dateStr && a.session === 'Afternoon');

                const getActualStatus = (record, session) => {
                    if (record && record.status) return record.status;
                    let targetHours = session === 'Morning' ? 9 : 13;
                    if (dateStr < todayStrLocal || (dateStr === todayStrLocal && currentHour >= targetHours)) {
                        return 'Absent (Auto)';
                    }
                    return 'Unmarked';
                };

                const morningStatus = getActualStatus(morningRecord, 'Morning');
                const afternoonStatus = getActualStatus(afternoonRecord, 'Afternoon');

                const isAbsentMorning = morningStatus.includes('Absent');
                const isAbsentAfternoon = afternoonStatus.includes('Absent');

                if (isAbsentMorning || isAbsentAfternoon) {
                    let sessions = [];
                    if (isAbsentMorning) sessions.push('Morning');
                    if (isAbsentAfternoon) sessions.push('Afternoon');

                    absentRecords.push({
                        name: student.name,
                        studentId: student.rollNo,
                        session: sessions.join(' & ')
                    });
                } else if ((morningStatus.includes('Present') || morningStatus.includes('OD')) && (afternoonStatus.includes('Present') || afternoonStatus.includes('OD') || afternoonStatus === 'Unmarked')) {
                    presentCountForDay += 1;
                }
            });

            const totalStudents = students?.length || 1;
            let percentage = Math.round((presentCountForDay / totalStudents) * 100);
            if (percentage > 100) percentage = 100;

            return {
                day: name,
                dateStr,
                percentage,
                absentRecords,
                isFuture: false
            };
        });
    };

    const weekData = getWeekData();

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } } };

    const attendanceNotifications = notifications?.filter(n => n.type === 'Attendance Published') || [];
    const assignmentNotifications = notifications?.filter(n => n.type === 'Assignment') || [];

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

            {/* Student Assignment Notification Banner */}
            {!isAuthorized && assignmentNotifications.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-1 rounded-[2rem] bg-gradient-to-r from-emerald-glow via-electric-blue to-royal-purple shadow-glow-emerald/20"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-[1.9rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-glow/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                        <div className="flex items-center space-x-5 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-glow/20 flex items-center justify-center text-emerald-glow border border-emerald-glow/30 shadow-glow-emerald animate-pulse">
                                <BookOpen size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">New Assignment Assigned</h3>
                                <p className="text-slate-400 font-medium text-sm mt-1">{assignmentNotifications[0].message}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 relative z-10 w-full md:w-auto">
                            <button
                                onClick={() => {
                                    setNotifications(prev => prev.filter(n => n.id !== assignmentNotifications[0].id));
                                }}
                                className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-xl border border-white/10 transition-all"
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={() => {
                                    if (assignmentNotifications[0].courseId) {
                                        setTargetCourseId(assignmentNotifications[0].courseId);
                                    }
                                    navigate('/courses');
                                }}
                                className="flex-1 md:flex-none px-8 py-3 bg-emerald-glow text-slate-900 font-black rounded-xl shadow-glow-emerald hover:scale-105 transition-all text-center"
                            >
                                SUBMIT NOW
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Student Notification Banner */}
            {!isAuthorized && attendanceNotifications.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-1 rounded-[2rem] bg-gradient-to-r from-electric-blue via-royal-purple to-emerald-glow shadow-glow-blue/20"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-[1.9rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                        <div className="flex items-center space-x-5 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-electric-blue/20 flex items-center justify-center text-electric-blue border border-electric-blue/30 shadow-glow-blue animate-pulse">
                                <Bell size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">New Attendance Published</h3>
                                <p className="text-slate-400 font-medium text-sm mt-1">{attendanceNotifications[0].message}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 relative z-10 w-full md:w-auto">
                            <button
                                onClick={() => {
                                    setNotifications(prev => prev.filter(n => n.id !== attendanceNotifications[0].id));
                                }}
                                className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-xl border border-white/10 transition-all"
                            >
                                Dismiss
                            </button>
                            <Link
                                to="/attendance"
                                className="flex-1 md:flex-none px-8 py-3 bg-electric-blue text-white font-black rounded-xl shadow-glow-blue hover:scale-105 transition-all text-center"
                            >
                                CHECK STATUS
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}

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
                        {weekData.map((data, i) => (
                            <div key={i} className="flex flex-col items-center justify-end h-full flex-1">
                                {!data.isFuture ? (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(data.percentage, 5)}%` }}
                                        transition={{ delay: 0.5 + i * 0.05, type: 'spring' }}
                                        onClick={() => setSelectedAbsentees(data)}
                                        className="w-12 sm:w-16 rounded-t-lg bg-gradient-to-t from-emerald-glow/10 to-emerald-glow/80 border-t border-emerald-glow/50 relative group mb-2 cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-shadow"
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-emerald-glow/20 pointer-events-none text-white font-bold whitespace-nowrap z-20">
                                            {data.percentage}%
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col items-center justify-center">
                                            <span className="text-[10px] font-bold text-white bg-black/50 px-1 rounded uppercase">View</span>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="w-12 sm:w-16 rounded-t-lg bg-white/5 border-t border-white/10 relative mb-2 h-[5%]"></div>
                                )}
                                <span className={`text-xs font-bold uppercase tracking-wider ${data.isFuture ? 'text-slate-600' : 'text-slate-400'}`}>{data.day}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Dashboard Pending Request Letters Section */}
            {isAuthorized && pendingRequests.length > 0 && (
                <div className="w-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-8 flex flex-col relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                                    <FileText className="text-amber-400" size={24} />
                                    Pending Request Letters
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-bold">
                                        {pendingRequests.length}
                                    </span>
                                </h2>
                                <p className="text-sm font-medium text-slate-400">Student requests awaiting your approval.</p>
                            </div>
                            <Link to="/request-letter" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold border border-white/10 transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
                            {pendingRequests.slice(0, 4).map(req => (
                                <div key={req.id} className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{req.studentName} <span className="text-sm text-electric-blue ml-1 font-normal">({req.studentId})</span></h4>
                                                <p className="text-xs text-slate-400 mt-1">{new Date(req.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">Pending</span>
                                        </div>
                                        <p className="text-slate-200 font-semibold mb-1 text-sm">{req.subject}</p>
                                        <p className="text-slate-400 text-sm line-clamp-2">{req.body}</p>
                                        <button onClick={() => setPreviewLetter(req)}
                                            className="px-3 py-1.5 mt-3 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all w-fit">
                                            <Eye size={13} /> View Full Letter
                                        </button>
                                    </div>
                                    <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                                        <button onClick={() => handleRejectRequest(req.id)}
                                            className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-xl text-xs font-bold border border-rose-500/30 hover:bg-rose-500/20 flex items-center gap-2 transition-all">
                                            <XCircle size={14} /> Reject
                                        </button>
                                        <button onClick={() => handleApproveRequest(req.id)}
                                            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/30 hover:bg-emerald-500/20 flex items-center gap-2 transition-all">
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Dashboard Uploaded OD Certificates Section */}
            {isAuthorized && uploadedCertificates.length > 0 && (
                <div className="w-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="w-full glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-8 flex flex-col relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                                    <FileBadge className="text-emerald-400" size={24} />
                                    Recently Uploaded OD Certificates
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-bold">
                                        {uploadedCertificates.length}
                                    </span>
                                </h2>
                                <p className="text-sm font-medium text-slate-400">Students who have uploaded their physical proofs.</p>
                            </div>
                            <Link to="/attendance" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold border border-white/10 transition-colors">
                                View Attendance
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                            {uploadedCertificates.slice(0, 6).map(cert => (
                                <div key={cert.id} className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-white tracking-wide">{cert.name}</h4>
                                            <span className="text-xs text-electric-blue font-medium">{cert.studentId}</span>
                                        </div>
                                        <button onClick={() => alert(`Certificate explicitly verified for ${cert.name}.`)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors tooltip-trigger" title="View Certificate">
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">Dates: <span className="text-slate-300 font-bold">{cert.start} to {cert.end}</span></p>
                                    <p className="text-xs text-slate-400 line-clamp-1">Subject: <span className="text-slate-300">{cert.reason || 'N/A'}</span></p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Absentees Modal */}
            <AnimatePresence>
                {selectedAbsentees && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setSelectedAbsentees(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden flex flex-col max-h-[80vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Calendar className="text-electric-blue" size={20} />
                                        Absentees List
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-1">{selectedAbsentees.day}, {new Date(selectedAbsentees.dateStr).toLocaleDateString('en-IN')}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedAbsentees(null)}
                                    className="p-2 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                {selectedAbsentees.absentRecords.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                            <CheckCircle className="text-emerald-500" size={32} />
                                        </div>
                                        <p className="text-lg font-bold text-white">100% Attendance!</p>
                                        <p className="text-slate-400 text-sm mt-1">No students were marked absent on this day.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedAbsentees.absentRecords.map((record, index) => (
                                            <div key={index} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-lg">{record.name}</span>
                                                    <span className="text-electric-blue text-sm font-medium">{record.studentId}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-xs font-bold mb-1">
                                                        Absent
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{record.session}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-slate-900 flex justify-between items-center">
                                <span className="text-slate-400 text-sm font-medium">
                                    Total Absent: <span className="text-rose-400 font-bold ml-1">{selectedAbsentees.absentRecords.length}</span>
                                </span>
                                <span className="text-slate-400 text-sm font-medium">
                                    Total Present: <span className="text-emerald-400 font-bold ml-1">{students?.length ? students.length - selectedAbsentees.absentRecords.length : 0}</span>
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Letter Preview Modal */}
            <LetterModal letter={previewLetter} onClose={() => setPreviewLetter(null)} />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Dashboard;
