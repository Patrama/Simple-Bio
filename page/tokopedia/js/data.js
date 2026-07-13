let allProducts = [];
let currentCategory = 'all';

// ---- 1. Proper CSV parser (handles quotes, commas inside fields, blank rows) ----
function parseCSV(text) {
  text = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const rows = [];
  let row = [], field = '', inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }

  const rawHeaders = rows.shift().map(h => h.trim().toLowerCase());

  return rows
    .filter(r => r.some(v => v.trim() !== ''))
    .map(r => {
      const obj = {};
      rawHeaders.forEach((h, idx) => { obj[h] = (r[idx] || '').trim(); });
      return obj;
    });
}

// ---- 2. Fetch + parse the sheet ----
async function loadStorefrontData() {
  if (location.protocol === 'file:') {
    document.getElementById('linksGrid').innerHTML = `
      <div class="text-center text-xs py-8 px-4 leading-relaxed" style="color:var(--danger)">
        This page was opened directly as a file (file://).<br>
        Browsers block loading remote data that way.<br>
        Run it through a local server or host it online instead. ⚠️
      </div>`;
    return;
  }

  try {
    const url = SPREADSHEET_CSV_URL + (SPREADSHEET_CSV_URL.includes('?') ? '&' : '?') + 'cb=' + Date.now();
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Sheet request failed with status ${response.status}`);
    }

    const csvText = await response.text();

    if (csvText.trim().startsWith('<')) {
      throw new Error('Response was HTML, not CSV — sheet may not be published, or the link/gid is wrong.');
    }

    allProducts = parseCSV(csvText);
    renderCategoryTabs(allProducts);
    applyFilters();
  } catch (error) {
    console.error('Error loading dynamic database:', error);
    document.getElementById('linksGrid').innerHTML = `
      <div class="text-center text-xs py-8 px-4 leading-relaxed" style="color:var(--danger)">
        Failed to sync database. ⚠️<br>
        Check console for details — common causes: sheet not published to web,
        wrong gid, or page opened via file:// instead of a server.
      </div>`;
  }
}

// ---- 3. Render category tabs dynamically (no more hardcoding new categories) ----
function renderCategoryTabs(products) {
  const categories = ['all', ...new Set(
    products.map(p => (p.category || '').toLowerCase()).filter(Boolean)
  )];

  const tabsContainer = document.getElementById('categoryTabs');
  tabsContainer.innerHTML = categories.map(cat => {
    const label = cat === 'all' ? 'All Finds 🌐' : cat.replace(/\b\w/g, c => c.toUpperCase());
    const isActive = cat === 'all';
    return `<button data-category="${cat}" class="cat-btn snap-start shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
      isActive
        ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)]'
        : 'bg-[var(--surface-alt)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]'
    }">${label}</button>`;
  }).join('');

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.remove('bg-[var(--accent)]', 'text-[var(--accent-contrast)]', 'border-[var(--accent)]');
        b.classList.add('bg-[var(--surface-alt)]', 'text-[var(--text-secondary)]', 'border-[var(--border)]');
      });
      btn.classList.remove('bg-[var(--surface-alt)]', 'text-[var(--text-secondary)]', 'border-[var(--border)]');
      btn.classList.add('bg-[var(--accent)]', 'text-[var(--accent-contrast)]', 'border-[var(--accent)]');
      applyFilters();
    });
  });
}

// ---- 4. Render table rows ----
function renderRows(list) {
  const container = document.getElementById('linksGrid');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `<div class="text-center text-xs text-[var(--text-secondary)] py-8">No matching items found 🔍</div>`;
    return;
  }

  list.forEach(item => {
    const rowHTML = `
      <div class="grid grid-cols-[34px_1fr_1fr_60px] gap-2 items-center px-3 py-2.5 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-alt)] transition-colors">
        <div class="text-xs text-[var(--text-secondary)] font-mono text-center">${item.number || ''}</div>
        <div>
          <span class="inline-block bg-[var(--accent-soft)] text-[var(--badge-text)] text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide leading-tight">
            ${item.category || '—'}
          </span>
        </div>
        <div class="text-xs font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">${item.name || ''}</div>
        <a href="${item.link || '#'}" target="_blank" rel="noopener noreferrer"
           class="text-center bg-[var(--accent-soft)] hover:bg-[var(--accent)] border border-[var(--accent)]/30 text-[var(--badge-text)] hover:text-[var(--accent-contrast)] font-bold text-[10px] py-1.5 rounded-lg transition-all">
          View
        </a>
      </div>`;
    container.insertAdjacentHTML('beforeend', rowHTML);
  });
}

// ---- 5. Search (matches Number or Name) + category filter combined ----
function applyFilters() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();

  const filtered = allProducts.filter(item => {
    const matchesCategory = currentCategory === 'all' || (item.category || '').toLowerCase() === currentCategory;
    const matchesSearch =
      query === '' ||
      String(item.number || '').toLowerCase().includes(query) ||
      String(item.name || '').toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  renderRows(filtered);
}

document.getElementById('searchInput').addEventListener('input', applyFilters);

// Optional: re-fetch every 5 minutes so new sheet rows show up without a manual reload.
setInterval(loadStorefrontData, 5 * 60 * 1000);

window.addEventListener('DOMContentLoaded', loadStorefrontData);
