// ================================================
//  admin.js  –  Professional Admin Dashboard
// ================================================

// ── Guard ───────────────────────────────────────
(function () {
    if (sessionStorage.getItem('sb_role') !== 'admin') {
        window.location.href = 'login.html';
    }
})();

// ── Session info ────────────────────────────────
var emailEl = document.getElementById('adminEmail');
if (emailEl) emailEl.textContent = sessionStorage.getItem('sb_user') || 'admin@gmail.com';

// ── Greeting ────────────────────────────────────
var greetEl = document.getElementById('greetMsg');
if (greetEl) {
    var h = new Date().getHours();
    var g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    greetEl.textContent = g + ', Admin. Here\'s what\'s happening today.';
}

// ── Date ────────────────────────────────────────
var dateEl = document.getElementById('todayDate');
if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
}

// ── Logout ──────────────────────────────────────
var logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        sessionStorage.removeItem('sb_user');
        sessionStorage.removeItem('sb_role');
        window.location.href = 'login.html';
    });
}

// ── Mobile sidebar toggle ───────────────────────
var menuToggle = document.getElementById('menuToggle');
var sidebar    = document.getElementById('sidebar');
if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });
    // close on outside click
    document.addEventListener('click', function (e) {
        if (sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            e.target !== menuToggle) {
            sidebar.classList.remove('open');
        }
    });
}

// ── Active nav ──────────────────────────────────
document.querySelectorAll('.sb-link').forEach(function (link) {
    link.addEventListener('click', function () {
        document.querySelectorAll('.sb-link').forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
    });
});

// ── Filter tabs (orders) ────────────────────────
document.querySelectorAll('.filter-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
        tab.closest('.filter-tabs').querySelectorAll('.filter-tab').forEach(function (t) {
            t.classList.remove('active');
        });
        tab.classList.add('active');
    });
});

// ── Chart tabs ──────────────────────────────────
document.querySelectorAll('.chart-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
        tab.closest('.chart-tabs').querySelectorAll('.chart-tab').forEach(function (t) {
            t.classList.remove('active');
        });
        tab.classList.add('active');
        drawRevenueChart(tab.textContent.trim() === 'Weekly');
    });
});

// ════════════════════════════════════════════════
//  CANVAS HELPERS
// ════════════════════════════════════════════════

function drawSparkline(canvasId, data, color) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.offsetWidth || 120;
    var H = canvas.height;
    canvas.width = W;

    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var range = max - min || 1;
    var step = W / (data.length - 1);

    // gradient fill
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '33');
    grad.addColorStop(1, color + '00');

    ctx.clearRect(0, 0, W, H);

    // fill
    ctx.beginPath();
    data.forEach(function (v, i) {
        var x = i * step;
        var y = H - ((v - min) / range) * (H - 4) - 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo((data.length - 1) * step, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    data.forEach(function (v, i) {
        var x = i * step;
        var y = H - ((v - min) / range) * (H - 4) - 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();
}

// ── Draw sparklines ─────────────────────────────
var sparkData = [
    [4200, 5100, 4800, 6200, 5900, 7100, 8420],   // revenue
    [22,   28,   19,   33,   30,   25,   37  ],   // orders
    [1180, 1200, 1215, 1230, 1248, 1270, 1284],   // users
    [18,   19,   20,   21,   22,   23,   24  ],   // products
];
var sparkColors = ['#b3004a', '#2e7d32', '#1565c0', '#f57f17'];

window.addEventListener('load', function () {
    sparkData.forEach(function (data, i) {
        drawSparkline('spark' + i, data, sparkColors[i]);
    });
    drawRevenueChart(false);
});

// ── Revenue bar chart ───────────────────────────
var monthlyData = [3200, 4100, 3800, 5200, 4900, 6100, 5600, 7200, 6800, 7900, 7400, 8420];
var weeklyData  = [980, 1240, 1100, 1380, 1290, 1540, 1680];
var monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var weekLabels  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function drawRevenueChart(weekly) {
    var canvas = document.getElementById('revenueChart');
    if (!canvas) return;

    var data   = weekly ? weeklyData  : monthlyData;
    var labels = weekly ? weekLabels  : monthLabels;

    var dpr = window.devicePixelRatio || 1;
    var W   = canvas.parentElement.clientWidth - 48;
    var H   = Math.round(W * 0.28);
    H = Math.max(H, 140);

    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width  = W * dpr;
    canvas.height = H * dpr;

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    var padL = 52, padR = 16, padT = 16, padB = 32;
    var chartW = W - padL - padR;
    var chartH = H - padT - padB;

    var maxVal = Math.max.apply(null, data) * 1.15;
    var barW   = Math.max(8, (chartW / data.length) * 0.55);
    var gap    = chartW / data.length;

    // horizontal grid lines
    var ticks = 4;
    ctx.textAlign = 'right';
    ctx.font = '11px Segoe UI, Arial, sans-serif';
    ctx.fillStyle = '#8a8fa8';

    for (var t = 0; t <= ticks; t++) {
        var yVal = (maxVal / ticks) * t;
        var yPos = padT + chartH - (yVal / maxVal) * chartH;

        ctx.beginPath();
        ctx.moveTo(padL, yPos);
        ctx.lineTo(W - padR, yPos);
        ctx.strokeStyle = t === 0 ? '#d0d0d0' : '#f0f0f0';
        ctx.lineWidth = 1;
        ctx.stroke();

        var label = yVal >= 1000 ? '$' + (yVal / 1000).toFixed(0) + 'k' : '$' + yVal.toFixed(0);
        ctx.fillText(label, padL - 6, yPos + 4);
    }

    // bars
    data.forEach(function (val, i) {
        var x    = padL + i * gap + (gap - barW) / 2;
        var barH = (val / maxVal) * chartH;
        var y    = padT + chartH - barH;

        // bar gradient
        var grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, '#b3004a');
        grad.addColorStop(1, '#f8a4c8');

        var r = Math.min(5, barW / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, y + barH);
        ctx.lineTo(x, y + barH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // x label
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8a8fa8';
        ctx.font = '11px Segoe UI, Arial, sans-serif';
        ctx.fillText(labels[i], x + barW / 2, H - padB + 16);
    });
}

// redraw chart on resize
var resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        var weekly = document.querySelector('.chart-tab.active');
        drawRevenueChart(weekly && weekly.textContent.trim() === 'Weekly');
        sparkData.forEach(function (data, i) {
            drawSparkline('spark' + i, data, sparkColors[i]);
        });
    }, 120);
});
