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

    // 4. Header Navigation on Scroll & Threshold Particle Effect
    var header = document.querySelector('header');
    if (header) {
        var scrollThreshold = 80;
        var wasScrolled = (window.pageYOffset || document.documentElement.scrollTop) > scrollThreshold;
        var particleTimer = null;
        var particleContainer = null;

        // Sync initial state on page load
        if (wasScrolled) {
            header.classList.add('is-scrolled');
        }

        function triggerThresholdEffect(direction) {
            // Respect reduced-motion preferences
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            // Skip particle effects on mobile viewports
            if (window.innerWidth <= 768) {
                return;
            }

            // Ensure particle container exists
            if (!particleContainer || !particleContainer.parentNode) {
                particleContainer = header.querySelector('.header-particles');
                if (!particleContainer) {
                    particleContainer = document.createElement('div');
                    particleContainer.className = 'header-particles';
                    particleContainer.setAttribute('aria-hidden', 'true');
                    header.appendChild(particleContainer);
                }
            }

            // Cancel any pending cleanup timer and clear stale particles
            if (particleTimer) {
                clearTimeout(particleTimer);
                particleTimer = null;
            }
            particleContainer.innerHTML = '';

            var headerWidth = header.offsetWidth;
            if (headerWidth <= 0) return;

            var fragment = document.createDocumentFragment();
            var count = 8;

            for (var i = 0; i < count; i++) {
                var particle = document.createElement('div');
                particle.className = 'star-particle';

                // Distribute across the width with organic variance
                var x = (i / (count - 1)) * (headerWidth - 60) + 30 + (Math.random() * 24 - 12);
                var size = Math.random() * 3 + 3; // 3-6px
                var duration = (Math.random() * 0.3 + 0.55).toFixed(2); // 0.55-0.85s
                var delay = (Math.random() * 0.12).toFixed(2); // 0-0.12s

                particle.style.left = Math.max(10, Math.min(headerWidth - 10, x)) + 'px';
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';

                var animName = direction === 'down' ? 'starBurstDown' : 'starBurstUp';
                particle.style.animation = animName + ' ' + duration + 's ease-out ' + delay + 's both';

                fragment.appendChild(particle);
            }

            particleContainer.appendChild(fragment);

            // Clean up particles after burst animation concludes
            particleTimer = setTimeout(function () {
                if (particleContainer) {
                    particleContainer.innerHTML = '';
                }
                particleTimer = null;
            }, 1000);
        }

        var ticking = false;
        function updateNavigation(scrollPos) {
            var isScrolled = scrollPos > scrollThreshold;

            if (isScrolled !== wasScrolled) {
                wasScrolled = isScrolled;
                if (isScrolled) {
                    header.classList.add('is-scrolled');
                    triggerThresholdEffect('down');
                } else {
                    header.classList.remove('is-scrolled');
                    triggerThresholdEffect('up');
                }
            }
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            var scrollPos = window.pageYOffset || document.documentElement.scrollTop;

            if (!ticking) {
                window.requestAnimationFrame(function () {
                    updateNavigation(scrollPos);
                });
                ticking = true;
            }
        }, { passive: true });
    }

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
