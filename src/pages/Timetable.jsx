import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Edit3, Save, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [
    { label: 'I', time: '08:00 - 08:50' },
    { label: 'II', time: '08:50 - 09:20' },
    { label: 'III', time: '09:30 - 10:10' },
    { label: 'IV', time: '10:10 - 11:00' },
    { label: 'V', time: '11:20 - 12:00' },
    { label: 'VI', time: '12:00 - 12:45' },
    { label: 'VII', time: '01:45 - 02:30' },
    { label: 'VIII', time: '02:45 - 03:15' },
];

const defaultTimetable = {
    Monday: [
        '24UMA463\n[OR]',
        '24UCS414\n[OS LAB]',
        '24UCB513\n[OOSE LAB]',
        '24UAM411\n[AI]',
        '24UMA463\n[OR]',
        '24UMA463\n[OR]',
        '24UCB513\n[OOSE]',
        '24UCS414\n[OS]'
    ],
    Tuesday: [
        '24UCS414\n[OS]',
        '24UCB513\n[OOSE]',
        '24UAM411\n[AI LAB]',
        '24UCB513\n[OOSE LAB]',
        '24UCS511\n[CN]',
        'APTITUDE',
        '24UAM411\n[AI]',
        '24UCS511\n[CN LAB]'
    ],
    Wednesday: [
        '24UCPE12/\n24UCPE11\n[RM/ED]',
        '24UCS511\n[CN]',
        'LL',
        'LL',
        '24UCS414\n[OS]',
        '24UCS511\n[CN]',
        'CSD',
        'CSD'
    ],
    Thursday: [
        '24UAM411\n[AI]',
        '24UCPE12/\n24UCPE11\n[RM/ED]',
        '24UAM411\n[AI LAB]',
        '24UMA463\n[OR]',
        '24UCB513\n[OOSE]',
        '24UMA463\n[OR]',
        '24UCS414\n[OS LAB]',
        '24UAM411\n[AI]'
    ],
    Friday: [
        '24UMA463\n[OR]',
        '24UCS511\n[CN]',
        '24UCS414\n[OS]',
        '24UCB513\n[OOSE]',
        'Placement\nTraining/\n[AR]',
        'Placement\nTraining/\n[AR]',
        'Placement\nTraining/\n[AR]',
        'Placement\nTraining/\n[AM]'
    ],
    Saturday: [
        '24UCPE12/\n24UCPE11\n[RM/ED]',
        'LIB/MEN',
        '24UMA463\n[OR]',
        '24UAM411\n[AI LAB]',
        '24UCS511\n[CN LAB]/NCC',
        '24UCS414\n[OS LAB]/NCC',
        '24UCPE12/\n24UCPE11\n[RM/ED]/NCC',
        '24UCB513\n[OOSE LAB]/NCC'
    ]
};

const getCellColor = (content) => {
    if (!content) return '';
    const c = content.toUpperCase();
    if (c.includes('UMA463') || c.includes('[OR]')) return 'bg-blue-500/15 border-blue-500/30 text-blue-300';
    if (c.includes('UCS414') || c.includes('[OS')) return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
    if (c.includes('UCB513') || c.includes('OOSE')) return 'bg-purple-500/15 border-purple-500/30 text-purple-300';
    if (c.includes('UAM411') || c.includes('[AI')) return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
    if (c.includes('UCS511') || c.includes('[CN')) return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
    if (c.includes('UCPE')) return 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300';
    if (c.includes('PLACEMENT') || c.includes('CSD') || c.includes('APTITUDE') || c.includes('LIB') || c.includes('LL')) return 'bg-slate-500/15 border-slate-500/30 text-slate-300';
    return 'bg-white/5 border-white/10 text-slate-300';
};

const Timetable = () => {
    const { currentUser, timetable, setTimetable } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    const data = timetable || defaultTimetable;

    const startEditing = () => {
        setEditData(JSON.parse(JSON.stringify(data)));
        setIsEditing(true);
    };

    const handleCellChange = (day, periodIndex, value) => {
        setEditData(prev => ({
            ...prev,
            [day]: prev[day].map((cell, i) => i === periodIndex ? value : cell)
        }));
    };

    const handleSave = () => {
        setTimetable(editData);
        setIsEditing(false);
        setEditData(null);
        alert('Timetable saved successfully!');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(null);
    };

    const displayData = isEditing ? editData : data;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <CalendarDays className="text-electric-blue" size={32} />
                        <span>Class Timetable</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">
                        B.E. CSE (AI&ML) — Year/Sem: II/IV — Academic Year: 2025-26 (Even) — Room: N514
                    </p>
                </div>
                {isAuthorized && (
                    <div className="flex space-x-3">
                        {isEditing ? (
                            <>
                                <button onClick={handleCancel} className="px-5 py-3 bg-slate-800 border border-white/10 rounded-xl text-slate-300 font-bold hover:bg-white/5 flex items-center space-x-2">
                                    <X size={18} /><span>Cancel</span>
                                </button>
                                <button onClick={handleSave} className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center space-x-2">
                                    <Save size={18} /><span>Save Timetable</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={startEditing} className="px-5 py-3 bg-gradient-to-r from-electric-blue to-royal-purple rounded-xl text-white font-bold hover:shadow-glow-blue flex items-center space-x-2">
                                <Edit3 size={18} /><span>Edit Timetable</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-950/60">
                                <th className="p-4 text-left text-slate-400 font-bold text-sm uppercase tracking-wider border-b border-r border-white/10 w-28 sticky left-0 bg-slate-950/90 z-10">Day</th>
                                {periods.map((p, i) => (
                                    <th key={i} className="p-3 text-center border-b border-r border-white/10 min-w-[110px]">
                                        <div className="text-electric-blue font-black text-sm">{p.label}</div>
                                        <div className="text-[10px] text-slate-500 font-medium mt-1">{p.time}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day, dayIdx) => (
                                <tr key={day} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 font-bold text-white border-b border-r border-white/10 sticky left-0 bg-slate-900/90 z-10">
                                        <span className={`${dayIdx === 5 ? 'text-luxury-gold' : ''}`}>{day}</span>
                                    </td>
                                    {displayData[day].map((cell, periodIdx) => {
                                        // Insert visual break indicators
                                        const cellColor = getCellColor(cell);
                                        return (
                                            <td key={periodIdx} className={`p-2 border-b border-r border-white/10 text-center align-middle ${periodIdx === 1 ? 'border-r-2 border-r-amber-500/30' : ''} ${periodIdx === 3 ? 'border-r-2 border-r-rose-500/30' : ''} ${periodIdx === 5 ? 'border-r-2 border-r-emerald-500/30' : ''}`}>
                                                {isEditing ? (
                                                    <textarea
                                                        value={cell}
                                                        onChange={(e) => handleCellChange(day, periodIdx, e.target.value)}
                                                        rows={3}
                                                        className="w-full bg-slate-800 border border-electric-blue/30 rounded-lg p-2 text-white text-xs font-medium text-center focus:outline-none focus:border-electric-blue resize-none"
                                                    />
                                                ) : (
                                                    cell ? (
                                                        <div className={`rounded-lg border px-2 py-2 text-xs font-bold whitespace-pre-line leading-relaxed ${cellColor}`}>
                                                            {cell}
                                                        </div>
                                                    ) : (
                                                        <div className="text-slate-600 text-xs">—</div>
                                                    )
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Break Legend */}
            <div className="flex flex-wrap gap-4 justify-center text-xs font-bold text-slate-400">
                <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">☕ Break: 09:20 - 09:30</span>
                <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">🚶 Movement Break: 11:00 - 11:20</span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">🍽 Lunch Break: 12:45 - 01:45</span>
            </div>

            {/* Subject Legend */}
            <div className="glass-card rounded-2xl border border-glass-border p-6">
                <h3 className="text-base font-bold text-white mb-4">Subject Color Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { code: '24UMA463', name: 'Operations Research', color: 'bg-blue-500/15 border-blue-500/30 text-blue-300' },
                        { code: '24UCS414', name: 'Operating Systems', color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' },
                        { code: '24UCB513', name: 'OOSE', color: 'bg-purple-500/15 border-purple-500/30 text-purple-300' },
                        { code: '24UAM411', name: 'Artificial Intelligence', color: 'bg-amber-500/15 border-amber-500/30 text-amber-300' },
                        { code: '24UCS511', name: 'Computer Networks', color: 'bg-rose-500/15 border-rose-500/30 text-rose-300' },
                        { code: 'UCPE', name: 'RM / ED Elective', color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' },
                    ].map((s, i) => (
                        <div key={i} className={`rounded-lg border px-3 py-2 text-xs font-bold ${s.color}`}>
                            <div>{s.code}</div>
                            <div className="text-[10px] opacity-70 mt-0.5">{s.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timetable;
