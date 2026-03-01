import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, CheckCircle, XCircle, Eye, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

// ── Full Letter Preview Modal ─────────────────────────────────────────────────
const LetterModal = ({ letter, onClose }) => (
    <AnimatePresence>
        {letter && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded shadow-2xl max-w-2xl w-full relative max-h-[92vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                    style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13px', color: '#111' }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                        <X size={18} />
                    </button>

                    <LetterBody letter={letter} />
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// ── Reusable Letter Body (used in both form & modal) ─────────────────────────
const LetterBody = ({ letter, editMode, body, setBody, subject, setSubject, date, setDate, signature, setSignature }) => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div
            className="border border-gray-400 m-4"
            style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13px', color: '#111' }}
        >
            {/* Title */}
            <div className="border-b border-gray-400 text-center py-2">
                <span className="font-bold text-blue-900 tracking-widest text-sm uppercase">Student Request Letter</span>
            </div>

            {/* From / To */}
            <div className="flex border-b border-gray-400">
                <div className="w-1/2 border-r border-gray-400 p-3 min-h-[72px]">
                    <p className="font-bold text-xs text-gray-600 mb-1">From</p>
                    {letter ? (
                        <>
                            <p className="font-semibold">{letter.studentName}</p>
                            <p>{letter.studentId}</p>
                            <p>AI &amp; ML Department</p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold">{editMode?.studentName}</p>
                            <p>{editMode?.studentId}</p>
                            <p>AI &amp; ML Department</p>
                        </>
                    )}
                </div>
                <div className="w-1/2 p-3 min-h-[72px]">
                    <p className="font-bold text-xs text-gray-600 mb-1">To</p>
                    <p className="font-semibold">The Head of Department,</p>
                    <p>Artificial Intelligence and Machine Learning,</p>
                </div>
            </div>

            {/* Salutation + Subject + Body */}
            <div className="p-4 border-b border-gray-400">
                <p className="mb-4">Respected Sir/Madam,</p>
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-medium">Subject :</span>
                    {editMode ? (
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-400 text-gray-800 pb-1"
                            placeholder="e.g. Request for Leave..."
                            required
                        />
                    ) : (
                        <span className="font-semibold">{letter?.subject}</span>
                    )}
                </div>

                {/* Editable body textarea OR read-only view */}
                {editMode ? (
                    <textarea
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        required
                        rows={14}
                        placeholder="Write the complete content of your letter here..."
                        className="w-full resize-none bg-transparent focus:outline-none text-gray-800 leading-7 placeholder-gray-400"
                        style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13px', minHeight: '260px' }}
                    />
                ) : (
                    <div className="whitespace-pre-wrap leading-7 min-h-[220px]" style={{ color: '#111' }}>
                        {letter?.body}
                    </div>
                )}
            </div>

            {/* Date + Signature */}
            <div className="flex border-b border-gray-400">
                <div className="w-1/2 border-r border-gray-400 p-3 flex items-center gap-2">
                    <p>Date:</p>
                    {editMode ? (
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-400 text-gray-800 pb-0.5"
                            required
                        />
                    ) : (
                        <span className="ml-1">{letter?.date ? new Date(letter.date).toLocaleDateString('en-IN') : (letter ? new Date(letter.submittedAt).toLocaleDateString('en-IN') : today)}</span>
                    )}
                </div>
                <div className="w-1/2 p-3">
                    <p className="text-gray-500 mb-2">Student Signature:</p>
                    {editMode ? (
                        <input
                            type="text"
                            value={signature}
                            onChange={e => setSignature(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-400 text-gray-800 font-semibold italic pb-0.5"
                            placeholder="Type your name as signature..."
                            required
                        />
                    ) : (
                        <p className="font-semibold italic">{letter?.signature || letter?.studentName}</p>
                    )}
                </div>
            </div>

            {/* Remarks By Class Advisor */}
            <div className="border-b border-gray-400">
                <div className="text-center text-xs text-gray-600 py-1 border-b border-gray-300">Remarks By Class Advisor</div>
                <div className="min-h-[36px] p-2" />
            </div>

            {/* Remarks By HoD / Dean */}
            <div className="flex border-b border-gray-400">
                <div className="w-1/2 border-r border-gray-400">
                    <div className="min-h-[36px] p-2" />
                    <div className="text-center text-xs text-gray-500 border-t border-gray-300 py-1">Remarks By HoD</div>
                </div>
                <div className="w-1/2">
                    <div className="min-h-[36px] p-2" />
                    <div className="text-center text-xs text-gray-500 border-t border-gray-300 py-1">Dean/IQAC(If applicable)</div>
                </div>
            </div>

            {/* Remarks by Principal / Director */}
            <div className="flex border-b border-gray-400">
                <div className="w-1/2 border-r border-gray-400">
                    <div className="min-h-[36px] p-2" />
                    <div className="text-center text-xs text-gray-500 border-t border-gray-300 py-1">Remarks by Principal</div>
                </div>
                <div className="w-1/2">
                    <div className="min-h-[36px] p-2" />
                    <div className="text-center text-xs text-gray-500 border-t border-gray-300 py-1">Remarks by Director(A&amp;A)</div>
                </div>
            </div>

            {/* Office Use / CEO */}
            <div className="flex">
                <div className="w-1/2 border-r border-gray-400">
                    <div className="min-h-[36px] p-2" />
                    <div className="text-center text-xs text-gray-500 border-t border-gray-300 py-1">Office Use/A.O</div>
                </div>
                <div className="w-1/2">
                    <div className="min-h-[36px] p-2" />
                    <div className="text-center text-xs text-gray-500 border-t border-gray-300 py-1">CEO</div>
                </div>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const RequestLetter = () => {
    const { currentUser, setNotifications, setRequestLetters, requestLetters } = useContext(AppContext);
    const [body, setBody] = useState('');
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [signature, setSignature] = useState('');
    const [previewLetter, setPreviewLetter] = useState(null);

    const isStudent = currentUser?.role === 'Student';
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!subject.trim() || !body.trim() || !signature.trim()) {
            alert('Please fill in the subject, body, and signature before submitting.');
            return;
        }
        const newRequest = {
            id: Date.now(),
            studentId: currentUser.id,
            studentName: currentUser.name,
            subject: subject.trim(),
            body: body.trim(),
            date: date,
            signature: signature.trim(),
            status: 'Pending',
            submittedAt: new Date().toISOString(),
        };
        setRequestLetters(prev => [newRequest, ...prev]);
        setNotifications(prev => [
            {
                type: 'Leave Request Letter',
                message: `New request letter from ${currentUser.name} (${currentUser.id}).`,
                date: new Date().toISOString(),
                from: currentUser.id,
                requestId: newRequest.id,
            },
            ...prev,
        ]);
        alert('Request Letter submitted successfully!');
        setSubject('');
        setBody('');
        setSignature('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleApprove = (id) => {
        setRequestLetters(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
        setNotifications(prev => [
            { type: 'Request Letter Approved', message: `Your request letter has been approved.`, date: new Date().toISOString() },
            ...prev,
        ]);
        alert('Request approved.');
    };

    const handleReject = (id) => {
        setRequestLetters(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
        setNotifications(prev => [
            { type: 'Request Letter Rejected', message: `Your request letter has been rejected.`, date: new Date().toISOString() },
            ...prev,
        ]);
        alert('Request rejected.');
    };

    const myRequests = requestLetters.filter(r => r.studentId === currentUser?.id);
    const pendingRequests = requestLetters.filter(r => r.status === 'Pending');
    const processedRequests = requestLetters.filter(r => r.status !== 'Pending');

    return (
        <div className="space-y-6">
            {/* ── Page Header ── */}
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <FileText className="text-electric-blue" size={32} />
                        <span>Request Letter</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Fill in your formal request letter below.</p>
                </div>
            </div>

            {/* ── STUDENT: Compose ── */}
            {isStudent && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/5 blur-[80px] rounded-full pointer-events-none" />

                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Compose Letter</h2>

                    <form onSubmit={handleSubmit}>
                        {/* White letter paper */}
                        <div className="bg-white shadow-xl rounded">
                            <LetterBody
                                editMode={{ studentName: currentUser.name, studentId: currentUser.id }}
                                body={body}
                                setBody={setBody}
                                subject={subject}
                                setSubject={setSubject}
                                date={date}
                                setDate={setDate}
                                signature={signature}
                                setSignature={setSignature}
                            />
                        </div>

                        <div className="flex justify-end mt-6">
                            <button type="submit"
                                className="bg-electric-blue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-glow-blue flex items-center space-x-2">
                                <Send size={18} />
                                <span>Submit Letter</span>
                            </button>
                        </div>
                    </form>

                    {/* My past submissions */}
                    {myRequests.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">My Submitted Letters</h3>
                            <div className="space-y-4">
                                {myRequests.map(req => (
                                    <div key={req.id} className="bg-slate-800/40 p-5 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-500 mb-1">
                                                {new Date(req.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                            <p className="font-semibold text-white mb-1">{req.subject}</p>
                                            <p className="text-slate-300 text-sm line-clamp-2">{req.body}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <button onClick={() => setPreviewLetter(req)}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all">
                                                <Eye size={13} /> View Full Letter
                                            </button>
                                            <span className={`px-3 py-1.5 rounded-lg font-bold text-xs border ${req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                req.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                                                    'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                }`}>{req.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ── ADMIN / FACULTY: Review ── */}
            {isAuthorized && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card p-6 md:p-10 relative overflow-hidden">
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                        Pending Request Letters
                        {pendingRequests.length > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-bold">
                                {pendingRequests.length}
                            </span>
                        )}
                    </h2>

                    {pendingRequests.length === 0 ? (
                        <div className="text-center text-slate-500 py-12 bg-slate-800/20 rounded-xl border border-white/5">
                            No pending requests at the moment.
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="space-y-4">
                                    {/* Mini info bar */}
                                    <div className="flex justify-between items-center flex-wrap gap-2">
                                        <div>
                                            <span className="font-bold text-white text-lg">{req.studentName}</span>
                                            <span className="ml-2 text-electric-blue text-sm">({req.studentId})</span>
                                            <p className="mt-1 font-semibold text-slate-200">{req.subject}</p>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            Submitted: {new Date(req.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* The actual letter */}
                                    <div className="bg-white shadow-xl rounded">
                                        <LetterBody letter={req} />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={() => handleReject(req.id)}
                                            className="px-5 py-2.5 bg-rose-500/10 text-rose-400 rounded-xl font-bold border border-rose-500/30 hover:bg-rose-500/20 flex items-center gap-2 transition-all">
                                            <XCircle size={16} /> Reject
                                        </button>
                                        <button onClick={() => handleApprove(req.id)}
                                            className="px-5 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold border border-emerald-500/30 hover:bg-emerald-500/20 flex items-center gap-2 transition-all">
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Processed */}
                    {processedRequests.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Processed Letters</h3>
                            <div className="space-y-3">
                                {processedRequests.map(req => (
                                    <div key={req.id} className="bg-slate-800/20 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 opacity-75 hover:opacity-100 transition-opacity">
                                        <div>
                                            <span className="font-bold text-white">{req.studentName}</span>
                                            <span className="text-slate-400 text-sm ml-2">({req.studentId})</span>
                                            <p className="mt-0.5 font-medium text-slate-300 text-sm">{req.subject}</p>
                                            <p className="text-xs text-slate-500 mt-1">{new Date(req.submittedAt).toLocaleDateString('en-IN')}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setPreviewLetter(req)}
                                                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition-all">
                                                <Eye size={12} /> View Letter
                                            </button>
                                            <span className={`px-3 py-1 rounded border font-bold text-xs ${req.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                                }`}>{req.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Letter Preview Modal */}
            <LetterModal letter={previewLetter} onClose={() => setPreviewLetter(null)} />
        </div>
    );
};

export default RequestLetter;
