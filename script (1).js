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

function renderMenu() {
    db.ref('menu').on('value', (snapshot) => {
        const raw = snapshot.val();
        if (!raw) return;

        const menuData = Object.values(raw);

        const container = document.getElementById('menu-container');

        // Remove old rendered sections
        document.querySelectorAll('.menu-section').forEach(s => s.remove());

        // Get unique categories (using categoryAr for new format, category for old)
        const categories = [...new Set(menuData.map(item => item.categoryAr || item.category))];

        categories.forEach(cat => {
            const catItems = menuData.filter(item => (item.categoryAr || item.category) === cat);
            const section = document.createElement('section');
            section.className = 'menu-section';

            // Show category in Arabic / English if available
            const firstItem = catItems[0];
            const catLabel = firstItem.categoryEn
                ? `${cat} / ${firstItem.categoryEn}`
                : cat;

            let itemsHtml = `<h2>${catLabel}</h2>`;

            catItems.forEach(item => {
                const nameAr = item.nameAr || item.name || '';
                const nameEn = item.nameEn || '';

                // ✅ Support new sizes[] array AND old small/large fields
                let priceText = '';
                if (item.sizes && item.sizes.length) {
                    priceText = item.sizes
                        .map(s => `${s.name}: ${s.price}`)
                        .join(' / ');
                } else {
                    priceText = item.large > 0
                        ? `${item.small} / ${item.large}`
                        : `${item.small}`;
                }

                itemsHtml += `
                    <div class="item">
                        <span>${nameAr}${nameEn ? ' / ' + nameEn : ''}</span>
                        <span>${priceText} L.E</span>
                    </div>`;
            });

            section.innerHTML = itemsHtml;

            // Insert before social section (same as original)
            const socialSection = document.getElementById('social-section');
            container.insertBefore(section, socialSection);
        });
    });
}

renderMenu();