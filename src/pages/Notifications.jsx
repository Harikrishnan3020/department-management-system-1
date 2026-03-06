import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { currentUser, notifications, setNotifications, setAttendance, setTargetCourseId } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';
    const navigate = useNavigate();

    const handleApproveOD = (e, notifIndex, studentId) => {
        e.stopPropagation();
        setAttendance(prev => prev.map(a => (a.studentId === studentId && a.status === 'OD Pending') ? { ...a, status: 'OD Approved' } : a));
        setNotifications(prev => prev.filter((_, i) => i !== notifIndex));
        alert('OD Request Approved');
    };

    const handleRejectOD = (e, notifIndex, studentId) => {
        e.stopPropagation();
        setAttendance(prev => prev.map(a => (a.studentId === studentId && a.status === 'OD Pending') ? { ...a, status: 'OD Rejected' } : a));
        setNotifications(prev => prev.filter((_, i) => i !== notifIndex));
        alert('OD Request Rejected');
    };

    const handleNotificationClick = (notif) => {
        const type = notif.type.toLowerCase();
        if (type.includes('request letter')) {
            navigate('/request-letter');
        } else if (type.includes('od request') || type.includes('attendance') || type.includes('absent')) {
            navigate('/attendance');
        } else if (type.includes('magazine') || type.includes('paper')) {
            navigate('/magazine');
        } else if (type.includes('google form') || type.includes('survey')) {
            navigate('/google-form');
        } else if (type.includes('coursera')) {
            navigate('/coursera');
        } else if (type.includes('assignment') || type.includes('question bank')) {
            if (notif.courseId) {
                setTargetCourseId(notif.courseId);
            }
            navigate('/courses');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <Bell className="text-rose-500" size={32} />
                        <span>Action Center</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Manage your alerts, requests, and system notifications.</p>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6 min-h-[500px]">
                {notifications.length === 0 ? (
                    <div className="text-center text-slate-500 py-20 text-lg font-medium">
                        You're all caught up! No pending notifications.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {notifications.map((notif, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                key={i}
                                onClick={() => handleNotificationClick(notif)}
                                className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-white/10 transition-colors flex flex-col group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/0 to-royal-purple/0 group-hover:from-electric-blue/5 group-hover:to-royal-purple/5 transition-all"></div>
                                <div className="flex-1 border-b border-white/10 pb-4 mb-4 relative z-10">
                                    <h4 className="text-white font-black text-lg mb-2 text-glow">{notif.type}</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">{notif.message}</p>
                                </div>

                                {isAuthorized && notif.type.includes('OD Request') && (
                                    <div className="flex space-x-3 mt-auto relative z-10">
                                        <button onClick={(e) => handleRejectOD(e, i, notif.from)} className="flex-1 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]">
                                            <XCircle size={16} /><span>Reject OD</span>
                                        </button>
                                        <button onClick={(e) => handleApproveOD(e, i, notif.from)} className="flex-1 py-2.5 bg-emerald-glow/10 text-emerald-glow rounded-xl text-sm font-bold hover:bg-emerald-glow/20 border border-emerald-glow/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]">
                                            <CheckCircle size={16} /><span>Approve OD</span>
                                        </button>
                                    </div>
                                )}
                                {(notif.type.includes('Paper Request') || notif.type.includes('Absent Alert') || notif.type.includes('Coursera') || notif.type.includes('Google Form') || notif.type.includes('Coursera Submission')) ? (
                                    <div className="mt-auto pt-4 flex justify-between items-center relative z-10">
                                        <span className="text-xs font-bold text-electric-blue bg-electric-blue/10 px-2 py-1 rounded">System Notification</span>
                                        <button onClick={(e) => { e.stopPropagation(); setNotifications(prev => prev.filter((_, idx) => idx !== i)); }} className="text-xs text-slate-500 hover:text-rose-400 font-bold transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">Dismiss</button>
                                    </div>
                                ) : (
                                    <div className="mt-auto pt-4 flex justify-end relative z-10">
                                        <button onClick={(e) => { e.stopPropagation(); setNotifications(prev => prev.filter((_, idx) => idx !== i)); }} className="text-xs text-slate-500 hover:text-rose-400 font-bold transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">Dismiss</button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Notifications;
