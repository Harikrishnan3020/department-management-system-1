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

// Search functionality (demo)
const searchInput = document.querySelector('.search-box input');
const tableRows = document.querySelectorAll('tbody tr');

if (searchInput) {
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();

        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Button click handlers (demo)
document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function () {
        alert('Edit functionality - Ready for backend integration');
    });
});

document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this department?')) {
            alert('Delete functionality - Ready for backend integration');
        }
    });
});

const btnPrimary = document.querySelector('.btn-primary');
if (btnPrimary) {
    btnPrimary.addEventListener('click', function () {
        alert('Add Department functionality - Ready for backend integration');
    });
}

// Role-based welcome and quick access
window.addEventListener('DOMContentLoaded', function () {
    const userRole = localStorage.getItem('userRole');
    const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
    const facultyData = JSON.parse(localStorage.getItem('facultyData') || '{}');
    const hodData = JSON.parse(localStorage.getItem('hodData') || '{}');

    const welcomeText = document.getElementById('welcomeText');
    const quickAccessButtons = document.getElementById('quickAccessButtons');

    if (!welcomeText) return;

    if (userRole === 'Student' && studentData.name) {
        welcomeText.textContent = `Welcome, ${studentData.name}!`;
        quickAccessButtons.innerHTML = `
            <button onclick="window.location.href='student-dashboard.html'" style="background: #fff; color: #667eea; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif;">
                📊 Go to My Dashboard
            </button>
        `;
    } else if (userRole === 'Faculty' && facultyData.name) {
        welcomeText.textContent = `Welcome, ${facultyData.name}!`;
        quickAccessButtons.innerHTML = `
            <button onclick="window.location.href='faculty-dashboard.html'" style="background: #fff; color: #667eea; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif;">
                👨‍🏫 Go to Faculty Dashboard
            </button>
        `;
    } else if (userRole === 'HOD' && hodData.name) {
        welcomeText.textContent = `Welcome, ${hodData.name}!`;
        quickAccessButtons.innerHTML = `
            <button onclick="window.location.href='admin-dashboard.html'" style="background: #fff; color: #667eea; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif;">
                👔 Go to Admin Dashboard
            </button>
        `;
    } else {
        // No role detected, redirect to login
        window.location.href = 'login.html';
    }
});
