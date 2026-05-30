/**
 * СПАД — Система Прогностического Автоматического Подбора Доноров
 * JavaScript для навигации по вкладкам, анимаций и интерактивности
 */

// =============================================
// PRELOADER
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');

    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1500);

    // Initialize everything after short delay
    setTimeout(() => {
        initHeaderScroll();
        initScrollReveal();
        initStatCounters();
        initSmoothScroll();
        initCarousel();
    }, 100);
});

// =============================================
// HEADER SCROLL EFFECT
// =============================================
function initHeaderScroll() {
    const header = document.getElementById('header');
    let ticking = false;
    // Threshold = viewport height (after hero video section)
    let threshold = window.innerHeight * 0.85;

    function updateHeader() {
        const scrollY = window.scrollY;
        if (scrollY > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        threshold = window.innerHeight * 0.85;
    }, { passive: true });

    // Initial check
    updateHeader();
}

// =============================================
// MODULES CAROUSEL
// =============================================
let carouselIndex = 0;
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselTotal = carouselSlides.length;

function initCarousel() {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer) return;

    for (let i = 0; i < carouselTotal; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }

    // Touch / swipe support
    const track = document.getElementById('carouselTrack');
    if (track) {
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) carouselNext();
                else carouselPrev();
            }
        }, { passive: true });

        // Mouse drag
        let mouseStartX = 0;
        let mouseDragging = false;

        track.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            mouseDragging = true;
        });

        track.addEventListener('mouseup', (e) => {
            if (!mouseDragging) return;
            mouseDragging = false;
            const diff = mouseStartX - e.clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) carouselNext();
                else carouselPrev();
            }
        });

        track.addEventListener('mouseleave', () => {
            mouseDragging = false;
        });
    }
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    if (track) {
        track.style.transform = 'translateX(-' + (carouselIndex * 100) + '%)';
    }

    carouselSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === carouselIndex);
    });

    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === carouselIndex);
    });

    const counter = document.getElementById('carouselCurrent');
    if (counter) {
        counter.textContent = String(carouselIndex + 1).padStart(2, '0');
    }
}

function carouselNext() {
    carouselIndex = (carouselIndex + 1) % carouselTotal;
    updateCarousel();
}

function carouselPrev() {
    carouselIndex = (carouselIndex - 1 + carouselTotal) % carouselTotal;
    updateCarousel();
}

function goToSlide(index) {
    carouselIndex = index;
    updateCarousel();
}

// =============================================
// MODULE NAVIGATION
// =============================================
const MODULES = [
    { id: 'prediction',  name: 'Поиск донора'    },
    { id: 'matching',    name: 'История поиска'  },
    { id: 'monitoring',  name: 'Статистика БД'   },
    { id: 'autopilot',   name: 'Карточка донора' },
    { id: 'reports',     name: 'PDF-отчёты'      },
    { id: 'integration', name: 'Технологии'      }
];



// =============================================
// TAB NAVIGATION
// =============================================
function showTab(tabName) {
    // Hide all tabs
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(`tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Update nav links
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tabName) {
            link.classList.add('active');
        }
    });

    // Close mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuBtn) menuBtn.classList.remove('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================
// MOBILE MENU
// =============================================
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('mobileMenuBtn');

    mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('active');
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('mobileMenuBtn');

    if (mobileMenu && menuBtn &&
        !mobileMenu.contains(e.target) &&
        !menuBtn.contains(e.target) &&
        mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
    }
});

// =============================================
// SCROLL TO SECTION (for anchor links)
// =============================================
function scrollToSection(sectionId) {
    showTab('home');
    setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const top = section.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    }, 100);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
}

// =============================================
// SCROLL REVEAL ANIMATION
// =============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// =============================================
// STAT COUNTERS
// =============================================
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;

        if (isDecimal) {
            el.textContent = current.toFixed(1);
        } else {
            el.textContent = Math.floor(current);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (isDecimal) {
                el.textContent = target.toFixed(1);
            } else {
                el.textContent = target;
            }
        }
    }

    requestAnimationFrame(update);
}

// =============================================
// FORM HANDLING
// =============================================
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Check if Formspree is configured
    const action = form.getAttribute('action');
    if (action && action.includes('YOUR_FORM_ID')) {
        showToast('Для отправки форм настройте Formspree: зарегистрируйтесь на formspree.io и замените YOUR_FORM_ID в коде', 'error');
        return;
    }

    // Send via Formspree
    fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            showToast('Запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
        } else {
            showToast('Ошибка отправки. Пожалуйста, попробуйте позже.', 'error');
        }
    })
    .catch(() => {
        showToast('Ошибка сети. Проверьте подключение к интернету.', 'error');
    });
}

// Attach handler to contact form
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Remove after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// =============================================
// KEYBOARD NAVIGATION
// =============================================
document.addEventListener('keydown', (e) => {
    // ESC closes mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            menuBtn.classList.remove('active');
        }
    }
});

// =============================================
// PERFORMANCE: Pause video when not visible
// =============================================
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.hero-video').forEach(video => {
    videoObserver.observe(video);
});

// =============================================
// RESIZE HANDLER
// =============================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 1024) {
            const mobileMenu = document.getElementById('mobileMenu');
            const menuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenu) mobileMenu.classList.remove('open');
            if (menuBtn) menuBtn.classList.remove('active');
        }
    }, 250);
}, { passive: true });
