import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Edit2, Trash2, X, Search, Save, AlertTriangle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Departments = () => {
    const { departments, setDepartments, currentUser } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [isModalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editForm, setEditForm] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const toggleModal = () => setModalOpen(!isModalOpen);

    const handleAddNew = () => {
        setEditForm({ id: '', name: '', head: '', faculty: 0, students: 0, status: 'Active' });
        setModalOpen(true);
    };

    const handleEditClick = (dept) => {
        setEditForm(dept);
        setModalOpen(true);
    };

    const handleDeleteClick = (dept) => {
        setDeleteTarget(dept);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            setDepartments(prev => prev.filter(d => d.id !== deleteTarget.id));
        }
        setDeleteTarget(null);
    };

    const handleSave = () => {
        if (!editForm.id || !editForm.name) return;
        const existingIndex = departments.findIndex(d => d.id === editForm.id);
        if (existingIndex >= 0) {
            const updated = [...departments];
            updated[existingIndex] = editForm;
            setDepartments(updated);
        } else {
            setDepartments([...departments, editForm]);
        }
        setModalOpen(false);
        setEditForm(null);
    };

    const filteredDepartments = departments.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <Building2 className="text-electric-blue" size={32} />
                        <span>Department Hub</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Manage academic branches and resources.</p>
                </div>
                {isAuthorized && (
                    <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={handleAddNew}
                        className="bg-gradient-to-r from-electric-blue to-royal-purple text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-glow-blue hover:shadow-glow-purple transition-shadow"
                    >
                        <Plus size={20} /><span>Add Department</span>
                    </motion.button>
                )}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue transition-all shadow-inner"
                    />
                </div>
                <button className="px-5 py-3 rounded-xl glass-card text-slate-300 font-semibold border border-white/10 hover:bg-white/5 transition-colors">
                    Filter Options
                </button>
            </div>

            {/* Table */}
            <div className="glass-card rounded-[2rem] border border-glass-border overflow-hidden shadow-glass-card">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-sm tracking-wider uppercase bg-slate-950/50 backdrop-blur-md">
                            <th className="p-6 font-semibold">Dept ID</th>
                            <th className="p-6 font-semibold">Name</th>
                            <th className="p-6 font-semibold">HOD</th>
                            <th className="p-6 font-semibold">Faculty / Students</th>
                            <th className="p-6 font-semibold">Status</th>
                            {isAuthorized && <th className="p-6 font-semibold text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredDepartments.map((dept, index) => (
                                <motion.tr
                                    key={dept.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                                >
                                    <td className="p-6 font-bold w-32">
                                        <span className="bg-gradient-to-r from-electric-blue to-royal-purple bg-clip-text text-transparent">
                                            {dept.id}
                                        </span>
                                    </td>
                                    <td className="p-6 font-semibold text-slate-200">{dept.name}</td>
                                    <td className="p-6 font-medium text-slate-400">{dept.head}</td>
                                    <td className="p-6">
                                        <div className="flex items-center space-x-3 text-sm font-semibold">
                                            <span className="text-royal-purple bg-royal-purple/10 px-2 py-1 rounded border border-royal-purple/20">{dept.faculty} F</span>
                                            <span className="text-slate-500">|</span>
                                            <span className="text-emerald-glow bg-emerald-glow/10 px-2 py-1 rounded border border-emerald-glow/20">{dept.students} S</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${dept.status === 'Active'
                                            ? 'bg-emerald-glow/20 text-emerald-glow border border-emerald-glow/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                            : 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 shadow-[0_0_10px_rgba(250,204,21,0.2)]'
                                            }`}>
                                            {dept.status}
                                        </span>
                                    </td>
                                    {isAuthorized && (
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleEditClick(dept)}
                                                    title="Edit"
                                                    className="p-2 bg-slate-800 hover:bg-electric-blue/20 text-slate-300 hover:text-electric-blue rounded-lg transition-all border border-transparent hover:border-electric-blue/30"
                                                >
                                                    <Edit2 size={18} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                    onClick={e => { e.stopPropagation(); handleDeleteClick(dept); }}
                                                    title="Delete"
                                                    className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-lg transition-all border border-transparent hover:border-rose-500/40"
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </div>
                                        </td>
                                    )}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {filteredDepartments.length === 0 && (
                            <tr>
                                <td colSpan={isAuthorized ? 6 : 5} className="p-12 text-center text-slate-500 font-medium">
                                    No departments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Add / Edit Modal ── */}
            <AnimatePresence>
                {isModalOpen && editForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="w-full max-w-lg glass-card rounded-[2rem] border border-glass-border shadow-glass-card overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/20 blur-[80px] rounded-full pointer-events-none -z-10" />
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-950/40">
                                <h2 className="text-2xl font-bold text-white text-glow">
                                    {departments.find(d => d.id === editForm.id) ? 'Edit Department' : 'New Department'}
                                </h2>
                                <button onClick={toggleModal} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-xl transition">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Department Name</label>
                                    <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                                        placeholder="e.g. Information Technology" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Department Code / ID</label>
                                    <input type="text" value={editForm.id} onChange={e => setEditForm({ ...editForm, id: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                                        placeholder="e.g. IT"
                                        disabled={!!departments.find(d => d.id === editForm.id)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Head of Department</label>
                                    <input type="text" value={editForm.head} onChange={e => setEditForm({ ...editForm, head: e.target.value })}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                                        placeholder="Enter HOD name..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Total Faculty</label>
                                        <input type="number" value={editForm.faculty} onChange={e => setEditForm({ ...editForm, faculty: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Total Students</label>
                                        <input type="number" value={editForm.students} onChange={e => setEditForm({ ...editForm, students: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                                    <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all">
                                        <option value="Active">Active</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex justify-end space-x-4">
                                    <button onClick={toggleModal} className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition">
                                        Cancel
                                    </button>
                                    <button onClick={handleSave} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-electric-blue to-royal-purple hover:shadow-glow-blue transition-all flex items-center space-x-2">
                                        <Save size={18} /><span>Save</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete Confirmation Modal ── */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.85, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.85, y: 30, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                            className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-[2rem] shadow-[0_0_60px_rgba(239,68,68,0.2)] overflow-hidden relative"
                        >
                            {/* Red top glow strip */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600 opacity-80" />
                            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 blur-[80px] rounded-full pointer-events-none" />

                            <div className="p-8 flex flex-col items-center text-center relative z-10">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(239,68,68,0.3)]"
                                >
                                    <AlertTriangle size={32} className="text-rose-400" />
                                </motion.div>

                                <h2 className="text-2xl font-black text-white mb-2">Delete Department?</h2>
                                <p className="text-slate-400 mb-2 text-sm">You are about to permanently delete:</p>
                                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-5 py-3 mb-5 w-full">
                                    <p className="text-rose-400 font-bold text-lg">{deleteTarget.name}</p>
                                    <p className="text-slate-500 text-sm font-mono mt-1">ID: {deleteTarget.id}</p>
                                </div>
                                <p className="text-slate-500 text-sm mb-8">
                                    This action <span className="text-rose-400 font-semibold">cannot be undone</span>.
                                    The department will be permanently removed.
                                </p>

                                <div className="flex space-x-3 w-full">
                                    <button
                                        onClick={() => setDeleteTarget(null)}
                                        className="flex-1 py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        onClick={confirmDelete}
                                        className="flex-1 py-3 rounded-xl font-black bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:shadow-[0_0_24px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center space-x-2"
                                    >
                                        <Trash2 size={18} />
                                        <span>Yes, Delete</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Departments;
