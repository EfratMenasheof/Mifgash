import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const fetchUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn("❌ No such user in Firestore!");
      return null;
    }
  } catch (error) {
    console.error("🔥 Error fetching user profile:", error);
    return null;
  }
};
