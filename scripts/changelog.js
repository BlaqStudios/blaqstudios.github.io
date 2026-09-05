// Blaq Studios — changelog loader
// Reads data/shikaku-versions.json and renders it into #changelog-list.
// To publish a new release: edit that JSON file and push. This script
// does not need to change when you add releases.

(function () {
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        var d = new Date(dateStr + 'T00:00:00');
        if (isNaN(d.getTime())) return escapeHtml(dateStr);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function renderRelease(release, isLatest) {
        var version = escapeHtml(release.version || 'Unversioned');
        var date = formatDate(release.date);
        var highlights = Array.isArray(release.highlights) ? release.highlights : [];

        var notesHtml = highlights
            .map(function (h) { return '<li>' + escapeHtml(h) + '</li>'; })
            .join('');

        return (
            '<article class="release-card">' +
                '<div class="release-head">' +
                    '<span class="release-version">v' + version + '</span>' +
                    (isLatest ? '<span class="pill latest-pill">Latest</span>' : '') +
                    (date ? '<span class="release-date">' + date + '</span>' : '') +
                '</div>' +
                (notesHtml ? '<ul class="release-notes">' + notesHtml + '</ul>' : '') +
            '</article>'
        );
    }

    function render(data) {
        var container = document.getElementById('changelog-list');
        if (!container) return;

        var releases = (data && Array.isArray(data.releases)) ? data.releases : [];

        if (releases.length === 0) {
            container.innerHTML = '<p class="changelog-state">No releases listed yet.</p>';
            return;
        }

        container.innerHTML = releases
            .map(function (release, i) { return renderRelease(release, i === 0); })
            .join('');
    }

    function showError() {
        var container = document.getElementById('changelog-list');
        if (!container) return;
        container.innerHTML =
            '<p class="changelog-state">Version history couldn\'t be loaded right now. ' +
            'If you\'re previewing this page as a local file, it needs to be served over ' +
            'http/https (e.g. GitHub Pages, or a local dev server) — browsers block local ' +
            'file reads by default.</p>';
    }

    document.addEventListener('DOMContentLoaded', function () {
        var container = document.getElementById('changelog-list');
        if (!container) return;

        fetch('../data/shikaku-versions.json')
            .then(function (res) {
                if (!res.ok) throw new Error('Failed to fetch version data');
                return res.json();
            })
            .then(render)
            .catch(showError);
    });
})();
