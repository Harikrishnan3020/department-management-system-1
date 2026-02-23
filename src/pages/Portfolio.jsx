import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import '../../assets/css/portfolio.css';

const rawStudentData = [
    "AARTHI S", "ABISEK T V", "ABISHEK S", "ADHITHYA S P", "AISHWARYA M",
    "AKSHAYAA A S", "ANGELINA A", "ANISH SURIYA J", "ARCHANA V", "BALAMURUGAN S",
    "BHAVATHARINI T M", "DHARSHINI R", "DHARSHINI R", "DHARUNIKA N", "DINESH KUMAR S",
    "EZHILAN K", "GOGUL AANANTH Y", "GOPIKA G", "HARIKRISHNAN S", "HARISBALAJI G",
    "HEMAPRABU P", "KABILAN G", "KARNIKA V", "KARTHIKEYAN M", "KEERTHANAPRIYA S",
    "KRITHIKA N", "MADHANRAJ D", "MADURAVALLI V", "MANUJANA N", "MEERASOUNDHARYA R",
    "MITHRAA N", "MOHAMED MYDEEN J", "MOHAMMED MINHAJ A", "NANDHINI S", "NITHISH A",
    "NIVEDA SREE DHANDAPANI", "PRAVEEN P", "RAMYA G", "RANJITH KUMAR K", "RATHISH T",
    "RITHIKA S", "RITHISH K", "ROSHMITA V", "SAIRAM K", "SANDHYA B",
    "SANJAY K", "SANTHIYA M", "SHAKTHI RITHANYA S", "SHALINI R", "SHEIK NATHARSHA A",
    "SHWETHA S", "SIVARAM A M", "SOWMYA M", "SOWMYA S", "SREE NIVETHA N",
    "SRI VATSAN S", "SRIHARIPRIYA P", "SRIMATHI K", "SRUTHI R", "VAISHNAVI S",
    "VARUN K J", "VIGNESH K", "VIGNESH RAJ S", "HARIPRIYA J", "SIDDHARTH P"
];

const Portfolio = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <ParallaxProvider>
            <div className="portfolio-wrapper">
                {/* Background Effects with Parallax */}
                <Parallax speed={-10} className="glow-bg glow-1" />
                <Parallax speed={-5} className="glow-bg glow-2" />
                <Parallax speed={-15} className="glow-bg glow-3" />

                {/* Navigation */}
                <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                    <div className="nav-container">
                        <a href="#" className="nav-logo">
                            <span className="logo-icon">🎓</span>
                            DMS
                        </a>
                        <ul className="nav-links">
                            <li><a href="#about">About</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#architecture">Architecture</a></li>
                            <li><a href="#preview">Preview</a></li>
                            <li><a href="#tech">Tech Stack</a></li>
                            <li><a href="#aiml">AIML</a></li>
                        </ul>
                        <div className="nav-actions">
                            <a href="login.html" className="btn-primary">Live Demo</a>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="hero">
                    <Parallax speed={5} className="hero-content">
                        <div className="badge">Next Generation Administration</div>
                        <h1 className="hero-title">Department Management System</h1>
                        <p className="hero-subtitle">
                            A smart, unified, and elegant platform for managing academics, student performance, and administrative workflows in modern educational institutions.
                        </p>
                        <div className="hero-cta">
                            <a href="login.html" className="btn-primary large">View Live Demo</a>
                            <a href="#" className="btn-secondary large">View GitHub</a>
                        </div>

                        <Parallax scale={[0.95, 1.05]} className="hero-preview">
                            <div className="glass-frame">
                                <div className="frame-content">
                                    <video autoPlay loop muted playsInline className="hero-bg-video">
                                        <source src="/The_aiml_hod_1080p_202601221036.mp4" type="video/mp4" />
                                    </video>
                                    <div className="mock-dash hero-mock-dash">
                                        <div className="mock-sidebar">
                                            <div className="ms-logo">🎓 DMS Admin</div>
                                            <div className="ms-menu">
                                                <div className="ms-item active"><span className="ms-icon">📊</span> Analytics</div>
                                                <div className="ms-item"><span className="ms-icon">👥</span> Student Roster</div>
                                                <div className="ms-item"><span className="ms-icon">📈</span> Academics</div>
                                                <div className="ms-item"><span className="ms-icon">👨‍🏫</span> Faculty Base</div>
                                            </div>
                                        </div>
                                        <div className="mock-main">
                                            <div className="mock-header">
                                                <div className="mh-title">Live Tracking</div>
                                                <div className="mh-user"><div className="mh-avatar">H</div></div>
                                            </div>
                                            <div className="mock-grid">
                                                <div className="mock-card">
                                                    <div className="mc-icon">👨‍🎓</div>
                                                    <div className="mc-info">
                                                        <div className="mc-val">1,250</div>
                                                        <div className="mc-label">Enrolled Students</div>
                                                    </div>
                                                </div>
                                                <div className="mock-card">
                                                    <div className="mc-icon">☑️</div>
                                                    <div className="mc-info">
                                                        <div className="mc-val">98.5%</div>
                                                        <div className="mc-label">Today's Attendance</div>
                                                    </div>
                                                </div>
                                                <div className="mock-card">
                                                    <div className="mc-icon">⭐</div>
                                                    <div className="mc-info">
                                                        <div className="mc-val">8.4</div>
                                                        <div className="mc-label">Avg Dept CGPA</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mock-table">
                                                <div className="mt-header">Recent Live Check-ins</div>
                                                <div className="mt-row">
                                                    <div className="mt-cell">Aarthi S</div>
                                                    <div className="mt-cell">24UAM101</div>
                                                    <div className="mt-cell"><span className="mt-badge success">Present (08:50 AM)</span></div>
                                                </div>
                                                <div className="mt-row">
                                                    <div className="mt-cell">Abishek TV</div>
                                                    <div className="mt-cell">24UAM102</div>
                                                    <div className="mt-cell"><span className="mt-badge warning">Late (09:12 AM)</span></div>
                                                </div>
                                                <div className="mt-row">
                                                    <div className="mt-cell">Abishek S</div>
                                                    <div className="mt-cell">24UAM103</div>
                                                    <div className="mt-cell"><span className="mt-badge success">Present (08:55 AM)</span></div>
                                                </div>
                                                <div className="mt-row">
                                                    <div className="mt-cell">MEERASOUNDHARYA R</div>
                                                    <div className="mt-cell">24UAM130</div>
                                                    <div className="mt-cell"><span className="mt-badge danger">Absent</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Parallax>
                    </Parallax>
                </section>

                {/* About Section */}
                <motion.section
                    id="about"
                    className="section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fadeInUp}
                >
                    {/* Rest of the sections following the same pattern */}
                    <div className="section-container">
                        <div className="two-column">
                            <Parallax speed={-5} className="column-text">
                                <h2 className="section-title">About The Project</h2>
                                <p className="section-desc">
                                    Managing an entire academic department is historically plagued by fragmented tools, manual spreadsheets, and communication silos. DMS solves this by providing a unified, role-based architecture designed for clarity and speed.
                                </p>
                                <div className="about-grid">
                                    <div className="about-item">
                                        <div className="about-icon">👔</div>
                                        <div>
                                            <h4>Admin & HODs</h4>
                                            <p>Centralized oversight, analytics, and resource allocation.</p>
                                        </div>
                                    </div>
                                    <div className="about-item">
                                        <div className="about-icon">👨‍🏫</div>
                                        <div>
                                            <h4>Faculty</h4>
                                            <p>Effortless attendance, grading, and course management.</p>
                                        </div>
                                    </div>
                                    <div className="about-item">
                                        <div className="about-icon">👨‍🎓</div>
                                        <div>
                                            <h4>Students</h4>
                                            <p>Real-time progress tracking, timetables, and personalized insights.</p>
                                        </div>
                                    </div>
                                </div>
                            </Parallax>
                            <Parallax speed={5} className="column-visual">
                                <div className="glass-card visual-card">
                                    <div className="vc-header">
                                        <div>Live Student Distribution</div>
                                        <div className="vc-badge">Active DB</div>
                                    </div>
                                    <div className="vc-student-list">
                                        <div className="vc-student-item">
                                            <div className="vc-s-avatar">R</div>
                                            <div className="vc-s-info">
                                                <div className="vc-s-name">RAMYA G</div>
                                                <div className="vc-s-id">24UAM138 • Sec A</div>
                                            </div>
                                            <div className="vc-s-score text-green">9.2 CGPA</div>
                                        </div>
                                        {/* Add more students as per HTML implicitly */}
                                    </div>
                                </div>
                            </Parallax>
                        </div>
                    </div>
                </motion.section>

                {/* Features Section */}
                <motion.section
                    id="features"
                    className="section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fadeInUp}
                >
                    <div className="section-container">
                        <div className="section-header text-center">
                            <h2 className="section-title">Core Features</h2>
                            <p className="section-desc mx-auto">Everything you need to run a modern academic department smoothly.</p>
                        </div>
                        <div className="features-grid">
                            {[
                                { icon: '🔐', title: 'Secure Role-Based Login', desc: 'Granular access control ensuring data privacy and correct functionality for every user type.' },
                                { icon: '🏢', title: 'Department Management', desc: 'Organize sections, allocate resources, and oversee cross-departmental operations.' },
                                { icon: '👥', title: 'Faculty & Staff', desc: 'Manage workloads, monitor schedules, and evaluate performance effortlessly.' },
                                { icon: '🎓', title: 'Student Management', desc: 'Comprehensive student profiles containing academic history, achievements, and alerts.' },
                                { icon: '📚', title: 'Course Management', desc: 'Syllabus tracking, credit distribution, and material sharing capabilities.' },
                                { icon: '✅', title: 'Attendance Tracking', desc: 'Streamlined check-ins with automated absence alerting and minimal friction.' },
                                { icon: '📈', title: 'Results & GPA', desc: 'Automated grading calculations mapped directly to institutional standards.' },
                                { icon: '📊', title: 'Analytics Dashboard', desc: 'High-level insights utilizing big data to find academic trends and opportunities.' }
                            ].map((feature, idx) => (
                                <Parallax key={idx} translateY={[10, -10]} className="feature-card">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.desc}</p>
                                </Parallax>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Architecture Section */}
                <motion.section
                    id="architecture"
                    className="section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="section-container">
                        <div className="section-header text-center">
                            <h2 className="section-title">System Architecture</h2>
                            <p className="section-desc mx-auto">Built on a robust and scalable 3-Tier architecture ensuring fast response times and high availability.</p>
                        </div>
                        <Parallax scale={[0.9, 1.1]} className="architecture-diagram">
                            <div className="tier client">
                                <div className="tier-icon">💻</div>
                                <h4>Frontend Layer</h4>
                                <p>Responsive interface built with HTML, CSS, JS, React</p>
                            </div>
                            <div className="tier-connector"><div className="line animated-line"></div></div>
                            <div className="tier server">
                                <div className="tier-icon">⚙️</div>
                                <h4>Application Layer</h4>
                                <p>Core logic, authentication, and routing APIs</p>
                            </div>
                            <div className="tier-connector"><div className="line animated-line"></div></div>
                            <div className="tier database">
                                <div className="tier-icon">🗄️</div>
                                <h4>Data Layer</h4>
                                <p>Secure databases handling millions of records</p>
                            </div>
                        </Parallax>
                    </div>
                </motion.section>

                {/* Dashboard Preview Section */}
                <motion.section
                    id="preview"
                    className="section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="section-container">
                        <div className="section-header text-center">
                            <h2 className="section-title">Application Preview</h2>
                            <p className="section-desc mx-auto">Experience our beautiful UI and fully functional sub-systems populated with real student data.</p>
                        </div>
                        <div className="preview-grid">
                            <Parallax speed={2} className="preview-card">
                                <div className="preview-img-wrapper mock-login-bg">
                                    <video autoPlay loop muted playsInline className="preview-video-bg">
                                        <source src="/The_college_students_1080p_202601212125.mp4" type="video/mp4" />
                                    </video>
                                    <div className="preview-glass-content">
                                        <div className="pgc-title">Student Portal Login</div>
                                        <div className="pgc-inputs">
                                            <div className="pgc-input">Username</div>
                                            <div className="pgc-input">Password</div>
                                            <div className="pgc-btn">Sign In</div>
                                        </div>
                                    </div>
                                </div>
                                <h4>Intelligent Login</h4>
                                <p>Role-based gateway synchronized with vibrant background videography and family portals.</p>
                            </Parallax>
                        </div>
                    </div>
                </motion.section>

                {/* Team Section */}
                <motion.section
                    id="team"
                    className="section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="section-container">
                        <div className="section-header text-center">
                            <h2 className="section-title">Project Team Context</h2>
                        </div>

                        <div className="student-db-preview mt-40">
                            <h4 className="mb-20 text-center text-muted">A subset of our generated Student Base (65+ Records)</h4>
                            <div className="student-tags-container" id="student-tags">
                                {rawStudentData.map((name, i) => (
                                    <motion.span
                                        key={i}
                                        className="student-tag"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        viewport={{ once: true }}
                                    >
                                        {name}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer-container">
                        <div className="footer-top">
                            <div className="footer-logo">🎓 DMS</div>
                        </div>
                        <div className="footer-bottom">
                            <p>&copy; 2026 Department Management System. All rights reserved.</p>
                            <p className="footer-credit">Designed with luxury and performance in mind.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </ParallaxProvider>
    );
};

export default Portfolio;
