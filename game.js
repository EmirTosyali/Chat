// Oyun kurulum
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Klavye kontrol durumlari
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

document.addEventListener('keydown', (e) => {
    if (e.code in keys) {
        keys[e.code] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code in keys) {
        keys[e.code] = false;
    }
});

// Oyuncu bilgileri
const player = {
    x: 50,
    y: 300,
    w: 30,
    h: 40,
    dx: 0,
    dy: 0,
    hiz: 2,
    ziplama: 9,
    yerde: false
};

const GRAVITY = 0.4;
const FLOOR = 360;

// Platformlar
const platforms = [
    { x: 0, y: FLOOR, w: canvas.width, h: 40 },
    { x: 200, y: 280, w: 120, h: 10 },
    { x: 400, y: 220, w: 120, h: 10 },
    { x: 600, y: 150, w: 120, h: 10 }
];

let skor = 0;

function reset() {
    player.x = 50;
    player.y = 300;
    player.dx = 0;
    player.dy = 0;
    skor = 0;
}

function guncelle() {
    // Yatay hareket
    if (keys.ArrowLeft) player.dx = -player.hiz;
    else if (keys.ArrowRight) player.dx = player.hiz;
    else player.dx = 0;

    // Ziplama
    if (keys.Space && player.yerde) {
        player.dy = -player.ziplama;
        player.yerde = false;
    }

    // Yercekimi
    player.dy += GRAVITY;
    player.x += player.dx;
    player.y += player.dy;

    // Carpisma kontrolu
    player.yerde = false;
    for (const p of platforms) {
        if (
            player.x < p.x + p.w &&
            player.x + player.w > p.x &&
            player.y < p.y + p.h &&
            player.y + player.h > p.y
        ) {
            if (player.dy >= 0 && player.y + player.h - player.dy <= p.y) {
                // Platformun ustune inildi
                player.y = p.y - player.h;
                player.dy = 0;
                player.yerde = true;
            } else if (player.dy < 0 && player.y >= p.y + p.h - player.dy) {
                // Platformun altina carpti
                player.y = p.y + p.h;
                player.dy = 0;
            }
        }
    }

    // Kenarlar
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

    // Asagi dusunce sifirla
    if (player.y > canvas.height) reset();

    // Skoru guncelle
    if (player.x > skor) skor = Math.floor(player.x);
}

function ciz() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Oyuncu cizimi
    ctx.fillStyle = '#0f0';
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Platform cizimi
    ctx.fillStyle = '#888';
    for (const p of platforms) {
        ctx.fillRect(p.x, p.y, p.w, p.h);
    }

    // Skor yazisi
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Skor: ${skor}`, 10, 25);
}

function oyunDongusu() {
    guncelle();
    ciz();
    requestAnimationFrame(oyunDongusu);
}

reset(); // baslangic degerleri
oyunDongusu();
