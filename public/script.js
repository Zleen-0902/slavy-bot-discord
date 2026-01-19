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

// List all the elements you want to give a pop-up effect to.
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.feature-card, .section-title, .table-container, .hero-content');
    
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden'); // Provide initial status (hidden)
        observer.observe(el);
    });
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
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Offset so that it is not covered by the navbar
                behavior: 'smooth'
            });
        }
    });
});

// --- 4. Interactive Effects on Buttons (Hover Glow) ---
const buttons = document.querySelectorAll('.btn-gold');
buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        btn.style.setProperty('--x', `${x}px`);
        btn.style.setProperty('--y', `${y}px`);
    });
});

console.log("💎 SlavyBot Website Engine Loaded Successfully");
