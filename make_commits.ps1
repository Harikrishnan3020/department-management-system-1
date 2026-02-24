
# Script to commit all files in logical groups with meaningful messages
# Set git config
git config user.email "harikrishnan3020@example.com"
git config user.name "Harikrishnan"

# Commit 1 - Package config files
Write-Host "Commit 1: Project config files"
git add package.json package-lock.json postcss.config.js tailwind.config.js vite.config.js
git commit -m "chore: add project config files (package.json, tailwind, vite, postcss)"

# Commit 2 - Vite/React entry files
Write-Host "Commit 2: React app entry points"
git add src/main.jsx src/index.css
git commit -m "feat: add React app entry point and global CSS styles"

# Commit 3 - App root component
Write-Host "Commit 3: App root"
git add src/App.jsx
git commit -m "feat: add root App component with routing configuration"

# Commit 4 - Context/State management
Write-Host "Commit 4: App context"
git add src/context/AppContext.jsx
git commit -m "feat: add AppContext for global state management"

# Commit 5 - Animated background component
Write-Host "Commit 5: AnimatedBackground component"
git add src/components/AnimatedBackground.jsx
git commit -m "feat: add AnimatedBackground component with particle effects"

# Commit 6 - Layouts
Write-Host "Commit 6: Layouts"
git add src/layouts/DashboardLayout.jsx src/layouts/PremiumLayout.jsx
git commit -m "feat: add DashboardLayout and PremiumLayout wrapper components"

# Commit 7 - Login page
Write-Host "Commit 7: Login page"
git add src/pages/Login.jsx
git commit -m "feat: add Login page with role-based authentication UI"

# Commit 8 - Dashboard page
Write-Host "Commit 8: Dashboard page"
git add src/pages/Dashboard.jsx
git commit -m "feat: add main Dashboard page with summary cards and navigation"

# Commit 9 - Departments page
Write-Host "Commit 9: Departments page"
git add src/pages/Departments.jsx
git commit -m "feat: add Departments page for managing academic departments"

# Commit 10 - Faculty page
Write-Host "Commit 10: Faculty page"
git add src/pages/Faculty.jsx
git commit -m "feat: add Faculty page with staff listing and management"

# Commit 11 - Students page
Write-Host "Commit 11: Students page"
git add src/pages/Students.jsx
git commit -m "feat: add Students page with student records and search"

# Commit 12 - Courses page
Write-Host "Commit 12: Courses page"
git add src/pages/Courses.jsx
git commit -m "feat: add Courses page with curriculum and subject management"

# Commit 13 - Attendance page
Write-Host "Commit 13: Attendance page"
git add src/pages/Attendance.jsx
git commit -m "feat: add Attendance page with Present/Absent/OD tracking"

# Commit 14 - Exam Results page
Write-Host "Commit 14: ExamResult page"
git add src/pages/ExamResult.jsx
git commit -m "feat: add ExamResult page for viewing student grades and results"

# Commit 15 - Fees page
Write-Host "Commit 15: Fees page"
git add src/pages/Fees.jsx
git commit -m "feat: add Fees page for fee payment tracking and management"

# Commit 16 - Portfolio pages
Write-Host "Commit 16: Portfolio pages"
git add src/pages/Portfolio.jsx src/pages/PortfolioLanding.jsx
git commit -m "feat: add Portfolio and PortfolioLanding pages for student showcase"

# Commit 17 - Coursera & Magazine pages
Write-Host "Commit 17: Coursera and Magazine pages"
git add src/pages/Coursera.jsx src/pages/Magazine.jsx
git commit -m "feat: add Coursera integration and Magazine pages for learning resources"

# Commit 18 - GoogleForm page
Write-Host "Commit 18: GoogleForm page"
git add src/pages/GoogleForm.jsx
git commit -m "feat: add GoogleForm page for embedded form submissions"

# Commit 19 - HTML core pages (login, index)
Write-Host "Commit 19: Core HTML pages"
git add index.html login.html
git commit -m "feat: add core HTML pages - index and login"

# Commit 20 - HTML dashboards
Write-Host "Commit 20: Dashboard HTML files"
git add dashboard.html admin-dashboard.html
git commit -m "feat: add admin and main dashboard HTML pages"

# Commit 21 - Faculty and student dashboards HTML
Write-Host "Commit 21: Faculty and student dashboard HTML"
git add faculty-dashboard.html student-dashboard.html student-dashboard-backup.html student-profile.html
git commit -m "feat: add faculty dashboard, student dashboard and student profile HTML pages"

# Commit 22 - Attendance HTML
Write-Host "Commit 22: Attendance HTML"
git add attendance.html
git commit -m "feat: add attendance management HTML page"

# Commit 23 - Legacy index HTML
Write-Host "Commit 23: Legacy index HTML"
git add index_old.html
git commit -m "chore: preserve legacy index.html for reference"

# Commit 24 - Faculty module JS and CSS
Write-Host "Commit 24: Faculty module JS/CSS"
git add faculty-module.js faculty-module.css
git commit -m "feat: add faculty module JavaScript logic and CSS styles"

# Commit 25 - Student module JS and CSS
Write-Host "Commit 25: Student module JS/CSS"
git add student-module.js student-module.css student-data.js
git commit -m "feat: add student module scripts, styles and data definitions"

# Commit 26 - Assets CSS files
Write-Host "Commit 26: Asset CSS files"
git add assets/css/
git commit -m "style: add CSS stylesheets for all pages and components"

# Commit 27 - Assets JS files
Write-Host "Commit 27: Asset JS files"
git add assets/js/
git commit -m "feat: add JavaScript logic files for all frontend modules"

# Commit 28 - Public folder (excluding large mp4)
Write-Host "Commit 28: Public assets"
git add public/ 2>&1
git commit -m "feat: add public assets including media and static resources" 2>&1

# Commit 29 - Dist build output
Write-Host "Commit 29: Distribution build"
git add dist/ 2>&1
git commit -m "build: add compiled distribution files from Vite build"

# Commit 30 - README and docs update
Write-Host "Commit 30: Docs update"
git add README.md
git commit -m "docs: update README with full project documentation and setup guide"

Write-Host ""
Write-Host "All commits created! Now pushing to dms1 remote..."
git push dms1 master --force
Write-Host "Done! All commits pushed to https://github.com/Harikrishnan3020/department-management-system-1.git"
