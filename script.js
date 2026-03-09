// script.js – slideshow, product grids, cart management

// ---------- CART MANAGEMENT (localStorage) ----------
let cart = JSON.parse(localStorage.getItem('filzaCart')) || [];

function saveCart() {
  localStorage.setItem('filzaCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
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
  alert(`✨ ${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  if (window.location.pathname.includes('cart.html')) renderCartPage();
}

function updateQuantity(productId, newQty) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQty;
      saveCart();
    }
  }
  if (window.location.pathname.includes('cart.html')) renderCartPage();
}

// ---------- RENDER PRODUCT CARDS (with links to detail page) ----------
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
      <button onclick="addToCart(${p.id})">add to cart</button>
    `;
    grid.appendChild(card);
  });
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

// Expose functions globally for onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;