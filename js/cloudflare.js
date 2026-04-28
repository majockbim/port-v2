
const TRACKER_URL = 'https://sachi-nanjou.majbim6.workers.dev/';

async function getLocation() {
    try {
        const r = await fetch('https://ipapi.co/json/');
        const d = await r.json();
        return { city: d.city, country: d.country_name };
    } catch {
        return {};
    }
}

async function track(event, target = null) {
    const loc = await getLocation();
    fetch(TRACKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, target, ...loc })
    });
}

track('visit');

document.querySelectorAll('.row').forEach(el => {
    el.addEventListener('click', () => {
        const label = el.querySelector('.item-title')?.textContent || 'unknown';
        track('click', label);
    });
});

// track nav icon clicks
document.querySelectorAll('nav a').forEach(el => {
    el.addEventListener('click', () => {
        track('click', el.querySelector('img')?.alt || 'nav');
    });
});