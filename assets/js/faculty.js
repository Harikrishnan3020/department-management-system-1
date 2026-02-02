window.addEventListener('DOMContentLoaded', function () {
    const facultyData = JSON.parse(localStorage.getItem('facultyData') || '{}');

    if (facultyData.name) {
        document.getElementById('facultyName').textContent = facultyData.name;
    } else {
        window.location.href = 'login.html';
    }
});

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');
    if (event && event.target) {
        const closestLink = event.target.closest('.nav-link');
        if (closestLink) {
            closestLink.classList.add('active');
        }
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

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});
