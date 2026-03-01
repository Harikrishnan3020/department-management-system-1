import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import PremiumLayout from './layouts/PremiumLayout';
import DashboardLayout from './layouts/DashboardLayout';

import PortfolioLanding from './pages/PortfolioLanding';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Faculty from './pages/Faculty';
import FacultyProfile from './pages/FacultyProfile';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import Courses from './pages/Courses';
import Attendance from './pages/Attendance';
import ExamResult from './pages/ExamResult';
import Magazine from './pages/Magazine';
import GoogleForm from './pages/GoogleForm';
import Coursera from './pages/Coursera';
import Fees from './pages/Fees';
import Timetable from './pages/Timetable';
import AcademicCalendar from './pages/AcademicCalendar';
import Notifications from './pages/Notifications';
import RequestLetter from './pages/RequestLetter';

function App() {
    return (
        <Router>
            <div className="min-h-screen text-slate-300 relative selection:bg-electric-blue selection:text-white">
                <AnimatedBackground />

                <Routes>
                    {/* Public Pages */}
                    <Route element={<PremiumLayout />}>
                        <Route path="/" element={<PortfolioLanding />} />
                        <Route path="/login" element={<Login />} />
                    </Route>

                    {/* Secured Dashboard */}
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/departments" element={<Departments />} />
                        <Route path="/faculty" element={<Faculty />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/exam-result" element={<ExamResult />} />
                        <Route path="/magazine" element={<Magazine />} />
                        <Route path="/google-form" element={<GoogleForm />} />
                        <Route path="/coursera" element={<Coursera />} />
                        <Route path="/fees" element={<Fees />} />
                        <Route path="/timetable" element={<Timetable />} />
                        <Route path="/academic-calendar" element={<AcademicCalendar />} />
                        <Route path="/request-letter" element={<RequestLetter />} />
                        <Route path="/students/:rollNo" element={<StudentProfile />} />
                        <Route path="/faculty/:id" element={<FacultyProfile />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
