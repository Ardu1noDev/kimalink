// firebase.js
// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDAV5c1E6ziB332jHkcW5aaqBms1IYb0jE",
  authDomain: "agroapp-fa01d.firebaseapp.com",
  projectId: "agroapp-fa01d",
  storageBucket: "agroapp-fa01d.appspot.com",
  messagingSenderId: "51084283387",
  appId: "1:51084283387:web:c93490bc1995acb0724f5e",
  measurementId: "G-VP2KXJ68XE"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Exportações
export { auth, db, provider };
