// Scroll animation observer
document.addEventListener("DOMContentLoaded", () => {

    // Navbar scroll logic
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Reveal elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed-element");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach(el => observer.observe(el));


    // Student Database Populate
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

    const tagsContainer = document.getElementById("student-tags");
    if (tagsContainer) {
        // limit to just display the database cleanly
        rawStudentData.forEach(name => {
            const span = document.createElement("span");
            span.className = "student-tag";
            span.textContent = name;
            tagsContainer.appendChild(span);
        });
    }

});
