// script.js – slideshow, product grids, cart management, dynamic buttons

// ---------- CART MANAGEMENT (localStorage) ----------
let cart = JSON.parse(localStorage.getItem('filzaCart')) || [];

function saveCart() {
  localStorage.setItem('filzaCart', JSON.stringify(cart));
  updateCartCount();
  updateAllAddToCartButtons(); // refresh button states after cart change
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function isInCart(productId) {
  return cart.some(item => item.id === productId);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, name: product.name, price: product.price, img: product.img, quantity: 1 });
  }
  saveCart();
  // No alert – button will change to "go to cart"
}

// Function to update all "add to cart" buttons based on cart state
function updateAllAddToCartButtons() {
  document.querySelectorAll('.product-card').forEach(card => {
    const productLink = card.querySelector('a[href*="product.html?id="]');
    if (!productLink) return;
    const href = productLink.getAttribute('href');
    const match = href.match(/id=(\d+)/);
    if (!match) return;
    const productId = parseInt(match[1]);
    const btn = card.querySelector('button');
    if (!btn) return;

    if (isInCart(productId)) {
      btn.textContent = 'go to cart';
      btn.onclick = () => { window.location.href = 'cart.html'; };
      btn.classList.add('in-cart');
    } else {
      btn.textContent = 'add to cart';
      btn.onclick = (e) => {
        e.stopPropagation();
        addToCart(productId);
      };
      btn.classList.remove('in-cart');
    }
  });
}

// ---------- RENDER PRODUCT CARDS ----------
function renderProductGrid(containerId, productArray) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  productArray.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="product.html?id=${p.id}" style="text-decoration: none; color: inherit;">
        <img src="${p.img}" alt="${p.name}">
        <h4>${p.name}</h4>
        <div class="price">₹${p.price}</div>
      </a>
      <button class="add-to-cart-btn" data-id="${p.id}">add to cart</button>
    `;
    grid.appendChild(card);
  });
  updateAllAddToCartButtons();
}

// ---------- SLIDESHOW ----------
let slideIndex = 1;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(n) {
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[slideIndex - 1]?.classList.add("active");
  dots[slideIndex - 1]?.classList.add("active");
}

function changeSlide(step) {
  showSlide(slideIndex += step);
}

function currentSlide(n) {
  showSlide(slideIndex = n);
}

// ---------- INIT ON PAGE LOAD ----------
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Load bestsellers (first 10 products)
  if (document.getElementById('bestseller-grid')) {
    renderProductGrid('bestseller-grid', products.slice(0, 10));
  }
  // Load new launches (products with cat 'new')
  if (document.getElementById('newlaunch-grid')) {
    const newProducts = products.filter(p => p.cat === 'new');
    renderProductGrid('newlaunch-grid', newProducts);
  }

  // Slideshow initialization
  if (document.querySelector('.slideshow-container')) {
    showSlide(slideIndex);
    setInterval(() => changeSlide(1), 5000);
  }

  // Search functionality
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    });
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

  // For cart page rendering (if on cart.html)
  if (window.location.pathname.includes('cart.html')) {
    renderCartPage();
  }
});

// Expose functions globally
window.addToCart = addToCart;
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
window.updateAllAddToCartButtons = updateAllAddToCartButtons;