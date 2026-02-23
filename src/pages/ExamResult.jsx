import React, { useState, useContext } from 'react';
import { FileText, Upload, RefreshCw, Send, CheckCircle, Search, AlertCircle, SearchCheck } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const ExamResult = () => {
    const { currentUser, examResults, setExamResults, students, setNotifications } = useContext(AppContext);
    const [file, setFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) return;

        // Mock reading file and giving random mock marks for all students
        const mockMarks = students.map(s => {
            const gradePoints = [10, 9, 8, 7, 0];
            const coursesMarks = [
                { course: 'CS101', credits: 4, mark: Math.floor(Math.random() * 40) + 60 },
                { course: 'CS102', credits: 4, mark: Math.floor(Math.random() * 40) + 60 },
            ];
            return {
                studentId: s.rollNo,
                studentName: s.name,
                term: 'Semester 1',
                results: coursesMarks,
                published: true,
                requests: []
            };
        });

        // Replace or append
        setExamResults(prev => [...prev.filter(r => r.term !== 'Semester 1'), ...mockMarks]);
        alert(`File ${file.name} uploaded and results sent to students successfully!`);
        setFile(null);
    };

    const handleRequestPaper = (studentId, course) => {
        setExamResults(prev => prev.map(r => {
            if (r.studentId === studentId) {
                return { ...r, requests: [...(r.requests || []), course] };
            }
            return r;
        }));
        setNotifications(prev => [...prev, {
            type: 'Paper Request',
            message: `Student ${currentUser.name} requested paper review for ${course}`
        }]);
        alert(`Request to view paper for ${course} sent to Admin & Faculty.`);
    };

    const calculateCGPA = (results) => {
        if (!results || results.length === 0) return 0;
        let totalCredits = 0;
        let totalPoints = 0;
        results.forEach(r => {
            let gp = Math.floor(r.mark / 10);
            if (r.mark < 50) gp = 0;
            totalPoints += gp * r.credits;
            totalCredits += r.credits;
        });
        return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
    };

    if (isAuthorized) {
        // Admin / Faculty View
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3 text-glow">
                            <FileText className="text-emerald-glow" size={32} />
                            <span>Exam Results Management</span>
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="glass-card p-6 rounded-[2rem] border border-glass-border shadow-glass-card">
                        <h2 className="text-xl font-bold text-white mb-4">Upload Results</h2>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="border-2 border-dashed border-white/20 p-8 rounded-xl text-center hover:bg-white/5 transition-colors cursor-pointer group">
                                <Upload size={48} className="mx-auto text-slate-500 group-hover:text-emerald-glow mb-4 transition-colors" />
                                <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="cursor-pointer font-bold text-slate-300">
                                    {file ? file.name : 'Click to select Excel/CSV file'}
                                </label>
                            </div>
                            <button type="submit" disabled={!file} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 ${file ? 'bg-emerald-glow text-slate-900 shadow-glow-emerald hover:scale-[1.02]' : 'bg-slate-800 text-slate-500'}`}>
                                <Send size={18} />
                                <span>Publish Results</span>
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 glass-card p-6 rounded-[2rem] border border-glass-border shadow-glass-card">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Student Result Dashboard</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="text" placeholder="Search roll no..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-slate-900/60 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white text-sm" />
                            </div>
                        </div>

                        <div className="space-y-4 overflow-y-auto max-h-[400px]">
                            {examResults.filter(r => r.studentId.toLowerCase().includes(searchTerm.toLowerCase())).map((res, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white font-bold">{res.studentId} - {res.studentName}</h3>
                                        <p className="text-sm text-slate-400">Term: {res.term} | CGPA: <span className="text-emerald-glow font-black">{calculateCGPA(res.results)}</span></p>
                                        {(res.requests || []).length > 0 && (
                                            <div className="mt-2 text-rose-400 text-xs font-bold border border-rose-500/30 bg-rose-500/10 inline-block px-2 py-1 rounded">
                                                Requested Paper View: {res.requests.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <button className="px-4 py-2 bg-electric-blue/20 text-electric-blue rounded border border-electric-blue/30 text-sm font-bold">Manage</button>
                                </div>
                            ))}
                            {examResults.length === 0 && <p className="text-slate-500 text-center py-8">No results uploaded yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Student View
    const myResults = examResults.filter(r => r.studentId === currentUser.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3 text-glow">
                        <FileText className="text-royal-purple" size={32} />
                        <span>My Exam Results</span>
                    </h1>
                </div>
            </div>

            {myResults.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-[2rem] border border-glass-border">
                    <AlertCircle size={48} className="mx-auto text-slate-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Results Found</h2>
                    <p className="text-slate-400">Your exam results have not been published yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {myResults.map((res, i) => {
                        const cgpa = calculateCGPA(res.results);
                        return (
                            <div key={i} className="glass-card p-6 rounded-[2rem] border border-glass-border relative overflow-hidden group shadow-glass-card hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-royal-purple/20 to-transparent rounded-full blur-3xl -z-10 group-hover:opacity-100 opacity-50 transition-opacity"></div>

                                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{res.term}</h2>
                                        <p className="text-slate-400 font-medium">Published on: {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-center bg-slate-900/80 px-4 py-2 rounded-xl border border-white/10 shadow-glow-purple">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current CGPA</p>
                                        <p className="text-3xl font-black text-white text-glow">{cgpa}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {res.results.map((course, j) => {
                                        const alreadyRequested = (res.requests || []).includes(course.course);
                                        return (
                                            <div key={j} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                                <div className="flex-1 w-full sm:mb-0 mb-3">
                                                    <p className="font-bold text-white">{course.course}</p>
                                                    <p className="text-sm text-slate-400">Credits: {course.credits}</p>
                                                </div>
                                                <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-emerald-400">{course.mark}</p>
                                                        <p className="text-xs text-slate-500 uppercase">Marks</p>
                                                    </div>
                                                    <button
                                                        disabled={alreadyRequested}
                                                        onClick={() => handleRequestPaper(res.studentId, course.course)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 ${alreadyRequested ? 'bg-slate-800 text-slate-500' : 'bg-transparent border border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10'} transition-colors`}
                                                    >
                                                        {alreadyRequested ? <CheckCircle size={14} /> : <SearchCheck size={14} />}
                                                        <span>{alreadyRequested ? 'Requested' : 'Request View'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-500 text-center">
                                    * CGPA is calculated accurately according to autonomous academic guidelines.
                                    <br />
                                    Issues? Please report to Faculty through the request button.
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExamResult;
