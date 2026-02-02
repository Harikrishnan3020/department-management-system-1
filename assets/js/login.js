// Role Selection
function selectRole(role) {
    // Remove active class from all buttons and add to current
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${role}'`)) {
            btn.classList.add('active');
        }
    });

    // Hide all forms
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.remove('active');
    });

    // Show selected form
    const selectedForm = document.getElementById(`${role}-form`);
    if (selectedForm) {
        selectedForm.classList.add('active');
    }

    // Handle Left Panel Content
    const defaultContent = document.getElementById('default-panel-content');
    const studentVideoContainer = document.getElementById('student-video-container');
    const studentVideo = document.getElementById('student-video');
    const facultyVideoContainer = document.getElementById('faculty-video-container');
    const facultyVideo = document.getElementById('faculty-video');
    const hodVideoContainer = document.getElementById('hod-video-container');
    const hodVideo = document.getElementById('hod-video');

    // Reset all first
    if (defaultContent) defaultContent.style.display = 'block';
    if (studentVideoContainer) {
        studentVideoContainer.style.display = 'none';
        if (studentVideo) studentVideo.pause();
    }
    if (facultyVideoContainer) {
        facultyVideoContainer.style.display = 'none';
        if (facultyVideo) facultyVideo.pause();
    }
    if (hodVideoContainer) {
        hodVideoContainer.style.display = 'none';
        if (hodVideo) hodVideo.pause();
    }

    if (role === 'student') {
        if (defaultContent) defaultContent.style.display = 'none';
        if (studentVideoContainer) {
            studentVideoContainer.style.display = 'block';
            if (studentVideo) studentVideo.play().catch(e => console.log("Autoplay prevented:", e));
        }
    } else if (role === 'faculty') {
        if (defaultContent) defaultContent.style.display = 'none';
        if (facultyVideoContainer) {
            facultyVideoContainer.style.display = 'block';
            if (facultyVideo) facultyVideo.play().catch(e => console.log("Autoplay prevented:", e));
        }
    } else if (role === 'hod') {
        if (defaultContent) defaultContent.style.display = 'none';
        if (hodVideoContainer) {
            hodVideoContainer.style.display = 'block';
            if (hodVideo) hodVideo.play().catch(e => console.log("Autoplay prevented:", e));
        }
    }
}

// Form Submissions
const studentForm = document.getElementById('student-form');
if (studentForm) {
    studentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin('Student');
    });
}

const facultyForm = document.getElementById('faculty-form');
if (facultyForm) {
    facultyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin('Faculty');
    });
}

const hodForm = document.getElementById('hod-form');
if (hodForm) {
    hodForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin('HOD');
    });
}

const parentForm = document.getElementById('parent-form');
if (parentForm) {
    parentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin('Parent');
    });
}

// Handle Login
function handleLogin(role) {
    // Get form data based on role BEFORE hiding forms
    let formData = {};
    const activeForm = document.querySelector('.login-form.active');

    if (!activeForm) return;

    if (role === 'Student') {
        const inputs = activeForm.querySelectorAll('.form-input');
        const attendanceCheckbox = document.getElementById('markAttendance');
        const attendanceMarked = attendanceCheckbox ? attendanceCheckbox.checked : false;

        if (inputs.length >= 2) {
            formData = {
                name: inputs[0].value,
                rollNo: inputs[1].value,
                attendanceMarked: attendanceMarked,
                attendanceDate: new Date().toISOString(),
                attendanceTime: new Date().toLocaleTimeString()
            };
            // Store student data in localStorage
            localStorage.setItem('studentData', JSON.stringify(formData));

            // Store attendance record
            if (attendanceMarked) {
                const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
                attendanceRecords.push({
                    name: inputs[0].value,
                    rollNo: inputs[1].value,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    status: 'Present'
                });
                localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
            }
        }
    } else if (role === 'Faculty') {
        const inputs = activeForm.querySelectorAll('.form-input');
        if (inputs.length >= 2) {
            formData = {
                name: inputs[0].value,
                password: inputs[1].value
            };
            localStorage.setItem('facultyData', JSON.stringify(formData));
        }
    } else if (role === 'HOD') {
        const inputs = activeForm.querySelectorAll('.form-input');
        if (inputs.length >= 2) {
            formData = {
                name: inputs[0].value,
                password: inputs[1].value
            };
            localStorage.setItem('hodData', JSON.stringify(formData));
        }
    } else if (role === 'Parent') {
        const inputs = activeForm.querySelectorAll('.form-input');
        if (inputs.length >= 2) {
            formData = {
                name: inputs[0].value,
                email: inputs[1].value
            };
            localStorage.setItem('parentData', JSON.stringify(formData));
        }
    }

    // Hide all forms
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.remove('active');
    });

    // Show loading
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('active');
    }

    // Simulate API call
    setTimeout(() => {
        // Hide loading
        if (loading) {
            loading.classList.remove('active');
        }

        // Store user role
        localStorage.setItem('userRole', role);

        // Redirect to main dashboard
        window.location.href = 'index.html';
    }, 1500);
}

// Input Focus Animation
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function () {
        if (this.parentElement) {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        }
    });

    input.addEventListener('blur', function () {
        if (this.parentElement) {
            this.parentElement.style.transform = 'scale(1)';
        }
    });
});
