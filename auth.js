import { auth } from "../../frontend/js/firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// SIGN UP
window.signup = async function (event) {
  if (event?.preventDefault) event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name) {
      await updateProfile(user, { displayName: name });
    }

    alert("Account created ✔");
    location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
};

window.googleSignIn = async function () {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    alert("Signed in with Google ✔");
    location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
};

// LOGIN
window.login = async function (event) {
  if (event?.preventDefault) event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in ✔");
    location.href = "cart.html";
  } catch (err) {
    alert(err.message);
  }
};

// LOGOUT
window.logout = async function () {
  await signOut(auth);
  alert("Logged out");
};

// TRACK USER
onAuthStateChanged(auth, (user) => {
  console.log("User:", user?.email || "No user");
});