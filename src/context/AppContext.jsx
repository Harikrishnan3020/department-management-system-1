import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// ─────────────────────────────────────────────────────────────────
// DATA VERSION — bump this string any time you change default data.
// The check runs SYNCHRONOUSLY at module load time so that the old
// stale localStorage values are wiped BEFORE any useState() reads them.
// ─────────────────────────────────────────────────────────────────
const DATA_VERSION = 'v4';

(function purgeStaleCacheSync() {
    try {
        if (localStorage.getItem('dataVersion') !== DATA_VERSION) {
            // Only wipe seeded/default data — keep user-generated data
            localStorage.removeItem('faculty');
            localStorage.removeItem('courses');
            localStorage.setItem('dataVersion', DATA_VERSION);
        }
    } catch (_) { /* Safari private-mode may throw */ }
})();

// ─────────────────────────────────────────────────────────────────
// DEFAULT DATA  (uses the same field names as Faculty.jsx & Courses.jsx)
// ─────────────────────────────────────────────────────────────────
const defaultFaculty = [
    { id: 'F1', name: 'Dr CHELLAPRIYA K', dept: 'S&H', role: 'Asst. Professor', email: 'chellapriya@dms.edu', phone: '+91 9876500001', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F1', subject: 'OR' },
    { id: 'F2', name: 'Dr NIRMALA DEVI J', dept: 'AI&ML', role: 'Professor', email: 'nirmaladevi@dms.edu', phone: '+91 9876500002', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F2', subject: 'AI' },
    { id: 'F3', name: 'Ms RAAKESH M', dept: 'AI&ML', role: 'Asst. Professor', email: 'raakesh@dms.edu', phone: '+91 9876500003', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F3', subject: 'AI / OOSE / OS' },
    { id: 'F4', name: 'Ms ARUNA R', dept: 'AI&ML', role: 'Asst. Professor', email: 'aruna@dms.edu', phone: '+91 9876500004', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F4', subject: 'OOSE' },
    { id: 'F5', name: 'Ms YAMUNA S', dept: 'AI&DS', role: 'Asst. Professor', email: 'yamuna@dms.edu', phone: '+91 9876500005', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F5', subject: 'CN' },
    { id: 'F6', name: 'Ms JASMINI SARANYA P', dept: 'AI&DS', role: 'Asst. Professor', email: 'jasmini@dms.edu', phone: '+91 9876500006', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F6', subject: 'CN' },
    { id: 'F7', name: 'Mr RAAKESH M (I)', dept: 'AI&ML', role: 'Asst. Professor', email: 'raakesh2@dms.edu', phone: '+91 9876500007', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F7', subject: 'OS' },
    { id: 'F8', name: 'Ms ANITHA M', dept: 'AI&ML', role: 'Asst. Professor', email: 'anitha@dms.edu', phone: '+91 9876500008', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F8', subject: 'OS' },
    { id: 'F9', name: 'Ms AKILANDESWARI M', dept: 'AI&DS', role: 'Asst. Professor', email: 'akilandeswari@dms.edu', phone: '+91 9876500009', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F9', subject: 'RM/ED' },
    { id: 'F10', name: 'Dr K KARTHIK', dept: 'Mech', role: 'Asst. Professor', email: 'karthik@dms.edu', phone: '+91 9876500010', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F10', subject: 'RM/ED' },
    { id: 'F11', name: 'Ms LALITHA', dept: 'S&H', role: 'Faculty', email: 'lalitha@dms.edu', phone: '+91 9876500011', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F11', subject: 'Life Lab' },
    { id: 'F12', name: 'Mr GLADWIN JOHN', dept: 'S&H', role: 'Faculty', email: 'gladwin@dms.edu', phone: '+91 9876500012', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=F12', subject: 'Life Lab' },
];

const defaultCourses = [
    { id: 1, code: '24UMA463', name: 'Operations Research', credits: 4, type: 'Theory', faculty: 'Dr CHELLAPRIYA K', desc: 'Mathematical optimization techniques including linear programming, simplex method, transportation and assignment problems.', outcome: 'Students will master optimization and decision-making methodologies.' },
    { id: 2, code: '24UAM411', name: 'Artificial Intelligence', credits: 4, type: 'Theory', faculty: 'Dr NIRMALA DEVI J / Ms RAAKESH M', desc: 'Fundamentals of AI including search algorithms, knowledge representation, machine learning basics, and neural networks.', outcome: 'Students will understand AI paradigms and implement intelligent agents.' },
    { id: 3, code: '24UCB513', name: 'Object Oriented Approach for Software Engineering', credits: 3, type: 'Integrated', faculty: 'Ms ARUNA R / Ms RAAKESH M', desc: 'Software development life cycle, UML diagrams, design patterns, and object-oriented analysis using real-world case studies.', outcome: 'Students will design and document software systems using OO methodologies.' },
    { id: 4, code: '24UCS511', name: 'Computer Networks', credits: 3, type: 'Integrated', faculty: 'Ms YAMUNA S / Ms JASMINI SARANYA P', desc: 'OSI and TCP/IP models, routing protocols, network security, socket programming, and modern networking technologies.', outcome: 'Students will configure and troubleshoot computer networks.' },
    { id: 5, code: '24UCS414', name: 'Operating Systems', credits: 4, type: 'Integrated', faculty: 'Mr RAAKESH M / Ms ANITHA M', desc: 'Process management, memory management, file systems, CPU scheduling algorithms, and concurrency control.', outcome: 'Students will understand OS internals and implement scheduling algorithms.' },
    { id: 6, code: '24UCPE12/24UCPE11', name: 'Research Methodology / Entrepreneurship Development', credits: 4, type: 'Elective', faculty: 'Ms AKILANDESWARI M / Dr K KARTHIK', desc: 'Research methods, literature review techniques, entrepreneurship fundamentals, and startup ecosystem.', outcome: 'Students will develop research skills and entrepreneurial thinking.' },
    { id: 7, code: 'LL', name: 'Life Lab', credits: 2, type: 'Lab', faculty: 'Ms LALITHA / Mr GLADWIN JOHN', desc: 'Life skills development including communication, leadership, critical thinking, and emotional intelligence.', outcome: 'Students will develop essential soft skills for professional life.' },
];

const defaultStudents = [
    { rollNo: '24UAM101', name: 'AARTHI S' },
    { rollNo: '24UAM102', name: 'ABISEK T V' },
    { rollNo: '24UAM103', name: 'ABISHEK S' },
    { rollNo: '24UAM104', name: 'ADHITHYA S P' },
    { rollNo: '24UAM105', name: 'AISHWARYA M' },
    { rollNo: '24UAM106', name: 'AKSHAYAA A S' },
    { rollNo: '24UAM107', name: 'ANGELINA A' },
    { rollNo: '24UAM108', name: 'ANISH SURIYA J' },
    { rollNo: '24UAM109', name: 'ARCHANA V' },
    { rollNo: '24UAM110', name: 'BALAMURUGAN S' },
    { rollNo: '24UAM111', name: 'BHAVATHARINI T M' },
    { rollNo: '24UAM112', name: 'DHARSHINI R' },
    { rollNo: '24UAM113', name: 'DHARSHINI R' },
    { rollNo: '24UAM114', name: 'DHARUNIKA N' },
    { rollNo: '24UAM115', name: 'DINESH KUMAR S' },
    { rollNo: '24UAM116', name: 'EZHILAN K' },
    { rollNo: '24UAM117', name: 'GOGUL AANANTH Y' },
    { rollNo: '24UAM118', name: 'GOPIKA G' },
    { rollNo: '24UAM119', name: 'HARIKRISHNAN S' },
    { rollNo: '24UAM120', name: 'HARISBALAJI G' },
    { rollNo: '24UAM121', name: 'HEMAPRABU P' },
    { rollNo: '24UAM122', name: 'KABILAN G' },
    { rollNo: '24UAM123', name: 'KARNIKA V' },
    { rollNo: '24UAM124', name: 'KARTHIKEYAN M' },
    { rollNo: '24UAM125', name: 'KEERTHANAPRIYA S' },
    { rollNo: '24UAM126', name: 'KRITHIKA N' },
    { rollNo: '24UAM127', name: 'MADHANRAJ D' },
    { rollNo: '24UAM128', name: 'MADURAVALLI V' },
    { rollNo: '24UAM129', name: 'MANUJANA N' },
    { rollNo: '24UAM130', name: 'MEERASOUNDHARYA R' },
    { rollNo: '24UAM131', name: 'MITHRAA N' },
    { rollNo: '24UAM132', name: 'MOHAMED MYDEEN J' },
    { rollNo: '24UAM133', name: 'MOHAMMED MINHAJ A' },
    { rollNo: '24UAM134', name: 'NANDHINI S' },
    { rollNo: '24UAM135', name: 'NITHISH A' },
    { rollNo: '24UAM136', name: 'NIVEDA SREE DHANDAPANI' },
    { rollNo: '24UAM137', name: 'PRAVEEN P' },
    { rollNo: '24UAM138', name: 'RAMYA G' },
    { rollNo: '24UAM139', name: 'RANJITH KUMAR K' },
    { rollNo: '24UAM140', name: 'RATHISH T' },
    { rollNo: '24UAM141', name: 'RITHIKA S' },
    { rollNo: '24UAM142', name: 'RITHISH K' },
    { rollNo: '24UAM143', name: 'ROSHMITA V' },
    { rollNo: '24UAM144', name: 'SAIRAM K' },
    { rollNo: '24UAM145', name: 'SANDHYA B' },
    { rollNo: '24UAM146', name: 'SANJAY K' },
    { rollNo: '24UAM147', name: 'SANTHIYA M' },
    { rollNo: '24UAM148', name: 'SHAKTHI RITHANYA S' },
    { rollNo: '24UAM149', name: 'SHALINI R' },
    { rollNo: '24UAM150', name: 'SHEIK NATHARSHA A' },
    { rollNo: '24UAM151', name: 'SHWETHA S' },
    { rollNo: '24UAM152', name: 'SIVARAM A M' },
    { rollNo: '24UAM153', name: 'SOWMYA M' },
    { rollNo: '24UAM154', name: 'SOWMYA S' },
    { rollNo: '24UAM155', name: 'SREE NIVETHA N' },
    { rollNo: '24UAM156', name: 'SRI VATSAN S' },
    { rollNo: '24UAM157', name: 'SRIHARIPRIYA P' },
    { rollNo: '24UAM158', name: 'SRIMATHI K' },
    { rollNo: '24UAM159', name: 'SRUTHI R' },
    { rollNo: '24UAM160', name: 'VAISHNAVI S' },
    { rollNo: '24UAM161', name: 'VARUN K J' },
    { rollNo: '24UAM162', name: 'VIGNESH K' },
    { rollNo: '24UAM163', name: 'VIGNESH RAJ S' },
    { rollNo: '24UAM601', name: 'HARIPRIYA J' },
    { rollNo: '24UAM602', name: 'SIDDHARTH P' },
];

// ─────────────────────────────────────────────────────────────────
// Safe localStorage helper — returns null on parse error / missing key
// ─────────────────────────────────────────────────────────────────
const load = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null || raw === undefined) return null;
        return JSON.parse(raw);
    } catch (_) {
        return null;
    }
};

const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { }
};

// ─────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {

    // ── Daily midnight reset: attendance + leave notifications ──────
    useEffect(() => {
        // Types of notifications that are attendance/leave related and should
        // be cleared every day at midnight along with attendance records.
        const LEAVE_NOTIF_TYPES = ['Absent Alert', 'OD Request', 'OD Pending', 'OD Approved', 'OD Completed'];

        const doReset = () => {
            const today = new Date().toDateString();
            const lastReset = localStorage.getItem('lastResetDate');

            if (lastReset === today) return; // already reset today

            // 1. Clear today's attendance records
            setAttendance([]);
            save('attendance', []);

            // 2. Clear leave-application notifications (keep other notifs like
            //    exam results, fee alerts, etc.)
            setNotifications(prev => {
                const kept = prev.filter(n => !LEAVE_NOTIF_TYPES.includes(n.type));
                save('notifications', kept);
                return kept;
            });

            localStorage.setItem('lastResetDate', today);
        };

        // Run once immediately on mount (catches missed resets if app was closed)
        doReset();

        // Schedule EXACT midnight timer – fires at 00:00:00 of the next day
        const scheduleMidnight = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setDate(midnight.getDate() + 1);
            midnight.setHours(0, 0, 0, 0);               // next 00:00:00.000
            const msUntilMidnight = midnight - now;

            return setTimeout(() => {
                doReset();
                // After the first midnight fires, run every 24 hours exactly
                const daily = setInterval(doReset, 24 * 60 * 60 * 1000);
                // Store interval id in closure so we can clear it on unmount
                // (overwrite the outer ref so the cleanup below handles it)
                intervalRef.current = daily;
            }, msUntilMidnight);
        };

        const intervalRef = { current: null };
        const timeoutId = scheduleMidnight();

        return () => {
            clearTimeout(timeoutId);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // ── state ──
    // NOTE: by the time these lazy initialisers run, purgeStaleCacheSync()
    // has already removed stale 'faculty' and 'courses' keys when the version
    // changed, so load() returns null and we fall back to the real defaults.
    const [currentUser, setCurrentUser] = useState(() => load('currentUser'));
    const [students, setStudents] = useState(() => load('students') ?? defaultStudents);
    const [departments, setDepartments] = useState(() => load('departments') ?? [
        { id: 'CSE', name: 'Computer Science & Engineering', head: 'Dr. Alan Turing', faculty: 42, students: 850, status: 'Active' },
        { id: 'ECE', name: 'Electronics & Communication', head: 'Dr. Ada Lovelace', faculty: 35, students: 620, status: 'Active' },
        { id: 'MEC', name: 'Mechanical Engineering', head: 'Dr. Nikola Tesla', faculty: 28, students: 540, status: 'Active' },
        { id: 'CIV', name: 'Civil Engineering', head: 'Dr. Isambard Brunel', faculty: 22, students: 480, status: 'Maintenance' },
        { id: 'AIML', name: 'Artificial Intelligence & ML', head: 'Dr. Geoffrey Hinton', faculty: 18, students: 300, status: 'Active' },
    ]);

    // faculty & courses: ?? so an intentionally-empty [] (all deleted) is kept
    const [faculty, setFaculty] = useState(() => load('faculty') ?? defaultFaculty);
    const [courses, setCourses] = useState(() => load('courses') ?? defaultCourses);

    const [attendance, setAttendance] = useState(() => load('attendance') ?? []);
    const [examResults, setExamResults] = useState(() => load('examResults') ?? []);
    const [notifications, setNotifications] = useState(() => load('notifications') ?? []);
    const [magazine, setMagazine] = useState(() => load('magazine') ?? []);
    const [googleForms, setGoogleForms] = useState(() => load('googleForms') ?? []);
    const [courseraLinks, setCourseraLinks] = useState(() => load('courseraLinks') ?? []);
    const [fees, setFees] = useState(() => load('fees') ?? []);
    const [timetable, setTimetable] = useState(() => load('timetable') ?? null);
    const [academicCalendar, setAcademicCalendar] = useState(() => load('academicCalendar') ?? null);

    // ── persist every state slice independently ──
    useEffect(() => { save('currentUser', currentUser); }, [currentUser]);
    useEffect(() => { save('students', students); }, [students]);
    useEffect(() => { save('departments', departments); }, [departments]);
    useEffect(() => { save('faculty', faculty); }, [faculty]);
    useEffect(() => { save('courses', courses); }, [courses]);
    useEffect(() => { save('attendance', attendance); }, [attendance]);
    useEffect(() => { save('examResults', examResults); }, [examResults]);
    useEffect(() => { save('notifications', notifications); }, [notifications]);
    useEffect(() => { save('magazine', magazine); }, [magazine]);
    useEffect(() => { save('googleForms', googleForms); }, [googleForms]);
    useEffect(() => { save('courseraLinks', courseraLinks); }, [courseraLinks]);
    useEffect(() => { save('fees', fees); }, [fees]);
    useEffect(() => { save('timetable', timetable); }, [timetable]);
    useEffect(() => { save('academicCalendar', academicCalendar); }, [academicCalendar]);

    const login = (role, id, name) => setCurrentUser({ role, id, name });
    const logout = () => setCurrentUser(null);

    return (
        <AppContext.Provider value={{
            currentUser, login, logout,
            departments, setDepartments,
            students, setStudents,
            courses, setCourses,
            faculty, setFaculty,
            attendance, setAttendance,
            examResults, setExamResults,
            notifications, setNotifications,
            magazine, setMagazine,
            googleForms, setGoogleForms,
            courseraLinks, setCourseraLinks,
            fees, setFees,
            timetable, setTimetable,
            academicCalendar, setAcademicCalendar,
        }}>
            {children}
        </AppContext.Provider>
    );
};
