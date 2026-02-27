import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, IndianRupee, Send, CheckCircle, Clock, AlertCircle, Upload, X } from 'lucide-react';
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

    const [payingFeeId, setPayingFeeId] = useState(null);
    const [paymentProofFile, setPaymentProofFile] = useState(null);

    const initiatePayment = (feeId) => {
        setPayingFeeId(feeId);
        setPaymentProofFile(null);
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        if (!paymentProofFile || !payingFeeId) return;

        const paidFee = fees.find(f => f.id === payingFeeId);

        setFees(prev => prev.map(f => {
            if (f.id === payingFeeId) {
                return { ...f, status: 'Paid', paidAt: new Date().toISOString(), proofFile: paymentProofFile.name };
            }
            return f;
        }));

        // Delete the original assignment notification for this student automatically
        setNotifications(prev => prev.filter(n => !(n.type === 'Fee Assigned' && n.message.includes(paidFee.description))));

        // Notify Admins/Faculty
        setNotifications(prev => [{
            id: Date.now(),
            type: 'Fee Payment',
            message: `${currentUser.name} (${currentUser.id}) has paid ₹${paidFee.amount} for ${paidFee.description} and uploaded proof.`,
            from: currentUser.id
        }, ...prev]);

        alert('Payment proof uploaded successfully! Notification sent to Admin/Faculty.');
        setPayingFeeId(null);
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
                                    <button onClick={() => initiatePayment(fee.id)} className="w-full bg-gradient-to-r from-electric-blue to-emerald-glow px-6 py-2 rounded-xl font-bold text-slate-900 border border-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform">
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

            {/* Payment Proof Upload Modal */}
            <AnimatePresence>
                {payingFeeId && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-md w-full shadow-glass-card relative"
                        >
                            <button onClick={() => setPayingFeeId(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                                <X size={22} />
                            </button>
                            <h2 className="text-2xl font-black text-white mb-2 flex items-center">
                                <IndianRupee size={24} className="mr-2 text-emerald-glow" /> Complete Payment
                            </h2>
                            {(() => {
                                const feeDetails = fees.find(f => f.id === payingFeeId);
                                return (
                                    <>
                                        <div className="bg-emerald-glow/10 p-4 rounded-xl border border-emerald-glow/20 mb-6 mt-4">
                                            <p className="text-slate-300 text-sm mb-2 text-center">Please transfer exactly:</p>
                                            <p className="text-4xl font-black text-emerald-glow text-center mb-2">₹{feeDetails?.amount}</p>
                                            <p className="text-sm font-semibold text-white mt-4 text-center">Transfer via GPay / UPI using</p>
                                            <p className="text-xl font-bold text-electric-blue text-center mb-1 bg-slate-950/50 py-2 rounded-lg mt-2 font-mono tracking-widest border border-white/5">7867011399</p>
                                        </div>

                                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                                            <div>
                                                <label className="text-slate-400 font-bold text-sm block mb-2">Upload Payment Proof (Screenshot)</label>
                                                <input
                                                    type="file"
                                                    required
                                                    accept="image/*,.pdf"
                                                    onChange={e => setPaymentProofFile(e.target.files[0])}
                                                    className="w-full text-sm text-slate-300 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-electric-blue/20 file:text-electric-blue hover:file:bg-electric-blue/30 bg-slate-800 rounded-xl border border-white/10"
                                                />
                                            </div>
                                            <div className="pt-4 border-t border-white/10 mt-6">
                                                <button type="submit" className="w-full bg-emerald-glow text-slate-900 px-6 py-4 rounded-xl font-black hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-shadow flex items-center justify-center space-x-2">
                                                    <Upload size={20} />
                                                    <span>Submit Proof</span>
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Fees;
