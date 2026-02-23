window.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard Loading... Checking session.');
    const studentData = DataService.getCurrentStudent();

    if (studentData) {
        console.log('Session verified for:', studentData.name);
        initSubmissionHandlers(); // Initialize form listeners

        // Basic Info - safely update
        const nameEl = document.getElementById('studentName');
        const rollEl = document.getElementById('studentRoll');
        const welcomeEl = document.getElementById('welcomeMessage');
        const avatarEl = document.getElementById('userAvatar');

        if (nameEl) nameEl.textContent = studentData.name;
        if (rollEl) rollEl.textContent = 'Roll No: ' + studentData.rollNumber;
        if (welcomeEl) welcomeEl.textContent = 'Welcome back, ' + studentData.name + '!';
        if (avatarEl) avatarEl.textContent = studentData.name.charAt(0).toUpperCase();

        // Stats Population
        const attendanceVal = document.getElementById('dash-attendance-val');
        if (attendanceVal && studentData.attendance) {
            attendanceVal.textContent = studentData.attendance.overall + '%';
        }

        const cgpaVal = document.getElementById('currentCGPA');
        if (cgpaVal && studentData.cgpa) {
            cgpaVal.textContent = studentData.cgpa;
        }

        const pendingVal = document.getElementById('dash-pending-val');
        if (pendingVal && studentData.assignments) {
            const pending = studentData.assignments.filter(a => a.status === 'pending').length;
            pendingVal.textContent = pending;

            const attendanceStatus = document.getElementById('attendanceStatus');
            if (attendanceStatus) {
                attendanceStatus.textContent = `You have ${pending} pending assignments and 0 upcoming exams this week.`;
            }
        }

        // Attendance Status Visual Feedback
        const authData = JSON.parse(localStorage.getItem('studentData') || '{}');
        const attendanceStatusNode = document.getElementById('attendanceStatus');
        if (authData.attendanceMarked && attendanceStatusNode) {
            attendanceStatusNode.innerHTML = `✅ <strong>Attendance marked!</strong> logged at ${authData.attendanceTime}`;
            attendanceStatusNode.style.color = '#10b981';
        }

        // Populate Dashboard Components
        populateDashboard(studentData);
    } else {
        console.error('DataService.getCurrentStudent() returned null. Redirecting to login.');
        const authCheck = localStorage.getItem('studentData');
        console.log('Raw studentData in localStorage:', authCheck);
        window.location.href = 'login.html';
    }
});

function populateDashboard(studentData) {
    // 1. Populate Courses
    const courseContainer = document.getElementById('dashboard-courses');
    if (courseContainer && studentData.schedule) {
        // Get today's classes
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];
        const todaysClasses = studentData.schedule[today] || [];

        // Show next 4 classes from the schedule (simplified for demo)
        const courses = todaysClasses.length > 0 ? todaysClasses : studentData.schedule['Monday'];

        courseContainer.innerHTML = courses.slice(0, 4).map(c => `
            <div class="course-item">
                <div class="course-icon">${c.subject.includes('Web') ? '🌐' : (c.subject.includes('Data') ? '💻' : '🔢')}</div>
                <div class="course-info">
                    <h4>${c.subject}</h4>
                    <p>${c.faculty} • Room: ${c.room} • ${c.time}</p>
                </div>
            </div>
        `).join('');
    }

    // 2. Populate Attendance Overview
    const attendanceContainer = document.getElementById('dashboard-attendance');
    if (attendanceContainer && studentData.attendance) {
        attendanceContainer.innerHTML = `
            <div class="attendance-progress">
                <div class="progress-header">
                    <span class="progress-label">Overall</span>
                    <span class="progress-value">${studentData.attendance.overall}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${studentData.attendance.overall}%"></div>
                </div>
            </div>
        ` + studentData.attendance.subjectWise.slice(0, 2).map(s => `
            <div class="attendance-progress">
                <div class="progress-header">
                    <span class="progress-label">${s.subject}</span>
                    <span class="progress-value">${s.percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${s.percentage}%"></div>
                </div>
            </div>
        `).join('');
    }

    // 3. Populate Pending Assignments
    const assignmentContainer = document.getElementById('dashboard-assignments');
    if (assignmentContainer && studentData.assignments) {
        assignmentContainer.innerHTML = studentData.assignments.slice(0, 3).map(a => `
            <div class="assignment-item" style="border-left-color: ${a.status === 'completed' ? '#10b981' : '#3b82f6'}">
                <h4>${a.title}</h4>
                <div class="assignment-meta">
                    <span class="assignment-due">Due: ${new Date(a.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span class="assignment-status ${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>
                </div>
            </div>
        `).join('');
    }
}

// Navigation Active State & Section Toggle
function showSection(sectionId) {
    // 1. Update Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        // Check if the link's onclick contains the sectionId
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${sectionId}'`)) {
            link.classList.add('active');
        }
    });

    // 2. Toggle Content Sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');

        // Update Page Title in Header
        const headerTitle = document.querySelector('.header-left h1');
        if (headerTitle) {
            headerTitle.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1) + ' Dashboard';
            if (sectionId === 'dashboard') headerTitle.textContent = 'Student Dashboard';
        }

        // Section Specific Logic
        if (sectionId === 'marks') {
            populateMarksSection();
        } else if (sectionId === 'attendance-timetable') {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = days[new Date().getDay()];
            renderTimetable(today === 'Sunday' ? 'Monday' : today);
            populateAttendanceHistory();
        } else if (sectionId === 'profile') {
            populateProfileSection();
        } else if (sectionId === 'submissions') {
            populateSubmissions();
        } else if (sectionId === 'calendar-exams') {
            populateCalendarExams();
        } else if (sectionId === 'requests') {
            populateRequests();
        } else if (sectionId === 'activities') {
            populateActivities();
        } else if (sectionId === 'parent-admin') {
            populateParentAdmin();
        }

        // Close mobile sidebar if open
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.overlay');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }

        // Trigger section-specific population (To be implemented in future modules)
        console.log(`Switched to section: ${sectionId}`);
    }
}

// --- Module 3: Marks Logic ---

function populateMarksSection() {
    const studentData = DataService.getCurrentStudent();
    if (!studentData || !studentData.semesters) return;

    // 1. Update CGPA and Credits
    document.getElementById('marks-cgpa').textContent = calculateCGPA(studentData).toFixed(2);

    let totalCredits = 0;
    studentData.semesters.forEach(sem => {
        sem.subjects.forEach(sub => totalCredits += sub.credits);
    });
    document.getElementById('marks-credits').textContent = totalCredits;

    // 2. Populate Semester Tabs
    const tabContainer = document.getElementById('marks-semester-tabs');
    if (tabContainer) {
        tabContainer.innerHTML = studentData.semesters.map((sem, index) => `
            <div class="semester-tab ${index === 0 ? 'active' : ''}" onclick="renderSemesterMarks(${sem.semester})">
                Semester ${sem.semester}
            </div>
        `).join('');

        // Render first semester by default
        if (studentData.semesters.length > 0) {
            renderSemesterMarks(studentData.semesters[0].semester);
        }
    }
}

function renderSemesterMarks(semNumber) {
    const studentData = DataService.getCurrentStudent();
    const semester = studentData.semesters.find(s => s.semester === semNumber);
    if (!semester) return;

    // Update Tab Active State
    document.querySelectorAll('.semester-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.includes(semNumber)) tab.classList.add('active');
    });

    // Populate Table
    const tableBody = document.getElementById('marks-table-body');
    if (tableBody) {
        tableBody.innerHTML = semester.subjects.map(sub => {
            const grade = getGrade(sub.marks);
            const gp = getGradePoints(sub.marks);
            return `
                <tr>
                    <td>${sub.code}</td>
                    <td>${sub.name}</td>
                    <td>${sub.credits}</td>
                    <td>${sub.marks}</td>
                    <td><span class="grade-badge grade-${grade}">${grade}</span></td>
                    <td>${gp.toFixed(1)}</td>
                </tr>
            `;
        }).join('');
    }
}

// GPA Calculation Helpers
function calculateCGPA(student) {
    let totalPoints = 0;
    let totalCredits = 0;
    student.semesters.forEach(sem => {
        sem.subjects.forEach(sub => {
            totalPoints += getGradePoints(sub.marks) * sub.credits;
            totalCredits += sub.credits;
        });
    });
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

function getGradePoints(marks) {
    if (marks >= 90) return 10.0;
    if (marks >= 80) return 9.0;
    if (marks >= 70) return 8.0;
    if (marks >= 60) return 7.0;
    if (marks >= 50) return 6.0;
    if (marks >= 40) return 5.0;
    return 0.0;
}

function getGrade(marks) {
    if (marks >= 90) return 'O';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
}

// --- Module 4: Attendance & Schedule Logic ---

function renderTimetable(day) {
    const studentData = DataService.getCurrentStudent();
    if (!studentData || !studentData.schedule) return;

    // Update Day Tabs
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.includes(day.slice(0, 3))) tab.classList.add('active');
    });

    const timetableBody = document.getElementById('timetable-content');
    if (timetableBody) {
        const classes = studentData.schedule[day] || [];

        if (classes.length === 0) {
            timetableBody.innerHTML = `
                <div class="section-card" style="padding: 40px; text-align: center; color: #64748b;">
                    No classes scheduled for ${day}.
                </div>
            `;
            return;
        }

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        timetableBody.innerHTML = classes.map(c => {
            // Very basic "current class" logic for demo:
            // Assuming time format "HH:MM AM/PM"
            const isCurrent = checkIsCurrentClass(c.time);

            return `
                <div class="timetable-card ${isCurrent ? 'current' : ''}">
                    <div class="time-slot">${c.time}</div>
                    <div class="class-details">
                        <h4>${c.subject}</h4>
                        <p>${c.faculty} • ${c.room}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function checkIsCurrentClass(timeStr) {
    // This is a simplified demo logic
    // In a real app, you'd parse the start/end times properly
    const now = new Date();
    const hour = now.getHours();
    const isPM = timeStr.includes('PM');
    let classHour = parseInt(timeStr.split(':')[0]);
    if (isPM && classHour < 12) classHour += 12;
    if (!isPM && classHour === 12) classHour = 0;

    // If the class hour matches current hour, highlight it
    return hour === classHour;
}

function populateAttendanceHistory() {
    const studentData = DataService.getCurrentStudent();
    if (!studentData || !studentData.attendance) return;

    document.getElementById('attendance-overall-val').textContent = studentData.attendance.overall + '%';

    const analyticsList = document.getElementById('attendance-detailed-list');
    if (analyticsList) {
        analyticsList.innerHTML = studentData.attendance.subjectWise.map(s => `
            <div class="attendance-progress" style="margin-bottom: 24px;">
                <div class="progress-header">
                    <span class="progress-label">${s.subject}</span>
                    <span class="progress-value">${s.percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${s.percentage}%"></div>
                </div>
                <p style="font-size: 11px; color: #64748b; margin-top: 6px;">
                    Target: 75% | Status: ${s.percentage >= 75 ? '<span style="color: #10b981">Safe</span>' : '<span style="color: #ef4444">Low</span>'}
                </p>
            </div>
        `).join('');
    }
}

window.renderTimetable = renderTimetable;

window.renderTimetable = renderTimetable;

function populateProfileSection() {
    const studentData = DataService.getCurrentStudent();
    if (!studentData) return;

    document.getElementById('prof-name').value = studentData.name;
    document.getElementById('prof-roll').value = studentData.rollNumber;
    document.getElementById('prof-dept').value = studentData.department;
    document.getElementById('prof-year').value = studentData.academicYear;
}

window.renderSemesterMarks = renderSemesterMarks;

// Mobile sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Handle Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('studentData');
        window.location.href = 'login.html';
    }
}

// --- New Extended Features Population ---

function populateSubmissions() {
    const studentData = DataService.getCurrentStudent();
    if (!studentData) return;

    // Get personal and global submissions
    const globalSubmissions = JSON.parse(localStorage.getItem('dms_global_submissions') || '[]');
    const mySubmissions = globalSubmissions.filter(s => s.studentRoll === studentData.rollNumber && s.category === 'Academic');

    // Merge with mock data for display
    const merged = [...(studentData.academicSubmissions || []), ...mySubmissions];

    const listBody = document.getElementById('submissions-list');
    if (listBody) {
        listBody.innerHTML = merged.sort((a, b) => new Date(b.date) - new Date(a.date)).map(sub => `
            <tr>
                <td><strong>${sub.type}</strong></td>
                <td>${sub.title || sub.purpose}</td>
                <td><span class="status-badge ${sub.status.toLowerCase().replace(' ', '-')}">${sub.status}</span></td>
                <td>
                    <button class="btn-view" style="padding: 4px 8px; font-size: 11px;" onclick="alert('Viewing: ${sub.fileName || 'Mock File'}')">👁️ View</button>
                    ${sub.signed ? '<span style="color: #10b981; margin-left:8px">🖋️ Signed</span>' : ''}
                </td>
            </tr>
        `).join('');
    }
}

function populateCalendarExams() {
    const calendarList = document.getElementById('calendar-list');
    if (calendarList) {
        calendarList.innerHTML = `
            <div class="assignment-item"><h4>Mid-Semester Examination</h4><div class="assignment-meta"><span>Feb 15 - Feb 22</span></div></div>
            <div class="assignment-item"><h4>Annual Cultural Fest</h4><div class="assignment-meta"><span>March 10</span></div></div>
            <div class="assignment-item"><h4>Project Submission</h4><div class="assignment-meta"><span>April 05</span></div></div>
        `;
    }

    const examList = document.getElementById('exam-list');
    if (examList) {
        examList.innerHTML = `
            <div class="course-item">
                <div class="course-icon">📝</div>
                <div class="course-info"><h4>Design & Analysis of Algorithms</h4><p>Feb 15 • 10:00 AM • Hall A-202</p></div>
            </div>
            <div class="course-item">
                <div class="course-icon">📝</div>
                <div class="course-info"><h4>Database Management Systems</h4><p>Feb 18 • 02:00 PM • Hall B-105</p></div>
            </div>
        `;
    }
}

function populateRequests() {
    const studentData = DataService.getCurrentStudent();
    if (!studentData) return;

    const globalSubmissions = JSON.parse(localStorage.getItem('dms_global_submissions') || '[]');
    const myRequests = globalSubmissions.filter(s => s.studentRoll === studentData.rollNumber && s.category === 'Certificate');

    const merged = [...(studentData.certificateRequests || []), ...myRequests];

    const listBody = document.getElementById('requests-status-list');
    if (listBody) {
        listBody.innerHTML = merged.map(req => `
            <div class="assignment-item" style="border-left-color: ${req.status === 'Processed' ? '#10b981' : '#f59e0b'}">
                <h4>${req.type}</h4>
                <div class="assignment-meta">
                    <span>${req.purpose || 'Official Use'}</span>
                    <span class="assignment-status ${req.status.toLowerCase()}">${req.status}</span>
                </div>
                <p style="font-size: 11px; margin-top: 5px; color: #64748b;">Submitted: ${new Date(req.date).toLocaleDateString()}</p>
            </div>
        `).join('');
    }
}

function initSubmissionHandlers() {
    const studentData = DataService.getCurrentStudent();

    // Helper to handle generic submission
    const handleSubmission = (formId, category, fields) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submission = {
                id: 'SUB' + Date.now(),
                studentName: studentData.name,
                studentRoll: studentData.rollNumber,
                category: category,
                date: new Date().toISOString(),
                status: 'Pending',
                ...fields()
            };

            // Store in global "database"
            const allSubmissions = JSON.parse(localStorage.getItem('dms_global_submissions') || '[]');
            allSubmissions.push(submission);
            localStorage.setItem('dms_global_submissions', JSON.stringify(allSubmissions));

            alert(`${category} submitted successfully! It is now visible to faculty.`);
            form.reset();

            // Refresh current section population
            if (category === 'Academic') populateSubmissions();
            if (category === 'Certificate') populateRequests();
            if (category === 'Leave') populateLeaveHistory();
            if (category === 'Admin') alert('Admin form uploaded successfully.');
        });
    };

    // 1. Academic Submissions
    handleSubmission('form-academic-submission', 'Academic', () => ({
        type: document.getElementById('acad-type').value,
        title: document.getElementById('acad-title').value,
        fileName: document.getElementById('acad-file').files[0]?.name || 'N/A'
    }));

    // 2. Certificate Requests
    handleSubmission('form-cert-request', 'Certificate', () => ({
        type: document.getElementById('req-type').value,
        purpose: document.getElementById('req-purpose').value,
        fileName: document.getElementById('req-file').files[0]?.name || 'N/A'
    }));

    // 3. Leave / OD Requests
    handleSubmission('form-leave-od', 'Leave', () => ({
        type: document.getElementById('leave-type').value,
        dates: document.getElementById('leave-dates').value,
        purpose: document.getElementById('leave-reason').value,
        fileName: document.getElementById('leave-file').files[0]?.name || 'N/A'
    }));

    // 4. Admin Uploads
    handleSubmission('form-admin-upload', 'Admin', () => ({
        type: document.getElementById('admin-type').value,
        fileName: document.getElementById('admin-file').files[0]?.name || 'N/A'
    }));
}

function populateLeaveHistory() {
    const studentData = DataService.getCurrentStudent();
    if (!studentData) return;

    const globalSubmissions = JSON.parse(localStorage.getItem('dms_global_submissions') || '[]');
    const myLeave = globalSubmissions.filter(s => s.studentRoll === studentData.rollNumber && s.category === 'Leave');

    const listBody = document.getElementById('leave-history-list');
    if (listBody) {
        if (myLeave.length === 0) {
            listBody.innerHTML = '<p style="text-align:center; padding: 20px; color:#64748b">No leave history found.</p>';
            return;
        }
        listBody.innerHTML = myLeave.map(l => `
            <div class="assignment-item" style="border-left-color: #3b82f6">
                <h4>${l.type}</h4>
                <div class="assignment-meta">
                    <span>${l.dates}</span>
                    <span class="assignment-status pending">${l.status}</span>
                </div>
            </div>
        `).join('');
    }
}

// Make functions globally accessible
window.showSection = showSection;
window.renderSemesterMarks = renderSemesterMarks;
window.renderTimetable = renderTimetable;
window.populateLeaveHistory = populateLeaveHistory;
