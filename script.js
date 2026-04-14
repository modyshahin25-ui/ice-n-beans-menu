// البيانات الكاملة من الـ PDF
const initialData = [
    // HOT DRINKS
    { name: "ESPRESSO", category: "HOT DRINKS", small: 40, large: 50 },
    { name: "AMERICANO", category: "HOT DRINKS", small: 50, large: 60 },
    { name: "CAPPUCCINO", category: "HOT DRINKS", small: 55, large: 65 },
    { name: "LATTE", category: "HOT DRINKS", small: 50, large: 60 },
    { name: "VANILLA LATTE", category: "HOT DRINKS", small: 55, large: 65 },
    { name: "CARAMEL LATTE", category: "HOT DRINKS", small: 55, large: 65 },
    { name: "HAZELNUT LATTE", category: "HOT DRINKS", small: 55, large: 65 },
    { name: "MOCHA", category: "HOT DRINKS", small: 55, large: 65 },
    { name: "WHITE MOCHA", category: "HOT DRINKS", small: 55, large: 65 },
    { name: "TURKISH COFFEE", category: "HOT DRINKS", small: 20, large: 30 },
    { name: "HOT CHOCOLATE", category: "HOT DRINKS", small: 45, large: 55 },
    
    // COLD DRINKS
    { name: "LATTE", category: "COLD DRINKS", small: 65, large: 75 },
    { name: "MOCHA", category: "COLD DRINKS", small: 80, large: 70 },
    { name: "CAPPUCCINO", category: "COLD DRINKS", small: 70, large: 80 },
    { name: "AMERICANO", category: "COLD DRINKS", small: 55, large: 65 },
    { name: "SPANISH LATTE", category: "COLD DRINKS", small: 70, large: 80 },

    // FRAPPE
    { name: "CHOCOLATE", category: "FRAPPE", small: 75, large: 85 },
    { name: "CARAMEL", category: "FRAPPE", small: 75, large: 85 },
    { name: "HAZELNUT", category: "FRAPPE", small: 75, large: 85 },
    { name: "SALTED CARAMEL", category: "FRAPPE", small: 85, large: 75 },

    // SMOOTHIES
    { name: "MANGO / PEACH", category: "SMOOTHIES", small: 40, large: 50 },
    { name: "MIX BERRIES", category: "SMOOTHIES", small: 40, large: 50 },
    { name: "PINACOLADA", category: "SMOOTHIES", small: 40, large: 50 },
    { name: "GREEN APPLE MOJITO", category: "SMOOTHIES", small: 40, large: 50 },

    // MILKSHAKES
    { name: "STRAWBERRY / VANILLA", category: "MILKSHAKES", small: 50, large: 60 },
    { name: "CHOCOLATE / CARAMEL", category: "MILKSHAKES", small: 50, large: 60 },
    { name: "HAZELNUT", category: "MILKSHAKES", small: 50, large: 60 },

    // SOFT DRINKS
    { name: "COCA / SPRITE / FANTA", category: "SOFT DRINKS", small: 20, large: 0 },
    { name: "REDBULL", category: "SOFT DRINKS", small: 55, large: 0 },
    { name: "MONSTER", category: "SOFT DRINKS", small: 65, large: 0 }
];

let menuData = JSON.parse(localStorage.getItem('fullMenu')) || initialData;

if (!localStorage.getItem('fullMenu')) {
    localStorage.setItem('fullMenu', JSON.stringify(menuData));
}

function renderMenu() {
    const container = document.querySelector('.container');
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(s => s.remove());

    const categories = ["HOT DRINKS", "COLD DRINKS", "FRAPPE", "SMOOTHIES", "MILKSHAKES", "SOFT DRINKS"];

    categories.forEach(cat => {
        const catItems = menuData.filter(item => item.category === cat);
        if (catItems.length > 0) {
            const sectionElement = document.createElement('section');
            sectionElement.className = 'menu-section';
            let itemsHtml = `<h2>${cat}</h2>`;
            
            catItems.forEach(item => {
                let priceDisplay = item.large > 0 ? `${item.small} / ${item.large}` : `${item.small}`;
                itemsHtml += `
                    <div class="item">
                        <span>${item.name}</span>
                        <span>${priceDisplay} L.E</span>
                    </div>`;
            });
            
            sectionElement.innerHTML = itemsHtml;
            container.insertBefore(sectionElement, document.querySelector('.social-media'));
        }
    });
}

window.onload = renderMenu;