/**
 * 🎓 DMS Centralized Data Service
 * This file contains the mock data and data management logic for the 
 * Department Management System.
 */

const DMS_DATA = {
    students: [
        {
            id: 'CS2024001',
            name: 'John Doe',
            rollNumber: 'CS2024001',
            department: 'Computer Science & Engineering',
            program: 'B.Tech',
            academicYear: '2nd Year',
            tenthPercentage: 92.5,
            photo: null,
            cgpa: 8.6,
            attendance: {
                overall: 87,
                subjectWise: [
                    { subject: 'DSA', percentage: 92 },
                    { subject: 'DBMS', percentage: 85 },
                    { subject: 'Web Dev', percentage: 88 },
                    { subject: 'ML', percentage: 83 }
                ]
            },
            schedule: {
                Monday: [
                    { time: '09:00 AM', subject: 'Web Development', room: 'Lab 1', faculty: 'Prof. Arun Patel' },
                    { time: '11:00 AM', subject: 'Data Structures', room: 'LH-102', faculty: 'Prof. Rajesh Kumar' }
                ],
                Tuesday: [
                    { time: '10:00 AM', subject: 'Data Structures', room: 'LH-102', faculty: 'Prof. Rajesh Kumar' },
                    { time: '02:00 PM', subject: 'DBMS', room: 'Lab 2', faculty: 'Prof. Priya Sharma' }
                ],
                Wednesday: [
                    { time: '11:00 AM', subject: 'Machine Learning', room: 'LH-201', faculty: 'Prof. Sunita Reddy' },
                    { time: '03:00 PM', subject: 'Academic Seminar', room: 'Auditorium', faculty: 'HOD' }
                ],
                Thursday: [
                    { time: '09:00 AM', subject: 'Web Development', room: 'Lab 1', faculty: 'Prof. Arun Patel' },
                    { time: '01:00 PM', subject: 'Library Hour', room: 'Central Library', faculty: '-' }
                ],
                Friday: [
                    { time: '10:00 AM', subject: 'Machine Learning', room: 'Lab 4', faculty: 'Prof. Sunita Reddy' },
                    { time: '02:00 PM', subject: 'DBMS', room: 'LH-105', faculty: 'Prof. Priya Sharma' }
                ]
            },
            assignments: [
                { id: 1, title: 'Binary Search Tree Implementation', subject: 'DSA', due: '2026-01-18', status: 'pending' },
                { id: 2, title: 'Database Normalization Report', subject: 'DBMS', due: '2026-01-20', status: 'pending' },
                { id: 3, title: 'React Portfolio Project', subject: 'Web Dev', due: '2026-01-15', status: 'completed' }
            ],
            semesters: [
                {
                    semester: 1,
                    sgpa: 8.50,
                    subjects: [
                        { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, marks: 85, maxMarks: 100, examDate: '2024-12-15' },
                        { code: 'PH101', name: 'Engineering Physics', credits: 4, marks: 78, maxMarks: 100, examDate: '2024-12-17' },
                        { code: 'CS101', name: 'Programming Fundamentals', credits: 3, marks: 92, maxMarks: 100, examDate: '2024-12-19' },
                        { code: 'EE101', name: 'Basic Electrical Engineering', credits: 3, marks: 75, maxMarks: 100, examDate: '2024-12-21' },
                        { code: 'ME101', name: 'Engineering Graphics', credits: 2, marks: 88, maxMarks: 100, examDate: '2024-12-23' }
                    ]
                },
                {
                    semester: 2,
                    sgpa: 8.70,
                    subjects: [
                        { code: 'MA102', name: 'Engineering Mathematics II', credits: 4, marks: 82, maxMarks: 100, examDate: '2025-05-15' },
                        { code: 'CH101', name: 'Engineering Chemistry', credits: 4, marks: 76, maxMarks: 100, examDate: '2025-05-17' },
                        { code: 'CS102', name: 'Data Structures', credits: 4, marks: 89, maxMarks: 100, examDate: '2025-05-19' },
                        { code: 'CS103', name: 'Object Oriented Programming', credits: 3, marks: 91, maxMarks: 100, examDate: '2025-05-21' },
                        { code: 'HS101', name: 'Communication Skills', credits: 2, marks: 85, maxMarks: 100, examDate: '2025-05-23' }
                    ]
                }
            ],
            // New Extended Data Fields
            academicSubmissions: [
                { id: 'sub1', type: 'Lab Record', title: 'Data Structures Lab Notebook', status: 'Submitted', date: '2026-02-10', signed: true },
                { id: 'sub2', type: 'Project', title: 'Mini Project: Weather App - Mid Review', status: 'Pending', date: '2026-03-01', stage: 'Mid Review' },
                { id: 'sub3', type: 'Internship', title: 'Google Summer of Code Offer Letter', status: 'Approved', date: '2026-01-20' },
                { id: 'sub4', type: 'Industrial Visit', title: 'ISRO Satellite Center Report', status: 'Draft', date: '2026-02-15' },
                { id: 'sub5', type: 'Research', title: 'Blockchain in IoT - Initial Draft', status: 'In Review', date: '2026-02-18' }
            ],
            certificateRequests: [
                { id: 'req1', type: 'Bonafide', purpose: 'Bank Loan', status: 'Processed', date: '2026-02-05' },
                { id: 'req2', type: 'No Dues', status: 'Initiated', date: '2026-02-20', clearings: { library: true, lab: false, dept: true } }
            ],
            coCurricular: [
                { id: 'act1', type: 'Workshop', title: 'Cloud Computing Essentials', platform: 'NPTEL', status: 'Completed', certificate: true },
                { id: 'act2', type: 'Hackathon', title: 'Smart India Hackathon 2026', role: 'Team Lead', status: 'Participated', date: '2026-01-12' },
                { id: 'act3', type: 'Club', title: 'Coding Club', membership: 'Active Core Member' }
            ],
            administrative: {
                undertakings: [
                    { title: 'Anti-Ragging Undertaking', signed: true, date: '2025-08-15' }
                ],
                library: {
                    booksIssued: [
                        { title: 'Clean Code', dueDate: '2026-03-05' }
                    ],
                    fineRecords: '₹ 0.00'
                },
                hostel: {
                    roomNo: 'A-304',
                    messDues: 'Paid'
                },
                feedback: [
                    { semester: 3, course: 'DSA', submitted: true }
                ]
            }
        }
    ]
};

/**
 * Data Management Module
 */
const DataService = {
    // Initialize data in localStorage if not present
    init: function () {
        let students = JSON.parse(localStorage.getItem('dms_students') || '[]');

        // If students list is empty or doesn't have our primary mock student, reset/add it
        if (students.length === 0 || !students.find(s => s.id === 'CS2024001')) {
            localStorage.setItem('dms_students', JSON.stringify(DMS_DATA.students));
        }
    },

    // Get all students
    getStudents: function () {
        return JSON.parse(localStorage.getItem('dms_students') || '[]');
    },

    // Get a specific student by roll number or ID
    getStudentById: function (id) {
        const students = this.getStudents();
        return students.find(s => s.id === id || s.rollNumber === id);
    },

    // Update student data
    updateStudent: function (updatedStudent) {
        let students = this.getStudents();
        const index = students.findIndex(s => s.id === updatedStudent.id);
        if (index !== -1) {
            students[index] = updatedStudent;
            localStorage.setItem('dms_students', JSON.stringify(students));
            return true;
        }
        return false;
    },

    // Get logged-in student's complete data
    getCurrentStudent: function () {
        const authData = JSON.parse(localStorage.getItem('studentData') || '{}');
        if (authData.rollNo) {
            return this.getStudentById(authData.rollNo);
        }
        return null;
    }
};

// Auto-initialize on load
DataService.init();
