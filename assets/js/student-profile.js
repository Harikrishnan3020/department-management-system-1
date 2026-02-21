// Sample Student Data
const sampleStudents = [
    {
        id: 'CS2024001',
        name: 'John Doe',
        rollNumber: 'CS2024001',
        department: 'Computer Science & Engineering',
        program: 'B.Tech',
        academicYear: '2nd Year',
        tenthPercentage: 92.5,
        photo: null,
        semesters: [
            {
                semester: 1,
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
                subjects: [
                    { code: 'MA102', name: 'Engineering Mathematics II', credits: 4, marks: 82, maxMarks: 100, examDate: '2025-05-15' },
                    { code: 'CH101', name: 'Engineering Chemistry', credits: 4, marks: 76, maxMarks: 100, examDate: '2025-05-17' },
                    { code: 'CS102', name: 'Data Structures', credits: 4, marks: 89, maxMarks: 100, examDate: '2025-05-19' },
                    { code: 'CS103', name: 'Object Oriented Programming', credits: 3, marks: 91, maxMarks: 100, examDate: '2025-05-21' },
                    { code: 'HS101', name: 'Communication Skills', credits: 2, marks: 85, maxMarks: 100, examDate: '2025-05-23' }
                ]
            },
            {
                semester: 3,
                subjects: [
                    { code: 'CS201', name: 'Database Management Systems', credits: 4, marks: 88, maxMarks: 100, examDate: '2025-12-15' },
                    { code: 'CS202', name: 'Computer Organization', credits: 4, marks: 79, maxMarks: 100, examDate: '2025-12-17' },
                    { code: 'CS203', name: 'Discrete Mathematics', credits: 3, marks: 84, maxMarks: 100, examDate: '2025-12-19' },
                    { code: 'CS204', name: 'Operating Systems', credits: 4, marks: 86, maxMarks: 100, examDate: '2025-12-21' },
                    { code: 'CS205', name: 'Web Development', credits: 3, marks: 93, maxMarks: 100, examDate: '2025-12-23' }
                ]
            }
        ]
    },
    {
        id: 'CS2024002',
        name: 'Jane Smith',
        rollNumber: 'CS2024002',
        department: 'Computer Science & Engineering',
        program: 'B.Tech',
        academicYear: '2nd Year',
        tenthPercentage: 89.3,
        photo: null,
        semesters: [
            {
                semester: 1,
                subjects: [
                    { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, marks: 90, maxMarks: 100, examDate: '2024-12-15' },
                    { code: 'PH101', name: 'Engineering Physics', credits: 4, marks: 85, maxMarks: 100, examDate: '2024-12-17' },
                    { code: 'CS101', name: 'Programming Fundamentals', credits: 3, marks: 95, maxMarks: 100, examDate: '2024-12-19' },
                    { code: 'EE101', name: 'Basic Electrical Engineering', credits: 3, marks: 82, maxMarks: 100, examDate: '2024-12-21' },
                    { code: 'ME101', name: 'Engineering Graphics', credits: 2, marks: 78, maxMarks: 100, examDate: '2024-12-23' }
                ]
            },
            {
                semester: 2,
                subjects: [
                    { code: 'MA102', name: 'Engineering Mathematics II', credits: 4, marks: 88, maxMarks: 100, examDate: '2025-05-15' },
                    { code: 'CH101', name: 'Engineering Chemistry', credits: 4, marks: 82, maxMarks: 100, examDate: '2025-05-17' },
                    { code: 'CS102', name: 'Data Structures', credits: 4, marks: 94, maxMarks: 100, examDate: '2025-05-19' },
                    { code: 'CS103', name: 'Object Oriented Programming', credits: 3, marks: 89, maxMarks: 100, examDate: '2025-05-21' },
                    { code: 'HS101', name: 'Communication Skills', credits: 2, marks: 91, maxMarks: 100, examDate: '2025-05-23' }
                ]
            }
        ]
    },
    {
        id: 'EC2024001',
        name: 'Robert Wilson',
        rollNumber: 'EC2024001',
        department: 'Electronics & Communication',
        program: 'B.Tech',
        academicYear: '2nd Year',
        tenthPercentage: 87.8,
        photo: null,
        semesters: [
            {
                semester: 1,
                subjects: [
                    { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, marks: 78, maxMarks: 100, examDate: '2024-12-15' },
                    { code: 'PH101', name: 'Engineering Physics', credits: 4, marks: 82, maxMarks: 100, examDate: '2024-12-17' },
                    { code: 'EC101', name: 'Basic Electronics', credits: 3, marks: 88, maxMarks: 100, examDate: '2024-12-19' },
                    { code: 'EE101', name: 'Circuit Theory', credits: 3, marks: 85, maxMarks: 100, examDate: '2024-12-21' },
                    { code: 'ME101', name: 'Engineering Graphics', credits: 2, marks: 76, maxMarks: 100, examDate: '2024-12-23' }
                ]
            }
        ]
    }
];

// Global Variables
let students = [];
let currentStudent = null;
let currentSemester = 1;
let userRole = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeData();
    checkAccess();
    applyRoleBasedUI();

    // Check for student ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');

    if (studentId) {
        showStudentProfile(studentId);
    } else {
        renderStudentsList();
    }
});

// Initialize Data from localStorage or use sample data
function initializeData() {
    const savedStudents = localStorage.getItem('dmsStudents');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    } else {
        students = sampleStudents;
        saveStudents();
    }
}

// Save students to localStorage
function saveStudents() {
    localStorage.setItem('dmsStudents', JSON.stringify(students));
}

// Check access permissions
function checkAccess() {
    userRole = localStorage.getItem('userRole');

    // If no role, show access denied (except if coming directly - allow viewing if logged in as student)
    if (!userRole) {
        document.getElementById('accessDenied').style.display = 'block';
        document.getElementById('studentsSection').style.display = 'none';
        return false;
    }

    return true;
}

// Apply role-based UI changes
function applyRoleBasedUI() {
    const role = userRole ? userRole.toLowerCase() : '';

    // Update portal subtitle and dashboard link
    const subtitleElement = document.getElementById('portalSubtitle');
    const dashboardLink = document.querySelector('.nav-link[href="dashboard.html"]');

    if (role === 'hod') {
        subtitleElement.textContent = 'Admin Portal';
        if (dashboardLink) dashboardLink.href = 'admin-dashboard.html';
    } else if (role === 'faculty') {
        subtitleElement.textContent = 'Faculty Portal';
        if (dashboardLink) dashboardLink.href = 'faculty-dashboard.html';
    } else if (role === 'student') {
        subtitleElement.textContent = 'Student Portal';
        if (dashboardLink) dashboardLink.href = 'student-dashboard.html';
    } else {
        subtitleElement.textContent = 'Portal';
    }

    // Show/hide admin-only elements
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        if (role === 'hod') { // HOD is treated as Admin
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });

    // Show/hide faculty-only elements
    const facultyElements = document.querySelectorAll('.faculty-only');
    facultyElements.forEach(el => {
        if (role === 'faculty') {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });

    // Show edit marks button for Admin and Faculty
    const editMarksBtn = document.querySelector('.edit-marks-btn');
    if (editMarksBtn) {
        if (role === 'hod' || role === 'faculty') {
            editMarksBtn.style.display = '';
        } else {
            editMarksBtn.style.display = 'none';
        }
    }

    // For students, show only their own profile
    if (role === 'student') {
        const studentData = localStorage.getItem('studentData');
        if (studentData) {
            const parsed = JSON.parse(studentData);
            const student = students.find(s =>
                s.rollNumber.toLowerCase() === parsed.rollNo?.toLowerCase()
            );
            if (student) {
                showStudentProfile(student.id);
            }
        }
    }
}

// Render Students List
function renderStudentsList(filteredStudents = null) {
    const grid = document.getElementById('studentsGrid');
    const studentsToRender = filteredStudents || students;

    grid.innerHTML = studentsToRender.map(student => {
        const cgpa = calculateCGPA(student);
        const photoUrl = student.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&size=64&background=667eea&color=fff&bold=true`;

        return `
            <div class="student-card" onclick="showStudentProfile('${student.id}')">
                <div class="student-card-cgpa">CGPA: ${cgpa.toFixed(2)}</div>
                <div class="student-card-header">
                    <img src="${photoUrl}" alt="${student.name}" class="student-card-image">
                    <div class="student-card-info">
                        <h3>${student.name}</h3>
                        <span class="roll-no">${student.rollNumber}</span>
                    </div>
                </div>
                <div class="student-card-details">
                    <span class="student-card-detail">📚 ${student.program}</span>
                    <span class="student-card-detail">🏢 ${student.department.split(' ')[0]}</span>
                    <span class="student-card-detail">📅 ${student.academicYear}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Search Students
function searchStudents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) {
        renderStudentsList();
        return;
    }

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.rollNumber.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query)
    );

    renderStudentsList(filtered);
}

// Show Student Profile
function showStudentProfile(studentId) {
    currentStudent = students.find(s => s.id === studentId);
    if (!currentStudent) return;

    document.getElementById('studentsSection').style.display = 'none';
    document.getElementById('profileSection').style.display = 'block';

    // Update profile info
    const photoUrl = currentStudent.photo ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStudent.name)}&size=150&background=667eea&color=fff&bold=true`;

    document.getElementById('profileImage').src = photoUrl;
    document.getElementById('studentName').textContent = currentStudent.name;
    document.getElementById('departmentBadge').textContent = currentStudent.department;
    document.getElementById('rollNumber').textContent = currentStudent.rollNumber;
    document.getElementById('academicYear').textContent = currentStudent.academicYear;
    document.getElementById('program').textContent = currentStudent.program;
    document.getElementById('tenthPercentage').textContent = currentStudent.tenthPercentage + '%';

    // Calculate and display CGPA
    const cgpa = calculateCGPA(currentStudent);
    document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);

    // Calculate total credits
    let totalCredits = 0;
    currentStudent.semesters.forEach(sem => {
        sem.subjects.forEach(sub => {
            totalCredits += sub.credits;
        });
    });
    document.getElementById('totalCredits').textContent = totalCredits;

    // Render semester tabs
    renderSemesterTabs();

    // Show first semester
    currentSemester = 1;
    showSemesterMarks(1);

    // Apply role-based UI again for profile section
    applyRoleBasedUI();
}

// Show Students List
function showStudentsList() {
    document.getElementById('profileSection').style.display = 'none';
    document.getElementById('studentsSection').style.display = 'block';
    currentStudent = null;
}

// Render Semester Tabs
function renderSemesterTabs() {
    const tabsContainer = document.getElementById('semesterTabs');
    const semesters = currentStudent.semesters;

    tabsContainer.innerHTML = semesters.map((sem, index) => `
        <button class="semester-tab ${index === 0 ? 'active' : ''}" 
                onclick="showSemesterMarks(${sem.semester})">
            Semester ${sem.semester}
        </button>
    `).join('');
}

// Show Semester Marks
function showSemesterMarks(semesterNum) {
    currentSemester = semesterNum;

    // Update active tab
    document.querySelectorAll('.semester-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.includes(semesterNum)) {
            tab.classList.add('active');
        }
    });

    const semester = currentStudent.semesters.find(s => s.semester === semesterNum);
    if (!semester) {
        document.getElementById('marksTableBody').innerHTML = `
            <tr><td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">
                No marks available for this semester
            </td></tr>
        `;
        return;
    }

    document.getElementById('semesterTitle').textContent = `Semester ${semesterNum}`;

    // Calculate SGPA for this semester
    const sgpa = calculateSGPA(semester);
    document.getElementById('semesterSgpa').textContent = sgpa.toFixed(2);
    document.getElementById('currentSgpa').textContent = sgpa.toFixed(2);

    // Render marks table
    const tbody = document.getElementById('marksTableBody');
    tbody.innerHTML = semester.subjects.map(subject => {
        const grade = getGrade(subject.marks);
        const gradePoints = getGradePoints(subject.marks);

        return `
            <tr>
                <td><strong>${subject.code}</strong></td>
                <td>${subject.name}</td>
                <td>${subject.credits}</td>
                <td>${subject.marks}</td>
                <td>${subject.maxMarks}</td>
                <td><span class="grade-badge grade-${grade}">${grade}</span></td>
                <td>${gradePoints.toFixed(1)}</td>
                <td>${formatDate(subject.examDate)}</td>
            </tr>
        `;
    }).join('');
}

// Calculate Grade from Marks
function getGrade(marks) {
    if (marks >= 90) return 'O';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
}

// Get Grade Points from Marks (10-point scale)
function getGradePoints(marks) {
    if (marks >= 90) return 10;
    if (marks >= 80) return 9;
    if (marks >= 70) return 8;
    if (marks >= 60) return 7;
    if (marks >= 50) return 6;
    if (marks >= 40) return 5;
    return 0;
}

// Calculate SGPA for a semester
function calculateSGPA(semester) {
    let totalCredits = 0;
    let totalGradePoints = 0;

    semester.subjects.forEach(subject => {
        const gradePoint = getGradePoints(subject.marks);
        totalGradePoints += gradePoint * subject.credits;
        totalCredits += subject.credits;
    });

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
}

// Calculate CGPA
function calculateCGPA(student) {
    if (!student.semesters || student.semesters.length === 0) return 0;

    let totalCredits = 0;
    let totalGradePoints = 0;

    student.semesters.forEach(semester => {
        semester.subjects.forEach(subject => {
            const gradePoint = getGradePoints(subject.marks);
            totalGradePoints += gradePoint * subject.credits;
            totalCredits += subject.credits;
        });
    });

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
}

// Format Date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Show Add Student Modal
function showAddStudentModal() {
    document.getElementById('addStudentModal').classList.add('active');
}

// Add Student
function addStudent(event) {
    event.preventDefault();

    const newStudent = {
        id: document.getElementById('newRollNumber').value,
        name: document.getElementById('newStudentName').value,
        rollNumber: document.getElementById('newRollNumber').value,
        department: document.getElementById('newDepartment').value,
        program: document.getElementById('newProgram').value,
        academicYear: document.getElementById('newAcademicYear').value,
        tenthPercentage: parseFloat(document.getElementById('newTenthPercentage').value),
        photo: null,
        semesters: []
    };

    students.push(newStudent);
    saveStudents();
    renderStudentsList();
    hideModal('addStudentModal');

    // Reset form
    document.getElementById('addStudentForm').reset();

    alert('Student added successfully!');
}

// Edit Student Details
function editStudentDetails() {
    if (!currentStudent) return;

    document.getElementById('editStudentName').value = currentStudent.name;
    document.getElementById('editRollNumber').value = currentStudent.rollNumber;
    document.getElementById('editDepartment').value = currentStudent.department;
    document.getElementById('editProgram').value = currentStudent.program;
    document.getElementById('editAcademicYear').value = currentStudent.academicYear;
    document.getElementById('editTenthPercentage').value = currentStudent.tenthPercentage;

    document.getElementById('editStudentModal').classList.add('active');
}

// Save Student Details
function saveStudentDetails(event) {
    event.preventDefault();

    const index = students.findIndex(s => s.id === currentStudent.id);
    if (index === -1) return;

    students[index].name = document.getElementById('editStudentName').value;
    students[index].department = document.getElementById('editDepartment').value;
    students[index].program = document.getElementById('editProgram').value;
    students[index].academicYear = document.getElementById('editAcademicYear').value;
    students[index].tenthPercentage = parseFloat(document.getElementById('editTenthPercentage').value);

    currentStudent = students[index];
    saveStudents();

    // Refresh profile display
    showStudentProfile(currentStudent.id);
    hideModal('editStudentModal');

    alert('Student details updated successfully!');
}

// Delete Student
function deleteStudent() {
    if (!currentStudent) return;

    if (confirm(`Are you sure you want to delete ${currentStudent.name}'s profile? This action cannot be undone.`)) {
        students = students.filter(s => s.id !== currentStudent.id);
        saveStudents();
        showStudentsList();
        renderStudentsList();
        alert('Student deleted successfully!');
    }
}

// Show Edit Marks Modal
function showEditMarksModal() {
    const semester = currentStudent.semesters.find(s => s.semester === currentSemester);

    document.getElementById('editMarksSemester').textContent = `Semester ${currentSemester}`;

    const grid = document.getElementById('marksEditGrid');

    if (!semester) {
        grid.innerHTML = `
            <p style="padding: 20px; color: #64748b;">No subjects found for this semester. Add subjects first.</p>
        `;
    } else {
        grid.innerHTML = semester.subjects.map((subject, index) => `
            <div class="marks-edit-item">
                <div class="marks-edit-subject">
                    <strong>${subject.code}</strong> - ${subject.name}
                </div>
                <input type="number" class="marks-edit-input" 
                       id="marks-${index}" 
                       value="${subject.marks}" 
                       min="0" max="100" 
                       placeholder="Marks">
                <input type="date" class="marks-edit-input" 
                       id="date-${index}" 
                       value="${subject.examDate}">
            </div>
        `).join('');
    }

    document.getElementById('editMarksModal').classList.add('active');
}

// Save Marks
function saveMarks(event) {
    event.preventDefault();

    const semesterIndex = currentStudent.semesters.findIndex(s => s.semester === currentSemester);
    if (semesterIndex === -1) return;

    currentStudent.semesters[semesterIndex].subjects.forEach((subject, index) => {
        const marksInput = document.getElementById(`marks-${index}`);
        const dateInput = document.getElementById(`date-${index}`);

        if (marksInput) {
            subject.marks = parseInt(marksInput.value) || 0;
        }
        if (dateInput) {
            subject.examDate = dateInput.value;
        }
    });

    // Update in students array
    const studentIndex = students.findIndex(s => s.id === currentStudent.id);
    if (studentIndex !== -1) {
        students[studentIndex] = currentStudent;
    }

    saveStudents();

    // Refresh marks display
    showSemesterMarks(currentSemester);

    // Recalculate CGPA
    const cgpa = calculateCGPA(currentStudent);
    document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);

    hideModal('editMarksModal');

    alert('Marks updated successfully!');
}

// Change Photo (placeholder - would need file upload implementation)
function changePhoto() {
    alert('Photo upload feature would open a file picker here. This is a demo placeholder.');
}

// Hide Modal
function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Logout
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('studentData');
    localStorage.removeItem('facultyData');
    localStorage.removeItem('hodData');
    window.location.href = 'login.html';
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});
