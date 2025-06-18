import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRxrm8EFXpuVO91wdJ_zfEOzC9rZJsJ8g",
  authDomain: "mifgash-2c01b.firebaseapp.com",
  projectId: "mifgash-2c01b",
  storageBucket: "mifgash-2c01b.firebasestorage.app",
  messagingSenderId: "984729209643",
  appId: "1:984729209643:web:cf620a6d22345b4bdd536e",
  measurementId: "G-FJHPCJX9ZV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, db };
