import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();