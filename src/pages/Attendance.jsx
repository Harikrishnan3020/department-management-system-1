import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, MapPin, Upload, FileSignature, AlertCircle, Download, Edit2, Save, Trash2, FileText } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { LetterBody } from './RequestLetter/index.jsx';

const Attendance = () => {
    const { currentUser, attendance, setAttendance, setNotifications, students, requestLetters, setRequestLetters } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    // Student State
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState(''); // Present, Absent, OD
    const [isLocating, setIsLocating] = useState(false);
    const [locationVerified, setLocationVerified] = useState(false);
    const [reason, setReason] = useState('');
    const [file, setFile] = useState(null);
    const [dates, setDates] = useState({ start: '', end: '' });

    // ODEdit form
    const [odSubject, setOdSubject] = useState('');
    const [odBody, setOdBody] = useState('');
    const [odSignature, setOdSignature] = useState('');
    const [odDate, setOdDate] = useState(new Date().toISOString().split('T')[0]);

    // Admin State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    // Auto-update OD to Absent if 2 days passed without certificate upload
    useEffect(() => {
        let hasChanges = false;
        const updatedAttendance = attendance.map(record => {
            if (record.status && record.status.includes('OD') && !record.certificateUploaded && record.end) {
                const endDate = new Date(record.end);
                endDate.setDate(endDate.getDate() + 2);
                if (new Date() > endDate) {
                    hasChanges = true;
                    return { ...record, status: 'Absent', reason: 'OD Certificate missing (exceeded 2 days)' };
                }
            }
            return record;
        });

        if (hasChanges) {
            setAttendance(updatedAttendance);
        }
    }, [attendance, setAttendance]);

    const getDeadlineString = (endDateStr) => {
        if (!endDateStr) return 'within 2 days';
        const date = new Date(endDateStr);
        date.setDate(date.getDate() + 2);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleMark = (selectedStatus) => {
        setStatus(selectedStatus);
        setStep(2);
    };

    const verifyLocation = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // KGISL Campus Coordinates (Approximate)
                    const kgislLat = 11.0828;
                    const kgislLon = 76.9963;

                    // Haversine formula to calculate distance in meters
                    const R = 6371e3; // Earth's radius in meters
                    const toRad = (value) => (value * Math.PI) / 180;

                    const phi1 = toRad(kgislLat);
                    const phi2 = toRad(latitude);
                    const deltaPhi = toRad(latitude - kgislLat);
                    const deltaLambda = toRad(longitude - kgislLon);

                    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                        Math.cos(phi1) * Math.cos(phi2) *
                        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = R * c;

                    // Use the provided Geoapify API key to get the readable location
                    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=661ddd32693444918bb2f7b436ef9970`)
                        .then(res => res.json())
                        .then(data => {
                            setIsLocating(false);
                            const address = data.features && data.features.length > 0 ? data.features[0].properties.formatted : "Unknown Address";

                            // 1km (1000 meters) threshold
                            if (distance <= 1000) {
                                setLocationVerified(true);
                                alert(`Location Verified!\nYou are inside the 1km campus radius.\nCurrent Location: ${address}`);
                            } else {
                                setLocationVerified(false);
                                alert(`Location Error: You are ${Math.round(distance)} meters away from the campus.\n\nCurrent Location: ${address}\n\nYou must be within 1km to mark attendance.`);
                            }
                        })
                        .catch(err => {
                            console.error('Geocoding error:', err);
                            setIsLocating(false);
                            // Fallback if API fails
                            if (distance <= 1000) {
                                setLocationVerified(true);
                                alert("Location Verified: You are inside the 1km campus radius!");
                            } else {
                                setLocationVerified(false);
                                alert(`Location Error: You are not inside the campus. You are ${Math.round(distance)} meters away.`);
                            }
                        });
                },
                (error) => {
                    setIsLocating(false);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("Please enable location services to mark attendance.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("Location information is unavailable. Please try again.");
                            break;
                        case error.TIMEOUT:
                            alert("The request to get user location timed out. Please try again.");
                            break;
                        default:
                            alert("An unknown error occurred while checking location.");
                            break;
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setIsLocating(false);
            alert("Geolocation is not supported by your browser");
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();

    let currentSession = '';
    if (currentHour >= 8 && currentHour < 12) currentSession = 'Morning';
    else if (currentHour >= 12) currentSession = 'Afternoon';

    const myTodayRecords = attendance.filter(a => a.studentId === currentUser?.id && a.date === todayStr);
    const hasMorning = myTodayRecords.some(a => a.session === 'Morning');
    const hasAfternoon = myTodayRecords.some(a => a.session === 'Afternoon');

    let canMark = true;
    let sessionMessage = '';

    if (currentHour < 8) {
        canMark = false;
        sessionMessage = 'Morning session attendance will open at 8:00 AM.';
    } else if (currentHour >= 9 && currentHour < 12) {
        canMark = false;
        sessionMessage = 'Morning time slot (8 AM to 9 AM) has closed. You have been automatically marked absent for the morning if unmarked. Next session opens at 12:00 PM.';
        // Automatically mark auto-absent if not already marked for morning? We can dynamically assume absent if unmarked for morning.
    } else if (currentHour === 12 && hasMorning && !hasAfternoon) {
        canMark = true;
    } else if (currentHour >= 13) {
        canMark = false;
        sessionMessage = 'Afternoon time slot (12 PM to 1 PM) has closed. You have been automatically marked absent for the afternoon if unmarked. Have a great day!';
    } else if (currentSession === 'Morning' && hasMorning) {
        canMark = false;
        sessionMessage = 'Morning attendance already marked. Next session opens at 12:00 PM.';
    } else if (currentSession === 'Afternoon' && hasAfternoon) {
        canMark = false;
        sessionMessage = 'Afternoon attendance already marked. Have a great day!';
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (status === 'Present') {
            if (!locationVerified) {
                alert("You are not inside the college!");
                return;
            }
            const record = { id: Date.now(), studentId: currentUser.id, name: currentUser.name, date: todayStr, session: currentSession, status: 'Present' };
            setAttendance(prev => [record, ...prev]);
            alert(`Attendance marked as Present for ${currentSession} Session.`);
            setStep(1);
            setLocationVerified(false);
        } else if (status === 'Absent') {
            const record = { id: Date.now(), studentId: currentUser.id, name: currentUser.name, date: todayStr, session: currentSession, status: 'Absent', reason, file: file?.name };
            setAttendance(prev => [record, ...prev]);
            setNotifications(prev => [{ type: 'Absent Alert', from: currentUser.id, message: `${currentUser.name} is absent (${currentSession}). Reason: ${reason} (Letter uploaded)` }, ...prev]);
            alert(`Absent request submitted for ${currentSession} Session.`);
            setStep(1);
        } else if (status === 'OD') {
            if (!odSubject.trim() || !odBody.trim() || !odSignature.trim()) {
                alert('Please fill in the subject, body, and signature for the OD Request Letter.');
                return;
            }

            const newRequest = {
                id: Date.now() + Math.random(),
                studentId: currentUser.id,
                studentName: currentUser.name,
                subject: odSubject.trim(),
                body: odBody.trim(),
                date: odDate,
                signature: odSignature.trim(),
                status: 'Pending',
                submittedAt: new Date().toISOString(),
            };

            if (setRequestLetters) {
                setRequestLetters(prev => [newRequest, ...prev]);
            }

            const record = {
                id: Date.now(),
                studentId: currentUser.id,
                name: currentUser.name,
                date: todayStr,
                session: currentSession,
                status: 'OD Pending',
                reason: newRequest.subject,
                start: dates.start,
                end: dates.end,
                requestLetterId: newRequest.id,
                certificateUploaded: false
            };
            setAttendance(prev => [record, ...prev]);
            setNotifications(prev => [{ type: 'OD Request', from: currentUser.id, message: `${currentUser.name} requests OD from ${dates.start} to ${dates.end}. Subject: ${record.reason}` }, ...prev]);
            alert('OD request submitted along with the Request Letter! Upload certificate within 2 days after OD to avoid being marked Absent.');

            setOdSubject('');
            setOdBody('');
            setOdSignature('');
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

    const handleAdminMark = (studentId, session, newStatus) => {
        const student = students.find(s => s.rollNo === studentId);
        const existingRecord = attendance.find(a => a.studentId === studentId && a.date === selectedDate && (!a.session || a.session === session));

        if (existingRecord) {
            setAttendance(attendance.map(a => a.id === existingRecord.id ? { ...a, status: newStatus, session } : a));
        } else {
            setAttendance([{
                id: Date.now() + Math.random(),
                studentId,
                name: student.name,
                date: selectedDate,
                session,
                status: newStatus
            }, ...attendance]);
        }
    };

    // Calculate dynamic state for each student on admin side
    const getStudentActualStatus = (record, session) => {
        if (record && record.status) return record.status;

        let targetHours = session === 'Morning' ? 9 : 13;
        // If we are past the hour and no record, they are absent
        const todayStr = new Date().toISOString().split('T')[0];
        if (selectedDate < todayStr || (selectedDate === todayStr && new Date().getHours() >= targetHours)) {
            return 'Absent (Auto)';
        }
        return 'Unmarked';
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
                                    <th className="py-4 px-6 font-semibold w-1/3">Morning Slot (8-9 AM)</th>
                                    <th className="py-4 px-6 font-semibold w-1/3">Afternoon Slot (12-1 PM)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => {
                                    // Separate by sessions for better tracking
                                    const morningRecord = attendance.find(a => a.studentId === student.rollNo && a.date === selectedDate && (!a.session || a.session === 'Morning'));
                                    const afternoonRecord = attendance.find(a => a.studentId === student.rollNo && a.date === selectedDate && a.session === 'Afternoon');

                                    const morningStatus = getStudentActualStatus(morningRecord, 'Morning');
                                    const afternoonStatus = getStudentActualStatus(afternoonRecord, 'Afternoon');

                                    const renderStatusBadge = (status, record) => {
                                        let textCls = 'text-slate-500';
                                        if (status.includes('Present')) textCls = 'text-emerald-500';
                                        if (status.includes('Absent') || status.includes('Auto')) textCls = 'text-rose-500';
                                        if (status.includes('OD')) textCls = 'text-electric-blue';

                                        return (
                                            <div className="flex flex-col items-start">
                                                <span className={`font-bold ${textCls}`}>{status}</span>
                                                {record?.certificateUploaded && (
                                                    <button onClick={() => alert(`Certificate successfully verified to be uploaded for ${record.name}`)} className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-full w-fit mt-1 transition-colors cursor-pointer text-left">
                                                        View Proof Uploaded
                                                    </button>
                                                )}
                                                {record?.file && (
                                                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full w-fit mt-1">
                                                        File: {record.file}
                                                    </span>
                                                )}
                                                {record?.reason && status.includes('Absent') && (
                                                    <span className="text-[10px] text-slate-500 mt-1 max-w-[150px] truncate" title={record.reason}>{record.reason}</span>
                                                )}
                                            </div>
                                        )
                                    }

                                    return (
                                        <tr key={student.rollNo} className="border-b border-white/5 hover:bg-white/[0.04]">
                                            <td className="py-4 px-6 text-slate-400 font-bold">{student.rollNo}</td>
                                            <td className="py-4 px-6 font-bold text-white tracking-wide">{student.name}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-2">
                                                    {renderStatusBadge(morningStatus, morningRecord)}
                                                    <div className="flex space-x-1 mt-1">
                                                        <button onClick={() => handleAdminMark(student.rollNo, 'Morning', 'Present')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all border bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 border-transparent`}>P</button>
                                                        <button onClick={() => handleAdminMark(student.rollNo, 'Morning', 'Absent')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all border bg-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 border-transparent`}>A</button>
                                                        <button onClick={() => handleAdminMark(student.rollNo, 'Morning', 'OD Approved')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all border bg-slate-800 text-slate-400 hover:bg-electric-blue/10 hover:text-electric-blue border-transparent`}>OD</button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-2">
                                                    {renderStatusBadge(afternoonStatus, afternoonRecord)}
                                                    <div className="flex space-x-1 mt-1">
                                                        <button onClick={() => handleAdminMark(student.rollNo, 'Afternoon', 'Present')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all border bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 border-transparent`}>P</button>
                                                        <button onClick={() => handleAdminMark(student.rollNo, 'Afternoon', 'Absent')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all border bg-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 border-transparent`}>A</button>
                                                        <button onClick={() => handleAdminMark(student.rollNo, 'Afternoon', 'OD Approved')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all border bg-slate-800 text-slate-400 hover:bg-electric-blue/10 hover:text-electric-blue border-transparent`}>OD</button>
                                                    </div>
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
                        {!canMark && (
                            <div className="bg-slate-800/60 border border-white/10 rounded-xl p-8 mb-6">
                                <AlertCircle size={48} className="mx-auto text-electric-blue mb-4 opacity-80" />
                                <h3 className="text-xl font-bold text-white mb-2">{sessionMessage}</h3>
                                <p className="text-slate-400">Current Time: {new Date().toLocaleTimeString('en-IN')}</p>
                            </div>
                        )}

                        {canMark && (
                            <div className="mb-4">
                                <span className="text-sm font-bold text-electric-blue uppercase tracking-widest bg-electric-blue/10 border border-electric-blue/20 rounded-full inline-flex items-center px-4 py-1.5 shadow-glow-blue">
                                    {currentSession} Session
                                </span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {canMark ? (
                                <>
                                    <button onClick={() => handleMark('Present')} className="py-6 px-4 bg-emerald-glow/10 border border-emerald-glow/30 rounded-xl text-emerald-glow hover:bg-emerald-glow/20 transition group">
                                        <CalendarCheck size={32} className="mx-auto mb-2 text-emerald-glow group-hover:scale-110 transition-transform" />
                                        <span className="font-bold text-emerald-400">Present</span>
                                    </button>
                                    <button onClick={() => handleMark('Absent')} className="py-6 px-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 hover:bg-rose-500/20 transition group">
                                        <AlertCircle size={32} className="mx-auto mb-2 text-rose-500 group-hover:scale-110 transition-transform" />
                                        <span className="font-bold text-rose-400">Absent</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button disabled className="py-6 px-4 bg-slate-800/30 border border-emerald-500/10 rounded-xl text-emerald-500/30 cursor-not-allowed group">
                                        <CalendarCheck size={32} className="mx-auto mb-2 text-emerald-500/30" />
                                        <span className="font-bold text-emerald-500/30">Present</span>
                                    </button>
                                    <button disabled className="py-6 px-4 bg-slate-800/30 border border-rose-500/10 rounded-xl text-rose-500/30 cursor-not-allowed group">
                                        <AlertCircle size={32} className="mx-auto mb-2 text-rose-500/30" />
                                        <span className="font-bold text-rose-500/30">Absent</span>
                                    </button>
                                </>
                            )}

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
                                <div className="grid grid-cols-2 gap-4 mb-4">
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
                                    <label className="text-slate-300 font-semibold flex items-center space-x-2 mb-2"><FileText size={18} /><span>Student Request Letter</span></label>
                                    <div className="bg-white rounded overflow-hidden">
                                        <LetterBody
                                            editMode={{ studentName: currentUser.name, studentId: currentUser.id }}
                                            body={odBody}
                                            setBody={setOdBody}
                                            subject={odSubject}
                                            setSubject={setOdSubject}
                                            date={odDate}
                                            setDate={setOdDate}
                                            signature={odSignature}
                                            setSignature={setOdSignature}
                                        />
                                    </div>
                                    <p className="text-slate-500 text-xs mt-2 text-center font-bold">This written letter will be attached to your OD request.</p>
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

            {/* My OD Requests section */}
            {currentUser?.role === 'Student' && (
                <div className="glass-card mt-8 p-8 rounded-[2rem] border border-glass-border shadow-glass-card max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">My Recent ODs & Certificates</h2>
                    <div className="space-y-4">
                        {attendance.filter(a => a.studentId === currentUser.id && a.status?.includes('OD')).map(record => (
                            <div key={record.id} className="bg-slate-900/60 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-300">
                                <div className="flex-1">
                                    <p className="font-bold text-white text-lg">{record.reason || 'OD Request'}</p>
                                    <p className="text-sm">Dates: <span className="text-electric-blue font-bold">{record.start}</span> to <span className="text-electric-blue font-bold">{record.end}</span></p>
                                    <p className="text-sm mt-1">Status: <span className={`font-bold ${record.status === 'OD Approved' ? 'text-emerald-400' : 'text-amber-400'}`}>{record.status}</span></p>
                                </div>
                                <div>
                                    {record.certificateUploaded ? (
                                        <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold flex items-center gap-2 text-sm">
                                            <CalendarCheck size={18} /> Uploaded
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <input type="file" id={`cert-${record.id}`} className="hidden" onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    alert("Certificate uploaded successfully!");
                                                    setAttendance(prev => prev.map(a => a.id === record.id ? { ...a, certificateUploaded: true } : a));
                                                }
                                            }} />
                                            <label htmlFor={`cert-${record.id}`} className="cursor-pointer px-4 py-2 bg-electric-blue text-white rounded-lg font-bold hover:shadow-glow-blue transition whitespace-nowrap text-sm">
                                                Upload Certificate & Photo
                                            </label>
                                            <p className="text-xs text-rose-400 font-semibold max-w-[150px] text-center">Deadline: {getDeadlineString(record.end)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {attendance.filter(a => a.studentId === currentUser.id && a.status?.includes('OD')).length === 0 && (
                            <p className="text-center text-slate-500 py-4">No OD records found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
