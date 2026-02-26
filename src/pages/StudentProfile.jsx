import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, ArrowLeft, Mail, Phone, MapPin, Calendar, Droplet,
    Edit2, X, Save, Star, BookOpen, Award, User, CheckCircle, XCircle,
    Cpu, ChevronRight, Users
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Field = ({ label, value, icon: Icon, color = 'electric-blue' }) => (
    <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors group">
        <div className={`mt-0.5 p-2 rounded-lg bg-${color}/10 text-${color} border border-${color}/20 shrink-0`}>
            <Icon size={14} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-semibold text-white mt-0.5 truncate">{value || '—'}</p>
        </div>
    </div>
);

const EditInput = ({ label, value, onChange, type = 'text' }) => (
    <div>
        <label className="text-slate-400 text-xs font-bold mb-1 block">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 p-2.5 rounded-xl text-white text-sm outline-none focus:border-emerald-glow/50 focus:ring-1 focus:ring-emerald-glow transition-all"
        />
    </div>
);

const StudentProfile = () => {
    const { rollNo } = useParams();
    const navigate = useNavigate();
    const { students, setStudents, currentUser, attendance } = useContext(AppContext);

    const student = students.find(s => s.rollNo === rollNo);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';
    const isOwnProfile = currentUser?.id === rollNo;

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <XCircle className="text-rose-500" size={48} />
                <p className="text-white text-xl font-bold">Student not found</p>
                <button onClick={() => navigate('/students')} className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition">
                    Back to Students
                </button>
            </div>
        );
    }

    // Calculate attendance stats
    const studentAttendance = attendance.filter(a => a.studentId === student.rollNo);
    const totalClasses = studentAttendance.length;
    const presentCount = studentAttendance.filter(a => a.status === 'Present').length;
    const attendancePct = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    const handleEdit = () => {
        setEditForm({ ...student, skills: (student.skills || []).join(', ') });
        setIsEditing(true);
    };

    const handleSave = () => {
        const updated = {
            ...editForm,
            skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        };
        setStudents(prev => prev.map(s => s.rollNo === rollNo ? updated : s));
        setIsEditing(false);
    };

    const cgpaColor = parseFloat(student.cgpa) >= 9 ? 'emerald-glow' : parseFloat(student.cgpa) >= 8 ? 'electric-blue' : 'luxury-gold';
    const attColor = attendancePct >= 75 ? 'emerald-glow' : 'rose-500';
    const canEdit = isAuthorized || isOwnProfile;

    return (
        <div className="space-y-6">
            {/* Back button + header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={22} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight text-glow">Student Profile</h1>
                    <p className="text-slate-400 text-sm font-medium">Detailed academic and personal information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Left Column: Identity Card ── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-8 flex flex-col items-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-glow/5 to-transparent pointer-events-none" />

                    {/* Avatar */}
                    <div className="relative mb-6 mt-2">
                        <div className="w-28 h-28 rounded-full border-[3px] border-emerald-glow/50 p-1 shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-slate-800 overflow-hidden">
                            <img
                                src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.rollNo}`}
                                alt={student.name}
                                className="w-full h-full object-cover rounded-full"
                                onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.rollNo}`; }}
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-glow/20 border border-emerald-glow/40 rounded-full flex items-center justify-center">
                            <CheckCircle size={14} className="text-emerald-glow" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-white text-center text-glow mb-1">{student.name}</h2>
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="px-3 py-1 bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/30 rounded-full text-xs font-bold">{student.rollNo}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{student.year} • Section {student.section}</p>

                    {/* CGPA & Attendance rings */}
                    <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                        <div className={`p-4 rounded-2xl bg-${cgpaColor}/10 border border-${cgpaColor}/20 text-center`}>
                            <p className={`text-3xl font-black text-${cgpaColor}`}>{student.cgpa}</p>
                            <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">CGPA</p>
                        </div>
                        <div className={`p-4 rounded-2xl bg-${attColor}/10 border border-${attColor}/20 text-center`}>
                            <p className={`text-3xl font-black text-${attColor}`}>{attendancePct}%</p>
                            <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Attendance</p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-6 w-full">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center space-x-2">
                            <Cpu size={12} /><span>Skills</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {(student.skills || []).map((skill, i) => (
                                <span key={i} className="px-2.5 py-1 bg-electric-blue/10 text-electric-blue border border-electric-blue/20 rounded-lg text-xs font-semibold">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Edit button */}
                    {canEdit && (
                        <button
                            onClick={handleEdit}
                            className="mt-6 w-full flex items-center justify-center space-x-2 py-3 bg-emerald-glow/10 hover:bg-emerald-glow/20 text-emerald-glow border border-emerald-glow/30 rounded-xl font-bold text-sm transition-colors"
                        >
                            <Edit2 size={16} />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </motion.div>

                {/* ── Right Column: Details ── */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Personal Info */}
                    <div className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                            <User size={18} className="text-emerald-glow" /><span>Personal Information</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Email" value={student.email} icon={Mail} color="electric-blue" />
                            <Field label="Phone" value={student.phone} icon={Phone} color="royal-purple" />
                            <Field label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} icon={Calendar} color="luxury-gold" />
                            <Field label="Blood Group" value={student.bloodGroup} icon={Droplet} color="rose-400" />
                            <Field label="Address" value={student.address} icon={MapPin} color="emerald-glow" />
                            <Field label="Parent's Name" value={student.parentName} icon={Users} color="electric-blue" />
                            <Field label="Parent's Phone" value={student.parentPhone} icon={Phone} color="royal-purple" />
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                            <BookOpen size={18} className="text-electric-blue" /><span>Academic Information</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Roll Number" value={student.rollNo} icon={Award} color="luxury-gold" />
                            <Field label="Year" value={student.year} icon={Star} color="electric-blue" />
                            <Field label="Section" value={student.section} icon={ChevronRight} color="royal-purple" />
                            <Field label="CGPA" value={student.cgpa} icon={Star} color="emerald-glow" />
                        </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                            <CheckCircle size={18} className="text-royal-purple" /><span>Attendance Summary</span>
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Total Classes', value: totalClasses, color: 'electric-blue' },
                                { label: 'Present', value: presentCount, color: 'emerald-glow' },
                                { label: 'Absent', value: totalClasses - presentCount, color: 'rose-400' },
                            ].map(({ label, value, color }) => (
                                <div key={label} className={`p-4 rounded-2xl bg-${color}/10 border border-${color}/20 text-center`}>
                                    <p className={`text-2xl font-black text-${color}`}>{value}</p>
                                    <p className="text-xs text-slate-400 mt-1 font-semibold">{label}</p>
                                </div>
                            ))}
                        </div>
                        {/* Progress bar */}
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-bold">
                                <span>Attendance</span>
                                <span className={attendancePct >= 75 ? 'text-emerald-glow' : 'text-rose-400'}>{attendancePct}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${attendancePct}%` }}
                                    transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${attendancePct >= 75 ? 'bg-gradient-to-r from-emerald-glow to-teal-400' : 'bg-gradient-to-r from-rose-500 to-orange-400'}`}
                                />
                            </div>
                            <p className={`text-xs mt-1.5 font-semibold ${attendancePct >= 75 ? 'text-emerald-glow' : 'text-rose-400'}`}>
                                {attendancePct >= 75 ? '✓ Eligible for exams' : `⚠ Need ${75 - attendancePct}% more to be eligible`}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-lg w-full shadow-glass-card relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                                <X size={22} />
                            </button>
                            <h2 className="text-2xl font-black text-white mb-6">Edit Profile</h2>
                            <div className="space-y-3">
                                <EditInput label="Full Name" value={editForm.name} onChange={v => setEditForm({ ...editForm, name: v })} />
                                <EditInput label="Email" value={editForm.email} onChange={v => setEditForm({ ...editForm, email: v })} type="email" />
                                <EditInput label="Phone" value={editForm.phone} onChange={v => setEditForm({ ...editForm, phone: v })} />
                                <EditInput label="Parent's Name" value={editForm.parentName} onChange={v => setEditForm({ ...editForm, parentName: v })} />
                                <EditInput label="Parent's Phone" value={editForm.parentPhone} onChange={v => setEditForm({ ...editForm, parentPhone: v })} />
                                <EditInput label="Date of Birth" value={editForm.dob} onChange={v => setEditForm({ ...editForm, dob: v })} type="date" />
                                <EditInput label="Blood Group" value={editForm.bloodGroup} onChange={v => setEditForm({ ...editForm, bloodGroup: v })} />
                                <EditInput label="Address" value={editForm.address} onChange={v => setEditForm({ ...editForm, address: v })} />
                                {isAuthorized && (
                                    <>
                                        <EditInput label="Year" value={editForm.year} onChange={v => setEditForm({ ...editForm, year: v })} />
                                        <EditInput label="Section" value={editForm.section} onChange={v => setEditForm({ ...editForm, section: v })} />
                                        <EditInput label="CGPA" value={editForm.cgpa} onChange={v => setEditForm({ ...editForm, cgpa: v })} />
                                    </>
                                )}
                                <EditInput label="Skills (comma separated)" value={editForm.skills} onChange={v => setEditForm({ ...editForm, skills: v })} />
                            </div>
                            <button
                                onClick={handleSave}
                                className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-glow to-teal-500 rounded-xl font-black text-white flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-transform"
                            >
                                <Save size={20} />
                                <span>Save Changes</span>
                            </button>
                        </motion.div>
                    </div>
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

export default StudentProfile;
