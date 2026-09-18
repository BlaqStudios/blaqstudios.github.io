// Blaq Studios — Enhanced interactive script with ripple effects, scroll animations, and floating nav

document.addEventListener('DOMContentLoaded', function () {
    // 1. Current Year in Footer
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Mobile Navigation Toggle
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('nav-open');
            var isOpen = navLinks.classList.contains('nav-open');
            menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('nav-open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 3. Morphing Button Effect on Click
    function createMorphingEffect(event) {
        var button = event.currentTarget;

        // Only add effect if not in reduced motion mode
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Add morphing class to trigger the effect
        button.classList.add('morphing-effect');

        // Remove the class after animation completes
        setTimeout(function() {
            button.classList.remove('morphing-effect');
        }, 400);
    }

    // Add morphing effect to all buttons and interactive elements
    var morphingElements = document.querySelectorAll('.btn-play, .btn-itch, .btn-secondary, .nav-cta, .preview-tab-btn');
    morphingElements.forEach(function(element) {
        element.addEventListener('click', createMorphingEffect);
    });

    // 4. Morphing Navigation on Scroll
    var header = document.querySelector('header');
    var lastScrollTop = 0;
    var scrollThreshold = 100;
    var ticking = false;

    function updateNavigation(scrollPos) {
        if (window.innerWidth > 768) {
            if (scrollPos > scrollThreshold) {
                // Scrolled down - morph to rectangular shape
                header.classList.add('morphing-down');
                header.classList.remove('morphing-up');
                header.classList.add('visible');
                header.classList.remove('initial');
                // Create star particles at top of header
                createStarParticles(header, 'down', scrollPos);
            } else {
                // Scrolled up - morph back to circular
                header.classList.add('morphing-up');
                header.classList.remove('morphing-down');
                header.classList.add('visible');
                header.classList.remove('initial');
                // Create star particles at top of header
                createStarParticles(header, 'up', scrollPos);
            }
        } else {
            // Mobile: always visible
            header.classList.add('visible');
            header.classList.add('initial');
            header.classList.remove('morphing-up');
            header.classList.remove('morphing-down');
        }
        ticking = false;
    }

    function createStarParticles(element, direction, scrollPos) {
        // Remove any existing particles first
        var existingParticles = element.querySelectorAll('.star-particle');
        existingParticles.forEach(function(particle) {
            particle.remove();
        });

        // Create 5-10 star particles based on scroll position
        var particleCount = Math.floor((scrollPos % 100) / 10) + 5;

        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('div');
            particle.className = 'star-particle';

            // Random position at top of header
            var particleX = Math.random() * element.offsetWidth;
            particle.style.left = particleX + 'px';

            // Random size and animation
            var size = Math.random() * 3 + 2; // 2-5px
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            // Set animation based on direction
            if (direction === 'down') {
                particle.style.animation = 'starBurstDown ' + (Math.random() * 0.5 + 0.5) + 's ease-out';
            } else {
                particle.style.animation = 'starBurstUp ' + (Math.random() * 0.5 + 0.5) + 's ease-out';
            }

            element.appendChild(particle);

            // Remove particle after animation
            setTimeout(function() {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1000);
        }
    }

    window.addEventListener('scroll', function() {
        lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateNavigation(lastScrollTop);
            });
            ticking = true;
        }
    });

    // 5. Scroll Reveal Animation using Intersection Observer
    var revealElements = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: stop observing after reveal
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function(element) {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        revealElements.forEach(function(element) {
            element.classList.add('visible');
        });
    }

    // 6. Interactive Theme & Mode Previewer (Shikaku)
    var tabBtns = document.querySelectorAll('.preview-tab-btn');
    var demoBox = document.getElementById('demo-puzzle-box');
    var demoMatrix = document.getElementById('demo-puzzle-matrix');
    var demoMeta = document.getElementById('demo-puzzle-meta');

    if (tabBtns.length && demoBox && demoMatrix) {
        var classicHtml =
            '<div class="cell boxed-amber" style="--i:0">4</div>' +
            '<div class="cell boxed-amber" style="--i:1">·</div>' +
            '<div class="cell" style="--i:2">·</div>' +
            '<div class="cell" style="--i:3">2</div>' +
            '<div class="cell boxed-amber" style="--i:4">·</div>' +
            '<div class="cell boxed-amber" style="--i:5">·</div>' +
            '<div class="cell" style="--i:6">·</div>' +
            '<div class="cell" style="--i:7">2</div>' +
            '<div class="cell boxed-blue" style="--i:8">3</div>' +
            '<div class="cell boxed-blue" style="--i:9">·</div>' +
            '<div class="cell boxed-blue" style="--i:10">·</div>' +
            '<div class="cell" style="--i:11">·</div>' +
            '<div class="cell" style="--i:12">·</div>' +
            '<div class="cell" style="--i:13">·</div>' +
            '<div class="cell" style="--i:14">1</div>' +
            '<div class="cell" style="--i:15">·</div>';

        var weirdHtml =
            '<div class="cell boxed-poly-1" style="--i:0">5</div>' +
            '<div class="cell boxed-poly-1" style="--i:1">·</div>' +
            '<div class="cell boxed-poly-1" style="--i:2">·</div>' +
            '<div class="cell boxed-poly-2" style="--i:3">3</div>' +
            '<div class="cell" style="--i:4">·</div>' +
            '<div class="cell boxed-poly-1" style="--i:5">·</div>' +
            '<div class="cell boxed-poly-2" style="--i:6">·</div>' +
            '<div class="cell boxed-poly-2" style="--i:7">·</div>' +
            '<div class="cell boxed-poly-1" style="--i:8">·</div>' +
            '<div class="cell" style="--i:9">·</div>' +
            '<div class="cell" style="--i:10">·</div>' +
            '<div class="cell" style="--i:11">2</div>' +
            '<div class="cell" style="--i:12">1</div>' +
            '<div class="cell" style="--i:13">·</div>' +
            '<div class="cell" style="--i:14">·</div>' +
            '<div class="cell" style="--i:15">·</div>';

        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                var theme = btn.getAttribute('data-theme');
                demoBox.className = 'puzzle-box puzzle-animate ' + theme;

                if (theme === 'puzzle-theme-weird') {
                    demoMatrix.innerHTML = weirdHtml;
                    if (demoMeta) {
                        demoMeta.innerHTML = '<span>GRID 4x4</span><span>WEIRD POLYOMINO</span>';
                    }
                } else {
                    demoMatrix.innerHTML = classicHtml;
                    if (demoMeta) {
                        var modeLabel = theme === 'puzzle-theme-light-zen' ? 'LIGHT ZEN' : (theme === 'puzzle-theme-dark-zen' ? 'DARK ZEN' : 'DARK NEON');
                        demoMeta.innerHTML = '<span>GRID 4x4</span><span>' + modeLabel + '</span>';
                    }
                }
            });
        });
    }

    // 7. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    });
