import React, { createContext, useState, useEffect } from 'react';
import { studentPhotoMap } from '../utils/studentPhotos';

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

    const makeStudent = (rollNo, name, seed, dob, blood, skills, cgpa, phone, address) => ({
        rollNo, name,
        email: '',
        phone: phone || '+91 98765 43210',
        dob: dob || '2005-06-15',
        address: address || 'Chennai, Tamil Nadu',
        bloodGroup: blood || 'B+',
        year: '2nd Year',
        section: 'A',
        cgpa: cgpa || (7.5 + Math.random()).toFixed(2),
        skills: skills || ['Python', 'Java', 'Data Structures'],
        avatar: studentPhotoMap[rollNo] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed || rollNo}`,
    });

    const defaultStudents = [
        makeStudent('24UAM101', 'AARTHI S', 'aarthi', '2005-03-12', 'O+', ['Python', 'ML', 'Statistics'], '8.72'),
        makeStudent('24UAM102', 'ABISEK T V', 'abisek', '2005-07-22', 'A+', ['Java', 'DSA', 'React'], '7.95'),
        makeStudent('24UAM103', 'ABISHEK S', 'abishek', '2005-01-09', 'B+', ['C++', 'Networks', 'OS'], '8.10'),
        makeStudent('24UAM104', 'ADHITHYA S P', 'adhithya', '2005-11-03', 'A-', ['Python', 'AI', 'NLP'], '8.50'),
        makeStudent('24UAM105', 'AISHWARYA M', 'aishwarya', '2005-05-17', 'O+', ['Web Dev', 'React', 'Node.js'], '9.01'),
        makeStudent('24UAM106', 'AKSHAYAA A S', 'akshayaa', '2005-09-28', 'B-', ['Java', 'SQL', 'Spring'], '7.88'),
        makeStudent('24UAM107', 'ANGELINA A', 'angelina', '2005-02-14', 'AB+', ['Python', 'TensorFlow', 'CV'], '8.64'),
        makeStudent('24UAM108', 'ANISH SURIYA J', 'anish', '2005-08-30', 'O-', ['C', 'Embedded', 'IoT'], '7.42'),
        makeStudent('24UAM109', 'ARCHANA V', 'archana', '2005-04-06', 'A+', ['Python', 'Pandas', 'Seaborn'], '8.33'),
        makeStudent('24UAM110', 'BALAMURUGAN S', 'balamurugan', '2005-12-19', 'B+', ['Java', 'Android', 'Kotlin'], '7.60'),
        makeStudent('24UAM111', 'BHAVATHARINI T M', 'bhavatharini', '2005-06-25', 'O+', ['UX/UI', 'Figma', 'CSS'], '8.90'),
        makeStudent('24UAM112', 'DHARSHINI R', 'dharshini1', '2005-03-31', 'A+', ['SQL', 'MongoDB', 'Express'], '8.12'),
        makeStudent('24UAM113', 'DHARSHINI R', 'dharshini2', '2005-07-04', 'B+', ['Python', 'Flask', 'AWS'], '7.75'),
        makeStudent('24UAM114', 'DHARUNIKA N', 'dharunika', '2005-10-11', 'O-', ['Cybersecurity', 'Linux', 'Python'], '8.44'),
        makeStudent('24UAM115', 'DINESH KUMAR S', 'dinesh', '2005-01-20', 'A-', ['React', 'TypeScript', 'GraphQL'], '7.99'),
        makeStudent('24UAM116', 'EZHILAN K', 'ezhilan', '2005-08-08', 'B-', ['Java', 'Spring Boot', 'Docker'], '8.22'),
        makeStudent('24UAM117', 'GOGUL AANANTH Y', 'gogul', '2005-05-02', 'AB+', ['Python', 'PyTorch', 'Computer Vision'], '8.55'),
        makeStudent('24UAM118', 'GOPIKA G', 'gopika', '2005-11-16', 'O+', ['R', 'Statistics', 'ggplot2'], '8.80'),
        makeStudent('24UAM119', 'HARIKRISHNAN S', 'harikrishnan', '2005-02-27', 'A+', ['MERN Stack', 'DevOps', 'CI/CD'], '9.15'),
        makeStudent('24UAM120', 'HARISBALAJI G', 'harisbalaji', '2005-09-13', 'B+', ['C++', 'Competitive Programming', 'STL'], '8.30'),
        makeStudent('24UAM121', 'HEMAPRABU P', 'hemaprabu', '2005-04-21', 'O-', ['Java', 'Microservices', 'Kafka'], '7.85'),
        makeStudent('24UAM122', 'KABILAN G', 'kabilan', '2005-12-05', 'A-', ['Python', 'Scikit-learn', 'XGBoost'], '8.40'),
        makeStudent('24UAM123', 'KARNIKA V', 'karnika', '2005-06-30', 'B-', ['HTML/CSS', 'JavaScript', 'Vue.js'], '8.65'),
        makeStudent('24UAM124', 'KARTHIKEYAN M', 'karthikeyan', '2005-03-07', 'AB-', ['Linux', 'Bash', 'Ansible'], '7.70'),
        makeStudent('24UAM125', 'KEERTHANAPRIYA S', 'keerthanapriya', '2005-07-18', 'O+', ['Data Analysis', 'Tableau', 'Power BI'], '8.95'),
        makeStudent('24UAM126', 'KRITHIKA N', 'krithika', '2005-01-24', 'A+', ['Python', 'Keras', 'NLP'], '9.05'),
        makeStudent('24UAM127', 'MADHANRAJ D', 'madhanraj', '2005-10-09', 'B+', ['Java', 'REST APIs', 'Hibernate'], '7.55'),
        makeStudent('24UAM128', 'MADURAVALLI V', 'maduravalli', '2005-05-14', 'O-', ['React Native', 'Firebase', 'Expo'], '8.20'),
        makeStudent('24UAM129', 'MANUJANA N', 'manujana', '2005-02-01', 'A-', ['Python', 'OpenCV', 'YOLO'], '8.50'),
        makeStudent('24UAM130', 'MEERASOUNDHARYA R', 'meerasoundharya', '2005-08-22', 'AB+', ['SQL', 'Power BI', 'DAX'], '8.75'),
        makeStudent('24UAM131', 'MITHRAA N', 'mithraa', '2005-04-15', 'O+', ['JavaScript', 'Node.js', 'MongoDB'], '8.10'),
        makeStudent('24UAM132', 'MOHAMED MYDEEN J', 'mohamedmydeen', '2005-11-28', 'A+', ['Python', 'Django', 'PostgreSQL'], '7.90'),
        makeStudent('24UAM133', 'MOHAMMED MINHAJ A', 'mohammedminhaj', '2005-06-03', 'B+', ['Java', 'Android', 'XML'], '8.00'),
        makeStudent('24UAM134', 'NANDHINI S', 'nandhini', '2005-03-19', 'O-', ['CSS', 'SASS', 'Tailwind'], '8.45'),
        makeStudent('24UAM135', 'NITHISH A', 'nithish', '2005-09-06', 'A-', ['Go', 'gRPC', 'Protocol Buffers'], '7.65'),
        makeStudent('24UAM136', 'NIVEDA SREE DHANDAPANI', 'niveda', '2005-12-31', 'B-', ['Python', 'BERT', 'Transformers'], '8.85'),
        makeStudent('24UAM137', 'PRAVEEN P', 'praveen', '2005-07-10', 'AB+', ['HTML', 'Bootstrap', 'jQuery'], '7.40'),
        makeStudent('24UAM138', 'RAMYA G', 'ramya', '2005-02-08', 'O+', ['Scala', 'Spark', 'Hadoop'], '8.60'),
        makeStudent('24UAM139', 'RANJITH KUMAR K', 'ranjith', '2005-05-25', 'A+', ['Rust', 'Systems Programming', 'WebAssembly'], '8.25'),
        makeStudent('24UAM140', 'RATHISH T', 'rathish', '2005-10-17', 'B+', ['Python', 'FastAPI', 'Celery'], '7.80'),
        makeStudent('24UAM141', 'RITHIKA S', 'rithika', '2005-01-13', 'O-', ['TypeScript', 'Angular', 'RxJS'], '8.95'),
        makeStudent('24UAM142', 'RITHISH K', 'rithish', '2005-08-04', 'A-', ['C#', '.NET', 'Azure'], '8.35'),
        makeStudent('24UAM143', 'ROSHMITA V', 'roshmita', '2005-04-29', 'AB-', ['Python', 'Matplotlib', 'Seaborn'], '8.70'),
        makeStudent('24UAM144', 'SAIRAM K', 'sairam', '2005-11-21', 'O+', ['Java', 'Multithreading', 'JVM'], '7.95'),
        makeStudent('24UAM145', 'SANDHYA B', 'sandhya', '2005-06-16', 'A+', ['SQL', 'Oracle', 'PL/SQL'], '8.15'),
        makeStudent('24UAM146', 'SANJAY K', 'sanjay', '2005-03-02', 'B+', ['JavaScript', 'Three.js', 'WebGL'], '8.55'),
        makeStudent('24UAM147', 'SANTHIYA M', 'santhiya', '2005-09-27', 'O-', ['Java', 'Maven', 'Jenkins'], '7.75'),
        makeStudent('24UAM148', 'SHAKTHI RITHANYA S', 'shakthi', '2005-12-12', 'A-', ['Python', 'Pandas', 'ML'], '9.20'),
        makeStudent('24UAM149', 'SHALINI R', 'shalini', '2005-07-07', 'B-', ['Go', 'Microservices', 'Docker'], '8.40'),
        makeStudent('24UAM150', 'SHEIK NATHARSHA A', 'sheik', '2005-02-23', 'AB+', ['Python', 'Cybersecurity', 'Ethical Hacking'], '8.00'),
        makeStudent('24UAM151', 'SHWETHA S', 'shwetha', '2005-05-11', 'O+', ['UX Research', 'Figma', 'Prototyping'], '8.80'),
        makeStudent('24UAM152', 'SIVARAM A M', 'sivaram', '2005-10-30', 'A+', ['C++', 'OpenMP', 'CUDA'], '8.15'),
        makeStudent('24UAM153', 'SOWMYA M', 'sowmya1', '2005-01-06', 'B+', ['Java', 'Spring MVC', 'Thymeleaf'], '7.60'),
        makeStudent('24UAM154', 'SOWMYA S', 'sowmya2', '2005-08-19', 'O-', ['Python', 'Airflow', 'ETL'], '8.30'),
        makeStudent('24UAM155', 'SREE NIVETHA N', 'sreenivetha', '2005-04-04', 'A-', ['React', 'Redux', 'Zustand'], '8.65'),
        makeStudent('24UAM156', 'SRI VATSAN S', 'srivatsan', '2005-11-10', 'AB-', ['Node.js', 'WebSockets', 'Redis'], '8.90'),
        makeStudent('24UAM157', 'SRIHARIPRIYA P', 'sriharipriya', '2005-06-26', 'O+', ['Python', 'LLMs', 'LangChain'], '9.10'),
        makeStudent('24UAM158', 'SRIMATHI K', 'srimathi', '2005-03-14', 'A+', ['SQL', 'Elasticsearch', 'Kibana'], '8.25'),
        makeStudent('24UAM159', 'SRUTHI R', 'sruthi', '2005-09-01', 'B+', ['Java', 'Servlet', 'JSP'], '7.85'),
        makeStudent('24UAM160', 'VAISHNAVI S', 'vaishnavi', '2005-12-24', 'O-', ['Python', 'Reinforcement Learning', 'OpenAI Gym'], '8.50'),
        makeStudent('24UAM161', 'VARUN K J', 'varun', '2005-07-15', 'A-', ['Next.js', 'Prisma', 'tRPC'], '8.75'),
        makeStudent('24UAM162', 'VIGNESH K', 'vignesh1', '2005-02-10', 'B-', ['Rust', 'WASM', 'Tauri'], '8.40'),
        makeStudent('24UAM163', 'VIGNESH RAJ S', 'vigneshraj', '2005-10-05', 'AB+', ['Python', 'Computer Vision', 'MediaPipe'], '8.00'),
        makeStudent('24UAM601', 'HARIPRIYA J', 'haripriya', '2004-05-20', 'O+', ['Java', 'Cloud Computing', 'AWS'], '8.60'),
        makeStudent('24UAM602', 'SIDDHARTH P', 'siddharth', '2004-11-13', 'A+', ['Python', 'MLOps', 'Kubernetes'], '9.00'),
    ];

    const [students, setStudents] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('students'));
        // If saved data lacks new fields, reset to enriched defaults
        const initialStudents = (!saved || !saved[0]?.email) ? defaultStudents : saved;

        return initialStudents.map(student => {
            const isDefaultEmail = student.email?.endsWith('@students.dms.edu');
            return {
                ...student,
                email: isDefaultEmail ? '' : (student.email || ''),
                avatar: studentPhotoMap[student.rollNo] || (student.avatar?.includes('dicebear') ? null : student.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.rollNo}`
            };
        });
    });
    const defaultDepartments = [
        { id: 'CSE', name: 'Computer Science & Engineering', head: 'Dr. Alan Turing', faculty: 42, students: 850, status: 'Active' },
        { id: 'ECE', name: 'Electronics & Communication', head: 'Dr. Ada Lovelace', faculty: 35, students: 620, status: 'Active' },
        { id: 'MEC', name: 'Mechanical Engineering', head: 'Dr. Nikola Tesla', faculty: 28, students: 540, status: 'Active' },
        { id: 'CIV', name: 'Civil Engineering', head: 'Dr. Isambard Brunel', faculty: 22, students: 480, status: 'Maintenance' },
        { id: 'AIML', name: 'Artificial Intelligence & ML', head: 'Dr. Geoffrey Hinton', faculty: 18, students: 300, status: 'Active' },
    ];

    const [departments, setDepartments] = useState(() => {
        const isSeeded = localStorage.getItem('dms_courses_faculty_seeded_v1');
        const saved = JSON.parse(localStorage.getItem('departments'));
        if (!isSeeded) return defaultDepartments;
        // Strict preservation: if seeded, whatever is in saved gets used.
        // If the user deleted all items, saved is [], and we SHOULD return [] so it stays deleted.
        return saved !== null ? saved : defaultDepartments;
    });
    const defaultCourses = [
        { id: 'C1', code: '24UMA463', name: 'Operations Research', type: 'Theory', credits: 4, faculty: 'Dr CHELLAPRIYA K', desc: 'Category: Theory | Hours: 7 | Abbreviation: OR', outcome: 'Understanding Operations Research' },
        { id: 'C2', code: '24UAM411', name: 'Artificial Intelligence', type: 'Integrated', credits: 4, faculty: 'Dr NIRMALA DEVI J, Ms RAAKESH M', desc: 'Category: Integrated Course | Hours: 4+3 | Abbreviation: AI', outcome: 'Mastering AI principles' },
        { id: 'C3', code: '24UCB513', name: 'Object Oriented Approach for Software Engineering', type: 'Integrated', credits: 3, faculty: 'Ms ARUNA R, Ms RAAKESH M', desc: 'Category: Integrated Course | Hours: 4+3 | Abbreviation: OOSE', outcome: 'Software Engineering approaches' },
        { id: 'C4', code: '24UCS511', name: 'Computer Networks', type: 'Integrated', credits: 4, faculty: 'Ms YAMUNA S, Ms JASMINI SARANYA P', desc: 'Category: Integrated Course | Hours: 4+2 | Abbreviation: CN', outcome: 'Understanding Computer Networks' },
        { id: 'C5', code: '24UCS414', name: 'Operating Systems', type: 'Integrated', credits: 4, faculty: 'MR RAAKESH M, Ms ANITHA M', desc: 'Category: Integrated Course | Hours: 4+3 | Abbreviation: OS', outcome: 'Concepts of Operating Systems' },
        { id: 'C6', code: '24UCPE12 / 24UCPE11', name: 'Research Methodology / Entrepreneurship Development', type: 'Integrated', credits: 0, faculty: 'Ms AKILANDESWARI M, Dr K KARTHIK', desc: 'Category: Integrated Course | Hours: 4 | Abbreviation: RM/ED', outcome: 'Research and Entrepreneurship' },
        { id: 'C7', code: 'LL', name: 'Life Lab', type: 'Lab', credits: 0, faculty: 'Ms LALITHA, Mr GLADWIN JOHN', desc: 'Category: Integrated Course | Hours: 2 | Abbreviation: LL', outcome: 'Life skills and well-being' },
        { id: 'C8', code: 'CS', name: 'Communication Skill', type: 'Lab', credits: 0, faculty: 'TBD', desc: 'Category: Integrated Course | Abbreviation: CS', outcome: 'Improving communication skills' }
    ];

    const [courses, setCourses] = useState(() => {
        const isSeeded = localStorage.getItem('dms_courses_faculty_seeded_v1');
        const saved = JSON.parse(localStorage.getItem('courses'));
        if (!isSeeded) return defaultCourses;
        // Strict preservation: if seeded, whatever is in saved gets used. We ONLY fallback to default if saved is literally null/missing, not if it's empty.
        // If the user deleted all items, saved is [], and we SHOULD return [] so it stays deleted.
        return saved !== null ? saved : defaultCourses;
    });

    const defaultFaculty = [
        { id: 'F1', name: 'Dr CHELLAPRIYA K', dept: 'S&H', role: 'Associate Professor', subject: 'Operations Research', email: 'chellapriya@dms.edu', phone: '+91 98400 11001', qualification: 'Ph.D. Mathematics', experience: '14 years', specialization: 'Operations Research, Linear Programming', publications: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chellapriya' },
        { id: 'F2', name: 'Dr NIRMALA DEVI J (I)', dept: 'AI&ML', role: 'Professor', subject: 'Artificial Intelligence', email: 'nirmala@dms.edu', phone: '+91 98400 11002', qualification: 'Ph.D. AI, M.E. CSE', experience: '20 years', specialization: 'AI, Machine Learning, Deep Learning', publications: 24, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nirmala' },
        { id: 'F3', name: 'Ms RAAKESH M (A)', dept: 'AI&ML', role: 'Assistant Professor', subject: 'Artificial Intelligence, OOSE', email: 'raakesh@dms.edu', phone: '+91 98400 11003', qualification: 'M.E. CSE', experience: '7 years', specialization: 'Software Engineering, OS, AI', publications: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raakesh' },
        { id: 'F4', name: 'Ms ARUNA R (I)', dept: 'AI&ML', role: 'Assistant Professor', subject: 'Object Oriented Approach for Software Engineering', email: 'aruna@dms.edu', phone: '+91 98400 11004', qualification: 'M.E. CSE', experience: '6 years', specialization: 'OOP, UML, Design Patterns', publications: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aruna' },
        { id: 'F5', name: 'Ms YAMUNA S (I)', dept: 'AI&DS', role: 'Assistant Professor', subject: 'Computer Networks', email: 'yamuna@dms.edu', phone: '+91 98400 11005', qualification: 'M.E. Networks', experience: '9 years', specialization: 'Computer Networks, IoT, Network Security', publications: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yamuna' },
        { id: 'F6', name: 'Ms JASMINI SARANYA P (A)', dept: 'AI&DS', role: 'Assistant Professor', subject: 'Computer Networks', email: 'jasmini@dms.edu', phone: '+91 98400 11006', qualification: 'M.Tech Networks', experience: '5 years', specialization: 'Wireless Networks, SDN', publications: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jasmini' },
        { id: 'F7', name: 'MR RAAKESH M (I)', dept: 'AI&ML', role: 'Assistant Professor', subject: 'Operating Systems', email: 'raakesh2@dms.edu', phone: '+91 98400 11007', qualification: 'M.E. CSE', experience: '7 years', specialization: 'Operating Systems, Virtualization', publications: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raakeshI' },
        { id: 'F8', name: 'Ms ANITHA M (A)', dept: 'AI&ML', role: 'Assistant Professor', subject: 'Operating Systems', email: 'anitha@dms.edu', phone: '+91 98400 11008', qualification: 'M.E. CSE', experience: '8 years', specialization: 'OS, Distributed Systems', publications: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anitha' },
        { id: 'F9', name: 'Ms AKILANDESWARI M', dept: 'AI&DS', role: 'Assistant Professor', subject: 'Research Methodology', email: 'akilandeswari@dms.edu', phone: '+91 98400 11009', qualification: 'M.Phil. CS', experience: '10 years', specialization: 'Research Methods, Data Science', publications: 9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akilandeswari' },
        { id: 'F10', name: 'Dr K KARTHIK', dept: 'Mech', role: 'Assistant Professor', subject: 'Entrepreneurship Development', email: 'karthik@dms.edu', phone: '+91 98400 11010', qualification: 'Ph.D. Management', experience: '12 years', specialization: 'Entrepreneurship, Innovation Management', publications: 11, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karthik' },
        { id: 'F11', name: 'Ms LALITHA', dept: 'S&H', role: 'Faculty', subject: 'Life Lab', email: 'lalitha@dms.edu', phone: '+91 98400 11011', qualification: 'M.A. Soft Skills', experience: '6 years', specialization: 'Communication, Leadership, Soft Skills', publications: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lalitha' },
        { id: 'F12', name: 'Mr GLADWIN JOHN', dept: 'S&H', role: 'Faculty', subject: 'Life Lab', email: 'gladwin@dms.edu', phone: '+91 98400 11012', qualification: 'M.B.A. HR', experience: '5 years', specialization: 'Emotional Intelligence, Team Building', publications: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gladwin' },
    ];

    const [faculty, setFaculty] = useState(() => {
        const isSeeded = localStorage.getItem('dms_courses_faculty_seeded_v1');
        const saved = JSON.parse(localStorage.getItem('faculty'));
        if (!isSeeded) return defaultFaculty;
        // Strict preservation: if seeded, whatever is in saved gets used. We ONLY fallback to default if saved is literally null/missing, not if it's empty.
        // If the user deleted all items, saved is [], and we SHOULD return [] so it stays deleted.
        return saved !== null ? saved : defaultFaculty;
    });
    const [attendance, setAttendance] = useState(() => JSON.parse(localStorage.getItem('attendance')) || []);
    const [examResults, setExamResults] = useState(() => JSON.parse(localStorage.getItem('examResults')) || []);
    const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('notifications')) || []);
    const [magazine, setMagazine] = useState(() => JSON.parse(localStorage.getItem('magazine')) || []);
    const [googleForms, setGoogleForms] = useState(() => JSON.parse(localStorage.getItem('googleForms')) || []);
    const [courseraLinks, setCourseraLinks] = useState(() => JSON.parse(localStorage.getItem('courseraLinks')) || []);
    const [fees, setFees] = useState(() => JSON.parse(localStorage.getItem('fees')) || []);
    const [requestLetters, setRequestLetters] = useState(() => JSON.parse(localStorage.getItem('requestLetters')) || []);
    const [targetCourseId, setTargetCourseId] = useState(null);
    const [assignments, setAssignments] = useState(() => JSON.parse(localStorage.getItem('assignments')) || []);
    const [assignmentSubmissions, setAssignmentSubmissions] = useState(() => JSON.parse(localStorage.getItem('assignmentSubmissions')) || []);

    useEffect(() => {
        localStorage.setItem('dms_courses_faculty_seeded_v1', 'true');
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
        localStorage.setItem('requestLetters', JSON.stringify(requestLetters));
        localStorage.setItem('assignments', JSON.stringify(assignments));
        localStorage.setItem('assignmentSubmissions', JSON.stringify(assignmentSubmissions));
    }, [currentUser, departments, students, courses, faculty, attendance, examResults, notifications, magazine, googleForms, courseraLinks, fees, requestLetters, assignments, assignmentSubmissions]);

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
            requestLetters, setRequestLetters,
            targetCourseId, setTargetCourseId,
            assignments, setAssignments,
            assignmentSubmissions, setAssignmentSubmissions
        }}>
            {children}
        </AppContext.Provider>
    );
};
