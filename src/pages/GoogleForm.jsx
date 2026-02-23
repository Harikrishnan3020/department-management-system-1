import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkIcon, Plus, Send, Copy, Eye, Clock, User, Bell, CheckCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const GoogleForm = () => {
    const { googleForms, setGoogleForms, currentUser, setNotifications } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [isCreating, setIsCreating] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [formLink, setFormLink] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleCreateForm = (e) => {
        e.preventDefault();
        if (!formTitle || !formLink) return;

        // Force the link to be fillable (viewform) instead of editable
        let fillableLink = formLink;
        if (fillableLink.includes('/edit')) {
            fillableLink = fillableLink.split('/edit')[0] + '/viewform';
        }

        const newForm = {
            id: Date.now(),
            title: formTitle,
            link: fillableLink,
            deadline: deadline,
            createdBy: currentUser.name,
            createdAt: new Date().toISOString()
        };

        setGoogleForms([newForm, ...googleForms]);

        // Notify students
        const notif = {
            id: Date.now(),
            type: 'Google Form',
            message: `New Form Available: ${formTitle} has been assigned by ${currentUser.name}.`
        };
        setNotifications(prev => [notif, ...prev]);

        setIsCreating(false);
        setFormTitle('');
        setFormLink('');
        setDeadline('');
        alert('Form linked and notification sent to students successfully!');
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <LinkIcon className="text-royal-purple" size={32} />
                        <span>Google Forms Portal</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Create or fill out integrated campus feedback and survey forms.</p>
                </div>
                {isAuthorized && (
                    <button onClick={() => setIsCreating(true)} className="bg-gradient-to-r from-royal-purple to-electric-blue text-white px-6 py-3 rounded-xl font-bold hover:shadow-glow-purple transition-shadow flex items-center space-x-2">
                        <Plus size={20} />
                        <span>Create / Send Link</span>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isCreating && isAuthorized && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                        <form onSubmit={handleCreateForm} className="glass-card p-6 rounded-2xl border border-glass-border shadow-glass-card space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Send size={20} className="mr-2 text-royal-purple" />Link a New Form</h2>
                            <div>
                                <label className="text-slate-400 font-bold text-sm block mb-1">Form Title</label>
                                <input type="text" required placeholder="e.g. End Semester Feedback" value={formTitle} onChange={e => setFormTitle(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-bold text-sm block mb-1">Google Form URL</label>
                                <input type="url" required placeholder="https://forms.gle/..." value={formLink} onChange={e => setFormLink(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-bold text-sm block mb-1">Deadline (Optional)</label>
                                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white" />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2 border border-white/20 rounded-lg text-slate-300 font-bold hover:bg-white/5">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-royal-purple rounded-lg text-white font-bold hover:shadow-glow-purple">Send to Students</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {googleForms.map(form => (
                    <motion.div key={form.id} variants={itemVariants} className="glass-card p-6 rounded-2xl border border-glass-border shadow-glass-card hover:border-royal-purple/30 transition-colors flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-black text-white">{form.title}</h3>
                            <div className="bg-royal-purple/20 p-2 rounded-lg text-royal-purple"><LinkIcon size={20} /></div>
                        </div>
                        <div className="space-y-2 mb-6 flex-1">
                            <p className="text-slate-400 text-sm flex items-center space-x-2"><User size={14} /><span>Sent by: {form.createdBy}</span></p>
                            {form.deadline && <p className="text-rose-400 text-sm flex items-center space-x-2"><Clock size={14} /><span>Due: {form.deadline}</span></p>}
                        </div>
                        <div className="mt-auto space-y-3">
                            <a href={form.link} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-royal-purple/20 hover:border-royal-purple/50 transition-colors text-white">
                                <Eye size={18} />
                                <span>Fill Google Form</span>
                            </a>
                            {!isAuthorized && (
                                <button
                                    onClick={() => {
                                        setNotifications(prev => [
                                            { type: 'Form Completed', from: currentUser.id, message: `${currentUser.name} has completed the form: ${form.title}` },
                                            ...prev
                                        ]);
                                        alert(`Notified faculty that you completed: ${form.title}`);
                                    }}
                                    className="w-full py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-bold flex items-center justify-center space-x-2 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                >
                                    <CheckCircle size={16} />
                                    <span>Mark as Done</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
                {googleForms.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 font-medium border border-dashed border-white/20 rounded-2xl">
                        No active Google Forms available right now.
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default GoogleForm;
