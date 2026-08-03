/** @format */

const products = [
  {
    title: "Tokopedia",
    soldLabel: "Plus +",
    Status: "10M",
    duration: "30 Hari",
    // oldPrice: FullPrice,
    // newPrice: 9500,
    stock: 1,
    link: "page/tokopedia.html",
    image: "img/Tokopedia-Clay-Style.webp",
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
    link: "page/shopee.html",
    image: "img/Shopee-Clay-Style.webp",
    sourceLabel: "Shopee",
  },
];

const priceFormatter = new Intl.NumberFormat("id-ID");

function formatRupiah(value) {
  return `Rp ${priceFormatter.format(value)}`;
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

        <div class="meta-row">
          <span class="meta-label">Durasi</span>
          <span class="meta-value">${item.duration}</span>
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
