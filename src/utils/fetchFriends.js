import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Fetches a user's friends from Firestore
 * @param {string} userId - The UID of the current user
 * @returns {Promise<Array>} - Array of friend user objects
 */
export const fetchUserFriends = async (userId) => {
  try {
    // Get all users
    const snapshot = await getDocs(collection(db, "users"));
    const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Find the current user in the list
    const currentUser = allUsers.find(u => u.uid === userId);

    if (!currentUser) {
      console.warn("Current user not found in Firestore");
      return [];
    }

    const friendIds = currentUser.friends || [];

    if (!Array.isArray(friendIds)) {
      console.warn("currentUser.friends is not an array");
      return [];
    }

    // Return only users whose UID is in the friendIds array
    return allUsers.filter(u => friendIds.includes(u.uid));
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  }
};