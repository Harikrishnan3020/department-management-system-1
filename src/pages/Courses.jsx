import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Code, Database, BrainCircuit, ShieldAlert, Cpu, Network, Plus, Edit3, X, Save, UploadCloud, Trash2, Send, FileText, Paperclip, Download, Award, Users } from 'lucide-react';
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
    const {
        courses, setCourses, faculty, currentUser, setNotifications,
        targetCourseId, setTargetCourseId,
        assignments, setAssignments,
        assignmentSubmissions, setAssignmentSubmissions
    } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    const [qbTitle, setQbTitle] = useState('');
    const [qbFile, setQbFile] = useState(null);
    const [showQbForm, setShowQbForm] = useState(false);

    // Assignment Form States
    const [showAsgnForm, setShowAsgnForm] = useState(false);
    const [asgnTitle, setAsgnTitle] = useState('');
    const [asgnDesc, setAsgnDesc] = useState('');
    const [asgnDue, setAsgnDue] = useState('');
    const [asgnMarks, setAsgnMarks] = useState(100);
    const [asgnFiles, setAsgnFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(null);
    const [submissionFiles, setSubmissionFiles] = useState([]);

    useEffect(() => {
        if (targetCourseId) {
            const course = courses.find(c => c.id === targetCourseId || c.code === targetCourseId);
            if (course) {
                setSelectedCourse(course);
                setTargetCourseId(null);
            }
        }
    }, [targetCourseId, courses, setTargetCourseId]);

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
            setCourses([...courses, editForm]);
        } else {
            setCourses(courses.map(c => c.id === editForm.id ? editForm : c));
        }
        setSelectedCourse(editForm);
        setIsEditing(false);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
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

            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-4xl w-full shadow-glass-card relative max-h-[90vh] overflow-y-auto"
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
                                <div className="space-y-8">
                                    <div className="mb-8">
                                        <span className="font-bold text-sm text-luxury-gold tracking-widest uppercase bg-luxury-gold/10 px-3 py-1 rounded-xl border border-luxury-gold/20 mb-4 inline-block">{selectedCourse.code}</span>
                                        <h2 className="text-3xl font-black text-white">{selectedCourse.name}</h2>
                                        <p className="text-slate-400 mt-2 text-lg font-medium">Instructor: <span className="text-white">{selectedCourse.faculty}</span> &bull; {selectedCourse.credits} Credits</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <h3 className="text-xl font-bold text-white mb-3 flex items-center space-x-2"><BookOpen size={20} className="text-electric-blue" /><span>Course Description</span></h3>
                                            <p className="text-slate-300 leading-relaxed text-sm">{selectedCourse.desc || 'No description available for this course.'}</p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <h3 className="text-xl font-bold text-white mb-3 flex items-center space-x-2"><BrainCircuit size={20} className="text-emerald-glow" /><span>Course Outcomes</span></h3>
                                            <p className="text-slate-300 leading-relaxed text-sm">{selectedCourse.outcome || 'Course outcomes are not defined yet.'}</p>
                                        </div>
                                    </div>

                                    {/* Question Banks */}
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        {!showQbForm ? (
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-bold text-white flex items-center space-x-2"><FileText size={20} className="text-luxury-gold" /><span>Question Banks</span></h3>
                                                {isAuthorized && (
                                                    <button onClick={() => setShowQbForm(true)} className="px-5 py-2.5 bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 rounded-xl font-bold hover:bg-luxury-gold/30 transition-all flex items-center space-x-2 text-xs uppercase tracking-widest">
                                                        <UploadCloud size={16} /><span>Upload New</span>
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-slate-800/80 p-6 rounded-2xl border border-luxury-gold/20 relative">
                                                <button onClick={() => setShowQbForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors border-0 cursor-pointer bg-transparent"><X size={18} /></button>
                                                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><Send size={18} className="mr-2 text-electric-blue" />Publish Question Bank</h3>
                                                <form onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (!qbTitle || !qbFile) return;
                                                    setNotifications(prev => [{
                                                        id: Date.now(),
                                                        type: 'Question Bank',
                                                        message: `New Question Bank '${qbTitle}' for ${selectedCourse.name}`,
                                                        courseId: selectedCourse.id
                                                    }, ...prev]);
                                                    alert('Question Bank uploaded & students notified!');
                                                    setQbTitle(''); setQbFile(null); setShowQbForm(false);
                                                }} className="space-y-4">
                                                    <input type="text" required placeholder="Title (e.g. Unit 1 Important Questions)" value={qbTitle} onChange={e => setQbTitle(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-luxury-gold/50" />
                                                    <input type="file" required accept=".pdf,.doc" onChange={e => setQbFile(e.target.files[0])} className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-luxury-gold/20 file:text-luxury-gold bg-slate-950 rounded-xl border border-white/10 p-2" />
                                                    <button type="submit" className="w-full py-3 bg-luxury-gold text-slate-900 font-bold rounded-xl text-xs uppercase tracking-widest hover:shadow-glow-gold transition-all border-0 cursor-pointer">
                                                        Upload & Notify Students
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </div>

                                    {/* Assignments Section */}
                                    <div className="space-y-6 pt-6 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-electric-blue/10 flex items-center justify-center border border-electric-blue/20 text-electric-blue">
                                                    <Award size={20} />
                                                </div>
                                                <span>Course Assignments</span>
                                            </h3>
                                            {isAuthorized && (
                                                <button onClick={() => setShowAsgnForm(true)} className="px-5 py-2.5 bg-emerald-glow text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-glow-emerald transition-all cursor-pointer flex items-center gap-2 border-0">
                                                    <Plus size={16} /> Create Assignment
                                                </button>
                                            )}
                                        </div>

                                        {showAsgnForm && (
                                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/80 p-8 rounded-[2rem] border-2 border-emerald-glow/30 relative">
                                                <button onClick={() => setShowAsgnForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer border-0"><X size={18} /></button>
                                                <h4 className="text-lg font-black text-white mb-6 uppercase tracking-tighter flex items-center gap-2"><Plus size={20} className="text-emerald-glow" />New Assignment</h4>
                                                <div className="space-y-5">
                                                    <input type="text" placeholder="Assignment Title" value={asgnTitle} onChange={e => setAsgnTitle(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-emerald-glow/50" />
                                                    <textarea placeholder="Instructions & Details..." value={asgnDesc} onChange={e => setAsgnDesc(e.target.value)} rows={3} className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-emerald-glow/50" />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Due Date</label>
                                                            <input type="date" value={asgnDue} onChange={e => setAsgnDue(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white font-bold outline-none" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Max Marks</label>
                                                            <input type="number" value={asgnMarks} onChange={e => setAsgnMarks(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white font-bold outline-none" />
                                                        </div>
                                                    </div>
                                                    <input type="file" multiple onChange={e => setAsgnFiles(Array.from(e.target.files))} className="w-full text-sm text-slate-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-emerald-glow/20 file:text-emerald-glow bg-slate-950 rounded-xl border border-white/10 p-2" />
                                                    <button onClick={() => {
                                                        if (!asgnTitle || !asgnDue) return alert('Title and Due Date are required');
                                                        const newAsgn = {
                                                            id: Date.now(),
                                                            courseId: selectedCourse.id,
                                                            title: asgnTitle,
                                                            desc: asgnDesc,
                                                            due: asgnDue,
                                                            maxMarks: asgnMarks,
                                                            fileNames: asgnFiles.map(f => f.name)
                                                        };
                                                        setAssignments([...assignments, newAsgn]);
                                                        setNotifications(prev => [{
                                                            id: Date.now() + 1,
                                                            type: 'Assignment',
                                                            message: `New Assignment: ${asgnTitle} for ${selectedCourse.name}`,
                                                            courseId: selectedCourse.id,
                                                            deadline: asgnDue
                                                        }, ...prev]);
                                                        alert('Assignment Created!');
                                                        setAsgnTitle(''); setAsgnDesc(''); setAsgnDue(''); setAsgnFiles([]); setShowAsgnForm(false);
                                                    }} className="w-full py-4 bg-emerald-glow text-slate-900 font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-glow-emerald transition-all border-0 cursor-pointer">
                                                        Create Assignment
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="space-y-4">
                                            {assignments.filter(a => a.courseId === selectedCourse.id).length === 0 ? (
                                                <div className="text-center py-10 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                                    <p className="text-slate-500 font-bold italic uppercase text-xs tracking-widest">No assignments posted yet</p>
                                                </div>
                                            ) : (
                                                assignments.filter(a => a.courseId === selectedCourse.id).map(asgn => {
                                                    const submission = assignmentSubmissions.find(s => s.assignmentId === asgn.id && s.studentId === currentUser.id);
                                                    return (
                                                        <div key={asgn.id} className="bg-slate-800 border border-white/10 rounded-3xl p-6 relative group hover:border-white/20 transition-all shadow-xl">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <div className="flex-1">
                                                                    <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{asgn.title}</h4>
                                                                    <p className="text-slate-400 text-sm font-bold line-clamp-1">{asgn.desc}</p>
                                                                </div>
                                                                {isAuthorized && (
                                                                    <div className="flex gap-4 items-center ml-8 shrink-0">
                                                                        <button onClick={() => { }} className="text-xs font-black text-electric-blue hover:bg-electric-blue/10 px-5 py-2.5 rounded-xl transition-all border border-electric-blue/20 cursor-pointer bg-transparent uppercase tracking-widest flex items-center gap-2">
                                                                            <Users size={14} />
                                                                            VIEW SUBMISSIONS ({assignmentSubmissions?.filter(s => s.assignmentId === asgn.id).length || 0})
                                                                        </button>
                                                                        <button onClick={() => setAssignments(prev => prev.filter(a => a.id !== asgn.id))} className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border-0 cursor-pointer"><Trash2 size={24} /></button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                                                <div className="flex flex-wrap gap-4">
                                                                    <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
                                                                        <Clock size={14} className="text-luxury-gold" />
                                                                        <span className="text-[10px] font-black text-luxury-gold uppercase tracking-widest">Due: {asgn.due}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
                                                                        <Award size={14} className="text-slate-400" />
                                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max: {asgn.maxMarks} Marks</span>
                                                                    </div>
                                                                </div>

                                                                {currentUser?.role === 'Student' && (
                                                                    <div className="flex justify-end gap-3 self-end">
                                                                        {submission ? (
                                                                            <div className="text-right bg-emerald-glow/5 p-4 rounded-2xl border border-emerald-glow/10 flex flex-col items-end gap-2">
                                                                                <p className="text-[10px] text-emerald-glow/60 font-black uppercase tracking-widest mb-1">Status: COMPLETED</p>
                                                                                <div className="space-y-1">
                                                                                    {submission.fileNames?.map((fname, idx) => (
                                                                                        <p key={idx} className="text-white font-bold text-sm flex items-center gap-2 justify-end">
                                                                                            <FileText size={14} className="text-emerald-glow" />{fname}
                                                                                        </p>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            isSubmitting === asgn.id ? (
                                                                                <div className="space-y-3 bg-slate-900/90 p-5 rounded-2xl border-2 border-electric-blue inline-block min-w-[300px]">
                                                                                    <input type="file" multiple onChange={e => setSubmissionFiles(Array.from(e.target.files))} className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-electric-blue/20 file:text-electric-blue" />
                                                                                    <div className="flex gap-2">
                                                                                        <button onClick={() => setIsSubmitting(null)} className="flex-1 py-2 text-[10px] font-black uppercase bg-white/5 text-slate-400 rounded-lg cursor-pointer border-0">Cancel</button>
                                                                                        <button onClick={() => {
                                                                                            if (submissionFiles.length === 0) return alert('Select at least one file');
                                                                                            const sub = { id: Date.now(), assignmentId: asgn.id, studentId: currentUser.id, studentName: currentUser.name, fileNames: submissionFiles.map(f => f.name), timestamp: Date.now() };
                                                                                            setAssignmentSubmissions([...assignmentSubmissions, sub]);
                                                                                            setNotifications(prev => [{ id: Date.now(), type: 'Coursera Submission', message: `${currentUser.name} submitted assignment: ${asgn.title}` }, ...prev]);
                                                                                            alert('Assignment Submitted!');
                                                                                            setIsSubmitting(null); setSubmissionFiles([]);
                                                                                        }} className="flex-2 py-2 text-[10px] font-black uppercase bg-electric-blue text-slate-900 rounded-lg cursor-pointer border-0">Submit</button>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <button onClick={() => setIsSubmitting(asgn.id)} className="px-10 py-5 bg-electric-blue text-slate-900 font-black rounded-2xl flex items-center gap-3 hover:shadow-glow-blue hover:scale-105 transition-all text-sm border-0 cursor-pointer uppercase tracking-widest group">
                                                                                    <UploadCloud size={20} className="group-hover:-translate-y-1 transition-transform" />
                                                                                    Upload Submission
                                                                                </button>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    {isAuthorized && (
                                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                                            <button onClick={() => { setEditForm(selectedCourse); setIsEditing(true); }} className="px-5 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white font-bold hover:bg-white/10 transition-colors flex items-center space-x-2">
                                                <Edit3 size={18} /><span>Edit Course Details</span>
                                            </button>
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
