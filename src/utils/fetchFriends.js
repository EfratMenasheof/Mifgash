import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const fetchUserFriends = async (userId) => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const currentUser = allUsers.find(u => u.id === userId);

    if (!currentUser) {
      console.warn("Current user not found in Firestore");
      return [];
    }

    const friendIds = currentUser.friends || [];

    if (!Array.isArray(friendIds)) {
      console.warn("currentUser.friends is not an array");
      return [];
    }

    return allUsers.filter(u => friendIds.includes(u.id)); // ✅ שונה מ־u.uid ל־u.id
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  }
};