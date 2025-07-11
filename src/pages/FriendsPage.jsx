import "../components/FriendMiniCard.css";
import "./FriendsPage.css";
import FriendCardStyled from "../components/FriendCardStyled";
import { useEffect, useState } from "react";
import ProfileModal from "../components/ProfileModal";
import MatchPreferencesModal from "../components/MatchPreferencesModal";
import { findBestMatch } from "../utils/matchUtils";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function FriendsPage() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      // שלב 1: הבאת המידע של המשתמש הנוכחי
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const friendIDs = userData.friends || [];

        // שלב 2: הבאת כל המשתמשים במסד הנתונים
        const usersCollection = await getDocs(collection(db, "users"));
        const allUsers = usersCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // שלב 3: סינון רק את החברים של המשתמש
        const matchedFriends = allUsers.filter(user => friendIDs.includes(user.id));

        setFriends(matchedFriends);
      }
    };

    fetchFriends();
  }, []);

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleCloseModal = () => {
    setSelectedFriend(null);
  };

  return (
    <div className="container mt-2">
      <h1 className="leadconnections-title">YOUR CONNECTIONS</h1>
      <h5 className="connections-subtitle">
        One People. Many Places. Shared Heart. 🌍
      </h5>

      <div className="friends-section">
        <div className="text-start mb-0 fw-bold">
          You have {friends.length} connections
        </div>

        <div className="friends-grid-container">
          <div className="friends-grid">
            {friends.map(friend => (
              <FriendCardStyled
                key={friend.id}
                friend={friend}
                onClick={handleFriendClick}
              />
            ))}
          </div>
        </div>

        <div className="friends-buttons mt-4">
          <button
            className="friends-button"
            onClick={() => setShowMatchModal(true)}
          >
            Make a New Connection
          </button>
        </div>
      </div>

      {selectedFriend && (
        <ProfileModal friend={selectedFriend} onClose={handleCloseModal} />
      )}

      {showMatchModal && (
        <MatchPreferencesModal
          onClose={() => setShowMatchModal(false)}
          onAcceptMatch={(match) => {
            alert(`Request sent to ${match.fullName}. They'll need to approve it.`);
            setShowMatchModal(false);
          }}
          candidates={friends}
        />
      )}
    </div>
  );
}

export default FriendsPage;