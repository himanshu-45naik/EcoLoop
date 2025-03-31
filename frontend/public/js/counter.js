function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentCount = Math.floor(progress * (end - start) + start);
        element.textContent = currentCount;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function startCounterAnimation() {
    const counterElements = {
        counter1: { target: 70 },  // MSW processed percentage
        counter2: { target: 62 },  // Million metric tonnes
        counter3: { target: 95 }   // D2D collection percentage
    };

    Object.entries(counterElements).forEach(([id, config]) => {
        const element = document.getElementById(id);
        if (element) {
            animateCounter(element, 0, config.target, 2000);
        }
    });
}

// Start animation when the content is loaded
document.addEventListener('DOMContentLoaded', startCounterAnimation);

// Restart animation when element comes into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounterAnimation();
        }
    });
}, { threshold: 0.5 });

// Observe all counter elements
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => observer.observe(counter));
});