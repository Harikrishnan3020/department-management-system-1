import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarRange, Edit3, Save, X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const months = ['December', 'January', 'February', 'March', 'April', 'May', 'June'];
const monthYears = { December: 2025, January: 2026, February: 2026, March: 2026, April: 2026, May: 2026, June: 2026 };

const eventTypes = {
    holiday: { label: 'Holiday', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    exam: { label: 'Exam / CIA', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    event: { label: 'Event', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    academic: { label: 'Academic', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    meeting: { label: 'Meeting', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    practical: { label: 'Practical', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
};

const defaultCalendarData = [
    // DECEMBER 2025
    { date: '2025-12-02', event: 'Domain Mentor Meeting 1', type: 'meeting' },
    { date: '2025-12-03', event: 'Course Coordinator Meet 1', type: 'meeting' },
    { date: '2025-12-04', event: 'Workshop', type: 'event' },
    { date: '2025-12-06', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2025-12-11', event: 'Department Review Meeting 1', type: 'meeting' },
    { date: '2025-12-13', event: 'Community Outreach Activity 1', type: 'event' },
    { date: '2025-12-17', event: 'Commencement of Regular Classes (Sem 4, 6 & 8)', type: 'academic' },
    { date: '2025-12-18', event: 'Course Coordinator Meet 2 | Certification Program Start 1', type: 'meeting' },
    { date: '2025-12-19', event: 'Self Driven Activity | IIC 1 | Skilling Program 1', type: 'event' },
    { date: '2025-12-20', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2025-12-22', event: 'National Mathematics Day', type: 'event' },
    { date: '2025-12-23', event: 'Christmas Celebration', type: 'event' },
    { date: '2025-12-24', event: 'Holiday - Christmas', type: 'holiday' },
    { date: '2025-12-25', event: 'Holiday - Christmas', type: 'holiday' },
    { date: '2025-12-26', event: 'Class Committee Meeting 1', type: 'meeting' },
    { date: '2025-12-27', event: 'Project Expo', type: 'event' },
    { date: '2025-12-29', event: 'Guest Lecture 1', type: 'academic' },
    { date: '2025-12-31', event: 'Professional Society Activity 1', type: 'event' },
    // JANUARY 2026
    { date: '2026-01-01', event: 'Holiday - New Year 2026', type: 'holiday' },
    { date: '2026-01-03', event: 'Guest Lecture 2', type: 'academic' },
    { date: '2026-01-05', event: 'VAC', type: 'academic' },
    { date: '2026-01-06', event: 'VAC', type: 'academic' },
    { date: '2026-01-07', event: 'VAC', type: 'academic' },
    { date: '2026-01-08', event: 'VAC', type: 'academic' },
    { date: '2026-01-10', event: 'VAC', type: 'academic' },
    { date: '2026-01-14', event: 'Holidays - Pongal', type: 'holiday' },
    { date: '2026-01-15', event: 'Pongal Celebrations', type: 'holiday' },
    { date: '2026-01-19', event: 'Career Development Programme 1', type: 'event' },
    { date: '2026-01-20', event: 'Professional Society Activity 2', type: 'event' },
    { date: '2026-01-22', event: 'Counselling / Motivational Program for Students', type: 'event' },
    { date: '2026-01-23', event: 'AI Hackathon (Healthcare)', type: 'event' },
    { date: '2026-01-26', event: 'Holiday - Republic Day', type: 'holiday' },
    { date: '2026-01-30', event: 'Student Feedback on Faculty 1 | National Level Technical Symposium', type: 'event' },
    { date: '2026-01-31', event: 'Course Coordinator Meeting 3 | National Level Workshop', type: 'meeting' },
    // FEBRUARY 2026
    { date: '2026-02-01', event: 'Thai Poosam - Holiday', type: 'holiday' },
    { date: '2026-02-02', event: 'Class Committee Meeting 2 | Certification Program 1 End', type: 'meeting' },
    { date: '2026-02-03', event: 'Skilling Programme 2', type: 'academic' },
    { date: '2026-02-04', event: 'Workshop 2', type: 'event' },
    { date: '2026-02-06', event: 'Professional Society Activity 3', type: 'event' },
    { date: '2026-02-07', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2026-02-09', event: 'CIA - 1 (IA Exam)', type: 'exam' },
    { date: '2026-02-10', event: 'CIA - 1 (IA Exam)', type: 'exam' },
    { date: '2026-02-11', event: 'CIA - 1 (IA Exam)', type: 'exam' },
    { date: '2026-02-12', event: 'CIA - 1 (IA Exam)', type: 'exam' },
    { date: '2026-02-14', event: 'Certification Program 2 Start', type: 'academic' },
    { date: '2026-02-18', event: 'IQAC Internal Audit 1', type: 'meeting' },
    { date: '2026-02-19', event: 'Career Development Program 2', type: 'event' },
    { date: '2026-02-20', event: 'Cultural Fest', type: 'event' },
    { date: '2026-02-21', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2026-02-23', event: 'Result Analysis Meeting (IA1)', type: 'meeting' },
    { date: '2026-02-25', event: 'Seminar 1', type: 'academic' },
    { date: '2026-02-27', event: 'National Science Day | Community Outreach Activity 2', type: 'event' },
    { date: '2026-02-28', event: 'Holiday - Saturday', type: 'holiday' },
    // MARCH 2026
    { date: '2026-03-02', event: 'Class Committee Meeting 3 | Seminar 2', type: 'meeting' },
    { date: '2026-03-05', event: 'Sports Day', type: 'event' },
    { date: '2026-03-06', event: 'Annual Day', type: 'event' },
    { date: '2026-03-07', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2026-03-09', event: "International Women's Day", type: 'event' },
    { date: '2026-03-11', event: 'Two Days Intl. Conference FutureFusion 2026 - AI-Driven Sustainable Digital Ecosystems', type: 'event' },
    { date: '2026-03-12', event: 'Two Days Intl. Conference FutureFusion 2026 (Day 2)', type: 'event' },
    { date: '2026-03-14', event: 'Hackathon (Blockchain)', type: 'event' },
    { date: '2026-03-19', event: 'Holiday - Ugadi / Telugu New Year', type: 'holiday' },
    { date: '2026-03-20', event: 'Holiday - Declared Holiday', type: 'holiday' },
    { date: '2026-03-21', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2026-03-23', event: 'Professional Society Activity 4', type: 'event' },
    { date: '2026-03-25', event: 'Student Feedback on Faculty 2', type: 'meeting' },
    { date: '2026-03-27', event: 'Certification Program 2 End', type: 'academic' },
    { date: '2026-03-28', event: 'Course Coordinator Meet 4', type: 'meeting' },
    { date: '2026-03-30', event: 'CIA - 2 (IA Exam)', type: 'exam' },
    { date: '2026-03-31', event: 'CIA - 2 (IA Exam)', type: 'exam' },
    // APRIL 2026
    { date: '2026-04-01', event: 'CIA - 2 (IA Exam)', type: 'exam' },
    { date: '2026-04-02', event: 'CIA - 2 (IA Exam)', type: 'exam' },
    { date: '2026-04-03', event: 'Holiday - Good Friday', type: 'holiday' },
    { date: '2026-04-04', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2026-04-06', event: 'CIA - 3 | Model Practical', type: 'practical' },
    { date: '2026-04-07', event: 'CIA - 3 | Model Practical | World Health Day', type: 'practical' },
    { date: '2026-04-08', event: 'CIA - 3 | Model Practical', type: 'practical' },
    { date: '2026-04-09', event: 'CIA - 3 | Model Practical', type: 'practical' },
    { date: '2026-04-10', event: 'CIA - 3 | Model Practical', type: 'practical' },
    { date: '2026-04-11', event: 'CIA - 3 | Model Practical', type: 'practical' },
    { date: '2026-04-13', event: 'IQAC Internal Audit 2 | Result Analysis Meeting (IA2)', type: 'meeting' },
    { date: '2026-04-14', event: 'Holiday - Tamil New Year | Ambedkar Jayanti', type: 'holiday' },
    { date: '2026-04-15', event: 'Student Exit Survey (Final Year) | Course End Survey', type: 'academic' },
    { date: '2026-04-16', event: 'Last Working Day for Higher Semester', type: 'academic' },
    { date: '2026-04-18', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2026-04-20', event: 'Commencement of End Semester Exam (Practical)', type: 'exam' },
    { date: '2026-04-25', event: 'Commencement of End Semester Exam (Theory)', type: 'exam' },
    // MAY 2026
    { date: '2026-05-01', event: 'Holiday - May Day', type: 'holiday' },
    { date: '2026-05-05', event: 'World Environment Day', type: 'event' },
    { date: '2026-05-16', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2026-05-20', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2026-05-22', event: 'Holiday - Maharram Festival', type: 'holiday' },
    { date: '2026-05-28', event: 'Holiday - Bakrid', type: 'holiday' },
    // JUNE 2026
    { date: '2026-06-05', event: 'World Environment Day', type: 'event' },
    { date: '2026-06-06', event: 'Holiday - Saturday', type: 'holiday' },
    { date: '2026-07-01', event: 'Commencement of Classes for Next Semester', type: 'academic' },
];

const AcademicCalendar = () => {
    const { currentUser, academicCalendar, setAcademicCalendar } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const calendarData = academicCalendar || defaultCalendarData;

    const [activeMonth, setActiveMonth] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [newEvent, setNewEvent] = useState({ date: '', event: '', type: 'academic' });
    const [showAddForm, setShowAddForm] = useState(false);

    const currentMonth = months[activeMonth];
    const currentYear = monthYears[currentMonth];

    const getMonthEvents = () => {
        const monthNum = { December: '12', January: '01', February: '02', March: '03', April: '04', May: '05', June: '06' }[currentMonth];
        const yearStr = String(currentYear);
        const data = isEditing ? editData : calendarData;
        return data.filter(e => e.date.startsWith(`${yearStr}-${monthNum}`)).sort((a, b) => a.date.localeCompare(b.date));
    };

    const startEditing = () => {
        setEditData(JSON.parse(JSON.stringify(calendarData)));
        setIsEditing(true);
    };

    const handleSave = () => {
        setAcademicCalendar(editData);
        setIsEditing(false);
        setEditData(null);
        alert('Academic Calendar saved successfully!');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(null);
        setShowAddForm(false);
    };

    const handleDeleteEvent = (date, eventName) => {
        setEditData(prev => prev.filter(e => !(e.date === date && e.event === eventName)));
    };

    const handleEditEvent = (idx, field, value) => {
        const monthNum = { December: '12', January: '01', February: '02', March: '03', April: '04', May: '05', June: '06' }[currentMonth];
        const yearStr = String(currentYear);
        const monthEvents = editData.filter(e => e.date.startsWith(`${yearStr}-${monthNum}`)).sort((a, b) => a.date.localeCompare(b.date));
        const target = monthEvents[idx];
        setEditData(prev => prev.map(e => (e.date === target.date && e.event === target.event) ? { ...e, [field]: value } : e));
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        if (!newEvent.date || !newEvent.event) return;
        setEditData(prev => [...prev, { ...newEvent }]);
        setNewEvent({ date: '', event: '', type: 'academic' });
        setShowAddForm(false);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
    };

    const monthEvents = getMonthEvents();

    // Key dates summary
    const keyDates = [
        { label: 'Commencement of Classes', value: 'Dec 17, 2025' },
        { label: 'IA 1 Exam', value: 'Feb 09 - 12, 2026' },
        { label: 'IA 2 Exam', value: 'Mar 30 - Apr 02, 2026' },
        { label: 'Model Practical', value: 'Apr 06 - 11, 2026' },
        { label: 'Last Working Day', value: 'Apr 16, 2026' },
        { label: 'End Sem Practical', value: 'Apr 20, 2026' },
        { label: 'End Sem Theory', value: 'Apr 27, 2026' },
        { label: 'Next Sem Start', value: 'Jul 01, 2026' },
    ];

    const workingDays = { December: 10, January: 19, February: 22, March: 22, April: 11, May: 0, June: 0 };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <CalendarRange className="text-luxury-gold" size={32} />
                        <span>Academic Calendar</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">
                        B.E. CSE (AI&ML) — Academic Year 2025-26 (Even Semester) — 84 Working Days
                    </p>
                </div>
                {isAuthorized && (
                    <div className="flex space-x-3">
                        {isEditing ? (
                            <>
                                <button onClick={() => setShowAddForm(true)} className="px-4 py-3 bg-luxury-gold/20 border border-luxury-gold/30 rounded-xl text-luxury-gold font-bold hover:bg-luxury-gold/30 flex items-center space-x-2">
                                    <Plus size={18} /><span>Add Event</span>
                                </button>
                                <button onClick={handleCancel} className="px-5 py-3 bg-slate-800 border border-white/10 rounded-xl text-slate-300 font-bold hover:bg-white/5 flex items-center space-x-2">
                                    <X size={18} /><span>Cancel</span>
                                </button>
                                <button onClick={handleSave} className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center space-x-2">
                                    <Save size={18} /><span>Save</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={startEditing} className="px-5 py-3 bg-gradient-to-r from-luxury-gold to-yellow-600 rounded-xl text-slate-900 font-bold hover:shadow-glow-gold flex items-center space-x-2">
                                <Edit3 size={18} /><span>Edit Calendar</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Key Dates Summary Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {keyDates.map((kd, i) => (
                    <div key={i} className="glass-card p-3 rounded-xl border border-glass-border text-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{kd.label}</p>
                        <p className="text-sm text-white font-black mt-1">{kd.value}</p>
                    </div>
                ))}
            </div>

            {/* Month Selector */}
            <div className="flex items-center justify-between glass-card rounded-2xl border border-glass-border p-4">
                <button onClick={() => setActiveMonth(Math.max(0, activeMonth - 1))} disabled={activeMonth === 0} className="p-2 rounded-lg bg-slate-800 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex space-x-2 flex-wrap justify-center">
                    {months.map((m, i) => (
                        <button key={m} onClick={() => setActiveMonth(i)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeMonth === i ? 'bg-luxury-gold text-slate-900 shadow-glow-gold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                            {m.slice(0, 3)}
                        </button>
                    ))}
                </div>
                <button onClick={() => setActiveMonth(Math.min(months.length - 1, activeMonth + 1))} disabled={activeMonth === months.length - 1} className="p-2 rounded-lg bg-slate-800 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Add Event Form */}
            <AnimatePresence>
                {showAddForm && isEditing && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <form onSubmit={handleAddEvent} className="glass-card p-6 rounded-2xl border border-glass-border space-y-4 max-w-2xl mx-auto">
                            <h3 className="text-lg font-bold text-white">Add New Calendar Event</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-slate-400 text-xs font-bold block mb-1">Date</label>
                                    <input type="date" required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full bg-slate-800 p-3 rounded-lg text-white border border-white/10" />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-xs font-bold block mb-1">Event Name</label>
                                    <input type="text" required placeholder="e.g. Sports Day" value={newEvent.event} onChange={e => setNewEvent({ ...newEvent, event: e.target.value })} className="w-full bg-slate-800 p-3 rounded-lg text-white border border-white/10" />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-xs font-bold block mb-1">Type</label>
                                    <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} className="w-full bg-slate-800 p-3 rounded-lg text-white border border-white/10">
                                        {Object.entries(eventTypes).map(([key, val]) => (<option key={key} value={key}>{val.label}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-300 border border-white/10 rounded-lg font-bold hover:bg-white/5">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-luxury-gold text-slate-900 rounded-lg font-bold">Add Event</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Calendar Events Table */}
            <motion.div
                key={activeMonth}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card overflow-hidden"
            >
                <div className="bg-slate-950/50 p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white">{currentMonth} {currentYear}</h2>
                        <p className="text-slate-400 text-sm font-medium mt-1">
                            {workingDays[currentMonth]} Working Days &bull; {monthEvents.length} Events Scheduled
                        </p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-xs tracking-wider uppercase bg-slate-900/40">
                                <th className="py-3 px-6 font-semibold text-left w-28">Date</th>
                                <th className="py-3 px-6 font-semibold text-left">Event</th>
                                <th className="py-3 px-6 font-semibold text-left w-32">Type</th>
                                {isEditing && <th className="py-3 px-6 font-semibold text-right w-20">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {monthEvents.length === 0 ? (
                                <tr><td colSpan={isEditing ? 4 : 3} className="text-center py-12 text-slate-500">No events scheduled for {currentMonth}.</td></tr>
                            ) : (
                                monthEvents.map((ev, idx) => {
                                    const typeInfo = eventTypes[ev.type] || eventTypes.academic;
                                    return (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                            <td className="py-4 px-6">
                                                {isEditing ? (
                                                    <input type="date" value={ev.date} onChange={(e) => handleEditEvent(idx, 'date', e.target.value)} className="bg-slate-800 p-2 rounded text-white text-xs border border-white/20 w-full" />
                                                ) : (
                                                    <span className="font-bold text-white text-sm">{formatDate(ev.date)}</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                {isEditing ? (
                                                    <input type="text" value={ev.event} onChange={(e) => handleEditEvent(idx, 'event', e.target.value)} className="bg-slate-800 p-2 rounded text-white text-sm border border-white/20 w-full" />
                                                ) : (
                                                    <span className="font-semibold text-slate-200 text-sm">{ev.event}</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                {isEditing ? (
                                                    <select value={ev.type} onChange={(e) => handleEditEvent(idx, 'type', e.target.value)} className="bg-slate-800 p-2 rounded text-white text-xs border border-white/20">
                                                        {Object.entries(eventTypes).map(([key, val]) => (<option key={key} value={key}>{val.label}</option>))}
                                                    </select>
                                                ) : (
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${typeInfo.color}`}>
                                                        {typeInfo.label}
                                                    </span>
                                                )}
                                            </td>
                                            {isEditing && (
                                                <td className="py-4 px-6 text-right">
                                                    <button onClick={() => handleDeleteEvent(ev.date, ev.event)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Event Type Legend */}
            <div className="flex flex-wrap gap-3 justify-center">
                {Object.entries(eventTypes).map(([key, val]) => (
                    <span key={key} className={`px-4 py-2 rounded-xl text-xs font-bold border ${val.color}`}>
                        {val.label}
                    </span>
                ))}
            </div>

            {/* Working Days Summary */}
            <div className="glass-card rounded-2xl border border-glass-border p-6">
                <h3 className="text-base font-bold text-white mb-4">Working Days Summary</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {Object.entries(workingDays).map(([month, days]) => (
                        <div key={month} className="text-center">
                            <div className={`text-2xl font-black ${days > 0 ? 'text-white' : 'text-slate-600'}`}>{days}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">{month.slice(0, 3)}</div>
                        </div>
                    ))}
                    <div className="text-center">
                        <div className="text-2xl font-black text-luxury-gold">84</div>
                        <div className="text-[10px] text-luxury-gold font-bold uppercase mt-1">Total</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendar;
