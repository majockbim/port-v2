const canvas = document.getElementById('binaryCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 14;
let bits = [];

function initBits() {
    bits = [];
    
    const columns = Math.ceil(canvas.width / fontSize);
    const rows = Math.ceil(canvas.height / fontSize);
    
    const density = window.innerWidth < 768 ? 0.04 : 0.015; 

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            if (Math.random() < density) {
                bits.push({
                    x: c,
                    targetY: r,
                    y: -(Math.random() * rows) - 5,
                    maxSpeed: 0.6 + Math.random() * 0.6,
                    char: Math.floor(Math.random() * 2).toString()
                });
            }
        }
    }
}

initBits();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#1c1c1c"; 
    ctx.font = fontSize + "px monospace";

    let stillMoving = false;

    for (let i = 0; i < bits.length; i++) {
        let b = bits[i];
        let dist = b.targetY - b.y;

        if (dist > 0.05) {
            let vel = dist * 0.06;
            if (vel > b.maxSpeed) vel = b.maxSpeed;
            
            b.y += vel;
            stillMoving = true;

            if (vel > 0.15 && Math.random() < 0.1) {
                b.char = Math.floor(Math.random() * 2).toString();
            }
        } else {
            b.y = b.targetY;
        }

        if (b.y > -1) {
            ctx.fillText(b.char, b.x * fontSize, b.y * fontSize);
        }
    }

    if (stillMoving) {
        requestAnimationFrame(draw);
    }
}

function updateCounter() {
const start = new Date('2025-05-03T00:00:00');
const now = new Date();
const diff = Math.floor((now - start) / 1000);

const days = Math.floor(diff / 86400);
const hours = Math.floor((diff % 86400) / 3600);
const mins = Math.floor((diff % 3600) / 60);
const secs = diff % 60;

document.getElementById('prog-counter').textContent =
    `${days}d ${hours}h ${mins}m ${secs}s`;
}

updateCounter();
setInterval(updateCounter, 1000);

requestAnimationFrame(draw);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initBits();

    requestAnimationFrame(draw);
});

document.querySelectorAll('.row').forEach(row => {
    const preview = row.querySelector('.row-preview');
    const soon = row.querySelector('.soon-label');

    row.addEventListener('mouseenter', () => {
        const container = document.querySelector('.container');
        const containerRect = container.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();

        if (preview) {
            preview.style.left = (containerRect.right + 8) + 'px';
            preview.style.top = rowRect.top + 'px';
            preview.style.opacity = '1';
        }

        if (soon) {
            soon.style.left = (containerRect.right - 12) + 'px'; /* -12 for dist from row */
            soon.style.top = (rowRect.top + rowRect.height / 2 - 6) + 'px';
            soon.style.opacity = '1';
        }
    });

    row.addEventListener('mouseleave', () => {
        if (preview) preview.style.opacity = '0';
        if (soon) soon.style.opacity = '0';
    });
});