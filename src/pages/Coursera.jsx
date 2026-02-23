import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MonitorPlay, Plus, Upload, CheckCircle, Clock, Send, Eye } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Coursera = () => {
    const { courseraLinks, setCourseraLinks, currentUser, setNotifications } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [isCreating, setIsCreating] = useState(false);
    const [subject, setSubject] = useState('');
    const [courseLink, setCourseLink] = useState('');
    const [deadline, setDeadline] = useState('');

    // For Student Upload
    const [uploadingFor, setUploadingFor] = useState(null);
    const [certFile, setCertFile] = useState(null);

    const handleCreateCourse = (e) => {
        e.preventDefault();
        if (!subject || !courseLink || !deadline) return;

        const newCourse = {
            id: Date.now(),
            subject: subject,
            link: courseLink,
            deadline: deadline,
            createdBy: currentUser.name,
            createdAt: new Date().toISOString(),
            submissions: [] // Store {studentId, studentName, file}
        };

        setCourseraLinks([newCourse, ...courseraLinks]);

        const notif = {
            id: Date.now(),
            type: 'Coursera Assignment',
            message: `New Coursera course assigned for ${subject} by ${currentUser.name}. Due: ${deadline}.`
        };
        setNotifications(prev => [notif, ...prev]);

        setIsCreating(false);
        setSubject('');
        setCourseLink('');
        setDeadline('');
        alert('Coursera assignment deployed to students!');
    };

    const handleUploadSubmit = (e, courseId, courseSubject) => {
        e.preventDefault();
        if (!certFile) return;

        setCourseraLinks(prev => prev.map(c => {
            if (c.id === courseId) {
                return {
                    ...c,
                    submissions: [...(c.submissions || []), { studentId: currentUser.id, studentName: currentUser.name, file: certFile.name, date: new Date().toISOString() }]
                };
            }
            return c;
        }));

        const notif = {
            id: Date.now(),
            type: 'Coursera Submission',
            message: `${currentUser.name} uploaded their certificate for ${courseSubject}.`
        };
        setNotifications(prev => [notif, ...prev]);

        setUploadingFor(null);
        setCertFile(null);
        alert('Certificate uploaded successfully!');
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <MonitorPlay className="text-electric-blue" size={32} />
                        <span>Coursera Hub</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Access mandatory assignments and upload completion certificates.</p>
                </div>
                {isAuthorized && (
                    <button onClick={() => setIsCreating(true)} className="bg-gradient-to-r from-electric-blue to-emerald-glow text-slate-900 px-6 py-3 rounded-xl font-bold hover:shadow-glow-blue transition-shadow flex items-center space-x-2">
                        <Plus size={20} />
                        <span>Assign Course</span>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isCreating && isAuthorized && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                        <form onSubmit={handleCreateCourse} className="glass-card p-6 rounded-2xl border border-glass-border shadow-glass-card space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Send size={20} className="mr-2 text-electric-blue" />Assign a Coursera Course</h2>
                            <div>
                                <label className="text-slate-400 font-bold text-sm block mb-1">Subject / Topic Name</label>
                                <input type="text" required placeholder="e.g. Machine Learning Basics" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-bold text-sm block mb-1">Coursera Course URL</label>
                                <input type="url" required placeholder="https://coursera.org/..." value={courseLink} onChange={e => setCourseLink(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-bold text-sm block mb-1">Deadline Date</label>
                                <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white" />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2 border border-white/20 rounded-lg text-slate-300 font-bold hover:bg-white/5">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-electric-blue rounded-lg text-slate-900 font-bold hover:shadow-glow-blue">Assign to Students</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseraLinks.map(course => {
                    const submissions = course.submissions || [];
                    const hasSubmitted = submissions.some(s => s.studentId === currentUser.id);

                    return (
                        <motion.div key={course.id} variants={itemVariants} className="glass-card p-6 rounded-2xl border border-glass-border shadow-glass-card hover:border-electric-blue/30 transition-colors flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-black text-white">{course.subject}</h3>
                                <div className="bg-electric-blue/20 p-2 rounded-lg text-electric-blue"><MonitorPlay size={20} /></div>
                            </div>

                            <p className="text-slate-400 text-sm mb-4">Assigned by <span className="text-white font-semibold">{course.createdBy}</span></p>

                            <div className="space-y-4 mb-6 flex-1">
                                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm bg-rose-500/10 p-2 rounded border border-rose-500/20">
                                    <Clock size={16} /><span>Due: {course.deadline}</span>
                                </div>
                                <div className="flex gap-2">
                                    <a href={course.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-slate-800 border border-electric-blue/30 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-electric-blue/20 transition-colors text-electric-blue">
                                        <Eye size={16} /> <span>Open Course</span>
                                    </a>
                                </div>
                            </div>

                            {!isAuthorized && (
                                <div className="mt-auto border-t border-white/10 pt-4">
                                    {hasSubmitted ? (
                                        <div className="flex items-center justify-center space-x-2 text-emerald-glow p-2 bg-emerald-glow/10 rounded-lg border border-emerald-glow/20 font-bold">
                                            <CheckCircle size={18} /><span>Certificate Uploaded</span>
                                        </div>
                                    ) : (
                                        uploadingFor === course.id ? (
                                            <form onSubmit={(e) => handleUploadSubmit(e, course.id, course.subject)} className="space-y-3">
                                                <input type="file" required accept="image/*,.pdf" className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-electric-blue file:text-slate-900 hover:file:bg-electric-blue/80" onChange={e => setCertFile(e.target.files[0])} />
                                                <div className="flex space-x-2">
                                                    <button type="submit" className="flex-1 bg-emerald-glow/20 text-emerald-glow font-bold text-sm py-2 rounded-lg border border-emerald-glow/30 hover:bg-emerald-glow/30">Upload</button>
                                                    <button type="button" onClick={() => setUploadingFor(null)} className="flex-1 bg-white/5 text-slate-300 font-bold text-sm py-2 rounded-lg border border-white/10 hover:bg-white/10">Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button onClick={() => setUploadingFor(course.id)} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors text-white">
                                                <Upload size={18} /><span>Upload Certificate</span>
                                            </button>
                                        )
                                    )}
                                </div>
                            )}

                            {isAuthorized && (
                                <div className="mt-auto border-t border-white/10 pt-4">
                                    <p className="text-slate-400 text-sm font-semibold mb-2">Student Submissions ({submissions.length})</p>
                                    <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {submissions.map((sub, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-lg border border-white/5 hover:border-emerald-500/20 transition-colors">
                                                <div className="flex items-center space-x-2 min-w-0">
                                                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black flex-shrink-0">{idx + 1}</span>
                                                    <div className="min-w-0">
                                                        <span className="text-xs text-white font-bold block truncate">{sub.studentName}</span>
                                                        <span className="text-[10px] text-slate-500">{sub.date ? new Date(sub.date).toLocaleDateString('en-IN') : ''}</span>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20 truncate max-w-[100px] flex-shrink-0">{sub.file}</span>
                                            </div>
                                        ))}
                                        {submissions.length === 0 && <span className="text-xs text-slate-500">No submissions yet</span>}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
                {courseraLinks.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 font-medium border border-dashed border-white/20 rounded-2xl">
                        No Coursera assignments pending.
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Coursera;
