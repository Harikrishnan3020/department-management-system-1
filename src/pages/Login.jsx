import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Github, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [role, setRole] = useState('Admin');
    const [error, setError] = useState('');
    const { login, students } = useContext(AppContext);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        const { username, password } = formData;

        let valid = false;
        let userId = '';
        let userName = '';

        if (role === 'Admin') {
            if (username === 'admin1' && password === 'admin1') {
                valid = true;
                userId = 'admin1';
                userName = 'System Admin';
            }
        } else if (role === 'Faculty') {
            if (username === 'faculty1' && password === 'faculty1') {
                valid = true;
                userId = 'faculty1';
                userName = 'Faculty Member';
            }
        } else if (role === 'Student') {
            const student = students.find(s => s.rollNo.toLowerCase() === username.toLowerCase());
            if (student && password.toLowerCase() === username.toLowerCase()) {
                valid = true;
                userId = student.rollNo;
                userName = student.name;
            }
        }

        if (valid) {
            login(role, userId, userName);
            // Simulate brief delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 600);
        } else {
            setError('Invalid credentials');
        }
    };

    const roles = ['Admin', 'Faculty', 'Student'];

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6">

            {/* Decorative floating elements */}
            <motion.div
                animate={{ y: [-20, 20, -20], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-20 left-20 w-32 h-32 rounded-3xl bg-gradient-to-tr from-electric-blue/30 to-royal-purple/30 blur-2xl border border-white/10 glass-card"
            />

            <motion.div
                animate={{ y: [30, -30, 30], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-glow/20 to-electric-blue/20 blur-3xl border border-white/5 glass-card"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="glass-card rounded-[2rem] p-8 md:p-10 shadow-glass-card relative border border-white/10 overflow-hidden group">

                    {/* Neon Top Edge */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-neon-border-blue opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                            className="w-16 h-16 bg-gradient-to-tr from-electric-blue to-royal-purple rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-glow-blue cursor-pointer"
                        >
                            <span className="text-3xl font-bold text-white">D</span>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2 text-glow">Welcome Back</h1>
                        <p className="text-slate-400 font-medium tracking-wide">Enter your credentials to access the portal</p>
                    </div>

                    <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8 border border-white/5">
                        {roles.map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative ${role === r ? 'text-white shadow-glow-purple' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {role === r && (
                                    <motion.div layoutId="role-pill" className="absolute inset-0 bg-gradient-to-r from-royal-purple/40 to-electric-blue/40 rounded-lg -z-10" />
                                )}
                                {r}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-electric-blue transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    placeholder={role === 'Student' ? "Roll No (e.g. 24UAM101)" : "Username"}
                                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue transition-all"
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-electric-blue transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    placeholder="Password"
                                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue transition-all"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input type="checkbox" className="form-checkbox bg-slate-900 border-slate-700 text-electric-blue rounded checked:border-transparent focus:ring-electric-blue focus:ring-offset-0 focus:ring-offset-transparent outline-none transition" />
                                <span className="text-slate-400 group-hover:text-slate-200 transition">Remember me</span>
                            </label>
                            <a href="#" className="text-electric-blue hover:text-white transition-colors duration-300 hover:text-glow-blue">Forgot Password?</a>
                        </div>

                        <button type="submit" className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-electric-blue to-royal-purple text-white font-semibold flex items-center justify-center space-x-2 hover:shadow-glow-blue transition-all duration-300 transform hover:-translate-y-0.5 mt-4">
                            <span>Sign In as {role}</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                </div>

            </motion.div>
        </div>
    );
};

export default Login;
