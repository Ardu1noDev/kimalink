// firestoreUtils.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// 🔧 Substitua pelos seus dados:
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
const db = getFirestore(app);

export async function salvarUsuario(usuario) {
  const docRef = await addDoc(collection(db, "usuarios"), usuario);
  return docRef.id;
}
