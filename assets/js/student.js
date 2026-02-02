// Get student info from localStorage
window.addEventListener('DOMContentLoaded', function () {
    const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');

    if (studentData.name) {
        document.getElementById('studentName').textContent = studentData.name;
        document.getElementById('studentRoll').textContent = 'Roll No: ' + studentData.rollNo;
        document.getElementById('welcomeMessage').textContent = 'Welcome back, ' + studentData.name + '!';

        // Set avatar initial
        const initial = studentData.name.charAt(0).toUpperCase();
        document.getElementById('userAvatar').textContent = initial;

        // Display attendance status
        const attendanceStatus = document.getElementById('attendanceStatus');
        if (studentData.attendanceMarked) {
            attendanceStatus.innerHTML = `✅ <strong>Attendance marked successfully!</strong> Logged in at ${studentData.attendanceTime} on ${new Date(studentData.attendanceDate).toLocaleDateString()}`;
            attendanceStatus.style.color = '#d1fae5';
        } else {
            attendanceStatus.textContent = 'You have 3 pending assignments and 2 upcoming exams this week.';
        }
    } else {
        // Redirect to login if no student data
        window.location.href = 'login.html';
    }
});

// Mobile sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Navigation active state
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('studentData');
        window.location.href = 'login.html';
    }
}
