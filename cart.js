import { db, auth } from "../../frontend/js/firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cart-items");
const totalBox = document.getElementById("total");
const loginLink = document.getElementById("nav-login");
const registerLink = document.getElementById("nav-register");
const logoutLink = document.getElementById("nav-logout");
const userStatus = document.getElementById("user-status");

function updateNav(user) {
  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
    if (logoutLink) {
      logoutLink.style.display = "inline-flex";
      logoutLink.onclick = async (event) => {
        event.preventDefault();
        await signOut(auth);
        location.href = "login.html";
      };
    }
    if (userStatus) userStatus.textContent = user.displayName ? `Hi, ${user.displayName}` : `Hi, ${user.email}`;
  } else {
    if (loginLink) loginLink.style.display = "inline-flex";
    if (registerLink) registerLink.style.display = "inline-flex";
    if (logoutLink) logoutLink.style.display = "none";
    if (userStatus) userStatus.textContent = "";
  }
}

onAuthStateChanged(auth, updateNav);

function renderCart() {

  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {

    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-card";

    div.innerHTML = `
      <p>${item.name} × ${item.quantity || 1} - ₦${item.price} each</p>
      <p><strong>Subtotal:</strong> ₦${itemTotal}</p>
      <button class="cart-action-btn" onclick="removeItem(${index})">Remove</button>
    `;

    container.appendChild(div);

  });

  totalBox.innerText = "Total: ₦" + total;

}

window.removeItem = function(index) {

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();

};

window.placeOrder = function () {

  async function verifyPayment(reference, total) {

  try {

    const res = await fetch(
      `http://localhost:5000/verify/${reference}`
    );

    const data = await res.json();

    console.log("Verification Result:", data);

    if (data.success) {

      await saveOrder(reference, total);

      alert("Payment verified ✔");

    } else {

      alert("Payment verification failed ❌");

    }

  } catch (error) {

    console.error(error);

    alert("Verification error ❌");

  }

}

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  // Convert to kobo (Paystack requirement)
  let amount = total * 100;

  let handler = PaystackPop.setup({
    key: "pk_live_a60ab8481c8625e2613fab05d9c0025a29c55037",
    email: auth.currentUser?.email || "customer@email.com",
    amount: amount,
    currency: "NGN",

    callback: function (response) {
      const reference = response.reference;
      verifyPayment(reference, total);
    },
    onClose: function () {
      alert("Payment cancelled");
    }
  });

  handler.openIframe();
};

window.saveOrder = async function (reference, total) {

  await addDoc(collection(db, "orders"), {
    items: cart,
    totalPrice: total,
    paymentRef: reference,
    status: "paid",
    userEmail: auth.currentUser?.email || "customer@email.com",
    customerName: auth.currentUser?.displayName || auth.currentUser?.email || "Guest Customer",
    createdAt: serverTimestamp()
  });

  localStorage.removeItem("cart");
  cart = [];

  alert("Order saved ✔");
  window.location.href = "index.html";
};

renderCart();