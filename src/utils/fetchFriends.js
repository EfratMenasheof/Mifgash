import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchUserFriends = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const friendIds = userData.friends || [];

      if (friendIds.length === 0) return [];

      const q = query(collection(db, 'users'), where('__name__', 'in', friendIds));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
};