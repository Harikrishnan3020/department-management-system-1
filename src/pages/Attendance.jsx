import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, MapPin, Upload, FileSignature, AlertCircle, Download, Edit2, Save, Trash2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Attendance = () => {
    const { currentUser, attendance, setAttendance, setNotifications, students } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    // Student State
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState(''); // Present, Absent, OD
    const [isLocating, setIsLocating] = useState(false);
    const [locationVerified, setLocationVerified] = useState(false);
    const [reason, setReason] = useState('');
    const [file, setFile] = useState(null);
    const [dates, setDates] = useState({ start: '', end: '' });

    // Admin State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!currentUser || isAuthorized) return;
        const today = new Date();
        let changed = false;
        const newAttendance = attendance.map(a => {
            if (a.studentId === currentUser.id && a.status === 'OD Approved' && !a.proofUploaded) {
                const endDate = new Date(a.end || a.date);
                const diffTime = today - endDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                // Only mark absent if 2 days have PASSED since end date.
                if (diffDays > 2) {
                    changed = true;
                    return { ...a, status: 'Absent', reason: 'Failed to upload OD proof within 2 days' };
                }
            }
            return a;
        });
        if (changed) setAttendance(newAttendance);
    }, [attendance, currentUser, isAuthorized, setAttendance]);

    const pendingProofs = attendance.filter(a => a.studentId === currentUser?.id && a.status === 'OD Approved' && !a.proofUploaded);

    const handleMark = (selectedStatus) => {
        setStatus(selectedStatus);
        setStep(2);
    };

    const verifyLocation = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setTimeout(() => {
                        setIsLocating(false);
                        // Mocking KGiSL location check
                        // For demo purposes, any location is accepted as "inside college" since real coords differ.
                        // We will simulate success
                        setLocationVerified(true);
                        alert("Location Verified: You are inside the college!");
                    }, 1000);
                },
                (error) => {
                    setIsLocating(false);
                    alert("Please enable location services to mark attendance.");
                }
            );
        } else {
            setIsLocating(false);
            alert("Geolocation is not supported by your browser");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (status === 'Present') {
            if (!locationVerified) {
                alert("You are not inside the college!");
                return;
            }
            const record = { id: Date.now(), studentId: currentUser.id, name: currentUser.name, date: new Date().toISOString().split('T')[0], status: 'Present' };
            setAttendance(prev => [record, ...prev]);
            alert('Attendance marked as Present');
            setStep(1);
            setLocationVerified(false);
        } else if (status === 'Absent') {
            const record = { id: Date.now(), studentId: currentUser.id, name: currentUser.name, date: new Date().toISOString().split('T')[0], status: 'Absent', reason, file: file?.name };
            setAttendance(prev => [record, ...prev]);
            setNotifications(prev => [{ type: 'Absent Alert', from: currentUser.id, message: `${currentUser.name} is absent. Reason: ${reason} (Letter uploaded)` }, ...prev]);
            alert('Absent request submitted with letter');
            setStep(1);
        } else if (status === 'OD') {
            const record = { id: Date.now(), studentId: currentUser.id, name: currentUser.name, date: new Date().toISOString().split('T')[0], status: 'OD Pending', reason, start: dates.start, end: dates.end };
            setAttendance(prev => [record, ...prev]);
            setNotifications(prev => [{ type: 'OD Request', from: currentUser.id, message: `${currentUser.name} requests OD from ${dates.start} to ${dates.end}. Reason: ${reason}` }, ...prev]);
            alert('OD request submitted for approval. Remember to upload photos/certificates within 2 days after OD.');
            setStep(1);
        }
    };

    const handleDownload = () => {
        const headers = ['Record ID', 'Student ID', 'Name', 'Date', 'Status', 'Reason', 'File Attached'];
        const rows = attendance.map(a => [
            a.id, a.studentId, a.name, a.date, a.status, a.reason || 'N/A', a.file || 'N/A'
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "student_attendance.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAdminMark = (studentId, newStatus) => {
        const student = students.find(s => s.rollNo === studentId);
        const existingRecord = attendance.find(a => a.studentId === studentId && a.date === selectedDate);

        if (existingRecord) {
            setAttendance(attendance.map(a => a.id === existingRecord.id ? { ...a, status: newStatus } : a));
        } else {
            setAttendance([{
                id: Date.now() + Math.random(),
                studentId,
                name: student.name,
                date: selectedDate,
                status: newStatus
            }, ...attendance]);
        }
    };

    if (isAuthorized) {

        const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()));

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
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="bg-slate-800/80 p-3 rounded-xl text-white border border-white/10 font-bold focus:border-electric-blue outline-none" />
                        <button onClick={handleDownload} className="flex items-center space-x-2 px-6 py-3 bg-emerald-glow/20 text-emerald-glow font-bold rounded-xl border border-emerald-glow/30 hover:bg-emerald-glow/30 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <Download size={18} /><span>Export</span>
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex">
                    <input type="text" placeholder="Search student by name or Roll No..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full max-w-md bg-slate-900/60 p-3 rounded-xl border border-white/10 text-white focus:outline-none focus:border-electric-blue/50" />
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
                                {filteredStudents.map((student) => {
                                    const record = attendance.find(a => a.studentId === student.rollNo && a.date === selectedDate);
                                    const currentStatus = record ? record.status : 'Unmarked';

                                    return (
                                        <tr key={student.rollNo} className="border-b border-white/5 hover:bg-white/[0.04]">
                                            <td className="py-4 px-6 text-slate-400 font-bold">{student.rollNo}</td>
                                            <td className="py-4 px-6 font-bold text-white tracking-wide">{student.name}</td>
                                            <td className="py-4 px-6 font-bold">
                                                <span className={`${currentStatus === 'Present' ? 'text-emerald-500' : currentStatus === 'Absent' ? 'text-rose-500' : currentStatus.includes('OD') ? 'text-electric-blue' : 'text-slate-500'}`}>
                                                    {currentStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleAdminMark(student.rollNo, 'Present')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${currentStatus === 'Present' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 border-transparent'}`}>Present</button>
                                                    <button onClick={() => handleAdminMark(student.rollNo, 'Absent')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${currentStatus === 'Absent' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 border-transparent'}`}>Absent</button>
                                                    <button onClick={() => handleAdminMark(student.rollNo, 'OD Approved')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${currentStatus.includes('OD') ? 'bg-electric-blue/20 text-electric-blue border-electric-blue/40' : 'bg-slate-800 text-slate-400 hover:bg-electric-blue/10 hover:text-electric-blue border-transparent'}`}>OD</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredStudents.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-6 text-slate-500">No students found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // Student View
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <CalendarCheck className="text-electric-blue" size={32} />
                        <span>Daily Attendance</span>
                    </h1>
                </div>
            </div>

            <div className="glass-card p-8 rounded-[2rem] border border-glass-border shadow-glass-card max-w-2xl mx-auto">
                {step === 1 && (
                    <div className="space-y-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-6">Mark Today's Attendance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button onClick={() => handleMark('Present')} className="py-6 px-4 bg-emerald-glow/10 border border-emerald-glow/30 rounded-xl text-emerald-glow hover:bg-emerald-glow/20 transition group">
                                <CalendarCheck size={32} className="mx-auto mb-2 text-emerald-glow group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-emerald-400">Present</span>
                            </button>
                            <button onClick={() => handleMark('Absent')} className="py-6 px-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 hover:bg-rose-500/20 transition group">
                                <AlertCircle size={32} className="mx-auto mb-2 text-rose-500 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-rose-400">Absent</span>
                            </button>
                            <button onClick={() => handleMark('OD')} className="py-6 px-4 bg-electric-blue/10 border border-electric-blue/30 rounded-xl text-electric-blue hover:bg-electric-blue/20 transition group">
                                <FileSignature size={32} className="mx-auto mb-2 text-electric-blue group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-blue-400">On Duty (OD)</span>
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-2 text-white mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                            <span className="font-bold">Selected Status:</span>
                            <span className={`px-3 py-1 rounded w-fit font-bold text-sm ${status === 'Present' ? 'bg-emerald-500 text-white' :
                                status === 'Absent' ? 'bg-rose-500 text-white' : 'bg-electric-blue text-white'
                                }`}>{status}</span>
                        </div>

                        {status === 'Present' && (
                            <div className="space-y-4">
                                <label className="text-slate-300 font-semibold flex items-center space-x-2"><MapPin size={18} /> <span>Campus Geolocation</span></label>
                                {locationVerified ? (
                                    <div className="bg-emerald-500/20 text-emerald-400 p-4 rounded-lg border border-emerald-500/30 flex items-center space-x-2 font-bold">
                                        <MapPin size={20} /><span>✓ Location Authenticated Inside Campus</span>
                                    </div>
                                ) : (
                                    <button type="button" onClick={verifyLocation} disabled={isLocating} className="w-full bg-electric-blue/20 border border-electric-blue/50 text-electric-blue p-4 rounded-lg font-bold hover:bg-electric-blue/30 transition flex items-center justify-center space-x-2">
                                        <MapPin size={20} />
                                        <span>{isLocating ? 'Locating...' : 'Enable & Verify Location'}</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {status === 'Absent' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold">Reason for Absence</label>
                                    <textarea required rows={3} className="w-full bg-slate-900 border border-white/10 p-3 rounded-lg text-white" value={reason} onChange={e => setReason(e.target.value)}></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold flex items-center space-x-2"><Upload size={18} /> <span>Parent Consult Letter (PDF/IMG)</span></label>
                                    <input type="file" required className="w-full bg-slate-900 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-electric-blue file:text-white hover:file:bg-electric-blue/80" onChange={e => setFile(e.target.files[0])} />
                                </div>
                            </>
                        )}

                        {status === 'OD' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-slate-300 font-semibold">Start Date</label>
                                        <input type="date" required className="w-full bg-slate-900 border border-white/10 p-3 rounded-lg text-white" value={dates.start} onChange={e => setDates({ ...dates, start: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-slate-300 font-semibold">End Date</label>
                                        <input type="date" required className="w-full bg-slate-900 border border-white/10 p-3 rounded-lg text-white" value={dates.end} onChange={e => setDates({ ...dates, end: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold">Reason for OD</label>
                                    <textarea required rows={2} className="w-full bg-slate-900 border border-white/10 p-3 rounded-lg text-white" value={reason} onChange={e => setReason(e.target.value)}></textarea>
                                </div>
                            </>
                        )}

                        <div className="flex space-x-4 pt-4 border-t border-white/10">
                            <button type="button" onClick={() => setStep(1)} className="px-6 py-3 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition flex-1 font-bold">Cancel</button>
                            <button type="submit" className="px-6 py-3 bg-electric-blue rounded-xl text-white font-bold hover:shadow-glow-blue transition flex-1" disabled={status === 'Present' && !locationVerified}>
                                Submit
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {pendingProofs.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mt-8 rounded-[2rem] border border-emerald-500/30 bg-emerald-500/5 shadow-glass-card max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <Upload className="text-emerald-400" size={24} />
                        <span>Pending OD Proofs</span>
                    </h3>
                    <p className="text-sm text-slate-300 mb-6 flex items-start">
                        <AlertCircle className="mr-2 text-emerald-400 shrink-0 mt-0.5" size={16} />
                        <span>You have approved ODs that require geo-tagged photos and certificates. If not uploaded within 2 days of completing your OD, you will be automatically marked Absent.</span>
                    </p>
                    <div className="space-y-4">
                        {pendingProofs.map(record => (
                            <div key={record.id} className="p-5 bg-slate-900/60 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:bg-white/5">
                                <div>
                                    <div className="text-white font-bold">{record.reason || 'OD Request'}</div>
                                    <div className="text-xs text-electric-blue font-semibold mt-1 bg-electric-blue/10 px-2 py-0.5 w-fit rounded">{record.start} to {record.end || record.date}</div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <input type="file" multiple accept="image/*,.pdf" className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-electric-blue/20 file:text-electric-blue hover:file:bg-electric-blue/30 w-full sm:w-auto" />
                                    <button onClick={() => {
                                        setAttendance(prev => prev.map(a => a.id === record.id ? { ...a, proofUploaded: true, status: 'OD Completed' } : a));
                                        alert('Proof uploaded successfully! OD Completed.');
                                    }} className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white rounded-xl text-sm font-bold border border-emerald-500/30 hover:scale-105 transition-transform">Submit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Attendance;
