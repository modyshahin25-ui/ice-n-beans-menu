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
   Render full menu from Firebase snapshot
---------------------------------------------------------------- */
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

        // Group by categoryAr (normalize old `category` field too)
        const catMap = {};
        menuData.forEach(item => {
            // Normalize: support both old {category} and new {categoryAr, categoryEn}
            const arKey = item.categoryAr || item.category || '';
            const enKey = item.categoryEn || '';

            if (!catMap[arKey]) {
                // Build label — never double-embed English if arKey already has it
                const label = (enKey && !arKey.includes(enKey))
                    ? arKey + ' / ' + enKey
                    : arKey;
                catMap[arKey] = { label, items: [] };
            }
            catMap[arKey].items.push(item);
        });

        Object.values(catMap).forEach(group => {
            const catItems = group.items;
            const section = document.createElement('section');
            section.className = 'menu-section';

            let html = `<h2>${group.label}</h2>`;

            catItems.forEach(item => {
                const nameAr = item.nameAr || item.name || '';
                if (!nameAr) return; // skip malformed entries

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

