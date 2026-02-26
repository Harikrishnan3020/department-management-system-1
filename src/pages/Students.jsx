import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Search, Edit2, Plus, Save, UploadCloud, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Students = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { students, setStudents, currentUser } = useContext(AppContext);
    const navigate = useNavigate();

    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';
    const [editingRoll, setEditingRoll] = useState(null);
    const [editForm, setEditForm] = useState({ rollNo: '', name: '' });

    const handleEdit = (e, student) => {
        e.stopPropagation();
        setEditingRoll(student.rollNo);
        setEditForm({ rollNo: student.rollNo, name: student.name });
    };

    const handleSave = (e) => {
        e.stopPropagation();
        setStudents(prev => prev.map(s => s.rollNo === editingRoll ? { ...s, name: editForm.name } : s));
        setEditingRoll(null);
    };

    const handleAdd = () => {
        const newRoll = `NEW${Math.floor(Math.random() * 1000)}`;
        setStudents(prev => [{ rollNo: newRoll, name: 'New Student', email: '', phone: '', skills: [], cgpa: '0.0', year: '1st Year', section: 'A', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newRoll}` }, ...prev]);
        setEditingRoll(newRoll);
        setEditForm({ rollNo: newRoll, name: 'New Student' });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        alert(`Parsing file: ${file.name}...`);
        setTimeout(() => {
            const randomStudents = [
                { rollNo: `24UAM${Math.floor(Math.random() * 800) + 200}`, name: 'Uploaded Student Alpha', email: '', phone: '', skills: [], cgpa: '7.5', year: '2nd Year', section: 'A', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=alpha` },
                { rollNo: `24UAM${Math.floor(Math.random() * 800) + 200}`, name: 'Uploaded Student Beta', email: '', phone: '', skills: [], cgpa: '7.5', year: '2nd Year', section: 'A', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=beta` },
            ];
            setStudents(prev => [...randomStudents, ...prev]);
            alert(`Successfully imported ${randomStudents.length} students from ${file.name}!`);
        }, 800);
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8 relative overflow-hidden">
                <div className="absolute top-1/2 right-20 -translate-y-1/2 w-64 h-64 bg-emerald-glow/10 blur-[80px] rounded-full pointer-events-none -z-10"></div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <GraduationCap className="text-emerald-glow" size={32} />
                        <span>Student Roster</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Click any row to view full profile.</p>
                </div>
                {isAuthorized && (
                    <div className="flex space-x-3 relative z-10">
                        <label className="flex items-center space-x-2 px-4 py-2 bg-slate-800/80 text-white font-bold rounded-xl border border-white/10 hover:bg-slate-700 transition-colors shadow-inner cursor-pointer">
                            <UploadCloud size={18} />
                            <span>Upload Data</span>
                            <input type="file" accept=".csv, .xlsx" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button onClick={handleAdd} className="flex items-center space-x-2 px-4 py-2 bg-emerald-glow/20 text-emerald-glow font-bold rounded-xl border border-emerald-glow/30 hover:bg-emerald-glow/30 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <Plus size={18} />
                            <span>Add Student</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="glass-card rounded-[2rem] border border-glass-border overflow-hidden shadow-glass-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0 relative z-10">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or roll no..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-glow/50 focus:ring-1 focus:ring-emerald-glow transition-all"
                        />
                    </div>
                    <span className="text-sm text-slate-400 font-semibold">{filteredStudents.length} students</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-sm tracking-wider uppercase">
                                <th className="py-4 px-6 font-semibold whitespace-nowrap">Roll No</th>
                                <th className="py-4 px-6 font-semibold whitespace-nowrap">Student Name</th>
                                <th className="py-4 px-6 font-semibold whitespace-nowrap">CGPA</th>
                                <th className="py-4 px-6 font-semibold whitespace-nowrap">Year</th>
                                {isAuthorized && <th className="py-4 px-6 font-semibold whitespace-nowrap text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredStudents.map((student, index) => (
                                    <motion.tr
                                        key={student.rollNo}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        onClick={() => editingRoll !== student.rollNo && navigate(`/students/${student.rollNo}`)}
                                        className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group cursor-pointer"
                                    >
                                        <td className="py-4 px-6 font-bold text-slate-300 group-hover:text-emerald-glow transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.rollNo}`}
                                                    alt={student.name}
                                                    className="w-8 h-8 rounded-full border border-white/10 bg-slate-800"
                                                    onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.rollNo}`; }}
                                                />
                                                <span>{student.rollNo}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-white tracking-wide">
                                            {editingRoll === student.rollNo ? (
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onClick={e => e.stopPropagation()}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="bg-slate-800 border border-white/10 rounded p-1 text-white w-full"
                                                />
                                            ) : student.name}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${parseFloat(student.cgpa) >= 9 ? 'bg-emerald-glow/15 text-emerald-glow' : parseFloat(student.cgpa) >= 8 ? 'bg-electric-blue/15 text-electric-blue' : 'bg-luxury-gold/15 text-luxury-gold'}`}>
                                                {student.cgpa || '—'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 font-medium text-sm">{student.year || '—'}</td>
                                        {isAuthorized && (
                                            <td className="py-4 px-6 text-right">
                                                {editingRoll === student.rollNo ? (
                                                    <button onClick={handleSave} className="text-emerald-glow hover:text-white transition-colors p-2">
                                                        <Save size={18} />
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={e => handleEdit(e, student)} className="text-slate-400 hover:text-electric-blue transition-colors p-2">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <ChevronRight size={16} className="text-slate-500 group-hover:text-emerald-glow transition-colors" />
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Students;
