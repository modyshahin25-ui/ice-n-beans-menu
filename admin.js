// جلب البيانات من الذاكرة
let menuData = JSON.parse(localStorage.getItem('fullMenu'));

// دالة عرض الأصناف في اللوحة
function displayAdminItems() {
    const list = document.getElementById('currentItems');
    if(!list) return;
    
    list.innerHTML = '<h2>الأصناف الحالية</h2>';
    
    menuData.forEach((item, index) => {
        list.innerHTML += `
            <div class="admin-item">
                <div>
                    <strong>${item.name}</strong> <br>
                    <small>القسم: ${item.category}</small>
                </div>
                <div>
                    S: <input type="number" value="${item.small}" onchange="updatePrice(${index}, 'small', this.value)" style="width:50px; display:inline;">
                    L: <input type="number" value="${item.large}" onchange="updatePrice(${index}, 'large', this.value)" style="width:50px; display:inline;">
                    <button class="delete-btn" onclick="deleteItem(${index})">حذف</button>
                </div>
            </div>`;
    });
}

// دالة إضافة صنف جديد
function addItem() {
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value.toUpperCase();
    const small = document.getElementById('priceSmall').value;
    const large = document.getElementById('priceLarge').value || 0;

    if(name && category && small) {
        menuData.push({ 
            name: name.toUpperCase(), 
            category: category, 
            small: parseInt(small), 
            large: parseInt(large) 
        });
        saveAndRefresh();
        
        // مسح الخانات
        document.getElementById('itemName').value = '';
        document.getElementById('itemCategory').value = '';
        document.getElementById('priceSmall').value = '';
        document.getElementById('priceLarge').value = '';
    } else {
        alert("برجاء ملء خانات الاسم والقسم والسعر الصغير.");
    }
}

// تحديث السعر عند التغيير
function updatePrice(index, type, value) {
    menuData[index][type] = parseInt(value);
    saveAndRefresh();
}

// حذف صنف
function deleteItem(index) {
    if(confirm('هل أنت متأكد من الحذف؟')) {
        menuData.splice(index, 1);
        saveAndRefresh();
    }
}

// حفظ وتحديث
function saveAndRefresh() {
    localStorage.setItem('fullMenu', JSON.stringify(menuData));
    displayAdminItems();
}

window.onload = displayAdminItems;