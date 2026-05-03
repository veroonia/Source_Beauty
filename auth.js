// ================================================
//  auth.js  –  Login & Sign Up interactions
// ================================================

// ── Show / hide password ───────────────────────
document.querySelectorAll('.toggle-pw').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var input = document.getElementById(btn.getAttribute('data-target'));
        if (!input) return;
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        // swap icon
        btn.innerHTML = show
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M6.53 6.53A10 10 0 0 0 1 12s4 8 11 8a10 10 0 0 0 5.47-1.53"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
});

// ── Segmented password strength (signup) ───────
var signupPw = document.getElementById('signupPassword');
if (signupPw) {
    signupPw.addEventListener('input', function () {
        updateStrength(signupPw.value);
    });
}

function updateStrength(pw) {
    var segs   = [
        document.getElementById('seg1'),
        document.getElementById('seg2'),
        document.getElementById('seg3'),
        document.getElementById('seg4'),
    ];
    var label  = document.getElementById('strengthLabel');
    if (!segs[0] || !label) return;

    var score = 0;
    if (pw.length >= 8)           score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9]/.test(pw))         score++;
    if (/[^A-Za-z0-9]/.test(pw))  score++;

    var levels = [
        { color: '#eee',    text: '',       textColor: '#aaa'     },
        { color: '#e53935', text: 'Weak',   textColor: '#e53935'  },
        { color: '#fb8c00', text: 'Fair',   textColor: '#fb8c00'  },
        { color: '#fdd835', text: 'Good',   textColor: '#c8a800'  },
        { color: '#43a047', text: 'Strong', textColor: '#43a047'  },
    ];

    var lvl = pw.length === 0 ? levels[0] : levels[score];

    segs.forEach(function (seg, i) {
        seg.style.background = i < score ? lvl.color : '#eee';
    });

    label.textContent  = lvl.text;
    label.style.color  = lvl.textColor;
}

// ── Helpers ────────────────────────────────────
function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg;
}

function clearErrors() {
    document.querySelectorAll('.field-error').forEach(function (el) {
        el.textContent = '';
    });
    document.querySelectorAll('input').forEach(function (el) {
        el.classList.remove('invalid', 'valid');
    });
}

function markInvalid(inputId, errorId, msg) {
    var input = document.getElementById(inputId);
    if (input) { input.classList.add('invalid'); input.classList.remove('valid'); }
    showError(errorId, msg);
}

function markValid(inputId) {
    var input = document.getElementById(inputId);
    if (input) { input.classList.add('valid'); input.classList.remove('invalid'); }
}

function showToast(msg, success) {
    var toast = document.createElement('div');
    toast.className = 'auth-toast';
    toast.style.background = success ? '#b3004a' : '#111';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('show'); });
    setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () { toast.remove(); }, 400);
    }, 2600);
}

// ── Accounts ───────────────────────────────────
var ACCOUNTS = [
    { email: 'admin@gmail.com', password: 'admin1234$', role: 'admin',  redirect: 'admin.html'  },
    { email: 'user@gmail.com',  password: 'user1234$',  role: 'user',   redirect: 'home.html'   }
];

// ── Login ──────────────────────────────────────
var loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();

        var email    = document.getElementById('email').value.trim().toLowerCase();
        var password = document.getElementById('password').value;
        var valid    = true;

        if (!email) {
            markInvalid('email', 'emailError', 'Email is required.');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            markInvalid('email', 'emailError', 'Enter a valid email address.');
            valid = false;
        } else {
            markValid('email');
        }

        if (!password) {
            markInvalid('password', 'passwordError', 'Password is required.');
            valid = false;
        } else {
            markValid('password');
        }

        if (!valid) return;

        var btn = loginForm.querySelector('.auth-btn');
        btn.textContent = 'Signing in…';
        btn.disabled = true;

        setTimeout(function () {
            // match against known accounts
            var account = null;
            for (var i = 0; i < ACCOUNTS.length; i++) {
                if (ACCOUNTS[i].email === email && ACCOUNTS[i].password === password) {
                    account = ACCOUNTS[i];
                    break;
                }
            }

            if (!account) {
                btn.textContent = 'Sign In';
                btn.disabled = false;
                markInvalid('email',    'emailError',    ' ');
                markInvalid('password', 'passwordError', 'Incorrect email or password.');
                return;
            }

            // store session
            sessionStorage.setItem('sb_user',  account.email);
            sessionStorage.setItem('sb_role',  account.role);

            var greeting = account.role === 'admin' ? 'Welcome, Admin! 🛠️' : 'Welcome back! ✨';
            showToast(greeting, true);
            setTimeout(function () { window.location.href = account.redirect; }, 1600);
        }, 800);
    });
}

// ── Sign Up ────────────────────────────────────
var signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();

        var firstName = document.getElementById('firstName').value.trim();
        var lastName  = document.getElementById('lastName').value.trim();
        var email     = document.getElementById('signupEmail').value.trim();
        var password  = document.getElementById('signupPassword').value;
        var confirm   = document.getElementById('confirmPassword').value;
        var terms     = document.getElementById('terms').checked;
        var valid     = true;

        if (!firstName) {
            markInvalid('firstName', 'firstNameError', 'Required.');
            valid = false;
        } else { markValid('firstName'); }

        if (!lastName) {
            markInvalid('lastName', 'lastNameError', 'Required.');
            valid = false;
        } else { markValid('lastName'); }

        if (!email) {
            markInvalid('signupEmail', 'signupEmailError', 'Email is required.');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            markInvalid('signupEmail', 'signupEmailError', 'Enter a valid email address.');
            valid = false;
        } else { markValid('signupEmail'); }

        if (!password) {
            markInvalid('signupPassword', 'signupPasswordError', 'Password is required.');
            valid = false;
        } else if (password.length < 8) {
            markInvalid('signupPassword', 'signupPasswordError', 'Must be at least 8 characters.');
            valid = false;
        } else { markValid('signupPassword'); }

        if (!confirm) {
            markInvalid('confirmPassword', 'confirmPasswordError', 'Please confirm your password.');
            valid = false;
        } else if (password !== confirm) {
            markInvalid('confirmPassword', 'confirmPasswordError', 'Passwords do not match.');
            valid = false;
        } else { markValid('confirmPassword'); }

        if (!terms) {
            showError('termsError', 'You must agree to continue.');
            valid = false;
        }

        if (!valid) return;

        var btn = signupForm.querySelector('.auth-btn');
        btn.textContent = 'Creating account…';
        btn.disabled = true;

        setTimeout(function () {
            showToast('Account created! Welcome to Source Beauty ✨', true);
            setTimeout(function () { window.location.href = 'home.html'; }, 2000);
        }, 900);
    });
}
