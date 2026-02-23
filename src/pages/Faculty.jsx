import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, Edit2, Trash2, Plus, X, Save } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Faculty = () => {
    const { faculty, setFaculty, currentUser } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    const handleEditClick = (fac) => {
        setEditForm(fac);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setEditForm({
            id: 'F' + Date.now().toString().slice(-4),
            name: 'New Faculty',
            dept: 'CSE',
            role: 'Asst. Professor',
            email: 'new@dms.edu',
            phone: '+91 9876543210',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!faculty.find(f => f.id === editForm.id)) {
            setFaculty([...faculty, editForm]);
        } else {
            setFaculty(faculty.map(f => f.id === editForm.id ? editForm : f));
        }
        setIsEditing(false);
    };

    const handleDelete = (id) => {
        setFaculty(faculty.filter(f => f.id !== id));
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const cardVariants = { hidden: { opacity: 0, scale: 0.9, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300 } } };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <Users className="text-royal-purple" size={32} />
                        <span>Faculty Base</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Manage academic staff and departmental assignments.</p>
                </div>
                {isAuthorized && (
                    <button onClick={handleAddNew} className="bg-gradient-to-r from-royal-purple to-electric-blue text-white px-6 py-3 rounded-xl font-bold hover:shadow-glow-purple transition-shadow flex items-center space-x-2">
                        <Plus size={20} />
                        <span>Add Faculty</span>
                    </button>
                )}
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {faculty.map((member) => (
                    <motion.div key={member.id} variants={cardVariants} className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6 flex flex-col items-center relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-royal-purple/5 to-electric-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>

                        <div className="relative mb-6 mt-4">
                            <div className="w-24 h-24 rounded-full border-[3px] border-electric-blue/50 p-1 group-hover:border-royal-purple group-hover:shadow-glow-purple transition-all duration-500 bg-slate-800 relative z-10 overflow-hidden">
                                <img src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-electric-blue/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-glow transition-all text-center z-10">{member.name}</h3>

                        <div className="flex items-center space-x-2 mb-4 z-10">
                            <span className="text-xs font-bold px-2 py-1 rounded bg-electric-blue/10 text-electric-blue border border-electric-blue/20">{member.dept}</span>
                            <span className="text-xs font-semibold text-slate-400">{member.role}</span>
                        </div>

                        <div className="w-full space-y-3 mt-4 pt-4 border-t border-white/5 z-10">
                            <div className="flex items-center space-x-3 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group/link">
                                <div className="p-2 bg-slate-800 rounded-lg group-hover/link:bg-royal-purple/20 group-hover/link:text-royal-purple transition-colors"><Mail size={16} /></div>
                                <span className="truncate">{member.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group/link">
                                <div className="p-2 bg-slate-800 rounded-lg group-hover/link:bg-emerald-glow/20 group-hover/link:text-emerald-glow transition-colors"><Phone size={16} /></div>
                                <span>{member.phone || '+1 (555) 123-4567'}</span>
                            </div>
                        </div>

                        {isAuthorized && (
                            <div className="absolute bottom-4 right-4 flex space-x-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                <button onClick={() => handleDelete(member.id)} className="p-2 bg-rose-500 text-white rounded-lg shadow-glow-rose hover:scale-110 transition-transform">
                                    <Trash2 size={16} />
                                </button>
                                <button onClick={() => handleEditClick(member)} className="p-2 bg-electric-blue text-white rounded-lg shadow-glow-blue hover:scale-110 transition-transform">
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-md w-full shadow-glass-card relative"
                        >
                            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-black text-white mb-6">Edit Faculty</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-slate-400 text-sm font-bold">Name</label>
                                    <input type="text" className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-royal-purple/50 focus:ring-1 focus:ring-royal-purple" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <label className="text-slate-400 text-sm font-bold">Department</label>
                                        <input type="text" className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-royal-purple/50 focus:ring-1 focus:ring-royal-purple" value={editForm.dept} onChange={e => setEditForm({ ...editForm, dept: e.target.value })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-slate-400 text-sm font-bold">Role</label>
                                        <input type="text" className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-royal-purple/50 focus:ring-1 focus:ring-royal-purple" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm font-bold">Email</label>
                                    <input type="email" className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-royal-purple/50 focus:ring-1 focus:ring-royal-purple" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <label className="text-slate-400 text-sm font-bold">Phone No.</label>
                                        <input type="text" className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-royal-purple/50 focus:ring-1 focus:ring-royal-purple" value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-slate-400 text-sm font-bold">Photo URL</label>
                                        <input type="text" className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-royal-purple/50 focus:ring-1 focus:ring-royal-purple" value={editForm.avatar || ''} onChange={e => setEditForm({ ...editForm, avatar: e.target.value })} />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button onClick={handleSave} className="w-full py-4 bg-gradient-to-r from-royal-purple to-electric-blue rounded-xl font-black text-white flex items-center justify-center space-x-2 shadow-glow-purple hover:scale-[1.02] transition-transform">
                                        <Save size={20} />
                                        <span>Save Changes</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Faculty;
