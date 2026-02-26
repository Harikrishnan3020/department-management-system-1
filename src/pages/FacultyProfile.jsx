import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, ArrowLeft, Mail, Phone, BookOpen, Award, Edit2, X, Save,
    Briefcase, GraduationCap, Star, FileText, XCircle, FlaskConical
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Field = ({ label, value, icon: Icon, color = 'royal-purple' }) => (
    <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors">
        <div className={`mt-0.5 p-2 rounded-lg bg-${color}/10 text-${color} border border-${color}/20 shrink-0`}>
            <Icon size={14} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-semibold text-white mt-0.5">{value || '—'}</p>
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
            className="w-full bg-slate-800 border border-white/10 p-2.5 rounded-xl text-white text-sm outline-none focus:border-royal-purple/50 focus:ring-1 focus:ring-royal-purple transition-all"
        />
    </div>
);

const FacultyProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { faculty, setFaculty, currentUser } = useContext(AppContext);

    const member = faculty.find(f => f.id === id);
    const isAuthorized = currentUser?.role === 'Admin';

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <XCircle className="text-rose-500" size={48} />
                <p className="text-white text-xl font-bold">Faculty member not found</p>
                <button onClick={() => navigate('/faculty')} className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition">
                    Back to Faculty
                </button>
            </div>
        );
    }

    const handleEdit = () => {
        setEditForm({ ...member });
        setIsEditing(true);
    };

    const handleSave = () => {
        const updated = {
            ...editForm,
            publications: parseInt(editForm.publications) || 0,
        };
        setFaculty(prev => prev.map(f => f.id === id ? updated : f));
        setIsEditing(false);
    };

    const roleColor = member.role?.includes('Professor') && !member.role?.includes('Asst') && !member.role?.includes('Assistant')
        ? 'luxury-gold' : 'royal-purple';

    return (
        <div className="space-y-6">
            {/* Back + Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={22} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight text-glow">Faculty Profile</h1>
                    <p className="text-slate-400 text-sm font-medium">Academic staff details and expertise</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Left: Identity Card ── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-8 flex flex-col items-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-royal-purple/5 to-transparent pointer-events-none" />

                    {/* Avatar */}
                    <div className="relative mb-6 mt-2">
                        <div className="w-28 h-28 rounded-full border-[3px] border-royal-purple/50 p-1 shadow-[0_0_30px_rgba(139,92,246,0.3)] bg-slate-800 overflow-hidden">
                            <img
                                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`}
                                alt={member.name}
                                className="w-full h-full object-cover rounded-full"
                                onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`; }}
                            />
                        </div>
                    </div>

                    <h2 className="text-xl font-black text-white text-center text-glow mb-2">{member.name}</h2>

                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <span className={`px-3 py-1 bg-${roleColor}/10 text-${roleColor} border border-${roleColor}/30 rounded-full text-xs font-bold`}>
                            {member.role || 'Faculty'}
                        </span>
                        <span className="px-3 py-1 bg-electric-blue/10 text-electric-blue border border-electric-blue/20 rounded-full text-xs font-bold">
                            {member.dept}
                        </span>
                    </div>

                    <p className="text-slate-400 text-sm text-center">{member.subject}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                        <div className="p-4 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/20 text-center">
                            <p className="text-2xl font-black text-luxury-gold">{member.publications || 0}</p>
                            <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Publications</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-glow/10 border border-emerald-glow/20 text-center">
                            <p className="text-2xl font-black text-emerald-glow truncate">{member.experience || 'N/A'}</p>
                            <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Experience</p>
                        </div>
                    </div>

                    {isAuthorized && (
                        <button
                            onClick={handleEdit}
                            className="mt-6 w-full flex items-center justify-center space-x-2 py-3 bg-royal-purple/10 hover:bg-royal-purple/20 text-royal-purple border border-royal-purple/30 rounded-xl font-bold text-sm transition-colors"
                        >
                            <Edit2 size={16} />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </motion.div>

                {/* ── Right: Details ── */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Contact Info */}
                    <div className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                            <Users size={18} className="text-royal-purple" /><span>Contact Information</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Email" value={member.email} icon={Mail} color="electric-blue" />
                            <Field label="Phone" value={member.phone} icon={Phone} color="royal-purple" />
                        </div>
                    </div>

                    {/* Academic Profile */}
                    <div className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                            <GraduationCap size={18} className="text-electric-blue" /><span>Academic Profile</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Department" value={member.dept} icon={Briefcase} color="electric-blue" />
                            <Field label="Designation" value={member.role} icon={Award} color={roleColor} />
                            <Field label="Subject(s)" value={member.subject} icon={BookOpen} color="luxury-gold" />
                            <Field label="Qualification" value={member.qualification} icon={GraduationCap} color="emerald-glow" />
                        </div>
                    </div>

                    {/* Research & Expertise */}
                    <div className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                            <FlaskConical size={18} className="text-luxury-gold" /><span>Research & Expertise</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <Field label="Specialization" value={member.specialization} icon={Star} color="luxury-gold" />
                            <Field label="Experience" value={member.experience} icon={Briefcase} color="emerald-glow" />
                            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                                <div className="p-2 rounded-lg bg-royal-purple/10 text-royal-purple border border-royal-purple/20 shrink-0">
                                    <FileText size={14} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Publications</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-2xl font-black text-luxury-gold">{member.publications || 0}</span>
                                        <div className="flex space-x-0.5">
                                            {Array.from({ length: Math.min(5, member.publications || 0) }).map((_, i) => (
                                                <Star key={i} size={12} className="text-luxury-gold fill-luxury-gold" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Edit Modal (Admin only) */}
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
                            <h2 className="text-2xl font-black text-white mb-6">Edit Faculty Profile</h2>
                            <div className="space-y-3">
                                <EditInput label="Full Name" value={editForm.name} onChange={v => setEditForm({ ...editForm, name: v })} />
                                <EditInput label="Email" value={editForm.email} onChange={v => setEditForm({ ...editForm, email: v })} type="email" />
                                <EditInput label="Phone" value={editForm.phone} onChange={v => setEditForm({ ...editForm, phone: v })} />
                                <EditInput label="Department" value={editForm.dept} onChange={v => setEditForm({ ...editForm, dept: v })} />
                                <EditInput label="Designation / Role" value={editForm.role} onChange={v => setEditForm({ ...editForm, role: v })} />
                                <EditInput label="Subject(s)" value={editForm.subject} onChange={v => setEditForm({ ...editForm, subject: v })} />
                                <EditInput label="Qualification" value={editForm.qualification} onChange={v => setEditForm({ ...editForm, qualification: v })} />
                                <EditInput label="Experience (e.g. 10 years)" value={editForm.experience} onChange={v => setEditForm({ ...editForm, experience: v })} />
                                <EditInput label="Specialization" value={editForm.specialization} onChange={v => setEditForm({ ...editForm, specialization: v })} />
                                <EditInput label="Publications (count)" value={String(editForm.publications)} onChange={v => setEditForm({ ...editForm, publications: v })} type="number" />
                                <EditInput label="Avatar URL" value={editForm.avatar} onChange={v => setEditForm({ ...editForm, avatar: v })} />
                            </div>
                            <button
                                onClick={handleSave}
                                className="mt-6 w-full py-4 bg-gradient-to-r from-royal-purple to-electric-blue rounded-xl font-black text-white flex items-center justify-center space-x-2 shadow-glow-purple hover:scale-[1.02] transition-transform"
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

export default FacultyProfile;
