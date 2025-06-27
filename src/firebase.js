// Import firebase core
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
  getDoc,
  setDoc
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBRxrm8EFXpuVO91wdJ_zfEOzC9rZJsJ8g",
  authDomain: "mifgash-2c01b.firebaseapp.com",
  projectId: "mifgash-2c01b",
  storageBucket: "mifgash-2c01b.firebasestorage.app",
  messagingSenderId: "984729209643",
  appId: "1:984729209643:web:cf620a6d22345b4bdd536e",
  measurementId: "G-FJHPCJX9ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ NEW: Send a connection request between users
export async function sendConnectionRequest(senderId, receiverId) {
  const senderRef = doc(db, "users", senderId);
  const receiverRef = doc(db, "users", receiverId);

  await Promise.all([
    updateDoc(senderRef, {
      sentRequests: arrayUnion(receiverId),
    }),
    updateDoc(receiverRef, {
      receivedRequests: arrayUnion(senderId),
    }),
  ]);
}

// Export
export { auth, provider, db, storage };
