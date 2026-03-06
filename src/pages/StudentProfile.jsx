import React, { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, ArrowLeft, Mail, Phone, MapPin, Calendar, Droplet,
    Edit2, X, Save, Star, BookOpen, Award, User, CheckCircle, XCircle,
    Cpu, ChevronRight, Users, FileBadge, FileText, Trophy, Code2,
    Github, Linkedin, Globe, Briefcase, Target, TrendingUp, Sparkles,
    BarChart3, Clock, Flame, Shield, Layers
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

const documentItems = [
    { key: 'doc10th', label: '10th Marksheet' },
    { key: 'doc12th', label: '12th Marksheet' },
    { key: 'aadhaar', label: 'Aadhaar Card' },
    { key: 'pan', label: 'PAN Card' },
    { key: 'community', label: 'Community Certificate' },
    { key: 'birth', label: 'Birth Certificate' },
    { key: 'firstGrad', label: 'First Graduate (Optional)' },
    { key: 'income', label: 'Income Certificate' }
];

// ── Sub-Components ────────────────────────────────────────────────────────────

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

const EditTextarea = ({ label, value, onChange, rows = 3 }) => (
    <div>
        <label className="text-slate-400 text-xs font-bold mb-1 block">{label}</label>
        <textarea
            rows={rows}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 p-2.5 rounded-xl text-white text-sm outline-none focus:border-emerald-glow/50 focus:ring-1 focus:ring-emerald-glow transition-all resize-none"
        />
    </div>
);

const FileInput = ({ label, value, onChange }) => (
    <div>
        <label className="text-slate-400 text-xs font-bold mb-1 block">{label}</label>
        <div className="flex items-center space-x-2">
            <input
                type="file"
                onChange={e => {
                    const file = e.target.files[0];
                    if (file) { onChange(`Uploaded: ${file.name}`); }
                }}
                className="hidden"
                id={`file-${label.replace(/\s+/g, '-')}`}
            />
            <label
                htmlFor={`file-${label.replace(/\s+/g, '-')}`}
                className="cursor-pointer px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-sm hover:bg-slate-700 transition-colors flex flex-1 items-center justify-center font-bold"
            >
                {value ? 'Replace File' : 'Choose File'}
            </label>
            {value && (
                <span className="text-xs text-emerald-glow truncate max-w-[150px] font-semibold" title={value}>
                    {value.replace('Uploaded: ', '')}
                </span>
            )}
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors bg-slate-800 rounded-xl border border-white/10"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    </div>
);

const SectionCard = ({ icon: Icon, title, iconColor = 'text-electric-blue', children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6"
    >
        <h3 className="text-lg font-bold text-white mb-5 flex items-center space-x-2.5">
            <Icon size={18} className={iconColor} />
            <span>{title}</span>
        </h3>
        {children}
    </motion.div>
);

const SkillBadge = ({ skill, index }) => {
    const colors = [
        'bg-electric-blue/10 text-electric-blue border-electric-blue/20',
        'bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20',
        'bg-royal-purple/10 text-royal-purple border-royal-purple/20',
        'bg-amber-400/10 text-amber-400 border-amber-400/20',
        'bg-rose-400/10 text-rose-400 border-rose-400/20',
    ];
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${colors[index % colors.length]}`}
        >
            {skill}
        </motion.span>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const StudentProfile = () => {
    const { rollNo } = useParams();
    const navigate = useNavigate();
    const { students, setStudents, currentUser, attendance, courses, examResults } = useContext(AppContext);

    const student = students.find(s => s.rollNo === rollNo);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';
    const isOwnProfile = currentUser?.id === rollNo;

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

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

    // ── Stats Computation ──────────────────────────────────────────────────────
    const studentAttendance = attendance.filter(a => a.studentId === student.rollNo);
    const totalClasses = (student.manualTotalClasses !== undefined && student.manualTotalClasses !== '') ? Number(student.manualTotalClasses) : studentAttendance.length;
    const presentCount = (student.manualPresentClasses !== undefined && student.manualPresentClasses !== '') ? Number(student.manualPresentClasses) : studentAttendance.filter(a => a.status === 'Present').length;
    const attendancePct = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
    const cgpaNum = parseFloat(student.cgpa) || 0;
    const cgpaColor = cgpaNum >= 9 ? 'emerald-glow' : cgpaNum >= 8 ? 'electric-blue' : 'luxury-gold';
    const attColor = attendancePct >= 75 ? 'emerald-glow' : 'rose-500';
    const canEdit = isAuthorized || isOwnProfile;

    // Sample achievements / projects (stored on student or fallback)
    const achievements = student.achievements || [
        { title: 'Best Project Award', org: 'Dept. AIML Symposium', year: '2025', icon: '🏆' },
        { title: 'Hackathon Runner-Up', org: 'Smart India Hackathon', year: '2024', icon: '⚡' },
        { title: 'NPTEL Elite Certificate', org: 'IIT Madras', year: '2024', icon: '📜' },
    ];

    const projects = student.projects || [
        { name: 'Smart Attendance System', desc: 'Geo-location based attendance using React + Node.js with real-time sync.', tech: ['React', 'Node.js', 'MongoDB'], status: 'Completed' },
        { name: 'ML Crop Disease Detector', desc: 'Deep learning model (CNN) to detect plant diseases from leaf images.', tech: ['Python', 'TensorFlow', 'Flask'], status: 'Ongoing' },
    ];

    const studentExams = (examResults || []).filter(e => e.studentId === student.rollNo || e.studentRoll === student.rollNo);

    const handleEdit = () => {
        setEditForm({
            ...student,
            skills: (student.skills || []).join(', '),
            bio: student.bio || '',
            linkedin: student.linkedin || '',
            github: student.github || '',
            website: student.website || '',
        });
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

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'academic', label: 'Academic', icon: BookOpen },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
        { id: 'documents', label: 'Documents', icon: FileBadge },
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* ── Back Navigation ── */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={22} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight text-glow">Student Portfolio</h1>
                    <p className="text-slate-400 text-sm font-medium">Complete academic portfolio and profile</p>
                </div>
            </div>

            {/* ── Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative glass-card rounded-[2rem] border border-glass-border shadow-glass-card overflow-hidden"
            >
                {/* Layered gradient banner */}
                <div className="h-40 bg-gradient-to-r from-electric-blue/30 via-royal-purple/20 to-emerald-glow/20 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.3)_0%,transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.2)_0%,transparent_60%)]" />
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className="absolute top-4 right-6 flex items-center gap-2">
                        <span className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-glow/20 text-emerald-glow border border-emerald-glow/30 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 bg-emerald-glow rounded-full animate-pulse" />
                            <span>AI & ML Dept.</span>
                        </span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 font-bold">{student.year} • Section {student.section}</span>
                    </div>
                </div>

                {/* Profile Info Row */}
                <div className="px-8 pb-6 flex flex-col md:flex-row md:items-end gap-6 -mt-16 relative z-10">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-[1.5rem] border-4 border-slate-900 shadow-[0_0_40px_rgba(59,130,246,0.35)] bg-slate-800 overflow-hidden">
                            <img
                                src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.rollNo}`}
                                alt={student.name}
                                className="w-full h-full object-cover"
                                onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.rollNo}`; }}
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-glow rounded-xl border-2 border-slate-900 flex items-center justify-center">
                            <CheckCircle size={16} className="text-white" />
                        </div>
                    </div>

                    {/* Name & Bio */}
                    <div className="flex-1 mt-4 md:mt-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h2 className="text-3xl font-black text-white tracking-tight">{student.name}</h2>
                            <span className="px-3 py-1 bg-electric-blue/10 text-electric-blue border border-electric-blue/20 rounded-full text-xs font-bold">{student.rollNo}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                            {student.bio || `${student.year} student at AI & ML Department • Passionate about technology and innovation • CGPA ${student.cgpa}`}
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3 mt-3">
                            {student.github && (
                                <a href={student.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                    <Github size={18} />
                                </a>
                            )}
                            {student.linkedin && (
                                <a href={student.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-electric-blue transition-colors">
                                    <Linkedin size={18} />
                                </a>
                            )}
                            {student.website && (
                                <a href={student.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-glow transition-colors">
                                    <Globe size={18} />
                                </a>
                            )}
                            {!student.github && !student.linkedin && (
                                <span className="text-xs text-slate-600 italic">No social links — edit profile to add</span>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4 shrink-0">
                        <div className={`p-4 rounded-2xl bg-${cgpaColor}/10 border border-${cgpaColor}/20 text-center min-w-[80px]`}>
                            <p className={`text-2xl font-black text-${cgpaColor}`}>{student.cgpa}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">CGPA</p>
                        </div>
                        <div className={`p-4 rounded-2xl bg-${attColor}/10 border border-${attColor}/20 text-center min-w-[80px]`}>
                            <p className={`text-2xl font-black text-${attColor}`}>{attendancePct}%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Attend.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-center min-w-[80px]">
                            <p className="text-2xl font-black text-amber-400">{achievements.length}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Awards</p>
                        </div>
                    </div>

                    {/* Edit button */}
                    {canEdit && (
                        <button
                            onClick={handleEdit}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-electric-blue/10 hover:bg-electric-blue/20 text-electric-blue border border-electric-blue/30 rounded-xl font-bold text-sm transition-colors shrink-0"
                        >
                            <Edit2 size={15} />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>
            </motion.div>

            {/* ── Skills Strip ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                className="glass-card rounded-2xl border border-glass-border p-5 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 shrink-0">
                    <Cpu size={16} className="text-electric-blue" />
                    <span className="text-sm font-black text-white uppercase tracking-widest">Skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(student.skills || []).map((skill, i) => <SkillBadge key={i} skill={skill} index={i} />)}
                    {(!student.skills || student.skills.length === 0) && (
                        <span className="text-xs text-slate-500 italic">No skills added yet — edit profile</span>
                    )}
                </div>
            </motion.div>

            {/* ── Tab Navigation ── */}
            <div className="flex gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-electric-blue text-white shadow-glow-blue' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon size={15} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab Content ── */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Personal Info */}
                        <SectionCard icon={User} title="Personal Information" iconColor="text-emerald-glow">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Email" value={student.email} icon={Mail} color="electric-blue" />
                                <Field label="Phone" value={student.phone} icon={Phone} color="royal-purple" />
                                <Field label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} icon={Calendar} color="luxury-gold" />
                                <Field label="Blood Group" value={student.bloodGroup} icon={Droplet} color="rose-400" />
                                <Field label="Address" value={student.address} icon={MapPin} color="emerald-glow" />
                            </div>
                        </SectionCard>

                        {/* Family Info */}
                        <SectionCard icon={Users} title="Family Details" iconColor="text-royal-purple">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Father's Name" value={student.fatherName} icon={Users} color="electric-blue" />
                                <Field label="Mother's Name" value={student.motherName} icon={Users} color="royal-purple" />
                                <Field label="Father's Phone" value={student.fatherPhone} icon={Phone} color="electric-blue" />
                                <Field label="Mother's Phone" value={student.motherPhone} icon={Phone} color="royal-purple" />
                                <Field label="Father's Occ." value={student.fatherOccupation} icon={Briefcase} color="emerald-glow" />
                                <Field label="Mother's Occ." value={student.motherOccupation} icon={Briefcase} color="rose-400" />
                                <Field label="Annual Income" value={student.annualIncome ? `₹${Number(student.annualIncome).toLocaleString('en-IN')}` : '—'} icon={TrendingUp} color="luxury-gold" />
                            </div>
                        </SectionCard>

                        {/* Attendance */}
                        <SectionCard icon={BarChart3} title="Attendance Summary" iconColor="text-electric-blue">
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                {[
                                    { label: 'Total', value: totalClasses, color: 'electric-blue' },
                                    { label: 'Present', value: presentCount, color: 'emerald-glow' },
                                    { label: 'Absent', value: totalClasses - presentCount, color: 'rose-400' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className={`p-4 rounded-2xl bg-${color}/10 border border-${color}/20 text-center`}>
                                        <p className={`text-2xl font-black text-${color}`}>{value}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{label}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-2 font-bold">
                                    <span>Attendance Rate</span>
                                    <span className={attendancePct >= 75 ? 'text-emerald-glow' : 'text-rose-400'}>{attendancePct}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${attendancePct}%` }}
                                        transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
                                        className={`h-full rounded-full ${attendancePct >= 75 ? 'bg-gradient-to-r from-emerald-glow to-teal-400' : 'bg-gradient-to-r from-rose-500 to-orange-400'}`}
                                    />
                                </div>
                                <p className={`text-xs mt-2 font-semibold ${attendancePct >= 75 ? 'text-emerald-glow' : 'text-rose-400'}`}>
                                    {attendancePct >= 75 ? '✓ Eligible for examinations' : `⚠ Need ${75 - attendancePct}% more to be exam eligible`}
                                </p>
                            </div>
                        </SectionCard>

                        {/* Projects */}
                        <SectionCard icon={Code2} title="Projects" iconColor="text-amber-400">
                            <div className="space-y-4">
                                {projects.map((proj, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${proj.status === 'Completed' ? 'bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20' : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'}`}>
                                                {proj.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">{proj.desc}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(proj.tech || []).map((t, ti) => (
                                                <span key={ti} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-white/5">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && <p className="text-slate-500 text-sm italic text-center py-6">No projects added yet.</p>}
                            </div>
                        </SectionCard>
                    </motion.div>
                )}

                {activeTab === 'academic' && (
                    <motion.div key="academic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Academic Details */}
                        <SectionCard icon={GraduationCap} title="Academic Information" iconColor="text-electric-blue">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Roll Number" value={student.rollNo} icon={Award} color="luxury-gold" />
                                <Field label="Year" value={student.year} icon={Clock} color="electric-blue" />
                                <Field label="Section" value={student.section} icon={Layers} color="royal-purple" />
                                <Field label="Department" value="AI & ML" icon={Cpu} color="emerald-glow" />
                                <Field label="CGPA" value={`${student.cgpa} / 10.0`} icon={Star} color="emerald-glow" />
                                <Field label="Institution" value="KGISL Institute of Technology" icon={GraduationCap} color="electric-blue" />
                            </div>
                        </SectionCard>

                        {/* CGPA Meter */}
                        <SectionCard icon={TrendingUp} title="Academic Performance" iconColor="text-emerald-glow">
                            <div className="flex flex-col items-center justify-center py-4">
                                {/* Circular CGPA indicator */}
                                <div className="relative w-40 h-40 mx-auto mb-6">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                        <motion.circle
                                            cx="50" cy="50" r="42" fill="none"
                                            stroke={cgpaNum >= 9 ? '#10b981' : cgpaNum >= 8 ? '#3b82f6' : '#f59e0b'}
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 42}`}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - cgpaNum / 10) }}
                                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-4xl font-black text-${cgpaColor}`}>{student.cgpa}</span>
                                        <span className="text-xs text-slate-400 font-bold">/ 10.0</span>
                                    </div>
                                </div>
                                <p className={`text-sm font-bold text-${cgpaColor} mb-2`}>
                                    {cgpaNum >= 9 ? '🌟 Distinction' : cgpaNum >= 8 ? '⭐ First Class' : cgpaNum >= 7 ? '✓ Second Class' : 'Pass'}
                                </p>

                                {/* Subject Scores if available */}
                                {studentExams.length > 0 && (
                                    <div className="w-full mt-4 space-y-3">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Subject Performance</p>
                                        {studentExams.slice(0, 4).map((ex, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="text-xs text-slate-400 w-28 truncate shrink-0">{ex.subject || ex.course || `Subject ${i + 1}`}</span>
                                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(((ex.marks || ex.score || 0) / (ex.maxMarks || 100)) * 100, 100)}%` }}
                                                        transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                                                        className="h-full bg-gradient-to-r from-electric-blue to-emerald-glow rounded-full"
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-white shrink-0">{ex.marks || ex.score || 'N/A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {studentExams.length === 0 && (
                                    <p className="text-xs text-slate-500 italic text-center mt-4">No exam results found yet.</p>
                                )}
                            </div>
                        </SectionCard>

                        {/* Courses enrolled */}
                        <SectionCard icon={BookOpen} title="Enrolled Courses" iconColor="text-royal-purple">
                            <div className="space-y-3">
                                {(courses || []).slice(0, 6).map((c, i) => (
                                    <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-royal-purple/10 text-royal-purple border border-royal-purple/20 rounded-lg flex items-center justify-center text-xs font-black">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{c.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{c.code}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-400 font-bold shrink-0">{c.credits ? `${c.credits} Cr.` : 'Audit'}</span>
                                    </div>
                                ))}
                                {(!courses || courses.length === 0) && <p className="text-slate-500 text-sm text-center italic py-4">No courses found.</p>}
                            </div>
                        </SectionCard>

                        {/* Skills & Interests */}
                        <SectionCard icon={Flame} title="Skills & Expertise" iconColor="text-rose-400">
                            <div className="space-y-4">
                                {(student.skills || []).map((skill, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-slate-300">{skill}</span>
                                            <span className="text-slate-500">{60 + (i * 7 % 35)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${60 + (i * 7 % 35)}%` }}
                                                transition={{ delay: 0.1 + i * 0.08, duration: 0.8 }}
                                                className="h-full rounded-full"
                                                style={{ background: `hsl(${200 + i * 30}, 80%, 60%)` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!student.skills || student.skills.length === 0) && (
                                    <p className="text-slate-500 text-sm italic text-center py-4">No skills listed.</p>
                                )}
                            </div>
                        </SectionCard>
                    </motion.div>
                )}

                {activeTab === 'achievements' && (
                    <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Achievements */}
                        <SectionCard icon={Trophy} title="Achievements & Awards" iconColor="text-amber-400">
                            <div className="space-y-4">
                                {achievements.map((ach, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-amber-400/20 hover:bg-amber-400/5 transition-all group"
                                    >
                                        <div className="text-2xl shrink-0">{ach.icon}</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">{ach.title}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{ach.org}</p>
                                        </div>
                                        <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-lg text-[10px] font-bold shrink-0">{ach.year}</span>
                                    </motion.div>
                                ))}
                                {achievements.length === 0 && (
                                    <p className="text-slate-500 text-sm italic text-center py-8">No achievements listed yet.</p>
                                )}
                            </div>
                        </SectionCard>

                        {/* All Projects */}
                        <SectionCard icon={Code2} title="Project Portfolio" iconColor="text-electric-blue">
                            <div className="space-y-4">
                                {projects.map((proj, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-electric-blue/20 hover:bg-electric-blue/5 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${proj.status === 'Completed' ? 'bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20' : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'}`}>
                                                {proj.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">{proj.desc}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(proj.tech || []).map((t, ti) => (
                                                <span key={ti} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-electric-blue/10 text-electric-blue border border-electric-blue/20">{t}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </SectionCard>

                        {/* Certifications */}
                        <SectionCard icon={Shield} title="Certifications" iconColor="text-emerald-glow">
                            <div className="space-y-3">
                                {(student.certifications || [
                                    { name: 'NPTEL - Machine Learning', issuer: 'IIT Madras', grade: 'Elite' },
                                    { name: 'Google Cloud Fundamentals', issuer: 'Google', grade: 'Pass' },
                                ]).map((cert, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-emerald-glow/20 transition-colors">
                                        <div className="w-10 h-10 bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20 rounded-xl flex items-center justify-center shrink-0">
                                            <Award size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-white text-sm truncate">{cert.name}</p>
                                            <p className="text-xs text-slate-400">{cert.issuer}</p>
                                        </div>
                                        <span className="px-2.5 py-1 bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20 rounded-lg text-[10px] font-black shrink-0">{cert.grade}</span>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>

                        {/* Competitions */}
                        <SectionCard icon={Target} title="Competitions & Events" iconColor="text-royal-purple">
                            <div className="space-y-3">
                                {(student.competitions || [
                                    { name: 'Smart India Hackathon 2024', result: 'Runner-Up', level: 'National' },
                                    { name: 'Dept. Tech Fest', result: 'Winner', level: 'Institution' },
                                ]).map((comp, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-royal-purple/20 transition-colors">
                                        <div className="w-10 h-10 bg-royal-purple/10 text-royal-purple border border-royal-purple/20 rounded-xl flex items-center justify-center shrink-0 text-lg">
                                            {comp.result === 'Winner' ? '🥇' : comp.result === 'Runner-Up' ? '🥈' : '🎖️'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-white text-sm truncate">{comp.name}</p>
                                            <p className="text-xs text-slate-400">{comp.result}</p>
                                        </div>
                                        <span className="px-2.5 py-1 bg-royal-purple/10 text-royal-purple border border-royal-purple/20 rounded-lg text-[10px] font-black shrink-0">{comp.level}</span>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </motion.div>
                )}

                {activeTab === 'documents' && (
                    <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <SectionCard icon={FileBadge} title="Submitted Documents" iconColor="text-emerald-glow">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {documentItems.map(doc => (
                                    <div key={doc.key} className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${student.documents?.[doc.key] ? 'bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                                            <FileText size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{doc.label}</p>
                                            <p className={`text-sm font-semibold mt-0.5 truncate ${student.documents?.[doc.key] ? 'text-emerald-glow' : 'text-slate-500'}`}>
                                                {student.documents?.[doc.key] || 'Not Submitted'}
                                            </p>
                                        </div>
                                        {student.documents?.[doc.key] ? (
                                            <CheckCircle size={16} className="text-emerald-glow shrink-0" />
                                        ) : (
                                            <XCircle size={16} className="text-slate-600 shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
                                <div className="text-sm text-slate-400">
                                    <span className="font-bold text-white">
                                        {Object.keys(student.documents || {}).length}
                                    </span> / {documentItems.length} documents submitted
                                </div>
                                <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(Object.keys(student.documents || {}).length / documentItems.length) * 100}%` }}
                                        transition={{ duration: 0.8 }}
                                        className="h-full bg-gradient-to-r from-emerald-glow to-electric-blue rounded-full"
                                    />
                                </div>
                            </div>
                        </SectionCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Edit Modal ── */}
            {createPortal(
                <AnimatePresence>
                    {isEditing && (
                        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-2xl w-full shadow-glass-card relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                            >
                                <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <X size={22} />
                                </button>
                                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                    <Sparkles className="text-electric-blue" size={24} />
                                    Edit Portfolio
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <EditInput label="Full Name" value={editForm.name} onChange={v => setEditForm({ ...editForm, name: v })} />
                                        <EditInput label="Roll Number" value={editForm.rollNo} onChange={v => setEditForm({ ...editForm, rollNo: v })} />
                                    </div>
                                    <EditTextarea label="Bio / About" value={editForm.bio || ''} onChange={v => setEditForm({ ...editForm, bio: v })} rows={2} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <EditInput label="Email" value={editForm.email} onChange={v => setEditForm({ ...editForm, email: v })} type="email" />
                                        <EditInput label="Phone" value={editForm.phone} onChange={v => setEditForm({ ...editForm, phone: v })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <EditInput label="Date of Birth" value={editForm.dob} onChange={v => setEditForm({ ...editForm, dob: v })} type="date" />
                                        <EditInput label="Blood Group" value={editForm.bloodGroup} onChange={v => setEditForm({ ...editForm, bloodGroup: v })} />
                                    </div>
                                    <EditInput label="Address" value={editForm.address} onChange={v => setEditForm({ ...editForm, address: v })} />

                                    <div className="border-t border-white/10 pt-4 mt-2">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Social Links</h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            <EditInput label="GitHub URL" value={editForm.github || ''} onChange={v => setEditForm({ ...editForm, github: v })} />
                                            <EditInput label="LinkedIn URL" value={editForm.linkedin || ''} onChange={v => setEditForm({ ...editForm, linkedin: v })} />
                                            <EditInput label="Portfolio / Website URL" value={editForm.website || ''} onChange={v => setEditForm({ ...editForm, website: v })} />
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Family Details</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <EditInput label="Father's Name" value={editForm.fatherName || ''} onChange={v => setEditForm({ ...editForm, fatherName: v })} />
                                            <EditInput label="Mother's Name" value={editForm.motherName || ''} onChange={v => setEditForm({ ...editForm, motherName: v })} />
                                            <EditInput label="Father's Phone" value={editForm.fatherPhone || ''} onChange={v => setEditForm({ ...editForm, fatherPhone: v })} />
                                            <EditInput label="Mother's Phone" value={editForm.motherPhone || ''} onChange={v => setEditForm({ ...editForm, motherPhone: v })} />
                                            <EditInput label="Father's Occupation" value={editForm.fatherOccupation || ''} onChange={v => setEditForm({ ...editForm, fatherOccupation: v })} />
                                            <EditInput label="Mother's Occupation" value={editForm.motherOccupation || ''} onChange={v => setEditForm({ ...editForm, motherOccupation: v })} />
                                            <EditInput label="Annual Income (₹)" value={editForm.annualIncome || ''} type="number" onChange={v => setEditForm({ ...editForm, annualIncome: v })} />
                                        </div>
                                    </div>

                                    {isAuthorized && (
                                        <div className="border-t border-white/10 pt-4">
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Academic (Admin Only)</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <EditInput label="Year" value={editForm.year} onChange={v => setEditForm({ ...editForm, year: v })} />
                                                <EditInput label="Section" value={editForm.section} onChange={v => setEditForm({ ...editForm, section: v })} />
                                                <EditInput label="CGPA" value={editForm.cgpa} onChange={v => setEditForm({ ...editForm, cgpa: v })} />
                                                <EditInput label="Manual Total Classes" value={editForm.manualTotalClasses || ''} type="number" onChange={v => setEditForm({ ...editForm, manualTotalClasses: v })} />
                                                <EditInput label="Manual Present Classes" value={editForm.manualPresentClasses || ''} type="number" onChange={v => setEditForm({ ...editForm, manualPresentClasses: v })} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t border-white/10 pt-4">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Skills</h4>
                                        <EditInput label="Skills (comma separated)" value={editForm.skills} onChange={v => setEditForm({ ...editForm, skills: v })} />
                                    </div>

                                    <div className="border-t border-white/10 pt-4">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Document Uploads</h4>
                                        <div className="space-y-3">
                                            {documentItems.map(doc => (
                                                <div key={doc.key}>
                                                    <FileInput
                                                        label={doc.label}
                                                        value={editForm.documents?.[doc.key] || ''}
                                                        onChange={v => {
                                                            const updatedDocs = { ...(editForm.documents || {}) };
                                                            if (!v || v.trim() === '') { delete updatedDocs[doc.key]; } else { updatedDocs[doc.key] = v; }
                                                            setEditForm({ ...editForm, documents: updatedDocs });
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="mt-8 w-full py-4 bg-gradient-to-r from-electric-blue to-emerald-glow rounded-xl font-black text-white flex items-center justify-center space-x-2 shadow-glow-blue hover:scale-[1.02] transition-transform"
                                >
                                    <Save size={20} />
                                    <span>Save Portfolio</span>
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default StudentProfile;
