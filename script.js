const firebaseConfig = {
    apiKey: "AIzaSyDndtpI55_IqfqUEUQZ4isyDPN8B5ncTi4",
    authDomain: "icenbeans-c092b.firebaseapp.com",
    databaseURL: "https://icenbeans-c092b-default-rtdb.firebaseio.com",
    projectId: "icenbeans-c092b",
    storageBucket: "icenbeans-c092b.firebasestorage.app",
    messagingSenderId: "716256126421",
    appId: "1:716256126421:web:74cbfc75fd1f171b0c495c",
    measurementId: "G-2CKMHVDZFN"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

/* ----------------------------------------------------------------
   Build price HTML — size pills for multiple sizes,
   simple price span for single-price items
---------------------------------------------------------------- */
function buildPriceHtml(item) {
    if (item.sizes && item.sizes.length) {
        if (item.sizes.length === 1) {
            return `<div class="item-prices">
                        <span class="price-single">${item.sizes[0].price}<span class="currency"> L.E</span></span>
                    </div>`;
        }
        const pills = item.sizes.map(s => `
            <span class="size-pill">
                <span class="size-label">${s.name}</span>
                <span class="size-dot"></span>
                <span class="size-price">${s.price}<span class="currency"> L.E</span></span>
            </span>`).join('');
        return `<div class="item-prices">${pills}</div>`;
    }

    if (item.large > 0) {
        return `<div class="item-prices">
                    <span class="size-pill">
                        <span class="size-label">S</span>
                        <span class="size-dot"></span>
                        <span class="size-price">${item.small}<span class="currency"> L.E</span></span>
                    </span>
                    <span class="size-pill">
                        <span class="size-label">L</span>
                        <span class="size-dot"></span>
                        <span class="size-price">${item.large}<span class="currency"> L.E</span></span>
                    </span>
                </div>`;
    }

    return `<div class="item-prices">
                <span class="price-single">${item.small}<span class="currency"> L.E</span></span>
            </div>`;
}

/* ----------------------------------------------------------------
   Render full menu from Firebase snapshot + build category nav
---------------------------------------------------------------- */
function slugify(str) {
    return str.replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '');
}

function buildCatNav(catGroups) {
    const nav = document.getElementById('cat-nav');
    nav.innerHTML = '';
    catGroups.forEach((group, i) => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn' + (i === 0 ? ' active' : '');
        btn.textContent = group.label;
        btn.dataset.target = 'cat-' + slugify(group.arKey);
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.target);
            if (target) {
                const offset = document.querySelector('.cat-nav-wrap').offsetHeight + 8;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
        nav.appendChild(btn);
    });
}

function renderMenu() {
    db.ref('menu').on('value', (snapshot) => {
        const raw = snapshot.val();
        if (!raw) return;

        const menuData = Object.values(raw);
        const container = document.getElementById('menu-container');
        const socialSection = document.getElementById('social-section');

        // Clear ALL children before social section
        while (container.firstChild && container.firstChild !== socialSection) {
            container.removeChild(container.firstChild);
        }

        // Group by categoryAr
        const catMap = {};
        const catOrder = [];
        menuData.forEach(item => {
            const arKey = item.categoryAr || item.category || '';
            const enKey = item.categoryEn || '';
            if (!catMap[arKey]) {
                const label = (enKey && !arKey.includes(enKey))
                    ? arKey + ' / ' + enKey
                    : arKey;
                catMap[arKey] = { label, arKey, items: [] };
                catOrder.push(arKey);
            }
            catMap[arKey].items.push(item);
        });

        const groups = catOrder.map(k => catMap[k]);

        // Build nav bar
        buildCatNav(groups);

        // Render sections
        groups.forEach(group => {
            const section = document.createElement('section');
            section.className = 'menu-section';
            section.id = 'cat-' + slugify(group.arKey);

            let html = `<h2>${group.label}</h2>`;
            group.items.forEach(item => {
                const nameAr = item.nameAr || item.name || '';
                if (!nameAr) return;
                const nameEn = item.nameEn || '';
                const displayName = nameEn ? `${nameAr} / ${nameEn}` : nameAr;
                html += `
                    <div class="item">
                        <span class="item-name">${displayName}</span>
                        ${buildPriceHtml(item)}
                    </div>`;
            });

            section.innerHTML = html;
            container.insertBefore(section, socialSection);
        });
    });
}
renderMenu();

function localizeUI() {
    const lang = navigator.language || navigator.userLanguage;
    const isArabic = lang.startsWith('ar');

    const callBtn = document.querySelector('.phone-btn');
    const followTitle = document.querySelector('.social-media h3');
    const whatsappBtn = document.querySelector('.whatsapp-btn');

    if (isArabic) {
        if (callBtn) callBtn.innerHTML = '<i class="fas fa-phone"></i> اتصل بنا';
        if (followTitle) followTitle.textContent = 'تابعنا';
        if (whatsappBtn) whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> واتساب';
    } else {
        if (callBtn) callBtn.innerHTML = '<i class="fas fa-phone"></i> Call Us';
        if (followTitle) followTitle.textContent = 'Follow Us';
        if (whatsappBtn) whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> WhatsApp';
    }
}

localizeUI();

