import { auth, db } from "../../frontend/js/firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const container = document.getElementById("orders");

async function loadMyOrders() {

  container.innerHTML = "";

  const user = auth.currentUser;

  if (!user) {
    container.innerHTML = "<p>Please login first</p>";
    return;
  }

  const querySnapshot = await getDocs(collection(db, "orders"));

  querySnapshot.forEach((doc) => {

    const order = doc.data();

    // Only show orders for this user
    if (order.userEmail !== user.email) return;

    const div = document.createElement("div");

    let itemsHTML = "";

    order.items.forEach(item => {
      itemsHTML += `<li>${item.name} - ₦${item.price}</li>`;
    });

    div.innerHTML = `
      <h3>Order ID: ${doc.id}</h3>
      <ul>${itemsHTML}</ul>
      <p>Total: ₦${order.totalPrice}</p>
      <p>Status: ${order.status}</p>
      <p>Ref: ${order.paymentRef || "N/A"}</p>
      <hr>
    `;

    container.appendChild(div);

  });

}

loadMyOrders();