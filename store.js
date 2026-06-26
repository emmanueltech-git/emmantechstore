import { db } from "../../frontend/js/firebase-config.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

function loadProducts() {

  const container = document.getElementById("products");

  onSnapshot(collection(db, "products"), (querySnapshot) => {
    container.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const p = doc.data();

      const card = document.createElement("div");
      card.className = "product-card";

      const imageUrl = p.image && typeof p.image === "string" ? p.image : "";
      const placeholder = "https://via.placeholder.com/440x260?text=No+Image";

      card.innerHTML = `
        <img class="product-image" src="${imageUrl || placeholder}" alt="${p.name} image" onerror="this.src='${placeholder}'; this.onerror=null;">
        <h3>${p.name}</h3>
        <p><b>₦${p.price}</b></p>
        <p>${p.category}</p>
        <p>${p.description}</p>
      `;

      const quantityField = document.createElement("input");
      quantityField.type = "number";
      quantityField.min = "1";
      quantityField.value = "1";
      quantityField.style.width = "76px";
      quantityField.style.marginTop = "14px";
      quantityField.style.padding = "10px 12px";
      quantityField.style.borderRadius = "999px";
      quantityField.style.border = "1px solid rgba(15, 23, 42, 0.12)";
      quantityField.style.fontSize = "0.95rem";
      quantityField.style.color = "#111827";
      quantityField.style.background = "#ffffff";

      const button = document.createElement("button");
      button.className = "add-to-cart-btn";
      button.textContent = "Add to Cart";
      button.addEventListener("click", () => {
        const quantity = Math.max(1, Number(quantityField.value) || 1);
        addToCart(doc.id, p.name, p.price, quantity);
      });

      card.appendChild(quantityField);
      card.appendChild(button);
      container.appendChild(card);
    });
  });

}

window.addToCart = function(id, name, price, quantity = 1) {
  const existingIndex = cart.findIndex((item) => item.id === id);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
  } else {
    cart.push({ id, name, price, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`Added ${quantity} × ${name} to cart ✔`);
};

updateCartCount();
loadProducts();