import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, Edit2, Trash2, Plus, X, Save, ExternalLink } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Faculty = () => {
    const { faculty, setFaculty, currentUser } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';
    const navigate = useNavigate();

    const [isAdding, setIsAdding] = useState(false);
    const [addForm, setAddForm] = useState(null);

    const handleAddNew = () => {
        setAddForm({
            id: 'F' + Date.now().toString().slice(-4),
            name: 'New Faculty',
            dept: 'AI&ML',
            role: 'Assistant Professor',
            subject: 'TBD',
            email: 'new@dms.edu',
            phone: '+91 98765 00000',
            qualification: '',
            experience: '',
            specialization: '',
            publications: 0,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
        });
        setIsAdding(true);
    };

    const handleSaveNew = () => {
        setFaculty(prev => [...prev, { ...addForm, publications: parseInt(addForm.publications) || 0 }]);
        setIsAdding(false);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        setFaculty(faculty.filter(f => f.id !== id));
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const cardVariants = { hidden: { opacity: 0, scale: 0.9, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300 } } };

    const roleColor = (role) => {
        if (!role) return 'electric-blue';
        if (role.toLowerCase().includes('professor') && !role.toLowerCase().includes('asst') && !role.toLowerCase().includes('assistant')) return 'luxury-gold';
        return 'royal-purple';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <Users className="text-royal-purple" size={32} />
                        <span>Faculty Base</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Click any card to view full profile.</p>
                </div>
                {isAuthorized && (
                    <button onClick={handleAddNew} className="bg-gradient-to-r from-royal-purple to-electric-blue text-white px-6 py-3 rounded-xl font-bold hover:shadow-glow-purple transition-shadow flex items-center space-x-2">
                        <Plus size={20} />
                        <span>Add Faculty</span>
                    </button>
                )}
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {faculty.map((member) => {
                    const rc = roleColor(member.role);
                    return (
                        <motion.div
                            key={member.id}
                            variants={cardVariants}
                            onClick={() => navigate(`/faculty/${member.id}`)}
                            className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6 flex flex-col items-center relative group overflow-hidden cursor-pointer"
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-royal-purple/5 to-electric-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>

                            {/* View profile indicator */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink size={14} className="text-electric-blue" />
                            </div>

                            <div className="relative mb-5 mt-3">
                                <div className="w-20 h-20 rounded-full border-[3px] border-electric-blue/50 p-1 group-hover:border-royal-purple group-hover:shadow-glow-purple transition-all duration-500 bg-slate-800 relative z-10 overflow-hidden">
                                    <img
                                        src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`}
                                        alt={member.name}
                                        className="w-full h-full object-cover rounded-full"
                                        onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`; }}
                                    />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-electric-blue/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-glow transition-all text-center z-10 leading-snug">{member.name}</h3>

                            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 z-10">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${rc}/10 text-${rc} border border-${rc}/20`}>{member.role || 'Faculty'}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-electric-blue/10 text-electric-blue border border-electric-blue/20">{member.dept}</span>
                            </div>

                            <p className="text-xs text-slate-400 text-center z-10 mb-4 line-clamp-1">{member.subject}</p>

                            <div className="w-full space-y-2 mt-auto pt-3 border-t border-white/5 z-10">
                                <div className="flex items-center space-x-2 text-xs text-slate-400">
                                    <div className="p-1.5 bg-slate-800 rounded-lg shrink-0"><Mail size={12} /></div>
                                    <span className="truncate">{member.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-slate-400">
                                    <div className="p-1.5 bg-slate-800 rounded-lg shrink-0"><Phone size={12} /></div>
                                    <span>{member.phone || 'N/A'}</span>
                                </div>
                            </div>

                            {isAuthorized && (
                                <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                    <button
                                        onClick={e => handleDelete(e, member.id)}
                                        className="p-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/30 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Add New Faculty Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-md w-full shadow-glass-card relative max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-black text-white mb-6">Add Faculty Member</h2>
                            <div className="space-y-3">
                                {[
                                    ['name', 'Full Name', 'text'],
                                    ['email', 'Email', 'email'],
                                    ['phone', 'Phone', 'text'],
                                    ['dept', 'Department', 'text'],
                                    ['role', 'Designation', 'text'],
                                    ['subject', 'Subject(s)', 'text'],
                                    ['qualification', 'Qualification', 'text'],
                                    ['experience', 'Experience', 'text'],
                                    ['specialization', 'Specialization', 'text'],
                                    ['publications', 'Publications', 'number'],
                                ].map(([key, label, type]) => (
                                    <div key={key}>
                                        <label className="text-slate-400 text-xs font-bold mb-1 block">{label}</label>
                                        <input
                                            type={type}
                                            className="w-full bg-slate-800 border border-white/10 p-2.5 rounded-xl text-white text-sm outline-none focus:border-royal-purple/50 focus:ring-1 focus:ring-royal-purple transition-all"
                                            value={addForm[key]}
                                            onChange={e => setAddForm({ ...addForm, [key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleSaveNew} className="mt-6 w-full py-4 bg-gradient-to-r from-royal-purple to-electric-blue rounded-xl font-black text-white flex items-center justify-center space-x-2 shadow-glow-purple hover:scale-[1.02] transition-transform">
                                <Save size={20} />
                                <span>Save Faculty</span>
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Faculty;
