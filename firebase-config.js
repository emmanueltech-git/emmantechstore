import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIz9Z4IdDsPYqvevyrDASo420PwUc_Hmw",
  authDomain: "emmanuel-tech-store.firebaseapp.com",
  projectId: "emmanuel-tech-store",
  storageBucket: "emmanuel-tech-store.appspot.com",
  messagingSenderId: "620671791199",
  appId: "1:620671791199:web:d5e86d00d7d16ebff7abea"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);