// Blaq Studios — shared site script
// Intentionally minimal: no scroll-triggered effects, just small housekeeping.

document.addEventListener('DOMContentLoaded', function () {
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
