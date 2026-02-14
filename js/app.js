// ===================================================================
// DATA LOADING
// ===================================================================
let CATEGORIES = [];
let PRODUCTS = [];

async function loadData() {
  const [catRes, prodRes] = await Promise.all([
    fetch('data/categories.json'),
    fetch('data/products.json')
  ]);
  CATEGORIES = await catRes.json();
  PRODUCTS = await prodRes.json();
}

// ===================================================================
// STATE
// ===================================================================
let state = {
  page: 'shop',
  subPage: null,
  productId: null,
  activeCategory: 'alle',
  expandedCategories: new Set(['stuehle']),
  searchQuery: '',
  sortBy: 'name-asc',
  openDropdown: null,
  mobileMenuOpen: false,
  cart: [],
  cartStep: 1,
  globalSearchQuery: '',
  searchFilterCategory: '',
  searchFilterBrand: '',
  searchSortBy: 'name-asc',
  // Raumplanung
  rpSelectedId: null,
  rpExpandedIds: new Set(['ch']),
  rpTab: 'karte'
};

// ===================================================================
// RAUMPLANUNG – LOCATION DATA
// ===================================================================
const LOCATIONS = {
  id: 'ch', label: 'Schweiz', type: 'country', count: 230, children: [
    { id: 'be', label: 'Bern', type: 'kanton', count: 45, children: [
      { id: 'b-001', label: 'Bundeshaus Ost', code: '1502.AB.0', address: 'Bundesgasse 3, 3003 Bern', type: 'building',
        photo: 'photo-1486406146926-c627a92ad1ab', coords: [46.9480, 7.4474], baujahr: '1892', status: 'Geb\u00e4ude bestehend', kategorie: 'Verwaltungsgeb\u00e4ude', flaeche: '12\u2009450 m\u00b2',
        children: [
          { id: 'b-001-ug', label: 'UG', type: 'floor', flaeche: '1\u2009820 m\u00b2', plaetze: 0, raeume: 14 },
          { id: 'b-001-eg', label: 'EG', type: 'floor', flaeche: '2\u2009650 m\u00b2', plaetze: 42, raeume: 22 },
          { id: 'b-001-1', label: '1. OG', type: 'floor', flaeche: '2\u2009650 m\u00b2', plaetze: 58, raeume: 24 },
          { id: 'b-001-2', label: '2. OG', type: 'floor', flaeche: '2\u2009650 m\u00b2', plaetze: 56, raeume: 23 },
          { id: 'b-001-3', label: '3. OG', type: 'floor', flaeche: '1\u2009680 m\u00b2', plaetze: 34, raeume: 18 }
        ]},
      { id: 'b-002', label: 'Bundeshaus West', code: '1502.AB.1', address: 'Bundesplatz 3, 3003 Bern', type: 'building',
        photo: 'photo-1577495508048-b635879837f1', coords: [46.9468, 7.4441], baujahr: '1857', status: 'Geb\u00e4ude bestehend', kategorie: 'Verwaltungsgeb\u00e4ude', flaeche: '9\u2009800 m\u00b2',
        children: [
          { id: 'b-002-eg', label: 'EG', type: 'floor', flaeche: '2\u2009100 m\u00b2', plaetze: 30, raeume: 18 },
          { id: 'b-002-1', label: '1. OG', type: 'floor', flaeche: '2\u2009100 m\u00b2', plaetze: 44, raeume: 20 },
          { id: 'b-002-2', label: '2. OG', type: 'floor', flaeche: '2\u2009100 m\u00b2', plaetze: 40, raeume: 19 }
        ]},
      { id: 'b-003', label: 'Verwaltungsgeb\u00e4ude Hallwyl', code: '1504.BA.0', address: 'Hallwylstrasse 15, 3003 Bern', type: 'building',
        photo: 'photo-1554435493-93422e8220c8', coords: [46.9440, 7.4510], baujahr: '1975', status: 'Geb\u00e4ude bestehend', kategorie: 'Verwaltungsgeb\u00e4ude', flaeche: '8\u2009200 m\u00b2',
        children: [
          { id: 'b-003-ug', label: 'UG', type: 'floor', flaeche: '1\u2009200 m\u00b2', plaetze: 0, raeume: 8 },
          { id: 'b-003-eg', label: 'EG', type: 'floor', flaeche: '1\u2009750 m\u00b2', plaetze: 28, raeume: 16 },
          { id: 'b-003-1', label: '1. OG', type: 'floor', flaeche: '1\u2009750 m\u00b2', plaetze: 48, raeume: 20 },
          { id: 'b-003-2', label: '2. OG', type: 'floor', flaeche: '1\u2009750 m\u00b2', plaetze: 46, raeume: 19 }
        ]}
    ]},
    { id: 'zh', label: 'Z\u00fcrich', type: 'kanton', count: 15, children: [
      { id: 'b-010', label: 'Zollkreisdirektion', code: '2001.ZH.0', address: 'Seestrasse 356, 8038 Z\u00fcrich', type: 'building',
        photo: 'photo-1497366811353-6870744d04b2', coords: [47.3440, 8.5280], baujahr: '1960', status: 'Geb\u00e4ude bestehend', kategorie: 'Verwaltungsgeb\u00e4ude', flaeche: '4\u2009600 m\u00b2',
        children: [
          { id: 'b-010-eg', label: 'EG', type: 'floor', flaeche: '1\u2009150 m\u00b2', plaetze: 18, raeume: 12 },
          { id: 'b-010-1', label: '1. OG', type: 'floor', flaeche: '1\u2009150 m\u00b2', plaetze: 24, raeume: 14 },
          { id: 'b-010-2', label: '2. OG', type: 'floor', flaeche: '1\u2009150 m\u00b2', plaetze: 22, raeume: 13 }
        ]},
      { id: 'b-011', label: 'Bundesasylzentrum', code: '2002.ZH.0', address: 'D\u00fcttweilerstrasse 100, 8005 Z\u00fcrich', type: 'building',
        photo: 'photo-1497215842964-222b430dc094', coords: [47.3890, 8.5170], baujahr: '2018', status: 'Geb\u00e4ude bestehend', kategorie: 'Spezialgeb\u00e4ude', flaeche: '6\u2009200 m\u00b2',
        children: [
          { id: 'b-011-eg', label: 'EG', type: 'floor', flaeche: '2\u2009100 m\u00b2', plaetze: 10, raeume: 8 },
          { id: 'b-011-1', label: '1. OG', type: 'floor', flaeche: '2\u2009050 m\u00b2', plaetze: 12, raeume: 10 }
        ]}
    ]},
    { id: 'bs', label: 'Basel', type: 'kanton', count: 12, children: [
      { id: 'b-020', label: 'Zollverwaltung Nord', code: '3001.BS.0', address: 'Elisabethenstrasse 31, 4010 Basel', type: 'building',
        photo: 'photo-1497366216548-37526070297c', coords: [47.5500, 7.5886], baujahr: '1985', status: 'Geb\u00e4ude bestehend', kategorie: 'Verwaltungsgeb\u00e4ude', flaeche: '5\u2009100 m\u00b2',
        children: [
          { id: 'b-020-eg', label: 'EG', type: 'floor', flaeche: '1\u2009275 m\u00b2', plaetze: 20, raeume: 14 },
          { id: 'b-020-1', label: '1. OG', type: 'floor', flaeche: '1\u2009275 m\u00b2', plaetze: 28, raeume: 16 },
          { id: 'b-020-2', label: '2. OG', type: 'floor', flaeche: '1\u2009275 m\u00b2', plaetze: 26, raeume: 15 }
        ]}
    ]},
    { id: 'lu', label: 'Luzern', type: 'kanton', count: 8, children: [
      { id: 'b-030', label: 'Bundesgeb\u00e4ude Luzern', code: '4001.LU.0', address: 'Bahnhofstrasse 20, 6002 Luzern', type: 'building',
        photo: 'photo-1524758631624-e2822e304c36', coords: [47.0502, 8.3093], baujahr: '1970', status: 'Geb\u00e4ude bestehend', kategorie: 'Verwaltungsgeb\u00e4ude', flaeche: '3\u2009800 m\u00b2',
        children: [
          { id: 'b-030-eg', label: 'EG', type: 'floor', flaeche: '950 m\u00b2', plaetze: 14, raeume: 10 },
          { id: 'b-030-1', label: '1. OG', type: 'floor', flaeche: '950 m\u00b2', plaetze: 20, raeume: 12 },
          { id: 'b-030-2', label: '2. OG', type: 'floor', flaeche: '950 m\u00b2', plaetze: 18, raeume: 11 }
        ]}
    ]}
  ]
};

// Helper: find a node + its parent chain by id
function rpFindNode(id, node, path) {
  if (!node) node = LOCATIONS;
  if (!path) path = [];
  if (node.id === id) return { node, path };
  if (node.children) {
    for (const child of node.children) {
      const result = rpFindNode(id, child, [...path, node]);
      if (result) return result;
    }
  }
  return null;
}

// Helper: get the parent building for a floor node
function rpGetParentBuilding(floorId) {
  const result = rpFindNode(floorId);
  if (!result) return null;
  return result.path.find(n => n.type === 'building') || null;
}

// SVG icons per location type
const RP_ICONS = {
  country: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3v10l4-2 4 2 4-2V1l-4 2-4-2-4 2z"/></svg>',
  kanton: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M5 3V1h6v2"/><line x1="2" y1="7" x2="14" y2="7"/></svg>',
  building: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="2" width="10" height="13" rx="1"/><line x1="6" y1="5" x2="6" y2="5.01"/><line x1="8" y1="5" x2="8" y2="5.01"/><line x1="10" y1="5" x2="10" y2="5.01"/><line x1="6" y1="8" x2="6" y2="8.01"/><line x1="8" y1="8" x2="8" y2="8.01"/><line x1="10" y1="8" x2="10" y2="8.01"/><path d="M6 15v-3h4v3"/></svg>',
  floor: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="10" rx="1"/><line x1="2" y1="8" x2="9" y2="8"/><line x1="7" y1="3" x2="7" y2="10"/></svg>'
};

// ===================================================================
// CART
// ===================================================================
function addToCart(productId) {
  const existing = state.cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity++;
  } else {
    state.cart.push({ productId, quantity: 1 });
  }
  updateCartBadge();
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  updateCartBadge();
  navigateTo('cart');
}

function updateCartQuantity(index, qty) {
  const q = Math.max(1, Math.min(99, parseInt(qty) || 1));
  state.cart[index].quantity = q;
  navigateTo('cart');
}

function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  const btn = document.querySelector('.top-header__action[aria-label="Warenkorb"]');
  if (!btn) return;
  let badge = btn.querySelector('.cart-badge');
  if (count > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      btn.appendChild(badge);
    }
    badge.textContent = count;
  } else if (badge) {
    badge.remove();
  }
}

// ===================================================================
// ICONS
// ===================================================================
const ICONS = {
  chevronRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,6 15,12 9,18"/></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>`,
  placeholder: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>`,
  chair: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><path d="M7 18v3M17 18v3M5 10V6a2 2 0 012-2h10a2 2 0 012 2v4M5 10h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2z"/></svg>`,
  desk: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><rect x="2" y="7" width="20" height="3" rx="1"/><line x1="4" y1="10" x2="4" y2="20"/><line x1="20" y1="10" x2="20" y2="20"/><rect x="6" y="12" width="6" height="5" rx="0.5"/></svg>`,
  lamp: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><path d="M9 21h6M12 21v-6M8 3l-4 12h16L16 3z"/></svg>`,
  shelf: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`,
  cabinet: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="14" cy="7" r="1"/><circle cx="14" cy="17" r="1"/></svg>`,
  korpus: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><rect x="5" y="4" width="14" height="16" rx="1"/><line x1="5" y1="9" x2="19" y2="9"/><line x1="5" y1="14" x2="19" y2="14"/><circle cx="15" cy="6.5" r="0.8"/><circle cx="15" cy="11.5" r="0.8"/><circle cx="15" cy="16.5" r="0.8"/></svg>`,
  garderobe: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><line x1="12" y1="2" x2="12" y2="22"/><line x1="6" y1="6" x2="12" y2="4"/><line x1="18" y1="6" x2="12" y2="4"/><circle cx="12" cy="22" r="2"/></svg>`,
  sofa: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><path d="M4 12V8a4 4 0 014-4h8a4 4 0 014 4v4"/><rect x="2" y="12" width="20" height="6" rx="2"/><line x1="4" y1="18" x2="4" y2="21"/><line x1="20" y1="18" x2="20" y2="21"/></svg>`,
  misc: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>`
};

// Unsplash placeholder images per product ID
const PRODUCT_IMAGES = {
  1:  'photo-1503602642458-232111445657',  // bar stool
  2:  'photo-1567538096630-e0c55bd6374c',     // bistro chair
  3:  'photo-1580480055273-228ff5388ef8',  // office chair dark
  4:  'photo-1616627547584-bf28cee262db',  // office chair blue
  5:  'photo-1586023492125-27b2c045efd7',  // executive chair
  6:  'photo-1506439773649-6e0eb8cfb237',  // stacking chair
  7:  'photo-1561677978-583a8c7a4b43',     // wood chair classic
  8:  'photo-1549187774-b4e9b0445b41',     // wood stacking chair
  9:  'photo-1592078615290-033ee584e267',   // cantilever chair
  10: 'photo-1595428774223-ef52624120d2',   // USM shelving
  11: 'photo-1518455027359-f3f8164ba6bd',   // desk workspace
  12: 'photo-1573164713988-8665fc963095',   // desk lamp
  13: 'photo-1595526114035-0d45ed16cfbf',   // rolling stool
  14: 'photo-1493663284031-b7e3aefcae8e',      // sideboard
  15: 'photo-1462826303086-329426d1aef5',   // conference table
  16: 'photo-1558997519-83ea9252edf8',      // filing cabinet
  17: 'photo-1580480055273-228ff5388ef8',   // office chair (used)
  18: 'photo-1595428774223-ef52624120d2',   // USM shelf (used)
  19: 'photo-1592078615290-033ee584e267',   // visitor chair (used)
  20: 'photo-1598300042247-d088f8ab3a91',   // saddle chair
  21: 'photo-1580480055273-228ff5388ef8',   // task chair
  22: 'photo-1581539250439-c96689b516dd',   // conference chair
  23: 'photo-1611269154421-4e27233ac5c7',   // USM Kitos desk
  24: 'photo-1593642632559-0c6d3fc62b89',   // sit-stand desk
  25: 'photo-1532372576444-dda954194ad0',   // side table
  26: 'photo-1577412647305-991150c7d163',   // standing table
  27: 'photo-1513506003901-1e6a229e2d15',   // floor lamp
  28: 'photo-1558997519-83ea9252edf8',      // filing cabinet
  29: 'photo-1594620302200-9a762244a156',   // wall shelf
  30: 'photo-1594620302200-9a762244a156',   // bookshelf
  31: 'photo-1493663284031-b7e3aefcae8e',      // pedestal
  32: 'photo-1493663284031-b7e3aefcae8e',      // USM pedestal
  33: 'photo-1524758631624-e2822e304c36',   // coat stand
  34: 'photo-1524758631624-e2822e304c36',   // flipchart
  35: 'photo-1555041469-a586c61ea9bc',      // sofa
  36: 'photo-1497215842964-222b430dc094',   // acoustic panel
  37: 'photo-1518455027359-f3f8164ba6bd',   // desk (used)
  38: 'photo-1573164713988-8665fc963095',   // lamp (used)
  39: 'photo-1581539250439-c96689b516dd',   // conference chair (used)
  40: 'photo-1493663284031-b7e3aefcae8e',      // pedestal (used)
};

function getProductImage(product) {
  const photoId = PRODUCT_IMAGES[product.id];
  if (photoId) {
    return `<img src="https://images.unsplash.com/${photoId}?w=600&h=400&fit=crop&auto=format&q=80" srcset="https://images.unsplash.com/${photoId}?w=400&h=267&fit=crop&auto=format&q=80 400w, https://images.unsplash.com/${photoId}?w=600&h=400&fit=crop&auto=format&q=80 600w, https://images.unsplash.com/${photoId}?w=800&h=533&fit=crop&auto=format&q=80 800w" sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 280px" alt="${product.name}" loading="lazy">`;
  }
  return getProductIcon(product);
}

function getProductIcon(product) {
  const cat = product.category;
  if (cat === 'stuehle') return ICONS.chair;
  if (cat === 'tische') return ICONS.desk;
  if (cat === 'lampen') return ICONS.lamp;
  if (cat === 'regale') return ICONS.shelf;
  if (cat === 'usm') return ICONS.shelf;
  if (cat === 'schraenke' || cat === 'sicherheitsschraenke') return ICONS.cabinet;
  if (cat === 'korpus') return ICONS.korpus;
  if (cat === 'garderobe') return ICONS.garderobe;
  if (cat === 'clubsessel-sofa') return ICONS.sofa;
  return ICONS.misc;
}

// ===================================================================
// HELPERS
// ===================================================================
function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function getCategoryLabel(id) {
  function find(cats) {
    for (const c of cats) {
      if (c.id === id) return c.label;
      if (c.children && c.children.length) {
        const found = find(c.children);
        if (found) return found;
      }
    }
    return null;
  }
  return find(CATEGORIES) || id;
}

function getParentCategory(subcatId) {
  for (const c of CATEGORIES) {
    if (c.id === subcatId) return null;
    if (c.children) {
      for (const ch of c.children) {
        if (ch.id === subcatId) return c;
        if (ch.children) {
          for (const gch of ch.children) {
            if (gch.id === subcatId) return ch;
          }
        }
      }
    }
  }
  return null;
}

function getAllSubcategoryIds(catId) {
  const ids = [catId];
  function collect(cats) {
    for (const c of cats) {
      if (c.id === catId) {
        function addAll(children) {
          for (const ch of children) {
            ids.push(ch.id);
            if (ch.children) addAll(ch.children);
          }
        }
        if (c.children) addAll(c.children);
        return true;
      }
      if (c.children && collect(c.children)) return true;
    }
    return false;
  }
  collect(CATEGORIES);
  return ids;
}

function countProductsInCategory(catId) {
  if (catId === 'alle') return PRODUCTS.filter(p => !p.isCircular).length;
  const ids = getAllSubcategoryIds(catId);
  return PRODUCTS.filter(p => !p.isCircular && (ids.includes(p.category) || ids.includes(p.subcategory))).length;
}

// ---- BREADCRUMB HELPER ----
// Usage: renderBreadcrumb(['Produktkatalog', "navigateTo('shop')"], ['Stühle'])
// Last item = current page (no link). Previous items = links.
function renderBreadcrumb(...items) {
  const SEP = ` <span class="breadcrumb__sep">${ICONS.chevronRight}</span> `;
  let html = `<a href="#" onclick="navigateTo('home');return false">Home</a>`;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    html += SEP;
    if (i < items.length - 1 && item.length > 1) {
      html += `<a href="#" onclick="${item[1]};return false">${item[0]}</a>`;
    } else {
      html += `<span class="breadcrumb__current">${item[0]}</span>`;
    }
  }
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${html}</nav>`;
}

function findCategory(id) {
  function find(cats) {
    for (const c of cats) {
      if (c.id === id) return c;
      if (c.children) {
        const found = find(c.children);
        if (found) return found;
      }
    }
    return null;
  }
  return find(CATEGORIES);
}

function filterProducts() {
  let filtered = PRODUCTS.filter(p => !p.isCircular);

  if (state.activeCategory !== 'alle') {
    const ids = getAllSubcategoryIds(state.activeCategory);
    filtered = filtered.filter(p => ids.includes(p.category) || ids.includes(p.subcategory));
  }

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (state.sortBy) {
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'de'));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name, 'de'));
      break;
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'new':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
  }

  return filtered;
}

function filterCircularProducts() {
  let filtered = PRODUCTS.filter(p => p.isCircular);

  if (state.activeCategory !== 'alle') {
    const ids = getAllSubcategoryIds(state.activeCategory);
    filtered = filtered.filter(p => ids.includes(p.category) || ids.includes(p.subcategory));
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  switch (state.sortBy) {
    case 'name-asc':  filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
    case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
  }

  return filtered;
}

function debounce(fn, ms) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

// ===================================================================
// RENDERING
// ===================================================================
function render() {
  const app = document.getElementById('app');

  // Update nav active states
  const activePage = ['scan', 'erfassen', 'charta'].includes(state.page) ? 'circular'
                   : ['stilwelten', 'planungsbeispiele', 'cad'].includes(state.page) ? 'planung'
                   : state.page;
  document.querySelectorAll('.main-navigation__link').forEach(link => {
    const nav = link.dataset.nav;
    if (nav === activePage) {
      link.classList.add('main-navigation__link--active');
    } else {
      link.classList.remove('main-navigation__link--active');
    }
  });

  // Trigger page transition
  app.style.animation = 'none';
  app.offsetHeight; // force reflow
  app.style.animation = '';

  switch (state.page) {
    case 'home': app.innerHTML = renderHome(); break;
    case 'shop': app.innerHTML = renderShop(); attachShopEvents(); break;
    case 'product': app.innerHTML = renderProductDetail(state.productId); attachProductDetailEvents(); break;
    case 'planung': app.innerHTML = renderPlanung(); break;
    case 'grundriss': app.innerHTML = renderGrundriss(); attachGrundrissEvents(); break;
    case 'circular': app.innerHTML = renderCircular(); attachShopEvents(); break;
    case 'scan': app.innerHTML = renderScan(); break;
    case 'erfassen': app.innerHTML = renderErfassen(); break;
    case 'charta': app.innerHTML = renderCharta(); break;
    case 'stilwelten': app.innerHTML = renderStilwelten(); break;
    case 'planungsbeispiele': app.innerHTML = renderPlanungsbeispiele(); break;
    case 'cad': app.innerHTML = renderCad(); attachAccordionEvents(); break;
    case 'cart': app.innerHTML = renderCart(); attachCartEvents(); break;
    case 'search': app.innerHTML = renderSearch(); attachSearchEvents(); break;
    default: app.innerHTML = renderShop(); attachShopEvents();
  }
}

// ---- HOME ----
function renderHome() {
  return `
    <section class="hero" id="mainContent">
      <div class="hero__content">
        <h1 class="hero__title">Arbeitsplatz-Management</h1>
        <p class="hero__description">Die Plattform f\u00fcr die Einrichtung und Verwaltung von Arbeitspl\u00e4tzen in der Bundesverwaltung. Mobiliar bestellen, R\u00e4ume planen, gebrauchte M\u00f6bel wiederverwenden.</p>
        <div class="hero__cta">
          <a href="#/shop" class="btn btn--filled btn--lg" onclick="navigateTo('shop');return false">Zum Produktkatalog ${ICONS.arrowRight}</a>
          <a href="#/planung" class="btn btn--outline btn--lg" onclick="navigateTo('planung');return false">Arbeitspl\u00e4tze gestalten ${ICONS.arrowRight}</a>
        </div>
      </div>
      <div class="hero__image">
        <picture>
          <source srcset="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format&q=80" media="(min-width: 768px)">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=533&fit=crop&auto=format&q=80" alt="Beispiel eines modernen B\u00fcroarbeitsplatzes" loading="eager">
        </picture>
      </div>
    </section>

    <section class="section section--bg-alt">
      <div class="tile-grid">
        <div class="card card--centered card--clickable" onclick="navigateTo('shop')" role="button" tabindex="0">
          <h3 class="card__title">Produktkatalog</h3>
          <p class="card__description">B\u00fcrom\u00f6bel, Sitzm\u00f6bel, Beleuchtung und Zubeh\u00f6r bestellen. Alle Produkte entsprechen den Standards der Bundesverwaltung.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--clickable" onclick="navigateTo('planung')" role="button" tabindex="0">
          <h3 class="card__title">Arbeitspl\u00e4tze gestalten</h3>
          <p class="card__description">Stilwelten, Planungsbeispiele und CAD-Daten f\u00fcr die B\u00fcroplanung. Vorlagen und Konzepte f\u00fcr die Einrichtung von Arbeitspl\u00e4tzen.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--clickable" onclick="navigateTo('circular')" role="button" tabindex="0">
          <h3 class="card__title">Gebrauchte M\u00f6bel</h3>
          <p class="card__description">Gebrauchtes Mobiliar wiederverwenden statt entsorgen. Objekte scannen, erfassen und im Angebot verf\u00fcgbarer M\u00f6bel suchen.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">Neuheiten</h2>
      <div class="product-grid product-grid--spaced">
        ${PRODUCTS.filter(p => p.isNew && !p.isCircular).slice(0, 6).map(p => renderProductCard(p)).join('')}
      </div>
      <div class="section-link">
        <a href="#/shop" class="section-link__a" onclick="navigateTo('shop');return false">Alle Produkte anzeigen &rarr;</a>
      </div>
    </section>
  `;
}

// ---- CATEGORY TREE ----
function renderCategoryTree(categories) {
  return categories.map(cat => {
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = state.expandedCategories.has(cat.id);
    const isActive = state.activeCategory === cat.id;
    const count = countProductsInCategory(cat.id);
    return `
      <div class="cat-item">
        <div class="cat-item__row" data-cat-id="${cat.id}" role="treeitem" aria-expanded="${hasChildren ? isExpanded : ''}" tabindex="0">
          <div class="cat-item__radio ${isActive ? 'cat-item__radio--active' : ''}"></div>
          <span class="cat-item__label">${cat.label}</span>
          ${count > 0 && cat.id !== 'alle' ? `<span class="cat-item__count">${count}</span>` : ''}
          ${hasChildren ? `<span class="cat-item__toggle ${isExpanded ? 'cat-item__toggle--open' : ''}">\u203A</span>` : ''}
        </div>
        ${hasChildren ? `<div class="cat-item__children ${isExpanded ? 'cat-item__children--open' : ''}">${renderCategoryTree(cat.children)}</div>` : ''}
      </div>
    `;
  }).join('');
}

// ---- SHOP ----
function renderShop() {
  const products = filterProducts();
  const catLabel = getCategoryLabel(state.activeCategory);
  const parent = getParentCategory(state.activeCategory);

  const bcItems = [['Produktkatalog', "setCategory('alle')"]];
  if (state.activeCategory !== 'alle') {
    if (parent) {
      bcItems.push([parent.label, `setCategory('${parent.id}')`]);
    }
    bcItems.push([catLabel]);
  }

  return `
    <div class="container container--with-top-pad container--no-bottom">
      ${renderBreadcrumb(...bcItems)}
    </div>
    <div class="app-layout">
      <aside class="sidebar" role="navigation" aria-label="Kategorien">
        <div class="sidebar__title">Kategorien</div>
        <div class="cat-tree" role="tree">
          ${renderCategoryTree(CATEGORIES)}
        </div>
      </aside>
      <main class="main-content" id="mainContent">
        <div class="toolbar">
          <div class="search">
            <input class="search__field" type="search" placeholder="Suchen..." id="searchInput" value="${escapeHtml(state.searchQuery)}" aria-label="Produkte suchen">
            <button class="search__button" aria-label="Suchen">${ICONS.search}</button>
          </div>
          <select class="select" id="sortSelect" aria-label="Sortierung">
            <option value="name-asc" ${state.sortBy==='name-asc'?'selected':''}>Name A-Z</option>
            <option value="name-desc" ${state.sortBy==='name-desc'?'selected':''}>Name Z-A</option>
            <option value="price-asc" ${state.sortBy==='price-asc'?'selected':''}>Preis aufsteigend</option>
            <option value="price-desc" ${state.sortBy==='price-desc'?'selected':''}>Preis absteigend</option>
            <option value="new" ${state.sortBy==='new'?'selected':''}>Neuheiten zuerst</option>
          </select>
          <span class="toolbar__count">${products.length} Produkt${products.length !== 1 ? 'e' : ''}</span>
        </div>
        ${products.length ? `
          <div class="product-grid" id="productGrid">
            ${products.map(p => renderProductCard(p)).join('')}
          </div>
        ` : `
          <div class="no-results">
            <div class="no-results__icon">${ICONS.placeholder}</div>
            <p class="no-results__text">Keine Produkte gefunden.</p>
          </div>
        `}
      </main>
    </div>
  `;
}

// ---- PRODUCT CARD ----
function renderProductCard(p) {
  return `
    <div class="card card--product" onclick="navigateTo('product',${p.id})" tabindex="0" role="button" aria-label="${escapeHtml(p.name)}">
      <div class="card__image card__image--placeholder">
        ${getProductImage(p)}
        ${p.isNew ? '<span class="badge badge--new">Neu</span>' : ''}
        ${p.isCircular ? '<span class="badge badge--circular">Gebraucht</span>' : ''}
      </div>
      <div class="card__body">
        <div class="card__title">${escapeHtml(p.name)}</div>
        <div class="card__description">${escapeHtml(p.description)}</div>
        <div class="card__price">${p.currency} ${p.price.toFixed(2)}</div>
      </div>
      <div class="card__footer">
        <span class="card__brand">${escapeHtml(p.brand)}</span>
      </div>
    </div>
  `;
}

// ---- PRODUCT DETAIL ----
function renderProductDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) {
    return `
      <div class="container container--with-top-pad" id="mainContent">
        ${renderBreadcrumb(['Produktkatalog', "navigateTo('shop')"], ['Nicht gefunden'])}
        <div class="no-results">
          <div class="no-results__icon">${ICONS.placeholder}</div>
          <p class="no-results__text">Produkt nicht gefunden.</p>
        </div>
      </div>
    `;
  }

  const catLabel = getCategoryLabel(p.subcategory) || getCategoryLabel(p.category);
  const parentCat = getParentCategory(p.subcategory);

  const bcItems = [['Produktkatalog', "navigateTo('shop')"]];
  if (parentCat) {
    bcItems.push([parentCat.label, `setCategory('${parentCat.id}')`]);
  }
  if (p.subcategory && p.subcategory !== p.category) {
    bcItems.push([catLabel, `setCategory('${p.subcategory}')`]);
  } else {
    bcItems.push([getCategoryLabel(p.category), `setCategory('${p.category}')`]);
  }
  bcItems.push([escapeHtml(p.name)]);

  const articleNr = 'ART-' + String(p.id).padStart(5, '0');

  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(...bcItems)}
      <div class="detail-toolbar">
        <button class="btn btn--outline btn--sm detail-toolbar__back" onclick="history.back()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>
          Zur\u00fcck
        </button>
        <div class="detail-toolbar__actions">
          <button class="detail-toolbar__icon" aria-label="Drucken" onclick="window.print()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          </button>
          <button class="detail-toolbar__icon" aria-label="Teilen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
        </div>
      </div>
      <div class="product-detail">
        <div class="product-detail__image">
          ${getProductImage(p)}
          ${p.isNew ? '<span class="badge badge--new">Neu</span>' : ''}
          ${p.isCircular ? '<span class="badge badge--circular">Gebraucht</span>' : ''}
        </div>
        <div class="product-detail__info">
          <h1 class="product-detail__title">${escapeHtml(p.name)}</h1>
          <p class="product-detail__desc">${escapeHtml(p.description)}</p>
          <div class="product-detail__meta">
            <span class="product-detail__meta-label">Marke</span>
            <span class="product-detail__meta-value">${escapeHtml(p.brand)}</span>
            <span class="product-detail__meta-label">Kategorie</span>
            <span class="product-detail__meta-value">${catLabel}</span>
            ${p.isCircular ? `<span class="product-detail__meta-label">Zustand</span>
            <span class="product-detail__meta-value">Gebraucht \u2013 guter Zustand</span>` : ''}
            <span class="product-detail__meta-label">Artikel-Nr.</span>
            <span class="product-detail__meta-value">${articleNr}</span>
          </div>
          <div class="product-detail__price">${p.currency} ${p.price.toFixed(2)}</div>
          <div class="product-detail__actions">
            <button class="btn btn--filled" id="addToCartBtn" data-product-id="${p.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              In den Warenkorb
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- PLANUNG ----
function renderPlanung() {
  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Arbeitspl\u00e4tze gestalten'])}
      <div class="page-hero">
        <h1 class="page-hero__title">Arbeitspl\u00e4tze gestalten</h1>
        <p class="page-hero__subtitle">B\u00fcror\u00e4ume nach aktuellen Arbeitsplatzstandards des Bundes planen und einrichten.</p>
      </div>

      <div class="tile-grid">
        <div class="card card--centered card--clickable" onclick="navigateTo('stilwelten')" role="button" tabindex="0">
          <h3 class="card__title">Stilwelten</h3>
          <p class="card__description">Vordefinierte Einrichtungskonzepte und B\u00fcro-Stile als Planungsgrundlage. Von konzentriertem Einzelarbeiten bis zur offenen Kollaborationszone.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--clickable" onclick="navigateTo('planungsbeispiele')" role="button" tabindex="0">
          <h3 class="card__title">Planungsbeispiele</h3>
          <p class="card__description">Realisierte Referenzprojekte aus der Bundesverwaltung. Sehen Sie, wie andere Bundesstellen ihre R\u00e4ume gestaltet haben.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--clickable" onclick="navigateTo('cad')" role="button" tabindex="0">
          <h3 class="card__title">CAD-Daten</h3>
          <p class="card__description">Laden Sie CAD-Dateien und technische Zeichnungen f\u00fcr die professionelle Raumplanung herunter. F\u00fcr Planer und Architekten.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
      </div>

    </div>

    <section class="section section--bg-alt">
      <h2 class="section__title">Stilwelten</h2>
      <div class="tile-grid">
        <div class="card card--clickable" onclick="navigateTo('stilwelten')" role="button" tabindex="0">
          <div class="card__image card__image--visual">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop&auto=format&q=80" alt="Fokus-Arbeitsplatz" loading="lazy">
          </div>
          <div class="card__body">
            <div class="card__title">Fokus-Arbeitsplatz</div>
            <div class="card__description">Konzentriertes Arbeiten mit optimaler Akustik und erg\u00e4nzenden Elementen f\u00fcr ungest\u00f6rte Einzelarbeit.</div>
          </div>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--clickable" onclick="navigateTo('stilwelten')" role="button" tabindex="0">
          <div class="card__image card__image--visual">
            <img src="https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&h=300&fit=crop&auto=format&q=80" alt="Kollaborationszone" loading="lazy">
          </div>
          <div class="card__body">
            <div class="card__title">Kollaborationszone</div>
            <div class="card__description">Offene, flexibel m\u00f6blierte Bereiche f\u00fcr spontane Teamarbeit und geplante Workshops.</div>
          </div>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--clickable" onclick="navigateTo('stilwelten')" role="button" tabindex="0">
          <div class="card__image card__image--visual">
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=300&fit=crop&auto=format&q=80" alt="Lounge &amp; Empfang" loading="lazy">
          </div>
          <div class="card__body">
            <div class="card__title">Lounge &amp; Empfang</div>
            <div class="card__description">Repr\u00e4sentative R\u00e4ume mit Wohncharakter f\u00fcr Empfangs- und Wartebereiche.</div>
          </div>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
      </div>
      <div class="section-link">
        <a href="#/stilwelten" class="section-link__a" onclick="navigateTo('stilwelten');return false">Alle Stilwelten anzeigen &rarr;</a>
      </div>
    </section>
  `;
}

// ---- STILWELTEN ----
function renderStilwelten() {
  const stilwelten = [
    { title: "Fokus-Arbeitsplatz", desc: "Konzentriertes Arbeiten mit optimaler Akustik und erg\u00e4nzenden Elementen f\u00fcr ungest\u00f6rte Einzelarbeit. Schallabsorbierende Paneele, Sichtschutz und dimmbare Beleuchtung schaffen eine produktive Umgebung.", image: "photo-1497366216548-37526070297c" },
    { title: "Kollaborationszone", desc: "Offene, flexibel m\u00f6blierte Bereiche f\u00fcr spontane Teamarbeit und geplante Workshops. Mobile Trennw\u00e4nde, Whiteboards und Stehtische f\u00f6rdern den kreativen Austausch.", image: "photo-1497215842964-222b430dc094" },
    { title: "Lounge & Empfang", desc: "Repr\u00e4sentative R\u00e4ume mit Wohncharakter f\u00fcr Empfangs- und Wartebereiche. Hochwertige Polsterm\u00f6bel, Beistelltische und Pflanzen vermitteln eine einladende Atmosph\u00e4re.", image: "photo-1524758631624-e2822e304c36" },
    { title: "Konferenz & Meeting", desc: "Professionell ausgestattete Besprechungsr\u00e4ume f\u00fcr formelle Sitzungen. Medientechnik, ergonomische St\u00fchle und modulare Tischsysteme f\u00fcr verschiedene Gruppengr\u00f6ssen.", image: "photo-1462826303086-329426d1aef5" },
    { title: "Flex-Desk", desc: "Shared-Desk-Arbeitspl\u00e4tze mit pers\u00f6nlichen Schliessfachsystemen. Standardisierte Ausstattung f\u00fcr schnellen Wechsel, optimiert f\u00fcr Desk-Sharing und hybride Arbeitsmodelle.", image: "photo-1593642632559-0c6d3fc62b89" },
    { title: "Bibliothek & Archiv", desc: "Ruhezonen mit Regalsystemen und Lesepl\u00e4tzen. Akustisch ged\u00e4mmte R\u00e4ume f\u00fcr konzentriertes Lesen und Recherche, kombiniert mit systematischen Ablagem\u00f6glichkeiten.", image: "photo-1507842217343-583bb7270b66" }
  ];

  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Arbeitspl\u00e4tze gestalten', "navigateTo('planung')"], ['Stilwelten'])}
      <div class="page-hero">
        <h1 class="page-hero__title">Stilwelten</h1>
        <p class="page-hero__subtitle">Vordefinierte Einrichtungskonzepte und B\u00fcro-Stile als Planungsgrundlage. Von konzentriertem Einzelarbeiten bis zur offenen Kollaborationszone.</p>
      </div>

      <div class="tile-grid">
        ${stilwelten.map(s => `
          <div class="card card--clickable">
            <div class="card__image card__image--visual">
              <img src="https://images.unsplash.com/${s.image}?w=600&h=300&fit=crop&auto=format&q=80" alt="${s.title}" loading="lazy">
            </div>
            <div class="card__body">
              <div class="card__title">${s.title}</div>
              <div class="card__description">${s.desc}</div>
            </div>
            <div class="card__arrow">
              <span class="card__arrow-icon">&rarr;</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---- PLANUNGSBEISPIELE ----
function renderPlanungsbeispiele() {
  const beispiele = [
    { title: "Verwaltungsgeb\u00e4ude Bern", desc: "Neugestaltung von 120 Arbeitspl\u00e4tzen mit Fokus auf Activity-Based Working. Mischung aus Einzelarbeitspl\u00e4tzen, Kollaborationszonen und R\u00fcckzugsbereichen.", image: "photo-1497366216548-37526070297c" },
    { title: "Bundeshaus S\u00fcd", desc: "Modernisierung der Sitzungszimmer und Empfangsbereiche. Integration von Medientechnik und barrierefreier Ausstattung.", image: "photo-1497215842964-222b430dc094" },
    { title: "Zollverwaltung Basel", desc: "Umstellung auf Flex-Desk-Konzept f\u00fcr 80 Mitarbeitende. Pers\u00f6nliche Lockers, Buchungssystem und standardisierte Arbeitspl\u00e4tze.", image: "photo-1462826303086-329426d1aef5" },
    { title: "Agroscope Posieux", desc: "Labornahe B\u00fcroumgebung mit erh\u00f6hten Anforderungen an Sauberkeit und Ergonomie. Spezialm\u00f6bel und h\u00f6henverstellbare Arbeitstische.", image: "photo-1524758631624-e2822e304c36" }
  ];

  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Arbeitspl\u00e4tze gestalten', "navigateTo('planung')"], ['Planungsbeispiele'])}
      <div class="page-hero">
        <h1 class="page-hero__title">Planungsbeispiele</h1>
        <p class="page-hero__subtitle">Realisierte Referenzprojekte aus der Bundesverwaltung. Sehen Sie, wie andere Bundesstellen ihre R\u00e4ume gestaltet haben.</p>
      </div>

      <div class="tile-grid">
        ${beispiele.map(b => `
          <div class="card card--clickable">
            <div class="card__image card__image--visual">
              <img src="https://images.unsplash.com/${b.image}?w=600&h=300&fit=crop&auto=format&q=80" alt="${b.title}" loading="lazy">
            </div>
            <div class="card__body">
              <div class="card__title">${b.title}</div>
              <div class="card__description">${b.desc}</div>
            </div>
            <div class="card__arrow">
              <span class="card__arrow-icon">&rarr;</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---- CAD-DATEN ----
function renderCad() {
  const cadSections = [
    { id: 'einzelarbeitsplatz', title: 'Einzelarbeitsplatz', files: [
      { name: 'Grundriss Einzelb\u00fcro Typ A (12 m\u00b2)', format: 'DWG', size: '245.30 kB', date: '15. M\u00e4rz 2025' },
      { name: 'Grundriss Einzelb\u00fcro Typ B (15 m\u00b2)', format: 'DWG', size: '312.80 kB', date: '15. M\u00e4rz 2025' },
      { name: 'M\u00f6blierungsvorschlag Einzelb\u00fcro', format: 'PDF', size: '1.85 MB', date: '10. Januar 2025' },
      { name: 'Massbeschriftung Standardarbeitsplatz', format: 'PDF', size: '420.00 kB', date: '10. Januar 2025' }
    ]},
    { id: 'sitzungsraum', title: 'Sitzungsraum', files: [
      { name: 'Sitzungsraum 4\u20138 Personen', format: 'DWG', size: '198.50 kB', date: '22. Februar 2025' },
      { name: 'Sitzungsraum 10\u201320 Personen', format: 'DWG', size: '356.20 kB', date: '22. Februar 2025' },
      { name: 'Medientechnik-Positionen Sitzungsr\u00e4ume', format: 'PDF', size: '890.00 kB', date: '5. Dezember 2024' }
    ]},
    { id: 'open-space', title: 'Open Space', files: [
      { name: 'Grossraumb\u00fcro Rasteranordnung 24 AP', format: 'DWG', size: '512.40 kB', date: '8. November 2024' },
      { name: 'Zonierungskonzept Open Space', format: 'PDF', size: '2.10 MB', date: '8. November 2024' },
      { name: 'Verkehrswege und Fluchtwege', format: 'PDF', size: '645.00 kB', date: '1. September 2024' }
    ]},
    { id: 'empfang', title: 'Empfang & Lounge', files: [
      { name: 'Empfangsbereich Standardlayout', format: 'DWG', size: '278.90 kB', date: '14. Juni 2024' },
      { name: 'Wartezone M\u00f6blierungsvarianten', format: 'PDF', size: '1.42 MB', date: '14. Juni 2024' }
    ]},
    { id: 'teekueche', title: 'Teek\u00fcche & Sozialraum', files: [
      { name: 'K\u00fcchenzeile Typ Standard', format: 'DWG', size: '189.70 kB', date: '3. April 2024' },
      { name: 'Sozialraum M\u00f6blierung', format: 'DWG', size: '210.30 kB', date: '3. April 2024' },
      { name: 'Installationsplan Wasser / Strom', format: 'PDF', size: '1.05 MB', date: '20. M\u00e4rz 2024' }
    ]},
    { id: '3d-modelle', title: '3D-Modelle', files: [
      { name: 'BIM-Modell Standardb\u00fcro (IFC 4.0)', format: 'IFC', size: '8.50 MB', date: '28. Januar 2025' },
      { name: 'Raummodell Einzelb\u00fcro SketchUp', format: 'SKP', size: '4.20 MB', date: '15. Dezember 2024' },
      { name: 'Raummodell Open Space SketchUp', format: 'SKP', size: '6.80 MB', date: '15. Dezember 2024' },
      { name: '\u00dcbersicht 3D-Modelle und Formate', format: 'PDF', size: '320.00 kB', date: '1. November 2024' }
    ]}
  ];

  const downloadIcon = `<svg class="download-item__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

  const chevronIcon = `<svg class="accordion__arrow" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"/></svg>`;

  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Arbeitspl\u00e4tze gestalten', "navigateTo('planung')"], ['CAD-Daten'])}
      <div class="page-hero">
        <h1 class="page-hero__title">CAD-Daten</h1>
        <p class="page-hero__subtitle">CAD-Dateien und technische Zeichnungen f\u00fcr die professionelle Raumplanung. F\u00fcr Planer und Architekten.</p>
      </div>

      <ul class="accordion">
        ${cadSections.map(s => `
          <li class="accordion__item">
            <button class="accordion__button" aria-expanded="false" aria-controls="accordion-${s.id}">
              <h3 class="accordion__title">${s.title}</h3>
              ${chevronIcon}
            </button>
            <div class="accordion__drawer" id="accordion-${s.id}" aria-hidden="true">
              <div class="accordion__content">
                ${s.files.map(f => `
                  <a href="#" class="download-item" onclick="event.preventDefault()">
                    ${downloadIcon}
                    <div class="download-item__info">
                      <div class="download-item__name">${f.name}</div>
                      <div class="download-item__meta">${f.format}&ensp;|&ensp;${f.size}&ensp;|&ensp;${f.date}</div>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

// ---- RAUMPLANUNG (Grundriss) ----

function rpRenderTreeNode(node, depth) {
  if (!depth) depth = 0;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = state.rpExpandedIds.has(node.id);
  const isSelected = state.rpSelectedId === node.id;
  const icon = RP_ICONS[node.type] || '';
  const countLabel = node.count ? ` (${node.count})` : '';
  const chevron = hasChildren
    ? `<svg class="rp-tree__chevron ${isExpanded ? 'rp-tree__chevron--open' : ''}" viewBox="0 0 12 12" width="12" height="12"><polyline points="4,2 8,6 4,10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : '<span class="rp-tree__chevron-spacer"></span>';

  let label = node.label;
  if (node.type === 'building' && node.code) label = `${node.code} \u2013 ${node.label}`;

  let html = `
    <div class="rp-tree__item ${isSelected ? 'rp-tree__item--selected' : ''}" data-id="${node.id}" data-depth="${depth}" style="padding-left:${depth * 16 + 8}px">
      ${chevron}
      <span class="rp-tree__icon">${icon}</span>
      <span class="rp-tree__label">${label}${countLabel}</span>
    </div>`;

  if (hasChildren && isExpanded) {
    html += node.children.map(c => rpRenderTreeNode(c, depth + 1)).join('');
  }
  return html;
}

function rpGetTabs(nodeType) {
  if (nodeType === 'building') return [
    { id: 'uebersicht', label: '\u00dcbersicht' },
    { id: 'flaechen', label: 'Geb\u00e4udefl\u00e4chen' },
    { id: 'dokumente', label: 'Dokumente' }
  ];
  if (nodeType === 'floor') return [
    { id: 'uebersicht', label: '\u00dcbersicht' },
    { id: 'grundriss', label: 'Grundriss' },
    { id: 'inventar', label: 'Inventar' }
  ];
  // default: portfolio view
  return [
    { id: 'karte', label: 'Karte' },
    { id: 'galerie', label: 'Galerie' }
  ];
}

function rpRenderContent(selected) {
  if (!selected) return rpRenderPortfolio();
  const { node, path } = selected;
  if (node.type === 'building') return rpRenderBuilding(node, path);
  if (node.type === 'floor') return rpRenderFloor(node, path);
  return rpRenderPortfolio();
}

function rpRenderPortfolio() {
  const tab = state.rpTab;
  if (tab === 'galerie') {
    // Collect all buildings
    const buildings = [];
    (function collect(n) {
      if (n.type === 'building') buildings.push(n);
      if (n.children) n.children.forEach(collect);
    })(LOCATIONS);

    return `
      <div class="rp-gallery">
        ${buildings.map(b => `
          <div class="rp-gallery__card" data-select="${b.id}">
            <div class="rp-gallery__image">
              <img src="https://images.unsplash.com/${b.photo}?w=400&h=250&fit=crop&auto=format&q=80" alt="${escapeHtml(b.label)}" loading="lazy">
            </div>
            <div class="rp-gallery__body">
              <div class="rp-gallery__title">${escapeHtml(b.label)}</div>
              <div class="rp-gallery__meta">${b.code} &middot; ${b.address}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  // Karte tab (default)
  return `
    <div class="rp-map-placeholder">
      <div class="rp-map-placeholder__inner">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" stroke-width="1">
          <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/>
          <path d="M8 2v16"/>
          <path d="M16 6v16"/>
        </svg>
        <p>Kartenansicht</p>
        <span class="rp-map-placeholder__sub">Interaktive Karte mit Standorten der Bundesgeb\u00e4ude. W\u00e4hlen Sie ein Geb\u00e4ude in der Baumnavigation oder klicken Sie auf einen Standort.</span>
      </div>
    </div>`;
}

function rpRenderBuilding(b, path) {
  const tab = state.rpTab;

  if (tab === 'flaechen') {
    const floors = b.children || [];
    const totalFlaeche = floors.length > 0 ? b.flaeche : '\u2013';
    const totalPlaetze = floors.reduce((s, f) => s + (f.plaetze || 0), 0);
    return `
      <div class="rp-detail">
        <h2 class="rp-detail__title">${escapeHtml(b.label)}</h2>
        <p class="rp-detail__subtitle">${b.address}</p>
        <div class="rp-detail__section-title">Fl\u00e4chen nach Stockwerk</div>
        <table class="rp-table">
          <thead><tr><th>Stockwerk</th><th>Fl\u00e4che</th><th>Arbeitspl\u00e4tze</th><th>R\u00e4ume</th></tr></thead>
          <tbody>
            ${floors.map(f => `<tr class="rp-table__row--link" data-select="${f.id}"><td>${f.label}</td><td>${f.flaeche}</td><td>${f.plaetze}</td><td>${f.raeume}</td></tr>`).join('')}
          </tbody>
          <tfoot><tr><td><strong>Gesamt</strong></td><td><strong>${totalFlaeche}</strong></td><td><strong>${totalPlaetze}</strong></td><td></td></tr></tfoot>
        </table>
      </div>`;
  }

  if (tab === 'dokumente') {
    return `
      <div class="rp-detail">
        <h2 class="rp-detail__title">${escapeHtml(b.label)}</h2>
        <p class="rp-detail__subtitle">${b.address}</p>
        <div class="rp-detail__section-title">Dokumente</div>
        <div class="rp-detail__empty">Keine Dokumente vorhanden.</div>
      </div>`;
  }

  // \u00dcbersicht (default)
  return `
    <div class="rp-detail">
      <div class="rp-detail__header">
        <h2 class="rp-detail__title">${escapeHtml(b.label)}</h2>
      </div>
      <p class="rp-detail__subtitle">${b.address}</p>

      <div class="rp-detail__media">
        <div class="rp-detail__photo">
          <img src="https://images.unsplash.com/${b.photo}?w=600&h=400&fit=crop&auto=format&q=80" alt="${escapeHtml(b.label)}" loading="lazy">
        </div>
        <div class="rp-detail__map-snippet">
          <div class="rp-map-placeholder rp-map-placeholder--sm">
            <div class="rp-map-placeholder__inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" stroke-width="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Standort</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rp-detail__section-title">Objektdaten</div>
      <div class="rp-detail__grid">
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Geb\u00e4ude-ID</div>
          <div class="rp-detail__field-value">${b.code}</div>
        </div>
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Geb\u00e4udestatus</div>
          <div class="rp-detail__field-value">${b.status}</div>
        </div>
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Geb\u00e4udekategorie</div>
          <div class="rp-detail__field-value">${b.kategorie}</div>
        </div>
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Bauperiode</div>
          <div class="rp-detail__field-value">${b.baujahr}</div>
        </div>
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Gesamtfl\u00e4che</div>
          <div class="rp-detail__field-value">${b.flaeche}</div>
        </div>
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Adresse</div>
          <div class="rp-detail__field-value">${b.address}</div>
        </div>
      </div>

      ${b.children && b.children.length ? `
        <div class="rp-detail__section-title">Stockwerke</div>
        <table class="rp-table">
          <thead><tr><th>Stockwerk</th><th>Fl\u00e4che</th><th>Arbeitspl\u00e4tze</th><th>R\u00e4ume</th></tr></thead>
          <tbody>
            ${b.children.map(f => `<tr class="rp-table__row--link" data-select="${f.id}"><td>${f.label}</td><td>${f.flaeche}</td><td>${f.plaetze}</td><td>${f.raeume}</td></tr>`).join('')}
          </tbody>
        </table>
      ` : ''}
    </div>`;
}

function rpRenderFloor(floor, path) {
  const building = path.find(n => n.type === 'building');
  const tab = state.rpTab;
  const bLabel = building ? building.label : '';

  if (tab === 'grundriss') {
    return `
      <div class="rp-detail">
        <h2 class="rp-detail__title">${floor.label} \u2013 ${escapeHtml(bLabel)}</h2>
        <div class="rp-floorplan">
          <div class="rp-floorplan__placeholder">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" stroke-width="0.75">
              <rect x="1" y="1" width="22" height="22" rx="1"/>
              <line x1="1" y1="8" x2="12" y2="8"/>
              <line x1="8" y1="1" x2="8" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="23"/>
              <line x1="8" y1="12" x2="23" y2="12"/>
              <rect x="2" y="2" width="4" height="4" rx="0.5" fill="var(--color-gray-200)" stroke="none"/>
              <rect x="9" y="2" width="2" height="4" rx="0.5" fill="var(--color-gray-200)" stroke="none"/>
              <rect x="2" y="9" width="4" height="2" rx="0.5" fill="var(--color-gray-200)" stroke="none"/>
              <rect x="14" y="14" width="3" height="2" rx="0.5" fill="var(--color-gray-200)" stroke="none"/>
              <rect x="19" y="14" width="3" height="2" rx="0.5" fill="var(--color-gray-200)" stroke="none"/>
            </svg>
            <div class="rp-floorplan__label">Grundrissansicht</div>
            <p class="rp-floorplan__text">Interaktiver Grundriss mit M\u00f6blierung wird hier angezeigt.<br>Fl\u00e4che: ${floor.flaeche} &middot; ${floor.plaetze} Arbeitspl\u00e4tze &middot; ${floor.raeume} R\u00e4ume</p>
            <div class="rp-floorplan__actions">
              <span class="rp-floorplan__toggle rp-floorplan__toggle--active">2D</span>
              <span class="rp-floorplan__toggle">3D</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  if (tab === 'inventar') {
    // Generate mock room data
    const roomTypes = ['B\u00fcro', 'Sitzungszimmer', 'Korridor', 'Teeküche', 'WC', 'Lager', 'Empfang', 'Open Space'];
    const rooms = [];
    for (let i = 1; i <= floor.raeume; i++) {
      const typeIdx = i <= 2 ? 7 : (i % roomTypes.length);
      const rm = {
        nr: `${floor.label.replace(/[^0-9EUG]/g, '') || '0'}${String(i).padStart(2, '0')}`,
        typ: roomTypes[typeIdx],
        flaeche: Math.floor(12 + Math.random() * 40),
        plaetze: typeIdx <= 1 ? Math.floor(2 + Math.random() * 8) : (typeIdx === 7 ? Math.floor(6 + Math.random() * 12) : 0)
      };
      rooms.push(rm);
    }

    return `
      <div class="rp-detail">
        <h2 class="rp-detail__title">${floor.label} \u2013 ${escapeHtml(bLabel)}</h2>
        <p class="rp-detail__subtitle">${floor.flaeche} &middot; ${floor.plaetze} Arbeitspl\u00e4tze &middot; ${floor.raeume} R\u00e4ume</p>
        <div class="rp-detail__section-title">Raumliste</div>
        <table class="rp-table">
          <thead><tr><th>Raum</th><th>Typ</th><th>Fl\u00e4che</th><th>Pl\u00e4tze</th></tr></thead>
          <tbody>
            ${rooms.map(r => `<tr><td>${r.nr}</td><td>${r.typ}</td><td>${r.flaeche} m\u00b2</td><td>${r.plaetze || '\u2013'}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  // \u00dcbersicht (default)
  return `
    <div class="rp-detail">
      <h2 class="rp-detail__title">${floor.label} \u2013 ${escapeHtml(bLabel)}</h2>
      <p class="rp-detail__subtitle">${floor.flaeche} &middot; ${floor.plaetze} Arbeitspl\u00e4tze &middot; ${floor.raeume} R\u00e4ume</p>

      <div class="rp-detail__grid">
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Stockwerk</div>
          <div class="rp-detail__field-value">${floor.label}</div>
        </div>
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Geb\u00e4ude</div>
          <div class="rp-detail__field-value">${escapeHtml(bLabel)}</div>
        </div>
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Fl\u00e4che</div>
          <div class="rp-detail__field-value">${floor.flaeche}</div>
        </div>
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">Arbeitspl\u00e4tze</div>
          <div class="rp-detail__field-value">${floor.plaetze}</div>
        </div>
        <div class="rp-detail__field">
          <div class="rp-detail__field-label">R\u00e4ume</div>
          <div class="rp-detail__field-value">${floor.raeume}</div>
        </div>
      </div>

      <div class="rp-floorplan" style="margin-top:var(--space-xl)">
        <div class="rp-floorplan__placeholder rp-floorplan__placeholder--compact">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" stroke-width="1">
            <rect x="1" y="1" width="22" height="22" rx="1"/><line x1="1" y1="8" x2="12" y2="8"/><line x1="8" y1="1" x2="8" y2="12"/><line x1="12" y1="8" x2="12" y2="23"/><line x1="8" y1="12" x2="23" y2="12"/>
          </svg>
          <span>Grundriss anzeigen \u2192</span>
        </div>
      </div>
    </div>`;
}

function renderGrundriss() {
  const selected = state.rpSelectedId ? rpFindNode(state.rpSelectedId) : null;
  const nodeType = selected ? selected.node.type : null;
  const tabs = rpGetTabs(nodeType);

  // Ensure current tab is valid for this node type
  if (!tabs.find(t => t.id === state.rpTab)) {
    state.rpTab = tabs[0].id;
  }

  return `
    <div class="rp-layout" id="mainContent">
      <aside class="rp-tree" role="tree" aria-label="Standortnavigation">
        <div class="rp-tree__header">
          <span class="rp-tree__header-label">Objekte</span>
          <button class="rp-tree__filter-btn" aria-label="Filter">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="2" y1="4" x2="14" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="6" y1="12" x2="10" y2="12"/></svg>
          </button>
        </div>
        <div class="rp-tree__body">
          ${rpRenderTreeNode(LOCATIONS)}
        </div>
      </aside>
      <main class="rp-content">
        <div class="rp-tabs" role="tablist">
          ${tabs.map(t => `<button class="rp-tabs__tab ${state.rpTab === t.id ? 'rp-tabs__tab--active' : ''}" role="tab" data-tab="${t.id}" aria-selected="${state.rpTab === t.id}">${t.label}</button>`).join('')}
        </div>
        <div class="rp-content__body">
          ${rpRenderContent(selected)}
        </div>
      </main>
    </div>
  `;
}

function attachGrundrissEvents() {
  // Tree item clicks
  document.querySelectorAll('.rp-tree__item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const found = rpFindNode(id);
      if (!found) return;

      const hasChildren = found.node.children && found.node.children.length > 0;

      if (state.rpSelectedId === id && hasChildren) {
        // Toggle expand if clicking the already-selected node
        if (state.rpExpandedIds.has(id)) state.rpExpandedIds.delete(id);
        else state.rpExpandedIds.add(id);
      } else {
        // Select and expand
        state.rpSelectedId = id;
        if (hasChildren) state.rpExpandedIds.add(id);

        // Reset tab to first tab for the new node type
        const tabs = rpGetTabs(found.node.type);
        state.rpTab = tabs[0].id;
      }
      render();
    });
  });

  // Tab clicks
  document.querySelectorAll('.rp-tabs__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.rpTab = tab.dataset.tab;
      render();
    });
  });

  // Table row links (floors in building view)
  document.querySelectorAll('.rp-table__row--link, .rp-gallery__card').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.select;
      if (!id) return;
      state.rpSelectedId = id;
      const found = rpFindNode(id);
      if (found) {
        // Expand all ancestors
        found.path.forEach(n => state.rpExpandedIds.add(n.id));
        const tabs = rpGetTabs(found.node.type);
        state.rpTab = tabs[0].id;
      }
      render();
    });
  });

  // Floor plan compact click -> switch to grundriss tab
  const fpCompact = document.querySelector('.rp-floorplan__placeholder--compact');
  if (fpCompact) {
    fpCompact.style.cursor = 'pointer';
    fpCompact.addEventListener('click', () => {
      state.rpTab = 'grundriss';
      render();
    });
  }
}

// ---- CIRCULAR (Gebrauchte Möbel) ----
function renderCircular() {
  const products = filterCircularProducts();
  const catLabel = getCategoryLabel(state.activeCategory);
  const parent = getParentCategory(state.activeCategory);

  const bcItems = [['Gebrauchte M\u00f6bel', "navigateTo('circular')"]];
  if (state.activeCategory !== 'alle') {
    if (parent) {
      bcItems.push([parent.label, `setCategory('${parent.id}')`]);
    }
    bcItems.push([catLabel]);
  }

  return `
    <div class="container container--with-top-pad">
      ${renderBreadcrumb(...bcItems)}
      <div class="page-hero">
        <h1 class="page-hero__title">Gebrauchte M\u00f6bel</h1>
        <p class="page-hero__subtitle">Gebrauchtes Mobiliar wiederverwenden statt entsorgen. Objekte scannen, erfassen und im Angebot verf\u00fcgbarer M\u00f6bel suchen.</p>
      </div>

      <div class="tile-grid tile-grid--3col">
        <div class="card card--centered card--clickable" onclick="navigateTo('scan')" role="button" tabindex="0">
          <h3 class="card__title">Objekt scannen</h3>
          <p class="card__description">Scannen Sie den QR-Code oder geben Sie die Inventar-Nummer eines M\u00f6belst\u00fccks ein, um dessen Status und Verf\u00fcgbarkeit zu pr\u00fcfen.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--clickable" onclick="navigateTo('erfassen')" role="button" tabindex="0">
          <h3 class="card__title">Neues Objekt erfassen</h3>
          <p class="card__description">Gebrauchtes Mobiliar ins System eintragen und f\u00fcr andere Bundesstellen verf\u00fcgbar machen.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--clickable" onclick="navigateTo('charta')" role="button" tabindex="0">
          <h3 class="card__title">Charta kreislauforientiertes Bauen</h3>
          <p class="card__description">Erfahren Sie mehr \u00fcber unsere Strategie f\u00fcr Kreislaufwirtschaft und nachhaltiges Bauen in der Bundesverwaltung.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
      </div>

    </div>
    <div class="app-layout">
      <aside class="sidebar" role="navigation" aria-label="Kategorien">
        <div class="sidebar__title">Kategorien</div>
        <div class="cat-tree" role="tree">
          ${renderCategoryTree(CATEGORIES)}
        </div>
      </aside>
      <main class="main-content" id="mainContent">
        <div class="toolbar">
          <div class="search">
            <input class="search__field" type="search" placeholder="Gebrauchte M\u00f6bel suchen..." id="searchInput" value="${escapeHtml(state.searchQuery)}" aria-label="Gebrauchte M\u00f6bel suchen">
            <button class="search__button" aria-label="Suchen">${ICONS.search}</button>
          </div>
          <select class="select" id="sortSelect" aria-label="Sortierung">
            <option value="name-asc" ${state.sortBy==='name-asc'?'selected':''}>Name A-Z</option>
            <option value="name-desc" ${state.sortBy==='name-desc'?'selected':''}>Name Z-A</option>
            <option value="price-asc" ${state.sortBy==='price-asc'?'selected':''}>Preis aufsteigend</option>
            <option value="price-desc" ${state.sortBy==='price-desc'?'selected':''}>Preis absteigend</option>
          </select>
          <span class="toolbar__count">${products.length} Objekt${products.length !== 1 ? 'e' : ''}</span>
        </div>
        ${products.length ? `
          <div class="product-grid" id="productGrid">
            ${products.map(p => renderProductCard(p)).join('')}
          </div>
        ` : `
          <div class="no-results">
            <div class="no-results__icon">${ICONS.placeholder}</div>
            <p class="no-results__text">Keine gebrauchten M\u00f6bel gefunden.</p>
          </div>
        `}
      </main>
    </div>
  `;
}

// ---- OBJEKT SCANNEN ----
function renderScan() {
  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Gebrauchte M\u00f6bel', "navigateTo('circular')"], ['Objekt scannen'])}
      <div class="page-hero">
        <h1 class="page-hero__title">Objekt scannen</h1>
        <p class="page-hero__subtitle">Scannen Sie den QR-Code auf dem M\u00f6belst\u00fcck oder geben Sie die Inventar-Nummer manuell ein.</p>
      </div>

      <div class="scan-area">
        <div class="scan-area__visual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7z"/><rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.3"/></svg>
          <span>QR scannen</span>
        </div>
        <div class="scan-area__content">
          <h3 class="scan-area__title">Objekt identifizieren</h3>
          <p class="scan-area__text">Scannen Sie den QR-Code auf dem M\u00f6belst\u00fcck oder geben Sie die Inventar-Nummer manuell ein, um den Status und die Historie des Objekts einzusehen.</p>
          <div class="scan-area__input-row">
            <input class="scan-area__input" type="text" placeholder="z.B. INV-2024-001234">
            <button class="btn btn--filled">Suchen</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- NEUES OBJEKT ERFASSEN ----
function renderErfassen() {
  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Gebrauchte M\u00f6bel', "navigateTo('circular')"], ['Neues Objekt erfassen'])}
      <div class="page-hero">
        <h1 class="page-hero__title">Neues Objekt erfassen</h1>
        <p class="page-hero__subtitle">Erfassen Sie gebrauchtes Mobiliar und machen Sie es f\u00fcr andere Bundesstellen verf\u00fcgbar.</p>
      </div>

      <div class="form-card">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Bezeichnung</label>
            <input class="form-input" type="text" placeholder="z.B. B\u00fcrostuhl Giroflex 64">
          </div>
          <div class="form-group">
            <label class="form-label">Marke</label>
            <input class="form-input" type="text" placeholder="z.B. Giroflex">
          </div>
          <div class="form-group">
            <label class="form-label">Kategorie</label>
            <select class="form-select">
              <option value="">Bitte w\u00e4hlen...</option>
              ${CATEGORIES.filter(c => c.id !== 'alle').map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Zustand</label>
            <select class="form-select">
              <option value="">Bitte w\u00e4hlen...</option>
              <option>Sehr gut</option>
              <option>Gut</option>
              <option>Akzeptabel</option>
              <option>Reparaturbed\u00fcrftig</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Standort / Geb\u00e4ude</label>
            <input class="form-input" type="text" placeholder="z.B. Bundeshaus West, 3. OG">
          </div>
          <div class="form-group">
            <label class="form-label">Inventar-Nr.</label>
            <input class="form-input" type="text" placeholder="z.B. INV-2024-001234">
          </div>
          <div class="form-group form-group--full">
            <label class="form-label">Bemerkungen</label>
            <textarea class="form-textarea" placeholder="Zus\u00e4tzliche Informationen zum Objekt..."></textarea>
          </div>
          <div class="form-actions">
            <button class="btn btn--filled">Objekt erfassen</button>
            <button class="btn btn--outline">Abbrechen</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- CHARTA KREISLAUFORIENTIERTES BAUEN ----
function renderCharta() {
  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Gebrauchte M\u00f6bel', "navigateTo('circular')"], ['Charta kreislauforientiertes Bauen'])}

      <div class="placeholder-area">
        <div class="placeholder-area__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>
        </div>
        <div class="placeholder-area__title">Charta kreislauforientiertes Bauen (in Entwicklung)</div>
        <p class="placeholder-area__text">Unsere Strategie f\u00fcr Kreislaufwirtschaft und nachhaltiges Bauen.<br>Diese Seite wird in einer zuk\u00fcnftigen Version verf\u00fcgbar sein.</p>
      </div>
    </div>
  `;
}

// ---- SEARCH RESULTS ----
function filterGlobalSearch() {
  const q = state.globalSearchQuery.toLowerCase().trim();
  if (!q) return [];
  let results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    getCategoryLabel(p.category).toLowerCase().includes(q) ||
    getCategoryLabel(p.subcategory).toLowerCase().includes(q)
  );

  if (state.searchFilterCategory) {
    const ids = getAllSubcategoryIds(state.searchFilterCategory);
    results = results.filter(p => ids.includes(p.category) || ids.includes(p.subcategory));
  }

  if (state.searchFilterBrand) {
    results = results.filter(p => p.brand === state.searchFilterBrand);
  }

  switch (state.searchSortBy) {
    case 'name-asc':  results.sort((a, b) => a.name.localeCompare(b.name, 'de')); break;
    case 'name-desc': results.sort((a, b) => b.name.localeCompare(a.name, 'de')); break;
    case 'price-asc': results.sort((a, b) => a.price - b.price); break;
    case 'price-desc':results.sort((a, b) => b.price - a.price); break;
  }

  return results;
}

function renderSearch() {
  const results = filterGlobalSearch();
  const q = escapeHtml(state.globalSearchQuery);

  // Collect unique brands and top-level categories from all products for filter options
  const allBrands = [...new Set(PRODUCTS.map(p => p.brand))].sort((a, b) => a.localeCompare(b, 'de'));
  const topCategories = CATEGORIES.filter(c => c.id !== 'alle');

  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Suchergebnisse'])}

      <h1 class="search-page__title">Suchergebnisse</h1>

      <div class="search-page__input-wrapper">
        <form class="search-page__form" id="searchPageForm" role="search">
          <input class="search-page__input" id="searchPageInput" type="search" value="${q}" placeholder="Suchbegriff eingeben" aria-label="Suchbegriff eingeben">
          <button class="search-page__submit" type="submit" aria-label="Suchen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>
          </button>
        </form>
      </div>

      <button class="search-page__filter-toggle" id="filterToggle" aria-expanded="true">
        <svg class="search-page__filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
        <span id="filterToggleLabel">Filter ausblenden</span>
      </button>

      <div class="search-page__filters" id="searchFilters">
        <div class="search-page__filter-grid">
          <div class="form-group">
            <label class="form-label">Kategorie</label>
            <select class="form-select" id="searchFilterCat">
              <option value="">Alle Kategorien</option>
              ${topCategories.map(c => `<option value="${c.id}" ${state.searchFilterCategory === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Marke</label>
            <select class="form-select" id="searchFilterBrand">
              <option value="">Alle Marken</option>
              ${allBrands.map(b => `<option value="${b}" ${state.searchFilterBrand === b ? 'selected' : ''}>${b}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Sortierung</label>
            <select class="form-select" id="searchSortSelect">
              <option value="name-asc" ${state.searchSortBy==='name-asc'?'selected':''}>Name A\u2013Z</option>
              <option value="name-desc" ${state.searchSortBy==='name-desc'?'selected':''}>Name Z\u2013A</option>
              <option value="price-asc" ${state.searchSortBy==='price-asc'?'selected':''}>Preis aufsteigend</option>
              <option value="price-desc" ${state.searchSortBy==='price-desc'?'selected':''}>Preis absteigend</option>
            </select>
          </div>
        </div>
      </div>

      <div class="search-results__header">
        <div class="search-results__count">
          <strong>${results.length}</strong> Suchergebnis${results.length !== 1 ? 'se' : ''}
        </div>
        <div class="search-results__sort-label">
          Sortieren: ${state.searchSortBy === 'name-asc' ? 'Name A\u2013Z' : state.searchSortBy === 'name-desc' ? 'Name Z\u2013A' : state.searchSortBy === 'price-asc' ? 'Preis \u2191' : 'Preis \u2193'}
        </div>
      </div>

      ${results.length ? `
        <div class="product-grid product-grid--search" id="searchResultsGrid">
          ${results.map(p => renderProductCard(p)).join('')}
        </div>
      ` : `
        <div class="no-results">
          <div class="no-results__icon">${ICONS.placeholder}</div>
          <p class="no-results__text">${q ? `Keine Ergebnisse f\u00fcr \u00ab${q}\u00bb gefunden.` : 'Bitte geben Sie einen Suchbegriff ein.'}</p>
        </div>
      `}
    </div>
  `;
}

function attachSearchEvents() {
  // Search page form submit
  const form = document.getElementById('searchPageForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('searchPageInput');
      state.globalSearchQuery = input.value;
      render();
    });
  }

  // Filter toggle
  const toggle = document.getElementById('filterToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const filters = document.getElementById('searchFilters');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      filters.classList.toggle('search-page__filters--hidden');
      document.getElementById('filterToggleLabel').textContent = expanded ? 'Filter einblenden' : 'Filter ausblenden';
    });
  }

  // Filter selects
  const catSelect = document.getElementById('searchFilterCat');
  if (catSelect) {
    catSelect.addEventListener('change', () => {
      state.searchFilterCategory = catSelect.value;
      render();
    });
  }

  const brandSelect = document.getElementById('searchFilterBrand');
  if (brandSelect) {
    brandSelect.addEventListener('change', () => {
      state.searchFilterBrand = brandSelect.value;
      render();
    });
  }

  const sortSelect = document.getElementById('searchSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.searchSortBy = sortSelect.value;
      render();
    });
  }
}

// ---- SHOPPING CART ----
function renderCart() {
  const cartItems = state.cart.map((item, i) => {
    const p = PRODUCTS.find(x => x.id === item.productId);
    if (!p) return '';
    const lineTotal = p.price * item.quantity;
    const photoId = PRODUCT_IMAGES[p.id];
    const imgHtml = photoId
      ? `<img src="https://images.unsplash.com/${photoId}?w=120&h=80&fit=crop&auto=format&q=80" alt="${escapeHtml(p.name)}">`
      : getProductIcon(p);
    return `
      <div class="cart-item">
        <div class="cart-item__image">${imgHtml}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${escapeHtml(p.name)}</div>
          <div class="cart-item__unit-price">Preis pro St\u00fcck: ${p.currency} ${p.price.toFixed(2)}</div>
        </div>
        <div class="cart-item__quantity">
          <label class="cart-item__qty-label" for="qty-${i}">Anzahl</label>
          <input type="number" id="qty-${i}" class="cart-item__qty-input" value="${item.quantity}" min="1" max="99" data-index="${i}">
        </div>
        <div class="cart-item__total">${p.currency} ${lineTotal.toFixed(2)}</div>
        <button class="cart-item__remove" aria-label="Entfernen" data-index="${i}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          <span>Entfernen</span>
        </button>
      </div>
    `;
  }).join('');

  const total = getCartTotal();
  const currency = state.cart.length > 0 ? (PRODUCTS.find(x => x.id === state.cart[0].productId)?.currency || 'CHF') : 'CHF';

  const step1Active = state.cartStep === 1;
  const step2Active = state.cartStep === 2;
  const step3Active = state.cartStep === 3;

  return `
    <div class="container container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Produktkatalog', "navigateTo('shop')"], ['Warenkorb'])}
      <div class="detail-toolbar">
        <button class="btn btn--outline btn--sm detail-toolbar__back" onclick="history.back()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>
          Zur\u00fcck
        </button>
        <div class="detail-toolbar__actions">
          <button class="detail-toolbar__icon" aria-label="Drucken" onclick="window.print()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          </button>
        </div>
      </div>

      <h1 class="cart-page__title">Warenkorb</h1>

      ${state.cart.length === 0 ? `
        <div class="no-results">
          <div class="no-results__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <p class="no-results__text">Ihr Warenkorb ist leer.</p>
          <div style="margin-top:var(--space-lg)">
            <a href="#/shop" class="btn btn--filled" onclick="navigateTo('shop');return false">Zum Produktkatalog</a>
          </div>
        </div>
      ` : `
        <ul class="wizard-accordion">
          <!-- Step 1: Warenkorb -->
          <li class="wizard-accordion__step ${step1Active ? 'wizard-accordion__step--active' : ''} ${state.cartStep > 1 ? 'wizard-accordion__step--done' : ''}">
            <button class="wizard-accordion__header" aria-expanded="${step1Active}" aria-controls="wizard-step-1" data-step="1">
              <span class="wizard-accordion__number">1</span>
              <span class="wizard-accordion__label">Ihr Warenkorb</span>
              <svg class="wizard-accordion__chevron" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
            </button>
            <div class="wizard-accordion__panel" id="wizard-step-1" ${step1Active ? '' : 'aria-hidden="true"'}>
              <div class="wizard-accordion__content">
                <div class="cart-items">
                  ${cartItems}
                </div>
              </div>
            </div>
          </li>

          <!-- Step 2: Adresse -->
          <li class="wizard-accordion__step ${step2Active ? 'wizard-accordion__step--active' : ''} ${state.cartStep > 2 ? 'wizard-accordion__step--done' : ''}">
            <button class="wizard-accordion__header" aria-expanded="${step2Active}" aria-controls="wizard-step-2" data-step="2">
              <span class="wizard-accordion__number">2</span>
              <span class="wizard-accordion__label">Rechnungsadresse &amp; Lieferadresse</span>
              <svg class="wizard-accordion__chevron" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
            </button>
            <div class="wizard-accordion__panel" id="wizard-step-2" ${step2Active ? '' : 'aria-hidden="true"'}>
              <div class="wizard-accordion__content">
                <div class="form-card" style="border:none;padding:0">
                  <div class="form-grid">
                    <div class="form-group form-group--full">
                      <h3 style="font-size:var(--text-h4);font-weight:var(--font-weight-bold);margin-bottom:var(--space-sm)">Rechnungsadresse</h3>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Bundesstelle / Organisation</label>
                      <input class="form-input" type="text" placeholder="z.B. Bundesamt f\u00fcr Bauten und Logistik">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Kostenstelle</label>
                      <input class="form-input" type="text" placeholder="z.B. KST-4200-001">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Kontaktperson</label>
                      <input class="form-input" type="text" placeholder="Vor- und Nachname">
                    </div>
                    <div class="form-group">
                      <label class="form-label">E-Mail</label>
                      <input class="form-input" type="email" placeholder="vorname.nachname@bbl.admin.ch">
                    </div>
                    <div class="form-group form-group--full">
                      <h3 style="font-size:var(--text-h4);font-weight:var(--font-weight-bold);margin:var(--space-md) 0 var(--space-sm)">Lieferadresse</h3>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Geb\u00e4ude</label>
                      <input class="form-input" type="text" placeholder="z.B. Bundeshaus West">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Stockwerk / Raum</label>
                      <input class="form-input" type="text" placeholder="z.B. 3. OG, Raum 312">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Strasse / Nr.</label>
                      <input class="form-input" type="text" placeholder="z.B. Fellerstrasse 21">
                    </div>
                    <div class="form-group">
                      <label class="form-label">PLZ / Ort</label>
                      <input class="form-input" type="text" placeholder="z.B. 3003 Bern">
                    </div>
                    <div class="form-group form-group--full">
                      <label class="form-label">Bemerkungen zur Lieferung</label>
                      <textarea class="form-textarea" placeholder="Besondere Hinweise zur Anlieferung..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <!-- Step 3: Bestellung -->
          <li class="wizard-accordion__step ${step3Active ? 'wizard-accordion__step--active' : ''}">
            <button class="wizard-accordion__header" aria-expanded="${step3Active}" aria-controls="wizard-step-3" data-step="3">
              <span class="wizard-accordion__number">3</span>
              <span class="wizard-accordion__label">Bestellung \u00fcbermitteln</span>
              <svg class="wizard-accordion__chevron" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
            </button>
            <div class="wizard-accordion__panel" id="wizard-step-3" ${step3Active ? '' : 'aria-hidden="true"'}>
              <div class="wizard-accordion__content">
                <div class="cart-summary-review">
                  <p style="margin-bottom:var(--space-md)">Bitte pr\u00fcfen Sie Ihre Bestellung. Mit dem Absenden wird die Bestellung an das BBL \u00fcbermittelt.</p>
                  <div class="cart-summary-review__total">
                    <span>Bestellwert exkl. MwSt</span>
                    <strong>${currency} ${total.toFixed(2)}</strong>
                  </div>
                  <div style="margin-top:var(--space-lg)">
                    <button class="btn btn--filled btn--lg" onclick="alert('Bestellung \u00fcbermittelt (Demo)')">Bestellung \u00fcbermitteln</button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <!-- Summary + Next button -->
        <div class="cart-summary">
          <div class="cart-summary__line">
            <span>Provisorischer Bestellwert exkl. MwSt</span>
            <strong>${currency} ${total.toFixed(2)}</strong>
          </div>
          ${state.cartStep < 3 ? `
            <button class="btn btn--filled btn--lg cart-summary__next" data-next-step="${state.cartStep + 1}">
              N\u00e4chster Schritt
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
            </button>
          ` : ''}
        </div>
      `}
    </div>
  `;
}

function attachCartEvents() {
  // Wizard step headers
  document.querySelectorAll('.wizard-accordion__header').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = Number(btn.dataset.step);
      state.cartStep = step;
      navigateTo('cart');
    });
  });

  // Next step button
  const nextBtn = document.querySelector('.cart-summary__next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      state.cartStep = Number(nextBtn.dataset.nextStep);
      navigateTo('cart');
    });
  }

  // Quantity inputs
  document.querySelectorAll('.cart-item__qty-input').forEach(input => {
    input.addEventListener('change', () => {
      updateCartQuantity(Number(input.dataset.index), input.value);
    });
  });

  // Remove buttons
  document.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(Number(btn.dataset.index));
    });
  });
}

// ===================================================================
// EVENTS
// ===================================================================
function attachAccordionEvents() {
  document.querySelectorAll('.accordion__button').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const drawer = document.getElementById(btn.getAttribute('aria-controls'));
      if (expanded) {
        btn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        drawer.style.maxHeight = null;
        btn.classList.remove('active');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        drawer.style.maxHeight = drawer.scrollHeight + 'px';
        btn.classList.add('active');
      }
    });
  });
}

function attachProductDetailEvents() {
  const btn = document.getElementById('addToCartBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const id = Number(btn.dataset.productId);
    addToCart(id);
    btn.textContent = 'Hinzugef\u00fcgt \u2713';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> In den Warenkorb`;
      btn.disabled = false;
    }, 1500);
  });
}

function attachShopEvents() {
  // Category tree
  document.querySelectorAll('.cat-item__row').forEach(row => {
    row.addEventListener('click', () => {
      const catId = row.dataset.catId;
      const cat = findCategory(catId);
      const hasChildren = cat && cat.children && cat.children.length > 0;
      if (hasChildren) {
        if (state.expandedCategories.has(catId)) {
          state.expandedCategories.delete(catId);
        } else {
          state.expandedCategories.add(catId);
        }
      }
      state.activeCategory = catId;
      render();
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });
  });

  // Search with debounce
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    const debouncedSearch = debounce(() => {
      state.searchQuery = searchInput.value;
      updateProductGrid();
    }, 200);
    searchInput.addEventListener('input', debouncedSearch);
  }

  // Sort
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sortBy = sortSelect.value;
      updateProductGrid();
    });
  }
}

function updateProductGrid() {
  const products = filterProducts();
  const gridContainer = document.querySelector('.main-content');
  if (!gridContainer) return;

  // Update product count
  const countEl = gridContainer.querySelector('.toolbar__count');
  if (countEl) countEl.textContent = `${products.length} Produkt${products.length !== 1 ? 'e' : ''}`;

  // Replace grid
  const existing = gridContainer.querySelector('.product-grid, .no-results');
  if (existing) existing.remove();

  if (products.length) {
    const div = document.createElement('div');
    div.className = 'product-grid';
    div.id = 'productGrid';
    div.innerHTML = products.map(p => renderProductCard(p)).join('');
    gridContainer.appendChild(div);
  } else {
    const div = document.createElement('div');
    div.className = 'no-results';
    div.innerHTML = `<div class="no-results__icon">${ICONS.placeholder}</div><p class="no-results__text">Keine Produkte gefunden.</p>`;
    gridContainer.appendChild(div);
  }
}

function setCategory(catId) {
  state.activeCategory = catId;
  for (const c of CATEGORIES) {
    if (c.children) {
      for (const ch of c.children) {
        if (ch.id === catId) state.expandedCategories.add(c.id);
      }
    }
  }
  state.page = 'shop';
  render();
}

// ===================================================================
// NAVIGATION
// ===================================================================
function navigateTo(page, subPage) {
  const prevPage = state.page;
  state.page = page;
  state.subPage = (page === 'product') ? null : (subPage || null);
  state.productId = (page === 'product') ? Number(subPage) : null;
  if (page !== 'search') state.searchQuery = '';
  state.mobileMenuOpen = false;
  if (page === 'cart' && prevPage !== 'cart') state.cartStep = 1;
  document.getElementById('appNav').classList.remove('main-navigation--mobile-open');
  document.getElementById('burgerBtn').setAttribute('aria-expanded', 'false');
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  let hash = '#/' + page;
  if (page === 'product') {
    hash += '/' + subPage;
  } else if (subPage) {
    hash += '/' + subPage;
  }
  history.pushState(null, '', hash);
}

// ===================================================================
// BURGER MENU
// ===================================================================
document.getElementById('burgerBtn').addEventListener('click', () => {
  const nav = document.getElementById('appNav');
  const btn = document.getElementById('burgerBtn');
  state.mobileMenuOpen = !state.mobileMenuOpen;
  nav.classList.toggle('main-navigation--mobile-open', state.mobileMenuOpen);
  btn.setAttribute('aria-expanded', String(state.mobileMenuOpen));
});

// ===================================================================
// HASH ROUTING
// ===================================================================
function handleHash() {
  const hash = location.hash.replace('#/', '').split('/');
  const page = hash[0] || 'shop';
  const sub = hash[1] || null;

  if (page === 'product' && sub) {
    state.page = 'product';
    state.productId = Number(sub);
    state.subPage = null;
  } else if (['home', 'shop', 'planung', 'grundriss', 'circular', 'scan', 'erfassen', 'charta', 'stilwelten', 'planungsbeispiele', 'cad', 'cart', 'search'].includes(page)) {
    state.page = page;
    state.subPage = sub;
    state.productId = null;
  } else {
    state.page = 'shop';
    state.productId = null;
  }
  render();
}

window.addEventListener('hashchange', handleHash);
window.addEventListener('popstate', handleHash);

// Card keyboard support (delegated)
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && (e.target.classList.contains('card--clickable') || e.target.classList.contains('card--product'))) {
    e.preventDefault();
    e.target.click();
  }
});

// ===================================================================
// BACK-TO-TOP
// ===================================================================
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('back-to-top-btn--visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===================================================================
// COOKIE / CONSENT BANNER
// ===================================================================
(function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  if (localStorage.getItem('cookieConsent')) {
    banner.remove();
    return;
  }

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.add('notification-banner--hidden');
  });

  document.getElementById('cookieReject')?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    banner.classList.add('notification-banner--hidden');
  });
})();

// ===================================================================
// LANGUAGE SWITCHER
// ===================================================================
(function initLangSwitch() {
  const wrapper = document.getElementById('langSwitch');
  if (!wrapper) return;

  const toggle = wrapper.querySelector('.top-bar__lang');
  const options = wrapper.querySelectorAll('.language-switcher__option');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = wrapper.classList.toggle('language-switcher--open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => {
        o.classList.remove('language-switcher__option--active');
        o.setAttribute('aria-selected', 'false');
      });
      opt.classList.add('language-switcher__option--active');
      opt.setAttribute('aria-selected', 'true');

      const langMap = { 'Deutsch': 'DE', 'Fran\u00e7ais': 'FR', 'Italiano': 'IT', 'Rumantsch': 'RM' };
      toggle.firstChild.textContent = langMap[opt.textContent] || opt.textContent.substring(0, 2).toUpperCase();

      wrapper.classList.remove('language-switcher--open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove('language-switcher--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ===================================================================
// HEADER SEARCH (expand on click)
// ===================================================================
(function initHeaderSearch() {
  const wrapper = document.getElementById('headerSearch');
  const input = document.getElementById('headerSearchInput');
  const btn = wrapper?.querySelector('.header-search__btn');
  const form = document.getElementById('headerSearchForm');
  if (!wrapper || !input || !btn || !form) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!wrapper.classList.contains('header-search--open')) {
      wrapper.classList.add('header-search--open');
      input.focus();
    } else if (input.value.trim()) {
      state.globalSearchQuery = input.value.trim();
      state.searchFilterCategory = '';
      state.searchFilterBrand = '';
      state.searchSortBy = 'name-asc';
      wrapper.classList.remove('header-search--open');
      input.value = '';
      navigateTo('search');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) {
      state.globalSearchQuery = input.value.trim();
      state.searchFilterCategory = '';
      state.searchFilterBrand = '';
      state.searchSortBy = 'name-asc';
      wrapper.classList.remove('header-search--open');
      input.value = '';
      navigateTo('search');
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove('header-search--open');
    }
  });

  // Close on Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      wrapper.classList.remove('header-search--open');
      btn.focus();
    }
  });
})();

// ===================================================================
// INIT
// ===================================================================
loadData().then(() => {
  handleHash();
});
