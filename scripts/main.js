// Blaq Studios — shared site script

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

    // 3. Interactive Theme & Mode Previewer (Shikaku)
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
});
