# Changelog

All notable changes to the Department Management System are documented here.

## [2.0.0] - 2026-02-21

### Added
- Premium glassmorphism portfolio landing page (`index.html`)
- Multi-role login page with video background system per role
- Team section with all 9 members listed with roles
- Project team cards: Abishek S, Abishek TV, Aarthi S, MEERASOUNDHARYA R, RAMYA G, SIVARAM A M, DHARUNIKA N, SOWMYA M
- Hero dashboard mockup with live attendance data (Aarthi S, Abishek TV, MEERASOUNDHARYA R)
- Student profile mockup showing SOWMYA M with SGPA 9.4 and 96% attendance
- AIML section with Smart Campus Intelligence feature list
- About section with live student distribution visual card
- Scroll-reveal animations with Intersection Observer API

### Changed
- Renamed `index.html` → `dashboard.html` (admin dashboard)
- Renamed `portfolio.html` → `index.html` (now the landing page)
- Background changed from flat `#030508` to deep dark-blue gradient
- Hero section blank space removed (eliminated `margin-top: 60px` from `.mock-dash`)
- `hidden-element` removed from hero section to prevent blank page on load
- Student profile mock name changed to SOWMYA M
- Login redirect updated to point to `dashboard.html`
- Logout added to dashboard sidebar
- Scroll animation threshold lowered to 0.05 for quicker triggers

### Fixed
- Portfolio sections no longer appear blank/empty on scroll
- Login video synchronization improved with smooth fade transitions
- Student profile mock shows correct student name
- Dashboard routing fully integrated across all pages

## [1.0.0] - 2026-01-22

### Added
- Initial Department Management System structure
- Admin dashboard with departments table
- Faculty dashboard with student management
- Student dashboard with marks and attendance
- HOD/Admin panel
- Login page with 4 role selectors
- Student profile page with semester-wise marks
- Role-based localStorage session management
