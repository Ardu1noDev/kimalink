import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAV5c1E6ziB332jHkcW5aaqBms1IYb0jE",
  authDomain: "agroapp-fa01d.firebaseapp.com",
  projectId: "agroapp-fa01d",
  storageBucket: "agroapp-fa01d.appspot.com",
  messagingSenderId: "51084283387",
  appId: "1:51084283387:web:c93490bc1995acb0724f5e",
  measurementId: "G-VP2KXJ68XE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById('login-btn');
  const googleLoginBtn = document.getElementById('google-login');

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login bem-sucedido:", userCredential.user);
        window.location.href = "products.html";
      } catch (error) {
        console.error("Erro ao fazer login:", error);
      }
    });
  }

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        console.log("Login com Google bem-sucedido:", result.user);
        window.location.href = "products.html";
      } catch (error) {
        console.error("Erro ao fazer login com Google:", error);
      }
    });
  }
});