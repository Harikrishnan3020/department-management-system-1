import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Notifications = () => {
    const { currentUser, notifications, setNotifications, setAttendance } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const handleApproveOD = (notifIndex, studentId) => {
        setAttendance(prev => prev.map(a => (a.studentId === studentId && a.status === 'OD Pending') ? { ...a, status: 'OD Approved' } : a));
        setNotifications(prev => prev.filter((_, i) => i !== notifIndex));
        alert('OD Request Approved');
    };

    const handleRejectOD = (notifIndex, studentId) => {
        setAttendance(prev => prev.map(a => (a.studentId === studentId && a.status === 'OD Pending') ? { ...a, status: 'OD Rejected' } : a));
        setNotifications(prev => prev.filter((_, i) => i !== notifIndex));
        alert('OD Request Rejected');
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
                                className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl hover:bg-white/5 hover:border-white/10 transition-colors flex flex-col"
                            >
                                <div className="flex-1 border-b border-white/10 pb-4 mb-4">
                                    <h4 className="text-white font-black text-lg mb-2 text-glow">{notif.type}</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">{notif.message}</p>
                                </div>

                                {isAuthorized && notif.type.includes('OD Request') && (
                                    <div className="flex space-x-3 mt-auto">
                                        <button onClick={() => handleRejectOD(i, notif.from)} className="flex-1 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]">
                                            <XCircle size={16} /><span>Reject OD</span>
                                        </button>
                                        <button onClick={() => handleApproveOD(i, notif.from)} className="flex-1 py-2.5 bg-emerald-glow/10 text-emerald-glow rounded-xl text-sm font-bold hover:bg-emerald-glow/20 border border-emerald-glow/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]">
                                            <CheckCircle size={16} /><span>Approve OD</span>
                                        </button>
                                    </div>
                                )}
                                {(notif.type.includes('Paper Request') || notif.type.includes('Absent Alert') || notif.type.includes('Coursera') || notif.type.includes('Google Form') || notif.type.includes('Coursera Submission')) ? (
                                    <div className="mt-auto pt-2 flex justify-between items-center">
                                        <span className="text-xs font-bold text-electric-blue bg-electric-blue/10 px-2 py-1 rounded">System Notification</span>
                                        <button onClick={() => setNotifications(prev => prev.filter((_, idx) => idx !== i))} className="text-xs text-slate-500 hover:text-rose-400 font-bold transition-colors">Dismiss</button>
                                    </div>
                                ) : (
                                    <div className="mt-auto pt-2 flex justify-end">
                                        <button onClick={() => setNotifications(prev => prev.filter((_, idx) => idx !== i))} className="text-xs text-slate-500 hover:text-rose-400 font-bold transition-colors">Dismiss</button>
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
