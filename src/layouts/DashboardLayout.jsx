import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Building2, Users, GraduationCap, BookOpen, LogOut, Menu, X, Bell, Search, FileText, CalendarCheck, FileBadge, Link as LinkIcon, MonitorPlay, CreditCard, CalendarDays, CalendarRange } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout, notifications } = useContext(AppContext);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    let navItems = [];
    if (currentUser.role === 'Admin' || currentUser.role === 'Faculty') {
        navItems = [
            { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
            { path: '/attendance', label: 'Student Attendance', icon: CalendarCheck },
            { path: '/departments', label: 'Departments', icon: Building2 },
            { path: '/faculty', label: 'Faculty Base', icon: Users },
            { path: '/students', label: 'Students', icon: GraduationCap },
            { path: '/courses', label: 'Courses', icon: BookOpen },
            { path: '/exam-result', label: 'Exam Result', icon: FileText },
            { path: '/magazine', label: 'Magazine', icon: FileBadge },
            { path: '/google-form', label: 'Google Forms', icon: LinkIcon },
            { path: '/coursera', label: 'Coursera Hub', icon: MonitorPlay },
            { path: '/fees', label: 'Fees Mgmt', icon: CreditCard },
            { path: '/timetable', label: 'Timetable', icon: CalendarDays },
            { path: '/academic-calendar', label: 'Academic Calendar', icon: CalendarRange },
        ];
    } else if (currentUser.role === 'Student') {
        navItems = [
            { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
            { path: '/courses', label: 'Courses', icon: BookOpen },
            { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
            { path: '/exam-result', label: 'Exam Result', icon: FileText },
            { path: '/google-form', label: 'Google Forms', icon: LinkIcon },
            { path: '/coursera', label: 'Coursera Hub', icon: MonitorPlay },
            { path: '/fees', label: 'My Fees', icon: CreditCard },
            { path: '/timetable', label: 'Timetable', icon: CalendarDays },
            { path: '/academic-calendar', label: 'Academic Calendar', icon: CalendarRange },
        ];
    }

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    // Notification filtering matching Dashboard.jsx logic
    const userNotifications = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Faculty')
        ? notifications.filter(n => !n.to || n.type === 'Form Completed' || n.type === 'OD Request')
        : notifications.filter(n => n.to === currentUser?.id || n.type === 'General' || n.type === 'Google Form' || n.type === 'Coursera Assignment');

    return (
        <div className="flex h-screen overflow-hidden bg-transparent">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="relative z-20 flex flex-col h-full glass-card border-r border-glass-border rounded-r-2xl m-2"
                style={{ backdropFilter: 'blur(24px)' }}
            >
                <div className="flex items-center justify-between p-6">
                    <motion.div
                        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                        className="flex items-center space-x-3 overflow-hidden"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-royal-purple flex items-center justify-center shadow-glow-blue">
                            <span className="text-xl font-bold text-white">D</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">DMS System</span>
                    </motion.div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink key={item.path} to={item.path}>
                                <motion.div
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 relative ${isActive ? 'bg-white/10 text-white shadow-glow-purple border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-electric-blue/20 to-royal-purple/20 -z-10"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <Icon size={22} className={isActive ? 'text-electric-blue' : ''} />
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="ml-4 font-medium whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <a href="/" onClick={handleLogout}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                        >
                            <LogOut size={22} />
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="ml-4 font-medium whitespace-nowrap"
                                    >
                                        Logout
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </a>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 w-full min-w-0">
                <header className="h-20 glass-card mx-6 mt-4 rounded-2xl border border-glass-border flex items-center justify-between px-8 shadow-glass-card">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-xl text-slate-300 hover:bg-white/10 transition-colors focus:ring-2 ring-electric-blue/50"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="flex items-center flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search platform..."
                                className="w-full bg-slate-900/50 border border-glass-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue transition-all text-white placeholder-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 relative">
                        <div className="relative">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-300 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-electric-blue/50 rounded-xl">
                                <Bell size={22} />
                                {userNotifications.length > 0 && (
                                    <span className="absolute top-1 right-2 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
                                    </span>
                                )}
                            </button>
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-80 bg-slate-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50">
                                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
                                            <h3 className="text-white font-bold text-sm">Notifications</h3>
                                            <span className="px-2 py-0.5 bg-electric-blue/20 text-electric-blue rounded-full text-[10px] font-black">{userNotifications.length} New</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                            {userNotifications.length === 0 ? (
                                                <div className="text-center text-slate-500 py-8 text-sm">No new notifications.</div>
                                            ) : (
                                                <div className="p-2 space-y-1">
                                                    {userNotifications.slice(0, 10).map((notif, i) => (
                                                        <div key={i} className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className={`w-1.5 h-1.5 rounded-full ${notif.type.includes('OD') ? 'bg-electric-blue' : notif.type.includes('Form') ? 'bg-royal-purple' : notif.type.includes('Coursera') ? 'bg-emerald-500' : 'bg-luxury-gold'}`}></span>
                                                                <h4 className="text-white font-bold text-[11px] group-hover:text-electric-blue transition-colors line-clamp-1">{notif.type}</h4>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 leading-relaxed pl-3.5 line-clamp-2">{notif.message}</p>
                                                        </div>
                                                    ))}
                                                    {userNotifications.length > 10 && (
                                                        <button onClick={() => navigate('/dashboard')} className="w-full text-center py-2 text-xs text-electric-blue hover:text-white font-bold transition-colors">View All in Dashboard</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-white group-hover:text-electric-blue transition-colors">{currentUser.name}</p>
                                <p className="text-xs text-slate-400 capitalize">{currentUser.role === 'Student' ? `Roll No: ${currentUser.id}` : currentUser.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-electric-blue/50 overflow-hidden shadow-glow-blue cursor-pointer bg-slate-800 relative z-10">
                                <img src={`/photos/${currentUser.id}.jpg`} alt={currentUser.name} onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 hidden items-center justify-center text-white font-bold">{currentUser.name.charAt(0)}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                            transition={{ duration: 0.3 }}
                            style={{ willChange: "transform, opacity, filter" }}
                            className="p-8 w-full max-w-7xl mx-auto transform-gpu"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

