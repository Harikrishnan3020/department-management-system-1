import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, MapPin, Upload, FileSignature, AlertCircle, Download, CheckCircle, XCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

// Convert a File object → base64 data-URL string
const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('File read failed'));
        reader.readAsDataURL(file);
    });

const Attendance = () => {
    const { currentUser, attendance, setAttendance, setNotifications, students } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    // Student State
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [locationVerified, setLocationVerified] = useState(false);
    const [reason, setReason] = useState('');
    const [file, setFile] = useState(null);
    const [dates, setDates] = useState({ start: '', end: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Admin State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    // Auto-mark absent if OD proof not uploaded within 2 days
    useEffect(() => {
        if (!currentUser || isAuthorized) return;
        let changed = false;
        const today = new Date();
        const updated = attendance.map(a => {
            if (a.studentId === currentUser.id && a.status === 'OD Approved' && !a.proofUploaded) {
                const endDate = new Date(a.end || a.date);
                const diffDays = Math.floor((today - endDate) / 86_400_000);
                if (diffDays > 2) {
                    changed = true;
                    return { ...a, status: 'Absent', reason: 'Failed to upload OD proof within 2 days' };
                }
            }
            return a;
        });
        if (changed) setAttendance(updated);
    }, [attendance, currentUser, isAuthorized, setAttendance]);

    const pendingProofs = attendance.filter(a =>
        a.studentId === currentUser?.id && a.status === 'OD Approved' && !a.proofUploaded
    );

    const handleMark = (sel) => { setStatus(sel); setStep(2); };

    const verifyLocation = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => { setTimeout(() => { setIsLocating(false); setLocationVerified(true); }, 1000); },
                () => { setIsLocating(false); alert('Please enable location services to mark attendance.'); }
            );
        } else {
            setIsLocating(false);
            alert('Geolocation is not supported by your browser');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (status === 'Present') {
                if (!locationVerified) { alert('You are not inside the college!'); setIsSubmitting(false); return; }
                const record = {
                    id: Date.now(), studentId: currentUser.id, name: currentUser.name,
                    date: new Date().toISOString().split('T')[0], status: 'Present'
                };
                setAttendance(prev => [record, ...prev]);
                alert('Attendance marked as Present ✓');
                setStep(1); setLocationVerified(false);

            } else if (status === 'Absent') {
                // Convert file to base64 so admin can view it
                let fileData = null;
                let fileName = null;
                if (file) {
                    fileData = await fileToBase64(file);
                    fileName = file.name;
                }

                const record = {
                    id: Date.now(), studentId: currentUser.id, name: currentUser.name,
                    date: new Date().toISOString().split('T')[0], status: 'Absent', reason, file: fileName
                };
                setAttendance(prev => [record, ...prev]);

                // Rich notification with file attachment
                setNotifications(prev => [{
                    id: Date.now(),
                    type: 'Absent Alert',
                    from: currentUser.id,
                    studentName: currentUser.name,
                    message: `${currentUser.name} is absent today. Reason: ${reason}`,
                    reason,
                    date: new Date().toISOString().split('T')[0],
                    fileName,
                    fileData,       // base64 — admin can open this
                    acknowledged: false,
                }, ...prev]);

                alert('Absent request submitted with letter ✓');
                setStep(1); setReason(''); setFile(null);

            } else if (status === 'OD') {
                // Convert file to base64
                let fileData = null;
                let fileName = null;
                if (file) {
                    fileData = await fileToBase64(file);
                    fileName = file.name;
                }

                const record = {
                    id: Date.now(), studentId: currentUser.id, name: currentUser.name,
                    date: new Date().toISOString().split('T')[0],
                    status: 'OD Pending', reason, start: dates.start, end: dates.end
                };
                setAttendance(prev => [record, ...prev]);

                setNotifications(prev => [{
                    id: Date.now(),
                    type: 'OD Request',
                    from: currentUser.id,
                    studentName: currentUser.name,
                    message: `${currentUser.name} requests OD from ${dates.start} to ${dates.end}. Reason: ${reason}`,
                    reason,
                    start: dates.start,
                    end: dates.end,
                    date: new Date().toISOString().split('T')[0],
                    fileName,
                    fileData,
                    status: 'pending',  // pending | approved | denied
                }, ...prev]);

                alert('OD request submitted for approval ✓\nRemember to upload photos/certificates within 2 days after OD.');
                setStep(1); setReason(''); setFile(null); setDates({ start: '', end: '' });
            }
        } catch (err) {
            alert('Error processing file. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = () => {
        const headers = ['Record ID', 'Student ID', 'Name', 'Date', 'Status', 'Reason', 'File Attached'];
        const rows = attendance.map(a => [a.id, a.studentId, a.name, a.date, a.status, a.reason || 'N/A', a.file || 'N/A']);
        const csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'student_attendance.csv');
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    const handleAdminMark = (studentId, newStatus) => {
        const student = students.find(s => s.rollNo === studentId);
        const existing = attendance.find(a => a.studentId === studentId && a.date === selectedDate);
        if (existing) {
            setAttendance(attendance.map(a => a.id === existing.id ? { ...a, status: newStatus } : a));
        } else {
            setAttendance([{ id: Date.now() + Math.random(), studentId, name: student?.name, date: selectedDate, status: newStatus }, ...attendance]);
        }
    };

    // ─── ADMIN VIEW ─────────────────────────────────────────────────────────────
    if (isAuthorized) {
        const filteredStudents = students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                            <CalendarCheck className="text-electric-blue" size={32} />
                            <span>Attendance Sheet</span>
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium">Mark regular attendance for all students by date.</p>
                    </div>
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                            className="bg-slate-800/80 p-3 rounded-xl text-white border border-white/10 font-bold focus:border-electric-blue outline-none" />
                        <button onClick={handleDownload}
                            className="flex items-center space-x-2 px-6 py-3 bg-emerald-glow/20 text-emerald-glow font-bold rounded-xl border border-emerald-glow/30 hover:bg-emerald-glow/30 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <Download size={18} /><span>Export</span>
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <input type="text" placeholder="Search student by name or Roll No..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full max-w-md bg-slate-900/60 p-3 rounded-xl border border-white/10 text-white focus:outline-none focus:border-electric-blue/50" />
                </div>

                <div className="glass-card rounded-[2rem] border border-glass-border overflow-hidden shadow-glass-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm tracking-wider uppercase bg-slate-950/50">
                                    <th className="py-4 px-6 font-semibold">Roll No</th>
                                    <th className="py-4 px-6 font-semibold">Student Name</th>
                                    <th className="py-4 px-6 font-semibold">Current Status</th>
                                    <th className="py-4 px-6 font-semibold">Mark Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => {
                                    const record = attendance.find(a => a.studentId === student.rollNo && a.date === selectedDate);
                                    const currentStatus = record?.status || 'Unmarked';
                                    return (
                                        <tr key={student.rollNo} className="border-b border-white/5 hover:bg-white/[0.04]">
                                            <td className="py-4 px-6 text-slate-400 font-bold">{student.rollNo}</td>
                                            <td className="py-4 px-6 font-bold text-white">{student.name}</td>
                                            <td className="py-4 px-6 font-bold">
                                                <span className={
                                                    currentStatus === 'Present' ? 'text-emerald-400' :
                                                        currentStatus === 'Absent' ? 'text-rose-400' :
                                                            currentStatus.includes('OD') ? 'text-electric-blue' : 'text-slate-500'
                                                }>{currentStatus}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex space-x-2">
                                                    {['Present', 'Absent', 'OD Approved'].map(s => (
                                                        <button key={s} onClick={() => handleAdminMark(student.rollNo, s)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${currentStatus === s
                                                                    ? s === 'Present' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                                                        : s === 'Absent' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                                                            : 'bg-electric-blue/20 text-electric-blue border-electric-blue/40'
                                                                    : 'bg-slate-800 text-slate-400 hover:bg-white/10 border-transparent'
                                                                }`}>
                                                            {s === 'OD Approved' ? 'OD' : s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredStudents.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-8 text-slate-500">No students found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // ─── STUDENT VIEW ────────────────────────────────────────────────────────────
    const todayStr = new Date().toISOString().split('T')[0];
    const alreadyMarked = attendance.find(a => a.studentId === currentUser?.id && a.date === todayStr);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <CalendarCheck className="text-electric-blue" size={32} />
                        <span>Daily Attendance</span>
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium">{new Date().toDateString()}</p>
                </div>
                {alreadyMarked && (
                    <div className={`px-4 py-2 rounded-xl font-bold text-sm border ${alreadyMarked.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            alreadyMarked.status.includes('OD') ? 'bg-electric-blue/10 text-electric-blue border-electric-blue/30' :
                                'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                        Today: {alreadyMarked.status}
                    </div>
                )}
            </div>

            <div className="glass-card p-8 rounded-[2rem] border border-glass-border shadow-glass-card max-w-2xl mx-auto">
                {/* Already marked banner */}
                {alreadyMarked && step === 1 && (
                    <div className="mb-6 p-4 bg-slateald-900/60 border border-white/10 rounded-xl text-slate-400 text-sm text-center">
                        You have already marked attendance today as <span className="text-white font-bold">{alreadyMarked.status}</span>.
                        You can still submit a new request below.
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-6">Mark Today's Attendance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={() => handleMark('Present')}
                                className="py-8 px-4 bg-emerald-glow/10 border border-emerald-glow/30 rounded-2xl text-emerald-glow hover:bg-emerald-glow/20 transition group">
                                <CalendarCheck size={36} className="mx-auto mb-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-emerald-400 block text-lg">Present</span>
                                <span className="text-xs text-slate-500 mt-1 block">Location required</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={() => handleMark('Absent')}
                                className="py-8 px-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-500 hover:bg-rose-500/20 transition group">
                                <AlertCircle size={36} className="mx-auto mb-3 text-rose-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-rose-400 block text-lg">Absent</span>
                                <span className="text-xs text-slate-500 mt-1 block">Upload parent letter</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={() => handleMark('OD')}
                                className="py-8 px-4 bg-electric-blue/10 border border-electric-blue/30 rounded-2xl text-electric-blue hover:bg-electric-blue/20 transition group">
                                <FileSignature size={36} className="mx-auto mb-3 text-electric-blue group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-blue-400 block text-lg">On Duty (OD)</span>
                                <span className="text-xs text-slate-500 mt-1 block">Requires approval</span>
                            </motion.button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-3 text-white mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                            <span className="font-semibold text-slate-400">Selected Status:</span>
                            <span className={`px-3 py-1 rounded-lg font-bold text-sm ${status === 'Present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    status === 'Absent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                        'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                                }`}>{status}</span>
                        </div>

                        {status === 'Present' && (
                            <div className="space-y-4">
                                <label className="text-slate-300 font-semibold flex items-center space-x-2">
                                    <MapPin size={18} /><span>Campus Geolocation Verification</span>
                                </label>
                                {locationVerified ? (
                                    <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl border border-emerald-500/30 flex items-center space-x-3 font-bold">
                                        <CheckCircle size={20} /><span>Location Authenticated — Inside Campus ✓</span>
                                    </div>
                                ) : (
                                    <button type="button" onClick={verifyLocation} disabled={isLocating}
                                        className="w-full bg-electric-blue/20 border border-electric-blue/40 text-electric-blue p-4 rounded-xl font-bold hover:bg-electric-blue/30 transition flex items-center justify-center space-x-2">
                                        <MapPin size={20} />
                                        <span>{isLocating ? 'Detecting location…' : 'Enable & Verify Location'}</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {status === 'Absent' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold">Reason for Absence <span className="text-rose-400">*</span></label>
                                    <textarea required rows={3}
                                        className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-rose-500/50 transition"
                                        placeholder="Briefly explain your reason..."
                                        value={reason} onChange={e => setReason(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold flex items-center space-x-2">
                                        <Upload size={18} /><span>Parent / Consult Letter (PDF or Image) <span className="text-rose-400">*</span></span>
                                    </label>
                                    <label className="block w-full border-2 border-dashed border-white/10 hover:border-rose-500/40 rounded-xl p-6 text-center cursor-pointer transition-colors group">
                                        <Upload size={24} className="mx-auto mb-2 text-slate-500 group-hover:text-rose-400 transition-colors" />
                                        <p className="text-slate-400 text-sm group-hover:text-slate-300">
                                            {file ? <span className="text-rose-400 font-bold">{file.name}</span> : 'Click to upload your letter'}
                                        </p>
                                        <p className="text-xs text-slate-600 mt-1">PDF, JPG, PNG — Max 5 MB</p>
                                        <input type="file" required accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                                            onChange={e => setFile(e.target.files[0])} />
                                    </label>
                                </div>
                            </>
                        )}

                        {status === 'OD' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-slate-300 font-semibold">Start Date <span className="text-rose-400">*</span></label>
                                        <input type="date" required
                                            className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-electric-blue/50"
                                            value={dates.start} onChange={e => setDates({ ...dates, start: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-slate-300 font-semibold">End Date <span className="text-rose-400">*</span></label>
                                        <input type="date" required
                                            className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-electric-blue/50"
                                            value={dates.end} onChange={e => setDates({ ...dates, end: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold">Reason for OD <span className="text-rose-400">*</span></label>
                                    <textarea required rows={2}
                                        className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-electric-blue/50"
                                        placeholder="Specify the purpose of your OD..."
                                        value={reason} onChange={e => setReason(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold flex items-center space-x-2">
                                        <Upload size={18} /><span>Supporting Document (Optional)</span>
                                    </label>
                                    <label className="block w-full border-2 border-dashed border-white/10 hover:border-electric-blue/40 rounded-xl p-5 text-center cursor-pointer transition-colors group">
                                        <Upload size={22} className="mx-auto mb-2 text-slate-500 group-hover:text-electric-blue transition-colors" />
                                        <p className="text-slate-400 text-sm">
                                            {file ? <span className="text-electric-blue font-bold">{file.name}</span> : 'Click to upload supporting doc'}
                                        </p>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                                            onChange={e => setFile(e.target.files[0])} />
                                    </label>
                                </div>
                            </>
                        )}

                        <div className="flex space-x-4 pt-4 border-t border-white/10">
                            <button type="button" onClick={() => { setStep(1); setFile(null); setReason(''); }}
                                className="px-6 py-3 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition flex-1 font-bold">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSubmitting || (status === 'Present' && !locationVerified)}
                                className="px-6 py-3 bg-gradient-to-r from-electric-blue to-royal-purple rounded-xl text-white font-bold hover:shadow-glow-blue transition flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                                {isSubmitting ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Submitting…</span></>
                                ) : (
                                    <span>Submit Request</span>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Pending OD proof uploads */}
            <AnimatePresence>
                {pendingProofs.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 rounded-[2rem] border border-emerald-500/30 bg-emerald-500/5 shadow-glass-card max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                            <Upload className="text-emerald-400" size={24} />
                            <span>Pending OD Proof Uploads</span>
                        </h3>
                        <p className="text-sm text-slate-400 mb-6 flex items-start">
                            <AlertCircle className="mr-2 text-amber-400 shrink-0 mt-0.5" size={16} />
                            <span>Upload geo-tagged photos and certificates within 2 days of completing your OD or you will be marked Absent.</span>
                        </p>
                        <div className="space-y-4">
                            {pendingProofs.map(record => (
                                <div key={record.id} className="p-5 bg-slate-900/60 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="text-white font-bold">{record.reason || 'OD Request'}</div>
                                        <div className="text-xs text-electric-blue font-semibold mt-1 bg-electric-blue/10 px-2 py-0.5 w-fit rounded">
                                            {record.start} → {record.end || record.date}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        <input type="file" multiple accept="image/*,.pdf"
                                            className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-electric-blue/20 file:text-electric-blue hover:file:bg-electric-blue/30" />
                                        <button onClick={() => {
                                            setAttendance(prev => prev.map(a => a.id === record.id ? { ...a, proofUploaded: true, status: 'OD Completed' } : a));
                                            alert('Proof uploaded! OD Completed ✓');
                                        }} className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform">
                                            Submit Proof
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Attendance;
