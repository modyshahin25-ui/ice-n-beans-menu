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
        const menuData = snapshot.val() || [];
        const container = document.getElementById('menu-container');
        document.querySelectorAll('.menu-section').forEach(s => s.remove());

        const categories = [...new Set(menuData.map(item => item.category))];

        categories.forEach(cat => {
            const catItems = menuData.filter(item => item.category === cat);
            const section = document.createElement('section');
            section.className = 'menu-section';
            let itemsHtml = `<h2>${cat}</h2>`;
            
            catItems.forEach(item => {
                let price = item.large > 0 ? `${item.small} / ${item.large}` : `${item.small}`;
                itemsHtml += `
                    <div class="item">
                        <span>${item.name}</span>
                        <span>${price} L.E</span>
                    </div>`;
            });
            
            section.innerHTML = itemsHtml;
            const socialSection = document.getElementById('social-section');
            container.insertBefore(section, socialSection);
        });
    });
}
renderMenu();