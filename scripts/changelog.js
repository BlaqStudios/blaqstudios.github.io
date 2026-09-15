// Blaq Studios — changelog loader
// Reads window.SHIKAKU_VERSIONS_DATA or fetches data/shikaku-versions.json and renders it into #changelog-list.

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
        var title = escapeHtml(release.title || '');
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
                    (title ? '<span class="release-title">' + title + '</span>' : '') +
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
            'If you\'re previewing this page as a local file, ensure data/shikaku-versions.js is included.</p>';
    }

    document.addEventListener('DOMContentLoaded', function () {
        var container = document.getElementById('changelog-list');
        if (!container) return;

        // When hosted on the website (http: or https:), ALWAYS fetch data/shikaku-versions.json
        // with cache-busting timestamp so newly pushed changes appear immediately without code changes.
        if (location.protocol === 'http:' || location.protocol === 'https:') {
            fetch('../data/shikaku-versions.json?t=' + Date.now())
                .then(function (res) {
                    if (!res.ok) throw new Error('Failed to fetch version data: ' + res.status);
                    return res.json();
                })
                .then(render)
                .catch(function () {
                    if (typeof window !== 'undefined' && window.SHIKAKU_VERSIONS_DATA) {
                        render(window.SHIKAKU_VERSIONS_DATA);
                    } else {
                        showError();
                    }
                });
            return;
        }

        // When opened locally via file:/// protocol (where browser CORS blocks fetch),
        // use offline fallback data so the page displays without network errors.
        if (typeof window !== 'undefined' && window.SHIKAKU_VERSIONS_DATA) {
            render(window.SHIKAKU_VERSIONS_DATA);
            return;
        }

        fetch('../data/shikaku-versions.json')
            .then(function (res) {
                if (!res.ok) throw new Error('Failed to fetch version data');
                return res.json();
            })
            .then(render)
            .catch(showError);
    });
})();
