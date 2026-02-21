// ═══════════════════════════════════════
//  DMS Login JS — case-insensitive, clean
// ═══════════════════════════════════════

const videoSources = {
    student: 'The_college_students_1080p_202601212125.mp4',
    faculty: 'The_faculty_teaching_1080p_202601220952.mp4',
    hod: 'The_aiml_hod_1080p_202601221036.mp4',
    parent: 'The_college_students_1080p_202601212125.mp4'
};

const panelVideo = document.getElementById('panel-video');

function selectRole(role) {
    // Highlight active button
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${role}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Swap video with crossfade
    if (panelVideo && videoSources[role]) {
        panelVideo.style.opacity = '0';
        setTimeout(() => {
            const src = panelVideo.querySelector('source');
            if (src) src.src = videoSources[role];
            panelVideo.load();
            panelVideo.play().catch(() => { });
            panelVideo.style.opacity = '1';
        }, 400);
    }

    // Hide all forms and loading
    document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
    const loading = document.getElementById('loading');
    if (loading) loading.classList.remove('active');

    // Show target form
    const form = document.getElementById(`${role}-form`);
    if (form) form.classList.add('active');
}

// ─── Form Submission Handlers ───
['student', 'faculty', 'hod', 'parent'].forEach(role => {
    const form = document.getElementById(`${role}-form`);
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            handleLogin(role);
        });
    }
});

function handleLogin(role) {
    let data = {};

    if (role === 'student') {
        const name = document.getElementById('s-name')?.value.trim();
        const rollNo = document.getElementById('s-roll')?.value.trim().toUpperCase(); // Case-insensitive
        if (!name || !rollNo) return showError('Please fill all fields.');
        data = { name: name.toUpperCase(), rollNo };
        localStorage.setItem('studentData', JSON.stringify(data));

    } else if (role === 'faculty') {
        const name = document.getElementById('f-name')?.value.trim().toUpperCase();
        const pass = document.getElementById('f-pass')?.value.trim();
        if (!name || !pass) return showError('Please fill all fields.');
        data = { name, password: pass };
        localStorage.setItem('facultyData', JSON.stringify(data));

    } else if (role === 'hod') {
        const name = document.getElementById('h-name')?.value.trim().toUpperCase();
        const pass = document.getElementById('h-pass')?.value.trim();
        if (!name || !pass) return showError('Please fill all fields.');
        data = { name, password: pass };
        localStorage.setItem('hodData', JSON.stringify(data));

    } else if (role === 'parent') {
        const name = document.getElementById('p-name')?.value.trim().toUpperCase();
        const roll = document.getElementById('p-roll')?.value.trim().toUpperCase();
        if (!name || !roll) return showError('Please fill all fields.');
        data = { name, childRoll: roll };
        localStorage.setItem('parentData', JSON.stringify(data));
    }

    // Store role (normalized)
    const roleMap = { student: 'Student', faculty: 'Faculty', hod: 'HOD', parent: 'Parent' };
    localStorage.setItem('userRole', roleMap[role]);

    // Show loading
    document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('active');

    // Redirect
    setTimeout(() => {
        if (role === 'student') {
            window.location.href = 'attendance.html';   // Students go to attendance first
        } else if (role === 'faculty') {
            window.location.href = 'faculty-dashboard.html';
        } else if (role === 'hod') {
            window.location.href = 'admin-dashboard.html';
        } else if (role === 'parent') {
            window.location.href = 'student-dashboard.html';
        }
    }, 1200);
}

function showError(msg) {
    const existing = document.querySelector('.login-error');
    if (existing) existing.remove();
    const err = document.createElement('div');
    err.className = 'login-error';
    err.style.cssText = 'color:#f87171;font-size:13px;text-align:center;margin:10px 0;padding:10px;background:rgba(239,68,68,0.1);border-radius:8px;border:1px solid rgba(239,68,68,0.2);';
    err.textContent = '⚠️ ' + msg;
    const activeForm = document.querySelector('.login-form.active');
    if (activeForm) activeForm.prepend(err);
    setTimeout(() => err.remove(), 3000);
}

// ─── Video transition style ───
if (panelVideo) {
    panelVideo.style.transition = 'opacity 0.5s ease';
}

// ─── Input focus micro-animation ───
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function () {
        this.closest('.form-group')?.style && (this.closest('.form-group').style.transform = 'scale(1.01)');
        this.closest('.form-group').style.transition = 'transform 0.2s ease';
    });
    input.addEventListener('blur', function () {
        if (this.closest('.form-group')) {
            this.closest('.form-group').style.transform = 'scale(1)';
        }
    });
    // Auto uppercase for name/ID fields (not passwords)
    if (input.type !== 'password') {
        input.addEventListener('input', function () {
            const pos = this.selectionStart;
            this.value = this.value.toUpperCase();
            this.setSelectionRange(pos, pos);
        });
    }
});
