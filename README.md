# 🎓 Department Management System (DMS)

A **Smart Academic Administration Platform** designed for modern educational institutions. Built with a luxury, premium UI leveraging **React, Vite, Tailwind CSS, and Framer Motion**, DMS enables seamless management of students, faculty, academics, and attendance through a unified, role-based platform.

---

## 🚀 Features

- 🔐 **Multi-Role Secure Login** — Student, Faculty, & Admin portals.
- 📊 **Animated Admin & HOD Dashboard** — Full department analytics, live attendance visualizations, and pending request review.
- 📍 **Geofenced Smart Attendance** — Location-verified attendance tracking using the **Geoapify API** combined with the Haversine formula. Ensures students are within a 1km radius of the campus before marking "Present". Export to CSV built-in.
- 👨‍🏫 **Faculty & Student Hubs** — Deep dive into individual faculty portfolios, student profiles, semester-wise marks tracking, CGPA, and course/subject allocations.
- 🏗️ **Department & Course Management** — Full CRUD (Create, Read, Update, Delete) capability for academic branches with interactive modal forms.
- 📰 **Department Magazine Generator** — Visually construct custom magazine pages/articles for the college, download them as local files, or render beautifully styled newspaper-like layouts.
- ✉️ **Request Letter System** — Students can compose formal request/leave letters directly on the platform with auto-generated formatted templates. Approvals flow seamlessly to the Admin/HOD dashboard.
- 🧠 **Smart Campus Intelligence** — Dynamic state management powered by React Context falling back safely to `LocalStorage` for instantaneous client data persistence without external database lag.
- 🌐 **Portfolio Landing Page** — Premium glassmorphism showcase of the platform serving as the entry portal.
- 📘 **Centralized Hubs** — Quick links and tracking for Coursera, Google Forms, Exam Results, Fees, Academic Calendar, and Timetables.

---

## 👨‍💻 Project Team

| Name | Role |
|------|------|
| Harikrishnan S | Lead Developer |
| Abishek S | Backend Engineer |
| Abishek TV | Frontend Developer |
| Aarthi S | UI/UX Designer |
| MEERASOUNDHARYA R | Database Architect |
| RAMYA G | Machine Learning Engineer |
| SIVARAM A M | System Administrator |
| DHARUNIKA N | QA & Testing Lead |
| SOWMYA M | Data Analyst |

---

## 🛠️ Tech Stack

- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, Vanilla CSS (`.css` files for custom scrollbars & glassmorphism)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Location Services**: Geoapify API, HTML5 Geolocation API
- **Storage**: Client-side `LocalStorage` wrapped inside a robust global `AppContext` provider
- **Fonts**: Google Fonts (Inter, Playfair Display, Dancing Script)

---

## 📂 Project Structure

```
DMS/
├── src/
│   ├── components/        # Reusable UI components (e.g. AnimatedBackground)
│   ├── context/           # AppContext for global state & mock DB
│   ├── layouts/           # PremiumLayout, DashboardLayout
│   ├── pages/             # All main routes (Dashboard, Attendance, Magazine, RequestLetter, etc.)
│   ├── App.jsx            # Application Routing
│   ├── index.css          # Tailwind base and core styles
│   └── main.jsx           # React Root
├── public/                # Static assets
└── package.json           # Scripts and Dependencies
```

---

## 🎯 How to Run

1. Clone this repository to your local machine.
2. Ensure you have [Node.js](https://nodejs.org/) installed.
3. Open a terminal in the project directory and run:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the provided localhost link in your web browser (usually `http://localhost:5173`).
6. Explore the system, starting from the portfolio page to the login portal. 

---

## 📸 Highlights

- **Stunning UI/UX:** Heavily features glow borders, glass cards, dynamic noise effects overlay, and animated mount/unmount modals.
- **Robust Client Persistence:** You don't need a live database to try it out right away! The context engine saves students, attendance, layouts, and letters securely into the browser.
- **Form Interactivity:** Fully styled HTML forms avoiding default browser UI. File upload wrappers, custom inputs, and dynamic date ranges.

---

© 2026 Department Management System. Designed with luxury and performance in mind.
