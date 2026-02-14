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
  mobileMenuOpen: false
};

// ===================================================================
// ICONS
// ===================================================================
const CHEVRON_RIGHT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,6 15,12 9,18"/></svg>`;

const ICONS = {
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
    return `<img src="https://images.unsplash.com/${photoId}?w=600&h=400&fit=crop&auto=format&q=80" alt="${product.name}" loading="lazy">`;
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
  const SEP = ` <span class="breadcrumb__sep">${CHEVRON_RIGHT}</span> `;
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
  const activePage = ['scan', 'erfassen', 'charta'].includes(state.page) ? 'circular' : state.page;
  document.querySelectorAll('.app-nav__link').forEach(link => {
    const nav = link.dataset.nav;
    if (nav === activePage) {
      link.classList.add('app-nav__link--active');
    } else {
      link.classList.remove('app-nav__link--active');
    }
  });

  // Trigger page transition
  app.style.animation = 'none';
  app.offsetHeight; // force reflow
  app.style.animation = '';

  switch (state.page) {
    case 'home': app.innerHTML = renderHome(); break;
    case 'shop': app.innerHTML = renderShop(); attachShopEvents(); break;
    case 'product': app.innerHTML = renderProductDetail(state.productId); break;
    case 'planung': app.innerHTML = renderPlanung(); break;
    case 'grundriss': app.innerHTML = renderGrundriss(); break;
    case 'circular': app.innerHTML = renderCircular(); attachShopEvents(); break;
    case 'scan': app.innerHTML = renderScan(); break;
    case 'erfassen': app.innerHTML = renderErfassen(); break;
    case 'charta': app.innerHTML = renderCharta(); break;
    default: app.innerHTML = renderShop(); attachShopEvents();
  }
}

// ---- HOME ----
function renderHome() {
  return `
    <div class="page-container page-container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Home'])}
      <div class="page-hero">
        <h1 class="page-hero__title">Workspace Management</h1>
        <p class="page-hero__subtitle">Willkommen beim Bundesamt f\u00fcr Bauten und Logistik. Planen, bestellen und verwalten Sie Ihre B\u00fcroausstattung.</p>
      </div>

      <div class="tile-grid">
        <div class="card card--centered card--interactive" onclick="navigateTo('shop')" role="button" tabindex="0">
          <h3 class="card__title">Produktkatalog</h3>
          <p class="card__desc">Entdecken Sie unser Sortiment an B\u00fcrom\u00f6beln, Sitzm\u00f6beln, Beleuchtung und Zubeh\u00f6r f\u00fcr Ihren Arbeitsplatz. Alle Produkte entsprechen den Standards der Bundesverwaltung.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--interactive" onclick="navigateTo('planung')" role="button" tabindex="0">
          <h3 class="card__title">Arbeitspl\u00e4tze gestalten</h3>
          <p class="card__desc">Gestalten Sie Ihre Workspaces mit Stilwelten, Planungsbeispielen und CAD-Daten. Finden Sie Inspiration und Vorlagen f\u00fcr Ihre B\u00fcroplanung.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--interactive" onclick="navigateTo('circular')" role="button" tabindex="0">
          <h3 class="card__title">Gebrauchte M\u00f6bel</h3>
          <p class="card__desc">Gebrauchte M\u00f6bel wiederverwenden statt entsorgen. Scannen Sie bestehende Objekte, erfassen Sie neue und st\u00f6bern Sie im Angebot verf\u00fcgbarer Gebrauchtm\u00f6bel.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
      </div>

      <h2 class="section-heading">Neuheiten</h2>
      <div class="product-grid product-grid--spaced">
        ${PRODUCTS.filter(p => p.isNew && !p.isCircular).slice(0, 6).map(p => renderProductCard(p)).join('')}
      </div>
      <div class="section-link">
        <a href="#/shop" class="section-link__a" onclick="navigateTo('shop');return false">Alle Produkte einsehen &rarr;</a>
      </div>
    </div>
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
    <div class="page-container page-container--with-top-pad page-container--no-bottom">
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
          <div class="search-bar">
            <input class="search-bar__input" type="search" placeholder="Suchen..." id="searchInput" value="${escapeHtml(state.searchQuery)}" aria-label="Produkte suchen">
            <button class="search-bar__btn" aria-label="Suchen">${ICONS.search}</button>
          </div>
          <select class="sort-select" id="sortSelect" aria-label="Sortierung">
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
        ${p.isNew ? '<span class="card__badge card__badge--new">Neu</span>' : ''}
        ${p.isCircular ? '<span class="card__badge card__badge--circular">Gebraucht</span>' : ''}
      </div>
      <div class="card__body">
        <div class="card__title">${escapeHtml(p.name)}</div>
        <div class="card__desc">${escapeHtml(p.description)}</div>
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
      <div class="page-container page-container--with-top-pad" id="mainContent">
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

  const condition = p.isCircular ? 'Gebraucht \u2013 guter Zustand' : 'Neu';
  const articleNr = 'ART-' + String(p.id).padStart(5, '0');

  return `
    <div class="page-container page-container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(...bcItems)}
      <div class="product-detail">
        <div class="product-detail__image">
          ${getProductImage(p)}
          ${p.isNew ? '<span class="card__badge card__badge--new">Neu</span>' : ''}
          ${p.isCircular ? '<span class="card__badge card__badge--circular">Gebraucht</span>' : ''}
        </div>
        <div class="product-detail__info">
          <h1 class="product-detail__title">${escapeHtml(p.name)}</h1>
          <p class="product-detail__desc">${escapeHtml(p.description)}</p>
          <div class="product-detail__meta">
            <span class="product-detail__meta-label">Marke</span>
            <span class="product-detail__meta-value">${escapeHtml(p.brand)}</span>
            <span class="product-detail__meta-label">Kategorie</span>
            <span class="product-detail__meta-value">${catLabel}</span>
            <span class="product-detail__meta-label">Zustand</span>
            <span class="product-detail__meta-value">${condition}</span>
            <span class="product-detail__meta-label">Artikel-Nr.</span>
            <span class="product-detail__meta-value">${articleNr}</span>
          </div>
          <div class="product-detail__price">${p.currency} ${p.price.toFixed(2)}</div>
          <div class="product-detail__actions">
            <button class="btn btn--primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Bestellen
            </button>
            <button class="btn btn--outline" onclick="history.back()">Zur\u00fcck</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- PLANUNG ----
function renderPlanung() {
  const stilwelten = [
    { title: "Fokus-Arbeitsplatz", desc: "Konzentriertes Arbeiten mit Akustik-Elementen", image: "photo-1497366216548-37526070297c" },
    { title: "Kollaborationszone", desc: "Offene Bereiche f\u00fcr Teamarbeit und Workshops", image: "photo-1497215842964-222b430dc094" },
    { title: "Lounge & Empfang", desc: "Repr\u00e4sentative R\u00e4ume mit Wohncharakter", image: "photo-1524758631624-e2822e304c36" },
    { title: "Konferenz & Meeting", desc: "Professionelle Besprechungsr\u00e4ume", image: "photo-1462826303086-329426d1aef5" },
    { title: "Flex-Desk", desc: "Shared Desks mit Buchungssystem", image: "photo-1593642632559-0c6d3fc62b89" },
    { title: "Bibliothek & Archiv", desc: "Ruhezonen mit Regal-Systemen", image: "photo-1507842217343-583bb7270b66" }
  ];

  return `
    <div class="page-container page-container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Arbeitspl\u00e4tze gestalten'])}
      <div class="page-hero">
        <h1 class="page-hero__title">Workspaces gestalten</h1>
        <p class="page-hero__subtitle">Planen Sie Ihre B\u00fcror\u00e4ume effizient und nach aktuellen Arbeitsplatzstandards des Bundes.</p>
      </div>

      <div class="tile-grid">
        <div class="card card--centered card--interactive">
          <h3 class="card__title">Stilwelten</h3>
          <p class="card__desc">Entdecken Sie vordefinierte B\u00fcro-Stile und Einrichtungskonzepte. Von klassisch bis modern \u2013 finden Sie die passende Atmosph\u00e4re f\u00fcr Ihr Arbeitsumfeld.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--interactive">
          <h3 class="card__title">Planungsbeispiele</h3>
          <p class="card__desc">Lassen Sie sich von realisierten Referenzprojekten inspirieren. Sehen Sie, wie andere Bundesstellen ihre R\u00e4ume gestaltet haben.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--interactive">
          <h3 class="card__title">CAD-Daten</h3>
          <p class="card__desc">Laden Sie CAD-Dateien und technische Zeichnungen f\u00fcr die professionelle Raumplanung herunter. F\u00fcr Planer und Architekten.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
      </div>

      <h2 class="section-heading">Stilwelten</h2>
      <div class="tile-grid">
        ${stilwelten.map(s => `
          <div class="card card--interactive">
            <div class="card__image card__image--visual">
              <img src="https://images.unsplash.com/${s.image}?w=600&h=300&fit=crop&auto=format&q=80" alt="${s.title}" loading="lazy">
            </div>
            <div class="card__body">
              <div class="card__title">${s.title}</div>
              <div class="card__desc">${s.desc}</div>
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

// ---- GRUNDRISS-APP ----
function renderGrundriss() {
  return `
    <div class="page-container page-container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Arbeitspl\u00e4tze verwalten'])}

      <div class="placeholder-area">
        <div class="placeholder-area__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="14" y2="9"/><line x1="9" y1="3" x2="9" y2="14"/><line x1="14" y1="9" x2="14" y2="21"/><line x1="9" y1="14" x2="21" y2="14"/></svg>
        </div>
        <div class="placeholder-area__title">Arbeitspl\u00e4tze verwalten (in Entwicklung)</div>
        <p class="placeholder-area__text">Hier k\u00f6nnen Sie direkt im Browser Grundrisse erstellen und mit Ihren<br>Kunden R\u00e4ume gestalten. Diese Funktion wird in einer zuk\u00fcnftigen Version verf\u00fcgbar sein.</p>
      </div>
    </div>
  `;
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
    <div class="page-container page-container--with-top-pad page-container--no-bottom">
      ${renderBreadcrumb(...bcItems)}

      <div class="tile-grid tile-grid--3col">
        <div class="card card--centered card--interactive" onclick="navigateTo('scan')" role="button" tabindex="0">
          <h3 class="card__title">Objekt scannen</h3>
          <p class="card__desc">Scannen Sie den QR-Code oder geben Sie die Inventar-Nummer eines M\u00f6belst\u00fccks ein, um dessen Status und Verf\u00fcgbarkeit zu pr\u00fcfen.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--interactive" onclick="navigateTo('erfassen')" role="button" tabindex="0">
          <h3 class="card__title">Neues Objekt erfassen</h3>
          <p class="card__desc">Tragen Sie gebrauchte M\u00f6bel ins System ein und machen Sie diese f\u00fcr andere Bundesstellen verf\u00fcgbar. So f\u00f6rdern wir die Wiederverwendung.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
        <div class="card card--centered card--interactive" onclick="navigateTo('charta')" role="button" tabindex="0">
          <h3 class="card__title">Charta kreislauforientiertes Bauen</h3>
          <p class="card__desc">Erfahren Sie mehr \u00fcber unsere Strategie f\u00fcr Kreislaufwirtschaft und nachhaltiges Bauen in der Bundesverwaltung.</p>
          <div class="card__arrow"><span class="card__arrow-icon">&rarr;</span></div>
        </div>
      </div>

      <h2 class="section-heading">Gebrauchte M\u00f6bel</h2>
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
          <div class="search-bar">
            <input class="search-bar__input" type="search" placeholder="Gebrauchte M\u00f6bel suchen..." id="searchInput" value="${escapeHtml(state.searchQuery)}" aria-label="Gebrauchte M\u00f6bel suchen">
            <button class="search-bar__btn" aria-label="Suchen">${ICONS.search}</button>
          </div>
          <select class="sort-select" id="sortSelect" aria-label="Sortierung">
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
    <div class="page-container page-container--with-top-pad" id="mainContent">
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
            <button class="btn btn--primary">Suchen</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- NEUES OBJEKT ERFASSEN ----
function renderErfassen() {
  return `
    <div class="page-container page-container--with-top-pad" id="mainContent">
      ${renderBreadcrumb(['Gebrauchte M\u00f6bel', "navigateTo('circular')"], ['Neues Objekt erfassen'])}
      <div class="page-hero">
        <h1 class="page-hero__title">Neues Objekt erfassen</h1>
        <p class="page-hero__subtitle">M\u00f6belst\u00fcck dem Kreislauf hinzuf\u00fcgen.</p>
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
            <button class="btn btn--primary">Objekt erfassen</button>
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
    <div class="page-container page-container--with-top-pad" id="mainContent">
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

// ===================================================================
// EVENTS
// ===================================================================
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
  state.page = page;
  state.subPage = (page === 'product') ? null : (subPage || null);
  state.productId = (page === 'product') ? Number(subPage) : null;
  state.searchQuery = '';
  state.mobileMenuOpen = false;
  document.getElementById('appNav').classList.remove('app-nav--mobile-open');
  document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'false');
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
// HAMBURGER MENU
// ===================================================================
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  const nav = document.getElementById('appNav');
  const btn = document.getElementById('hamburgerBtn');
  state.mobileMenuOpen = !state.mobileMenuOpen;
  nav.classList.toggle('app-nav--mobile-open', state.mobileMenuOpen);
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
  } else if (['home', 'shop', 'planung', 'grundriss', 'circular', 'scan', 'erfassen', 'charta'].includes(page)) {
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
  if ((e.key === 'Enter' || e.key === ' ') && (e.target.classList.contains('card--interactive') || e.target.classList.contains('card--product'))) {
    e.preventDefault();
    e.target.click();
  }
});

// ===================================================================
// INIT
// ===================================================================
loadData().then(() => {
  handleHash();
});
