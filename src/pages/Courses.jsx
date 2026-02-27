import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Code, Database, BrainCircuit, ShieldAlert, Cpu, Network, Plus, Edit3, X, Save, UploadCloud, Trash2, Send, FileText } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const getIcon = (code) => {
    if (code.includes('AI') || code.includes('ML')) return BrainCircuit;
    if (code.includes('DB')) return Database;
    if (code.includes('NET')) return Network;
    if (code.includes('SEC')) return ShieldAlert;
    if (code.includes('HW') || code.includes('EC')) return Cpu;
    return Code;
};

const getColor = (index) => {
    const colors = ['electric-blue', 'royal-purple', 'emerald-glow', 'luxury-gold', 'rose-500'];
    return colors[index % colors.length];
};

const Courses = () => {
    const { courses, setCourses, faculty, currentUser, setNotifications } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    const [qbTitle, setQbTitle] = useState('');
    const [qbFile, setQbFile] = useState(null);
    const [showQbForm, setShowQbForm] = useState(false);

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setIsEditing(false);
    };

    const handleEditClick = (e, course) => {
        e.stopPropagation();
        setSelectedCourse(course);
        setEditForm(course);
        setIsEditing(true);
    };

    const handleDelete = (e, indexId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this course?')) {
            setCourses(courses.filter(c => c.id !== indexId));
            if (selectedCourse && selectedCourse.id === indexId) {
                setSelectedCourse(null);
                setIsEditing(false);
            }
        }
    };

    const handleAddNew = () => {
        const newCourse = {
            id: Date.now(),
            code: 'NEW101',
            name: 'New Course Name',
            credits: 3,
            type: 'Core',
            faculty: faculty[0]?.name || 'TBD',
            desc: 'Course description here...',
            outcome: 'Expected outcome...',
        };
        setSelectedCourse(newCourse);
        setEditForm(newCourse);
        setIsEditing(true);
    };

    const handleSave = () => {
        if (selectedCourse.id === editForm.id && !courses.find(c => c.id === editForm.id)) {
            // New Course
            setCourses([...courses, editForm]);
        } else {
            // Update
            setCourses(courses.map(c => c.id === editForm.id ? editForm : c));
        }
        setSelectedCourse(editForm);
        setIsEditing(false);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Simulating parsing a CSV/Excel file
        alert(`Parsing course data from: ${file.name}...`);
        setTimeout(() => {
            const randomCourses = [
                { id: Date.now() + 1, code: `UPC${Math.floor(Math.random() * 90) + 10}`, name: 'Uploaded Advanced Topics', credits: 4, type: 'Elective', faculty: faculty[0]?.name || 'TBD', desc: 'Auto-imported course description.', outcome: 'Auto-imported outcomes.' },
                { id: Date.now() + 2, code: `UPC${Math.floor(Math.random() * 90) + 50}`, name: 'Uploaded Seminar', credits: 2, type: 'Core', faculty: faculty[0]?.name || 'TBD', desc: 'Auto-imported course description.', outcome: 'Auto-imported outcomes.' },
            ];
            setCourses(prev => [...randomCourses, ...prev]);
            alert(`Successfully imported ${randomCourses.length} courses from ${file.name}!`);
        }, 800);
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
    const cardVariants = { hidden: { opacity: 0, scale: 0.8, rotateX: 20 }, show: { opacity: 1, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 200, damping: 20 } } };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <BookOpen className="text-luxury-gold" size={32} />
                        <span>Academic Curriculum</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Manage syllabi, credit structures, and course assignments.</p>
                </div>
                {isAuthorized && (
                    <div className="flex space-x-3 relative z-10">
                        <label className="flex items-center space-x-2 px-4 py-3 bg-slate-800/80 text-white font-bold rounded-xl border border-white/10 hover:bg-slate-700 transition-colors shadow-inner cursor-pointer h-[52px]">
                            <UploadCloud size={18} />
                            <span>Upload Data</span>
                            <input type="file" accept=".csv, .xlsx" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button onClick={handleAddNew} className="bg-gradient-to-r from-luxury-gold to-yellow-600 text-slate-900 px-6 py-3 rounded-xl font-bold font-sans shadow-glow-gold transition-all hover:scale-105 active:scale-95 flex items-center space-x-2 h-[52px]">
                            <Plus size={20} />
                            <span>New Course</span>
                        </button>
                    </div>
                )}
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, idx) => {
                    const Icon = getIcon(course.code);
                    const color = getColor(idx);
                    return (
                        <motion.div
                            key={course.id} variants={cardVariants}
                            whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5, z: 50 }}
                            onClick={() => handleCourseClick(course)}
                            className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-8 relative group cursor-pointer perspective-1000 transform-style-3d overflow-hidden flex flex-col justify-between h-full min-h-[300px]"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[sweep_1.5s_ease-in-out_infinite] z-0"></div>
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity duration-300 from-${color}/20 via-${color} to-${color}/20`}></div>

                            <div className="flex justify-between items-start mb-6 relative z-10" style={{ transform: 'translateZ(30px)' }}>
                                <div className={`w-14 h-14 rounded-2xl bg-${color}/10 flex items-center justify-center border border-${color}/20 text-${color} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                    <Icon size={28} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-lg text-white tracking-widest bg-slate-800/80 px-3 py-1 rounded-xl border border-white/10 shadow-inner">
                                        {course.code}
                                    </span>
                                    {isAuthorized && (
                                        <div className="flex space-x-1 pl-2">
                                            <button onClick={(e) => handleEditClick(e, course)} className="p-2 bg-slate-800 text-slate-400 hover:text-luxury-gold rounded-lg shadow-sm z-20 hover:scale-110 transition-transform">
                                                <Edit3 size={18} />
                                            </button>
                                            {currentUser?.role === 'Admin' && (
                                                <button onClick={(e) => handleDelete(e, course.id)} className="p-2 bg-slate-800 text-slate-400 hover:text-rose-500 rounded-lg shadow-sm z-20 hover:scale-110 transition-transform">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-glow transition-all relative z-10" style={{ transform: 'translateZ(20px)' }}>
                                {course.name}
                            </h3>

                            <p className="text-sm font-semibold text-slate-400 mb-6 relative z-10 line-clamp-2">Instr: {course.faculty}</p>

                            <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/10 relative z-10" style={{ transform: 'translateZ(10px)' }}>
                                <div className="flex items-center space-x-2 text-sm font-bold text-slate-300">
                                    <Clock size={16} className={`text-${color}`} />
                                    <span>{course.credits} Credits</span>
                                </div>
                                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10">
                                    {course.type || 'Core'}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Course Modal */}
            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-2xl w-full shadow-glass-card relative max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                                <X size={24} />
                            </button>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black text-white mb-6">Edit Course</h2>
                                    <div>
                                        <label className="text-slate-400 text-sm font-bold">Course Code</label>
                                        <input type="text" className="w-full bg-slate-800 border border-white/10 p-2 rounded text-white" value={editForm.code} onChange={e => setEditForm({ ...editForm, code: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm font-bold">Course Name</label>
                                        <input type="text" className="w-full bg-slate-800 border border-white/10 p-2 rounded text-white" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="flex-1">
                                            <label className="text-slate-400 text-sm font-bold">Credits</label>
                                            <input type="number" className="w-full bg-slate-800 border border-white/10 p-2 rounded text-white" value={editForm.credits} onChange={e => setEditForm({ ...editForm, credits: parseInt(e.target.value) })} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-slate-400 text-sm font-bold">Faculty/Instructor</label>
                                            <select className="w-full bg-slate-800 border border-white/10 p-2 rounded text-white" value={editForm.faculty} onChange={e => setEditForm({ ...editForm, faculty: e.target.value })}>
                                                {faculty.map(f => (<option key={f.id} value={f.name}>{f.name}</option>))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm font-bold">Description</label>
                                        <textarea rows={4} className="w-full bg-slate-800 border border-white/10 p-2 rounded text-white" value={editForm.desc} onChange={e => setEditForm({ ...editForm, desc: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm font-bold">Outcome</label>
                                        <textarea rows={3} className="w-full bg-slate-800 border border-white/10 p-2 rounded text-white" value={editForm.outcome} onChange={e => setEditForm({ ...editForm, outcome: e.target.value })} />
                                    </div>
                                    <div className="pt-4 flex justify-end space-x-2">
                                        <button onClick={() => { setSelectedCourse(null); setIsEditing(false); }} className="px-6 py-2 border border-white/10 rounded-xl text-slate-300 font-bold hover:bg-white/5">Cancel</button>
                                        <button onClick={handleSave} className="px-6 py-2 bg-emerald-glow rounded-xl text-slate-900 font-bold hover:shadow-glow-emerald flex items-center space-x-2">
                                            <Save size={18} /><span>Save Course</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-8">
                                        <span className="font-bold text-sm text-luxury-gold tracking-widest uppercase bg-luxury-gold/10 px-3 py-1 rounded-xl border border-luxury-gold/20 mb-4 inline-block">{selectedCourse.code}</span>
                                        <h2 className="text-3xl font-black text-white">{selectedCourse.name}</h2>
                                        <p className="text-slate-400 mt-2 text-lg font-medium">Instructor: <span className="text-white">{selectedCourse.faculty}</span> &bull; {selectedCourse.credits} Credits</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <h3 className="text-xl font-bold text-white mb-3 flex items-center space-x-2"><BookOpen size={20} className="text-electric-blue" /><span>Course Description</span></h3>
                                            <p className="text-slate-300 leading-relaxed">{selectedCourse.desc || 'No description available for this course.'}</p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <h3 className="text-xl font-bold text-white mb-3 flex items-center space-x-2"><BrainCircuit size={20} className="text-emerald-glow" /><span>Course Outcomes</span></h3>
                                            <p className="text-slate-300 leading-relaxed">{selectedCourse.outcome || 'Course outcomes are not defined yet.'}</p>
                                        </div>
                                    </div>

                                    {isAuthorized && (
                                        <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                                            {!showQbForm ? (
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-bold text-white flex items-center space-x-2"><FileText size={20} className="text-luxury-gold" /><span>Question Banks</span></h3>
                                                    <button onClick={() => setShowQbForm(true)} className="px-5 py-2.5 bg-gradient-to-r from-electric-blue to-emerald-glow rounded-xl text-slate-900 font-bold hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform flex items-center space-x-2">
                                                        <UploadCloud size={18} /><span>Upload New</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-800/80 p-6 rounded-2xl border border-white/10 relative shadow-inner">
                                                    <button onClick={() => setShowQbForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"><X size={18} /></button>
                                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center"><Send size={18} className="mr-2 text-electric-blue" />Publish Question Bank</h3>
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        if (!qbTitle || !qbFile) return;

                                                        setNotifications(prev => [{
                                                            id: Date.now(),
                                                            type: 'Question Bank',
                                                            message: `A new Question Bank '${qbTitle}' has been uploaded for ${selectedCourse.name} by ${currentUser.name}.`
                                                        }, ...prev]);

                                                        alert('Question Bank uploaded & students notified successfully!');
                                                        setQbTitle('');
                                                        setQbFile(null);
                                                        setShowQbForm(false);
                                                    }} className="space-y-4">
                                                        <div>
                                                            <label className="text-slate-400 font-bold text-xs block mb-1">Title</label>
                                                            <input type="text" required placeholder="e.g. Mid-Term Important Questions" value={qbTitle} onChange={e => setQbTitle(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white text-sm focus:border-electric-blue/50 outline-none transition-colors" />
                                                        </div>
                                                        <div>
                                                            <label className="text-slate-400 font-bold text-xs block mb-1">Attachment File (.pdf, .doc)</label>
                                                            <input type="file" required accept=".pdf,.doc,.docx" onChange={e => setQbFile(e.target.files[0])} className="w-full text-sm text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-electric-blue/20 file:text-electric-blue hover:file:bg-electric-blue/30 bg-slate-900/50 rounded-xl border border-white/10 cursor-pointer" />
                                                        </div>
                                                        <div className="pt-2 flex justify-end">
                                                            <button type="submit" className="px-6 py-2.5 bg-electric-blue rounded-xl text-slate-900 font-bold hover:shadow-glow-blue flex items-center space-x-2 transition-shadow">
                                                                <UploadCloud size={18} /><span>Upload & Notify Students</span>
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}

                                            <div className="mt-8 text-right flex justify-end pt-4">
                                                <button onClick={() => { setEditForm(selectedCourse); setIsEditing(true); }} className="px-5 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white font-bold hover:bg-white/10 transition-colors flex items-center space-x-2">
                                                    <Edit3 size={18} /><span>Edit Course Details</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
        </div>
    );
};

export default Courses;
