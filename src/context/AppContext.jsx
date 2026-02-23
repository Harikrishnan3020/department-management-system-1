import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Check local storage or set defaults
    const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')) || null);

    // Reset Attendance Daily at Midnight
    useEffect(() => {
        const checkReset = () => {
            const lastReset = localStorage.getItem('lastResetDate');
            const today = new Date().toDateString();
            if (lastReset !== today) {
                setAttendance([]);
                localStorage.setItem('attendance', '[]');
                localStorage.setItem('lastResetDate', today);
            }
        };
        checkReset();
        const interval = setInterval(checkReset, 60000);
        return () => clearInterval(interval);
    }, []);

    const defaultStudents = [
        { rollNo: "24UAM101", name: "AARTHI S" },
        { rollNo: "24UAM102", name: "ABISEK T V" },
        { rollNo: "24UAM103", name: "ABISHEK S" },
        { rollNo: "24UAM104", name: "ADHITHYA S P" },
        { rollNo: "24UAM105", name: "AISHWARYA M" },
        { rollNo: "24UAM106", name: "AKSHAYAA A S" },
        { rollNo: "24UAM107", name: "ANGELINA A" },
        { rollNo: "24UAM108", name: "ANISH SURIYA J" },
        { rollNo: "24UAM109", name: "ARCHANA V" },
        { rollNo: "24UAM110", name: "BALAMURUGAN S" },
        { rollNo: "24UAM111", name: "BHAVATHARINI T M" },
        { rollNo: "24UAM112", name: "DHARSHINI R" },
        { rollNo: "24UAM113", name: "DHARSHINI R" }, // Duplicate DHARSHINI R in list
        { rollNo: "24UAM114", name: "DHARUNIKA N" },
        { rollNo: "24UAM115", name: "DINESH KUMAR S" },
        { rollNo: "24UAM116", name: "EZHILAN K" },
        { rollNo: "24UAM117", name: "GOGUL AANANTH Y" },
        { rollNo: "24UAM118", name: "GOPIKA G" },
        { rollNo: "24UAM119", name: "HARIKRISHNAN S" },
        { rollNo: "24UAM120", name: "HARISBALAJI G" },
        { rollNo: "24UAM121", name: "HEMAPRABU P" },
        { rollNo: "24UAM122", name: "KABILAN G" },
        { rollNo: "24UAM123", name: "KARNIKA V" },
        { rollNo: "24UAM124", name: "KARTHIKEYAN M" },
        { rollNo: "24UAM125", name: "KEERTHANAPRIYA S" },
        { rollNo: "24UAM126", name: "KRITHIKA N" },
        { rollNo: "24UAM127", name: "MADHANRAJ D" },
        { rollNo: "24UAM128", name: "MADURAVALLI V" },
        { rollNo: "24UAM129", name: "MANUJANA N" },
        { rollNo: "24UAM130", name: "MEERASOUNDHARYA R" },
        { rollNo: "24UAM131", name: "MITHRAA N" },
        { rollNo: "24UAM132", name: "MOHAMED MYDEEN J" },
        { rollNo: "24UAM133", name: "MOHAMMED MINHAJ A" },
        { rollNo: "24UAM134", name: "NANDHINI S" },
        { rollNo: "24UAM135", name: "NITHISH A" },
        { rollNo: "24UAM136", name: "NIVEDA SREE DHANDAPANI" },
        { rollNo: "24UAM137", name: "PRAVEEN P" },
        { rollNo: "24UAM138", name: "RAMYA G" },
        { rollNo: "24UAM139", name: "RANJITH KUMAR K" },
        { rollNo: "24UAM140", name: "RATHISH T" },
        { rollNo: "24UAM141", name: "RITHIKA S" },
        { rollNo: "24UAM142", name: "RITHISH K" },
        { rollNo: "24UAM143", name: "ROSHMITA V" },
        { rollNo: "24UAM144", name: "SAIRAM K" },
        { rollNo: "24UAM145", name: "SANDHYA B" },
        { rollNo: "24UAM146", name: "SANJAY K" },
        { rollNo: "24UAM147", name: "SANTHIYA M" },
        { rollNo: "24UAM148", name: "SHAKTHI RITHANYA S" },
        { rollNo: "24UAM149", name: "SHALINI R" },
        { rollNo: "24UAM150", name: "SHEIK NATHARSHA A" },
        { rollNo: "24UAM151", name: "SHWETHA S" },
        { rollNo: "24UAM152", name: "SIVARAM A M" },
        { rollNo: "24UAM153", name: "SOWMYA M" },
        { rollNo: "24UAM154", name: "SOWMYA S" },
        { rollNo: "24UAM155", name: "SREE NIVETHA N" },
        { rollNo: "24UAM156", name: "SRI VATSAN S" },
        { rollNo: "24UAM157", name: "SRIHARIPRIYA P" },
        { rollNo: "24UAM158", name: "SRIMATHI K" },
        { rollNo: "24UAM159", name: "SRUTHI R" },
        { rollNo: "24UAM160", name: "VAISHNAVI S" },
        { rollNo: "24UAM161", name: "VARUN K J" },
        { rollNo: "24UAM162", name: "VIGNESH K" },
        { rollNo: "24UAM163", name: "VIGNESH RAJ S" },
        { rollNo: "24UAM601", name: "HARIPRIYA J" },
        { rollNo: "24UAM602", name: "SIDDHARTH P" }
    ];

    const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem('students')) || defaultStudents);
    const [departments, setDepartments] = useState(() => JSON.parse(localStorage.getItem('departments')) || [
        { id: 'CSE', name: 'Computer Science & Engineering', head: 'Dr. Alan Turing', faculty: 42, students: 850, status: 'Active' },
        { id: 'ECE', name: 'Electronics & Communication', head: 'Dr. Ada Lovelace', faculty: 35, students: 620, status: 'Active' },
        { id: 'MEC', name: 'Mechanical Engineering', head: 'Dr. Nikola Tesla', faculty: 28, students: 540, status: 'Active' },
        { id: 'CIV', name: 'Civil Engineering', head: 'Dr. Isambard Brunel', faculty: 22, students: 480, status: 'Maintenance' },
        { id: 'AIML', name: 'Artificial Intelligence & ML', head: 'Dr. Geoffrey Hinton', faculty: 18, students: 300, status: 'Active' },
    ]);
    const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem('courses')) || [
        { id: 1, code: '24UMA463', name: 'Operations Research', credits: 4, type: 'Theory', faculty: 'Dr. Chellapriya K', desc: 'Mathematical optimization techniques including linear programming, simplex method, transportation and assignment problems.', outcome: 'Students will master optimization and decision-making methodologies.' },
        { id: 2, code: '24UAM411', name: 'Artificial Intelligence', credits: 4, type: 'Theory', faculty: 'Dr. Nirmala Devi J / Ms. Raakesh M', desc: 'Fundamentals of AI including search algorithms, knowledge representation, machine learning basics, and neural networks.', outcome: 'Students will understand AI paradigms and implement intelligent agents.' },
        { id: 3, code: '24UCB513', name: 'Object Oriented Approach for Software Engineering', credits: 3, type: 'Integrated', faculty: 'Ms. Aruna R / Ms. Raakesh M', desc: 'Software development life cycle, UML diagrams, design patterns, and object-oriented analysis using real-world case studies.', outcome: 'Students will design and document software systems using OO methodologies.' },
        { id: 4, code: '24UCS511', name: 'Computer Networks', credits: 3, type: 'Integrated', faculty: 'Ms. Yamuna S / Ms. Jasmini Saranya P', desc: 'OSI and TCP/IP models, routing protocols, network security, socket programming, and modern networking technologies.', outcome: 'Students will configure and troubleshoot computer networks.' },
        { id: 5, code: '24UCS414', name: 'Operating Systems', credits: 4, type: 'Integrated', faculty: 'Mr. Raakesh M / Ms. Anitha M', desc: 'Process management, memory management, file systems, CPU scheduling algorithms, and concurrency control.', outcome: 'Students will understand OS internals and implement scheduling algorithms.' },
        { id: 6, code: '24UCPE12/24UCPE11', name: 'Research Methodology / Entrepreneurship Development', credits: 4, type: 'Elective', faculty: 'Ms. Akhandeswari M / Dr. K. Karthik', desc: 'Research methods, literature review techniques, entrepreneurship fundamentals, and startup ecosystem.', outcome: 'Students will develop research skills and entrepreneurial thinking.' },
        { id: 7, code: 'LL', name: 'Life Lab', credits: 2, type: 'Lab', faculty: 'Ms. Lalitha / Mr. Gladwin John', desc: 'Life skills development including communication, leadership, critical thinking, and emotional intelligence.', outcome: 'Students will develop essential soft skills for professional life.' },
    ]);
    const [faculty, setFaculty] = useState(() => JSON.parse(localStorage.getItem('faculty')) || [
        { id: 'F1', name: 'Dr CHELLAPRIYA K', department: 'S&H', designation: 'AP', subject: 'OR' },
        { id: 'F2', name: 'Dr NIRMALA DEVI J', department: 'AI&ML', designation: 'Professor', subject: 'AI' },
        { id: 'F3', name: 'Ms RAAKESH M', department: 'AI&ML', designation: 'AP', subject: 'AI / OOSE / OS' },
        { id: 'F4', name: 'Ms ARUNA R', department: 'AI&ML', designation: 'AP', subject: 'OOSE' },
        { id: 'F5', name: 'Ms YAMUNA S', department: 'AI&DS', designation: 'AP', subject: 'CN' },
        { id: 'F6', name: 'Ms JASMINI SARANYA P', department: 'AI&DS', designation: 'AP', subject: 'CN' },
        { id: 'F7', name: 'MR RAAKESH M (I)', department: 'AI&ML', designation: 'AP', subject: 'OS' },
        { id: 'F8', name: 'Ms ANITHA M', department: 'AI&ML', designation: 'AP', subject: 'OS' },
        { id: 'F9', name: 'Ms.AKILANDESWARI M', department: 'AI&DS', designation: 'AP', subject: 'RM/ED' },
        { id: 'F10', name: 'Dr.K.KARTHIK', department: 'Mech', designation: 'AP', subject: 'RM/ED' },
        { id: 'F11', name: 'Ms LALITHA', department: 'S&H', designation: 'Faculty', subject: 'Life Lab' },
        { id: 'F12', name: 'Mr GLADWIN JOHN', department: 'S&H', designation: 'Faculty', subject: 'Life Lab' },
    ]);
    const [attendance, setAttendance] = useState(() => JSON.parse(localStorage.getItem('attendance')) || []);
    const [examResults, setExamResults] = useState(() => JSON.parse(localStorage.getItem('examResults')) || []);
    const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('notifications')) || []);
    const [magazine, setMagazine] = useState(() => JSON.parse(localStorage.getItem('magazine')) || []);
    const [googleForms, setGoogleForms] = useState(() => JSON.parse(localStorage.getItem('googleForms')) || []);
    const [courseraLinks, setCourseraLinks] = useState(() => JSON.parse(localStorage.getItem('courseraLinks')) || []);
    const [fees, setFees] = useState(() => JSON.parse(localStorage.getItem('fees')) || []);
    const [timetable, setTimetable] = useState(() => JSON.parse(localStorage.getItem('timetable')) || null);
    const [academicCalendar, setAcademicCalendar] = useState(() => JSON.parse(localStorage.getItem('academicCalendar')) || null);

    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('departments', JSON.stringify(departments));
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('courses', JSON.stringify(courses));
        localStorage.setItem('faculty', JSON.stringify(faculty));
        localStorage.setItem('attendance', JSON.stringify(attendance));
        localStorage.setItem('examResults', JSON.stringify(examResults));
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('magazine', JSON.stringify(magazine));
        localStorage.setItem('googleForms', JSON.stringify(googleForms));
        localStorage.setItem('courseraLinks', JSON.stringify(courseraLinks));
        localStorage.setItem('fees', JSON.stringify(fees));
        localStorage.setItem('timetable', JSON.stringify(timetable));
        localStorage.setItem('academicCalendar', JSON.stringify(academicCalendar));
    }, [currentUser, departments, students, courses, faculty, attendance, examResults, notifications, magazine, googleForms, courseraLinks, fees, timetable, academicCalendar]);

    const login = (role, id, name) => {
        setCurrentUser({ role, id, name });
    };

    const logout = () => {
        setCurrentUser(null);
    };

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
            academicCalendar, setAcademicCalendar
        }}>
            {children}
        </AppContext.Provider>
    );
};
