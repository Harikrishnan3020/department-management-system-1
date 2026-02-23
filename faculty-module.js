window.addEventListener('DOMContentLoaded', function () {
    const facultyData = JSON.parse(localStorage.getItem('facultyData') || '{}');

    if (facultyData.name) {
        document.getElementById('facultyName').textContent = facultyData.name;
    } else {
        window.location.href = 'login.html';
    }

    // Initialize Submissions Filter
    const filterSelect = document.getElementById('sub-filter-category');
    if (filterSelect) {
        filterSelect.addEventListener('change', populateFacultySubmissions);
    }

    populateRecentMarks();
});

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');

    // Highlight correct link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => {
        if (l.getAttribute('onclick') && l.getAttribute('onclick').includes(`'${sectionId}'`)) {
            l.classList.add('active');
        }
    });

    if (sectionId === 'submissions') {
        populateFacultySubmissions();
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('facultyData');
        window.location.href = 'login.html';
    }
}

function populateFacultySubmissions() {
    const listBody = document.getElementById('faculty-submissions-list');
    if (!listBody) return;

    const allSubmissions = JSON.parse(localStorage.getItem('dms_global_submissions') || '[]');
    const filter = document.getElementById('sub-filter-category')?.value || 'All';

    const filtered = allSubmissions.filter(s => filter === 'All' || s.category === filter);

    if (filtered.length === 0) {
        listBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No submissions found for this category.</td></tr>';
        return;
    }

    listBody.innerHTML = filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).map(s => `
        <tr>
            <td><strong>${s.studentName}</strong><br><small>${s.studentRoll}</small></td>
            <td><span class="badge category-${s.category.toLowerCase()}">${s.category}</span></td>
            <td>${s.type}</td>
            <td>${s.title || s.purpose || 'N/A'}</td>
            <td>${new Date(s.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
            <td><span class="status-badge-${s.status.toLowerCase()}">${s.status}</span></td>
            <td>
                <button class="btn-view" onclick="viewSubmissionDetails('${s.id}')">Review</button>
            </td>
        </tr>
    `).join('');
}

let activeSubmissionId = null;

function viewSubmissionDetails(id) {
    const allSubmissions = JSON.parse(localStorage.getItem('dms_global_submissions') || '[]');
    const sub = allSubmissions.find(s => s.id === id);
    if (!sub) return;

    activeSubmissionId = id;
    const content = document.getElementById('sub-detail-content');
    content.innerHTML = `
        <div style="background: rgba(0,0,0,0.03); padding: 15px; border-radius: 8px;">
            <p><strong>Student:</strong> ${sub.studentName} (${sub.studentRoll})</p>
            <p><strong>Category:</strong> ${sub.category}</p>
            <p><strong>Type:</strong> ${sub.type}</p>
            <p><strong>Submission Time:</strong> ${new Date(sub.date).toLocaleString()}</p>
            <p><strong>File Name:</strong> ${sub.fileName || 'No file uploaded'}</p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
            <p><strong>Description/Purpose:</strong><br>${sub.purpose || sub.title || 'N/A'}</p>
        </div>
    `;

    showModal('sub-detail-modal');
}

// Approval Actions
document.getElementById('btn-approve-sub')?.addEventListener('click', () => updateSubmissionStatus('Approved'));
document.getElementById('btn-reject-sub')?.addEventListener('click', () => updateSubmissionStatus('Rejected'));

function updateSubmissionStatus(newStatus) {
    if (!activeSubmissionId) return;

    const allSubmissions = JSON.parse(localStorage.getItem('dms_global_submissions') || '[]');
    const index = allSubmissions.findIndex(s => s.id === activeSubmissionId);

    if (index !== -1) {
        allSubmissions[index].status = newStatus;
        if (newStatus === 'Approved') {
            allSubmissions[index].signed = true;
            allSubmissions[index].signedBy = "Dr. Rajesh Kumar (Faculty)";
        }
        localStorage.setItem('dms_global_submissions', JSON.stringify(allSubmissions));

        alert(`Submission has been ${newStatus.toLowerCase()} successfully.`);
        hideModal('sub-detail-modal');
        populateFacultySubmissions();
    }
}

function searchStudentForMarks() {
    const roll = document.getElementById('marks-search-input').value;
    const students = JSON.parse(localStorage.getItem('dms_students') || '[]');
    const student = students.find(s => s.id === roll || s.rollNumber === roll);

    const resDiv = document.getElementById('marks-search-result');
    if (student) {
        document.getElementById('res-name').textContent = student.name;
        document.getElementById('res-roll').textContent = student.rollNumber;
        document.getElementById('res-cgpa').textContent = student.cgpa || 'N/A';
        resDiv.style.display = 'block';

        // Auto-fill modal if visible
        const modalName = document.querySelector('#marks-modal input[placeholder*="Auto-filled"]');
        const modalRoll = document.querySelector('#marks-modal input[placeholder*="roll number"]');
        if (modalName) modalName.value = student.name;
        if (modalRoll) modalRoll.value = student.rollNumber;
    } else {
        alert('Student not found!');
        resDiv.style.display = 'none';
    }
}

window.showSection = showSection;
window.showModal = showModal;
window.hideModal = hideModal;
window.viewSubmissionDetails = viewSubmissionDetails;
window.searchStudentForMarks = searchStudentForMarks;

function populateRecentMarks() {
    const list = document.getElementById('recent-marks-list');
    if (!list) return;

    // Standard mock list for faculty view
    const recent = [
        { roll: 'CS2024001', name: 'John Doe', course: 'Data Structures', marks: '18/20' },
        { roll: 'CS2024005', name: 'Jane Smith', course: 'DBMS', marks: '19/20' },
        { roll: 'CS2024012', name: 'Mike Brown', course: 'Web Tech', marks: '17/20' }
    ];

    list.innerHTML = recent.map(r => `
        <tr>
            <td>${r.roll}</td>
            <td>${r.name}</td>
            <td>${r.course}</td>
            <td><span style="font-weight:600; color:#4318FF">${r.marks}</span></td>
            <td><button class="btn-edit" onclick="alert('Editing marks for ${r.name}')">Edit</button></td>
        </tr>
    `).join('');
}
window.populateRecentMarks = populateRecentMarks;
