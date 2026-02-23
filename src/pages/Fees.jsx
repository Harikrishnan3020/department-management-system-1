import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, IndianRupee, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Fees = () => {
    const { currentUser, fees, setFees, students, setNotifications } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    // Admin States
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleAssignFee = (e) => {
        e.preventDefault();
        if (!selectedStudent || !amount) return;

        const student = students.find(s => s.rollNo === selectedStudent);
        if (!student) return;

        const newFee = {
            id: Date.now(),
            studentId: student.rollNo,
            studentName: student.name,
            amount: amount,
            description: description,
            dueDate: dueDate,
            status: 'Pending',
            assignedBy: currentUser.name,
            assignedAt: new Date().toISOString()
        };

        setFees([newFee, ...fees]);

        // Notify Student
        setNotifications(prev => [{
            id: Date.now(),
            type: 'Fee Assigned',
            message: `New fee structure of ₹${amount} assigned for: ${description}. Due: ${dueDate}`,
            from: currentUser.name
        }, ...prev]);

        setIsAssigning(false);
        setAmount('');
        setDescription('');
        setDueDate('');
        setSelectedStudent('');
        alert('Fee assigned successfully and student notified!');
    };

    const handlePayment = (feeId) => {
        setFees(prev => prev.map(f => {
            if (f.id === feeId) {
                return { ...f, status: 'Paid', paidAt: new Date().toISOString() };
            }
            return f;
        }));

        const paidFee = fees.find(f => f.id === feeId);

        // Notify Admins/Faculty
        setNotifications(prev => [{
            id: Date.now(),
            type: 'Fee Payment',
            message: `${currentUser.name} (${currentUser.id}) has paid ₹${paidFee.amount} for ${paidFee.description}.`,
            from: currentUser.id
        }, ...prev]);

        alert('Payment simulated successfully! Notification sent to Admin/Faculty.');
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

    const myFees = isAuthorized ? fees : fees.filter(f => f.studentId === currentUser.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 text-glow">
                        <CreditCard className="text-rose-500" size={32} />
                        <span>Fee Management Dashboard</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Manage tuition, event, and miscellaneous fees securely.</p>
                </div>
                {isAuthorized && (
                    <button onClick={() => setIsAssigning(true)} className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-shadow flex items-center space-x-2">
                        <Send size={20} />
                        <span>Assign New Fee</span>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isAssigning && isAuthorized && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                        <form onSubmit={handleAssignFee} className="glass-card p-6 rounded-2xl border border-glass-border shadow-glass-card space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center"><IndianRupee size={20} className="mr-2 text-rose-500" />Assign Fee to Student</h2>
                            <div>
                                <label className="text-slate-400 font-bold text-sm block mb-1">Select Student</label>
                                <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white">
                                    <option value="" disabled>-- Choose a Student --</option>
                                    {students.map(s => (
                                        <option key={s.rollNo} value={s.rollNo}>{s.name} ({s.rollNo})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 font-bold text-sm block mb-1">Amount (₹)</label>
                                    <input type="number" required placeholder="e.g. 5000" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white" />
                                </div>
                                <div>
                                    <label className="text-slate-400 font-bold text-sm block mb-1">Due Date</label>
                                    <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="text-slate-400 font-bold text-sm block mb-1">Description / Category</label>
                                <input type="text" required placeholder="e.g. Semester 2 Tuition, Techfest Registration" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-lg text-white" />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setIsAssigning(false)} className="px-5 py-2 border border-white/20 rounded-lg text-slate-300 font-bold hover:bg-white/5">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-rose-500 rounded-lg text-white font-bold hover:shadow-[0_0_15px_rgba(244,63,94,0.5)]">Assign Fee</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myFees.map(fee => (
                    <motion.div key={fee.id} variants={itemVariants} className="glass-card p-6 rounded-2xl border border-glass-border shadow-glass-card flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                        {fee.status === 'Paid' && <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>}
                        <div className="flex items-center space-x-6 w-full md:w-auto">
                            <div className={`p-4 rounded-full ${fee.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-500'}`}>
                                <IndianRupee size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{fee.description}</h3>
                                {isAuthorized && <p className="text-electric-blue font-semibold text-sm mb-1">{fee.studentName} ({fee.studentId})</p>}
                                <p className="text-slate-400 text-sm flex items-center space-x-2">
                                    <Clock size={14} /> <span>Due: {fee.dueDate}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center w-full md:w-auto text-center md:text-right space-y-3">
                            <span className="text-3xl font-black text-white">₹{parseInt(fee.amount).toLocaleString()}</span>

                            {fee.status === 'Paid' ? (
                                <div className="flex items-center space-x-2 text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 w-full justify-center">
                                    <CheckCircle size={18} /> <span>Paid Online</span>
                                </div>
                            ) : (
                                !isAuthorized ? (
                                    <button onClick={() => handlePayment(fee.id)} className="w-full bg-gradient-to-r from-electric-blue to-emerald-glow px-6 py-2 rounded-xl font-bold text-slate-900 border border-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform">
                                        Pay Now
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-2 text-rose-500 font-bold bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20 w-full justify-center">
                                        <AlertCircle size={18} /> <span>Pending</span>
                                    </div>
                                )
                            )}
                        </div>
                    </motion.div>
                ))}

                {myFees.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 glass-card rounded-[2rem] border border-glass-border">
                        <CreditCard size={48} className="mb-4 opacity-50" />
                        <p className="text-xl font-bold">No active fee records found.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Fees;
