/**
 * Beijing Yushu Technology Co., Ltd.
 * Main JavaScript File
 * Corporate Website - European & American Markets
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgress = document.querySelector('.scroll-progress');
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');
    const counters = document.querySelectorAll('.counter');
    const lazyImages = document.querySelectorAll('img[data-src]');
    const backToTop = document.querySelector('.back-to-top');

    // ==========================================================================
    // Utility Functions
    // ==========================================================================
    
    /**
     * Debounce function to limit the rate of function calls
     */
    function debounce(func, wait = 20) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    /**
     * Throttle function to limit the rate of function calls
     */
    function throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= 0
        );
    }

    /**
     * Smooth scroll to element
     */
    function smoothScrollTo(target, duration = 1000) {
        const targetPosition = typeof target === 'string' 
            ? document.querySelector(target).getBoundingClientRect().top 
            : target;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ==========================================================================
    // Scroll Progress Indicator
    // ==========================================================================
    function updateScrollProgress() {
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }
    }

    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================
    function toggleMobileMenu() {
        menuToggle.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // ==========================================================================
    // Scroll Reveal Animation
    // ==========================================================================
    function handleRevealAnimations() {
        revealElements.forEach(element => {
            if (isInViewport(element, 100)) {
                element.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // Counter Animation
    // ==========================================================================
    function animateCounters() {
        counters.forEach(counter => {
            if (isInViewport(counter, 50) && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const start = 0;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(easeOutQuart * target);
                    
                    counter.textContent = current.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }

                requestAnimationFrame(updateCounter);
            }
        });
    }

    // ==========================================================================
    // Lazy Loading Images
    // ==========================================================================
    function handleLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                    img.classList.add('loaded');
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ==========================================================================
    // Back to Top Button
    // ==========================================================================
    function handleBackToTop() {
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    function scrollToTop() {
        smoothScrollTo(0, 500);
    }

    // ==========================================================================
    // Active Navigation Link
    // ==========================================================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==========================================================================
    // Button Ripple Effect
    // ==========================================================================
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        ripple.className = 'ripple';
        ripple.style.left = (event.clientX - rect.left) + 'px';
        ripple.style.top = (event.clientY - rect.top) + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // ==========================================================================
    // Parallax Effect
    // ==========================================================================
    function handleParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        const scrollY = window.scrollY;

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // ==========================================================================
    // Form Handling
    // ==========================================================================
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        
        if (validateForm(form)) {
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.classList.add('success');
                form.reset();

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');
                }, 3000);
            }, 1500);
        }
    }

    // ==========================================================================
    // Initialize Event Listeners
    // ==========================================================================
    function initEventListeners() {
        // Scroll events with throttling
        window.addEventListener('scroll', throttle(() => {
            handleHeaderScroll();
            updateScrollProgress();
            handleRevealAnimations();
            animateCounters();
            handleBackToTop();
            updateActiveNavLink();
            handleParallax();
        }, 16));

        // Mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (navList && navList.classList.contains('active')) {
                if (!navList.contains(e.target) && !menuToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    smoothScrollTo(target.offsetTop - 80, 1000);
                }
            });
        });

        // Back to top button
        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }

        // Button ripple effect
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', createRipple);
        });

        // Form submission
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
        });

        // Input validation on blur
        document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
        });

        // Keyboard navigation for accessibility
        document.addEventListener('keydown', (e) => {
            // ESC key closes mobile menu
            if (e.key === 'Escape' && navList.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ==========================================================================
    // Initialize
    // ==========================================================================
    function init() {
        // Initial checks
        handleHeaderScroll();
        handleRevealAnimations();
        animateCounters();
        handleLazyLoading();
        handleBackToTop();

        // Set active nav link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Initialize event listeners
        initEventListeners();

        // Add loaded class to body after everything is ready
        document.body.classList.add('loaded');

        console.log('Beijing Yushu Technology Co., Ltd. - Website Loaded Successfully');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
