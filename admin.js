let menuData = JSON.parse(localStorage.getItem('fullMenu'));

function displayAdminItems() {
    const list = document.getElementById('currentItems');
    list.innerHTML = '<h2>التحكم في المنيو الكاملة</h2>';
    
    menuData.forEach((item, index) => {
        list.innerHTML += `
            <div class="admin-item" style="border:1px solid #ccc; padding:10px; margin-bottom:10px; background:white;">
                <span><b>${item.name}</b> <br> <small>${item.category}</small></span>
                <div>
                    S: <input type="number" value="${item.small}" onchange="updatePrice(${index}, 'small', this.value)" style="width:60px">
                    L: <input type="number" value="${item.large}" onchange="updatePrice(${index}, 'large', this.value)" style="width:60px">
                    <button onclick="deleteItem(${index})" style="background:red; color:white; border:none; padding:5px; cursor:pointer;">حذف</button>
                </div>
            </div>`;
    });
}

function addItem() {
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const small = document.getElementById('priceSmall').value;
    const large = document.getElementById('priceLarge').value || 0;

    if(name && small) {
        menuData.push({ name: name.toUpperCase(), category, small: parseInt(small), large: parseInt(large) });
        saveAndRefresh();
        document.getElementById('itemName').value = '';
    }
}

function updatePrice(index, type, value) {
    menuData[index][type] = parseInt(value);
    saveAndRefresh();
}

function deleteItem(index) {
    if(confirm('مسح هذا الصنف نهائياً؟')) {
        menuData.splice(index, 1);
        saveAndRefresh();
    }
}

function saveAndRefresh() {
    localStorage.setItem('fullMenu', JSON.stringify(menuData));
    displayAdminItems();
}

window.onload = displayAdminItems;