const products = [
  {
    title: "Kiro Pro+ 10M Tokens",
    soldLabel: "7 TERJUAL",
    token: "10M",
    duration: "-",
    oldPrice: 12000,
    newPrice: 9500,
    stock: 1,
    link: "page/tokopedia/index.html",
    image: "img/Tokopedia.webp",
    sourceLabel: "Tokopedia",
  },
  {
    title: "Kiro Pro+ 20M Tokens",
    soldLabel: "2 TERJUAL",
    token: "20M",
    duration: "1 Hari",
    oldPrice: 18000,
    newPrice: 16000,
    stock: 0,
    link: "page/shopee/index.html",
    image: "img/Shopee.webp",
    sourceLabel: "Shopee",
  },
];

const priceFormatter = new Intl.NumberFormat("id-ID");
const page = document.querySelector(".page");

function formatRupiah(value) {
  return `Rp ${priceFormatter.format(value)}`;
}

function fitToViewport() {
  if (!page) {
    return;
  }

  page.style.setProperty("--page-scale", "1");

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const naturalWidth = page.scrollWidth;
  const naturalHeight = page.scrollHeight;

  if (!naturalWidth || !naturalHeight) {
    return;
  }

  const widthRatio = viewportWidth / naturalWidth;
  const heightRatio = viewportHeight / naturalHeight;
  const targetScale = Math.min(1, widthRatio, heightRatio);

  page.style.setProperty("--page-scale", String(targetScale));
}

function renderProducts(items) {
  const grid = document.getElementById("productGrid");
  if (!grid) {
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "product-card frame";

    const stockLabel = item.stock > 0 ? `${item.stock}` : "Habis";
    const buttonText = item.stock > 0 ? "BELI SEKARANG" : "STOK HABIS";
    const stockState = item.stock > 0 ? "" : "disabled";

    card.innerHTML = `
      <div class="product-head">
        <h2 class="product-title">${item.title}</h2>
        <span class="sold-badge">${item.soldLabel}</span>
      </div>

      <div class="meta">
        <div class="meta-row">
          <span class="meta-label">Token</span>
          <span class="meta-value">${item.token}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Durasi</span>
          <span class="meta-value">${item.duration}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Harga</span>
          <div class="price-line">
            <span class="price-old">${formatRupiah(item.oldPrice)}</span>
            <span class="price-new">${formatRupiah(item.newPrice)}</span>
          </div>
        </div>
        <div class="meta-row">
          <span class="meta-label">Stok</span>
          <span class="meta-value">${stockLabel}</span>
        </div>
      </div>

      <a href="${item.link}" class="thumb-link" aria-label="Open ${item.sourceLabel} page">
        <img src="${item.image}" width="46" height="46" loading="lazy" decoding="async" alt="${item.sourceLabel} thumbnail">
        <span>${item.sourceLabel}</span>
      </a>

      <button type="button" class="buy-btn" ${stockState}>${buttonText}</button>
    `;

    fragment.appendChild(card);
  });

  grid.replaceChildren(fragment);
}

renderProducts(products);
fitToViewport();

window.addEventListener("resize", fitToViewport, { passive: true });
