// Initialize GSAP animations
document.addEventListener('DOMContentLoaded', () => {
    // Fade in animation for all glass-morphism elements
    gsap.from('.glass-morphism', {
        duration: 1,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Animate course cards on the courses page
    if (document.getElementById('courseGrid')) {
        gsap.from('.course-card', {
            duration: 0.8,
            opacity: 0,
            y: 50,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    }

    // Animate form elements
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        gsap.from(form.elements, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.5
        });
    });

    // Hover animation for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.2
            });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.2
            });
        });
    });
}); 