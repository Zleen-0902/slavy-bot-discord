/*
--------------------------------------------
👑 Owner    : Enzzyx
📡 Discord  : https://discord.gg/QYVcWZbBp
🛠️ Studio   : Hazz Wave Studio
✅ Verified | 🧩 Flexible | ⚙️ Stable
--------------------------------------------
> © 2026 Enzzyx || Hazz Wave Studio || Slavy
--------------------------------------------
*/

// --- 1. Animation Appears When Scrolling (Scroll Reveal) ---
const observerOptions = {
    threshold: 0.15 // The element will appear when 15% of the part is visible.
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
        }
    });
}, observerOptions);

// Initialize reveal effects on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.feature-card, .section-title, .table-container, .hero-content');
    
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden'); // Apply initial hidden state
        observer.observe(el);
    });

    // --- NEW: Mobile Menu Logic (Sinkron dengan index.html baru) ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Opsional: Ubah ikon bars jadi times (X) saat aktif
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
});

// --- 2. Navbar Dynamic Styling ---
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '15px 0';
        navbar.style.background = 'rgba(10, 10, 11, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
        navbar.style.padding = '20px 0';
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// --- 3. Smooth Scroll for Navigation Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return; // Ignore empty links
        
        const target = document.querySelector(targetId);
        if (target) {
            // Tutup menu mobile jika link diklik (agar tidak menutupi layar)
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = document.querySelector('.menu-toggle i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }

            window.scrollTo({
                top: target.offsetTop - 80, // Offset to prevent navbar overlap
                behavior: 'smooth'
            });
        }
    });
});

// --- 4. Interactive Effects on Buttons (Hover Glow Position) ---
const buttons = document.querySelectorAll('.btn-gold');
buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Setting custom properties for CSS interaction
        btn.style.setProperty('--x', `${x}px`);
        btn.style.setProperty('--y', `${y}px`);
    });
});

console.log("💎 SlavyBot Website Engine Loaded Successfully");