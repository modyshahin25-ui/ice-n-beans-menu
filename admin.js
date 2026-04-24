// ============================================================
//  Firebase config
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyDndtpI55_IqfqUEUQZ4isyDPN8B5ncTi4",
  databaseURL: "https://icenbeans-c092b-default-rtdb.firebaseio.com",
  projectId: "icenbeans-c092b"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ============================================================
//  Standard sizes dictionary  (Arabic / English)
// ============================================================
const STANDARD_SIZES = [
  { ar: 'صغير',        en: 'Small',  value: 'صغير / Small'        },
  { ar: 'وسط',         en: 'Medium', value: 'وسط / Medium'         },
  { ar: 'كبير',        en: 'Large',  value: 'كبير / Large'         },
  { ar: 'إكسترا لارج', en: 'XL',    value: 'إكسترا لارج / XL'    },
];

function buildSizeOptions(selectedValue = '') {
  let opts = `<option value="">— اختر حجم —</option>`;
  STANDARD_SIZES.forEach(s => {
    const sel = selectedValue === s.value ? 'selected' : '';
    opts += `<option value="${s.value}" ${sel}>${s.ar} / ${s.en}</option>`;
  });
  const customSel = (selectedValue && !STANDARD_SIZES.some(s => s.value === selectedValue)) ? 'selected' : '';
  opts += `<option value="__custom__" ${customSel}>✏️ حجم مخصص...</option>`;
  return opts;
}

// ============================================================
//  Auth
// ============================================================
function login() {
  const u = document.getElementById('usr').value.trim();
  const p = document.getElementById('pwd').value;
  if (u === 'admin' && p === 'icenbean2026') {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    addSizeRow();
    startListen();
  } else {
    document.getElementById('login-err').textContent = 'خطأ في البيانات';
  }
}

function logout() { location.reload(); }

// ============================================================
//  Firebase listener
// ============================================================
function startListen() {
  db.ref('menu').on('value', snap => {
    const data = snap.val() || {};
    renderItems(data);
    updateCatSelect(data);
  });
}

// ============================================================
//  Category select
// ============================================================
function updateCatSelect(data) {
  const catMap = {};
  Object.values(data).forEach(i => {
    const arKey = i.categoryAr || i.category || '';
    if (!arKey || catMap[arKey]) return;
    const enKey = i.categoryEn || '';
    catMap[arKey] = (enKey && !arKey.includes(enKey)) ? arKey + ' / ' + enKey : arKey;
  });
  const sel = document.getElementById('catSelect');
  const cur = sel.value;
  sel.innerHTML = '<option value="">— اختر قسم —</option>';
  Object.values(catMap).forEach(c => {
    sel.innerHTML += '<option value="' + c + '">' + c + '</option>';
  });
  sel.innerHTML += '<option value="__new__">+ قسم جديد</option>';
  if (cur) sel.value = cur;
}

function onCatChange() {
  document.getElementById('newCatWrap').style.display =
    document.getElementById('catSelect').value === '__new__' ? 'block' : 'none';
}

// ============================================================
//  Size rows
// ============================================================
function addSizeRow(sizeValue = '', price = '') {
  const isCustom = sizeValue && !STANDARD_SIZES.some(s => s.value === sizeValue);
  const row = document.createElement('div');
  row.className = 'size-row' + (isCustom ? ' has-custom' : '');

  row.innerHTML = `
    <select class="f-select sz-select" onchange="onSizeSelectChange(this)">
      ${buildSizeOptions(isCustom ? '__custom__' : sizeValue)}
    </select>
    ${isCustom ? `<input class="f-input sz-custom" type="text" placeholder="مثال: ميدم / Medium" value="${sizeValue}">` : ''}
    <input class="f-input sz-price" type="number" placeholder="السعر" value="${price !== '' ? price : ''}">
    <button class="del-size" onclick="this.parentElement.remove()" title="حذف">×</button>
  `;
  document.getElementById('sizesContainer').appendChild(row);
}

function onSizeSelectChange(sel) {
  const row = sel.parentElement;
  const existing = row.querySelector('.sz-custom');

  if (sel.value === '__custom__') {
    if (!existing) {
      const inp = document.createElement('input');
      inp.className = 'f-input sz-custom';
      inp.type = 'text';
      inp.placeholder = 'مثال: ميدم / Medium';
      row.insertBefore(inp, row.querySelector('.sz-price'));
      row.classList.add('has-custom');
    }
  } else {
    if (existing) { existing.remove(); row.classList.remove('has-custom'); }
  }
}

// ============================================================
//  Save item (add or update)
// ============================================================
function saveItem() {
  const nameAr  = document.getElementById('nameAr').value.trim();
  const nameEn  = document.getElementById('nameEn').value.trim().toUpperCase();
  const editKey = document.getElementById('editKey').value;

  let category = document.getElementById('catSelect').value;
  if (category === '__new__') category = document.getElementById('newCatInput').value.trim();

  const catParts   = category.split(' / ');
  const categoryAr = catParts[0] || '';
  const categoryEn = catParts[1] || catParts[0] || '';

  const sizes = [];
  document.querySelectorAll('#sizesContainer .size-row').forEach(row => {
    const sel    = row.querySelector('.sz-select');
    const custom = row.querySelector('.sz-custom');
    const n = sel.value === '__custom__'
      ? (custom ? custom.value.trim() : '')
      : sel.value;
    const p = parseInt(row.querySelector('.sz-price').value);
    if (n && !isNaN(p)) sizes.push({ name: n, price: p });
  });

  if (!nameAr || !categoryAr || sizes.length === 0) {
    alert('برجاء ملء جميع البيانات (الاسم، القسم، وحجم واحد على الأقل).');
    return;
  }

  const itemData = { nameAr, nameEn, categoryAr, categoryEn, sizes };

  if (editKey) {
    db.ref('menu/' + editKey).update(itemData).then(() => { resetForm(); showToast('✅ تم تحديث الصنف'); });
  } else {
    db.ref('menu').push(itemData).then(() => { resetForm(); showToast('✅ تمت الإضافة'); });
  }
}

// ============================================================
//  Reset form
// ============================================================
function resetForm() {
  document.getElementById('nameAr').value = '';
  document.getElementById('nameEn').value = '';
  document.getElementById('catSelect').value = '';
  document.getElementById('editKey').value = '';
  document.getElementById('newCatInput').value = '';
  document.getElementById('newCatWrap').style.display = 'none';
  document.getElementById('formTitle').textContent = 'إضافة صنف جديد';
  document.getElementById('saveBtn').textContent = 'إضافة للمنيو';
  document.getElementById('cancelEdit').style.display = 'none';
  document.getElementById('sizesContainer').innerHTML = '<label class="sizes-label">الأحجام والأسعار</label>';
  addSizeRow();
}

// ============================================================
//  Render menu list
// ============================================================
function slugify(str) {
  return str.replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '');
}

function buildAdminCatNav(groupKeys) {
  const nav = document.getElementById('adminCatNav');
  nav.innerHTML = '';
  groupKeys.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'admin-cat-btn' + (i === 0 ? ' active' : '');
    btn.textContent = cat;
    btn.dataset.target = 'admin-cat-' + slugify(cat);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    nav.appendChild(btn);
  });
}

function renderItems(data) {
  const cont = document.getElementById('itemsList');
  cont.innerHTML = '';

  if (!data || Object.keys(data).length === 0) {
    cont.innerHTML = '<div class="empty">لا توجد أصناف بعد</div>';
    buildAdminCatNav([]);
    return;
  }

  const groups = {};
  const groupOrder = [];
  Object.keys(data).forEach(key => {
    const item = data[key];
    const arKey = item.categoryAr || item.category || 'بدون قسم';
    const enKey = item.categoryEn || '';
    const cat = (enKey && !arKey.includes(enKey)) ? arKey + ' / ' + enKey : arKey;
    if (!groups[cat]) { groups[cat] = []; groupOrder.push(cat); }
    groups[cat].push({ ...item, _key: key });
  });

  buildAdminCatNav(groupOrder);

  for (let cat of groupOrder) {
    const anchorId = 'admin-cat-' + slugify(cat);
    cont.innerHTML += `<div class="section-label" id="${anchorId}">${cat}</div>`;
    groups[cat].forEach(item => {
      const itemSizes = item.sizes && item.sizes.length ? item.sizes : [
        { name: 'صغير / Small', price: item.small },
        { name: 'كبير / Large', price: item.large }
      ];

      let sizesHtml = '';
      itemSizes.forEach((s, si) => {
        if (s.price != null && s.price >= 0) {
          sizesHtml += `
            <div class="price-group">
              <span class="price-tag">${s.name}</span>
              <div class="stepper">
                <button class="s-btn s-minus" onclick="updateStep('${item._key}', ${si}, -5)">−</button>
                <input class="s-input" value="${s.price}" readonly>
                <button class="s-btn s-plus"  onclick="updateStep('${item._key}', ${si}, 5)">+</button>
              </div>
            </div>`;
        }
      });

      cont.innerHTML += `
        <div class="item-row">
          <div class="item-info">
            <div class="item-name">${item.nameAr || item.name || ''}${item.nameEn ? ' / ' + item.nameEn : ''}</div>
            <div class="item-actions">
              <button class="item-edit" onclick="editItem('${item._key}')">تعديل</button>
              <button class="item-del"  onclick="deleteItem('${item._key}')">حذف</button>
            </div>
          </div>
          <div class="prices">${sizesHtml}</div>
        </div>`;
    });
  }
}

// ============================================================
//  Price stepper
// ============================================================
function updateStep(key, sizeIdx, delta) {
  const ref = db.ref('menu/' + key);
  ref.once('value').then(snap => {
    const d = snap.val();
    if (d.sizes && d.sizes[sizeIdx] != null) {
      d.sizes[sizeIdx].price = Math.max(0, (parseInt(d.sizes[sizeIdx].price) || 0) + delta);
    } else {
      const field = sizeIdx === 0 ? 'small' : 'large';
      d[field] = Math.max(0, (parseInt(d[field]) || 0) + delta);
    }
    ref.set(d);
  });
}

// ============================================================
//  Edit item
// ============================================================
function editItem(key) {
  db.ref('menu/' + key).once('value').then(snap => {
    const item = snap.val();
    document.getElementById('nameAr').value = item.nameAr || '';
    document.getElementById('nameEn').value = item.nameEn || item.name || '';

    const catVal = (item.categoryAr && item.categoryEn)
      ? item.categoryAr + ' / ' + item.categoryEn
      : (item.category || '');
    document.getElementById('catSelect').value = catVal;

    document.getElementById('editKey').value = key;
    document.getElementById('formTitle').textContent = 'تعديل الصنف';
    document.getElementById('saveBtn').textContent = 'تحديث البيانات';
    document.getElementById('cancelEdit').style.display = 'block';

    document.getElementById('sizesContainer').innerHTML = '<label class="sizes-label">الأحجام والأسعار</label>';
    const itemSizes = item.sizes && item.sizes.length ? item.sizes : [
      { name: 'صغير / Small', price: item.small },
      { name: 'كبير / Large', price: item.large }
    ];
    itemSizes.forEach(s => addSizeRow(s.name, s.price));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
//  Delete item
// ============================================================
function deleteItem(key) {
  if (confirm('حذف نهائي؟ لا يمكن التراجع.')) {
    db.ref('menu/' + key).remove().then(() => showToast('🗑️ تم الحذف'));
  }
}

// ============================================================
//  Toast notification
// ============================================================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}