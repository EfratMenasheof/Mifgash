import { useState, useEffect } from 'react';
import FriendMiniCard from '../components/FriendMiniCard';
import ProfileModal from '../components/ProfileModal';
import MatchPreferencesModal from '../components/MatchPreferencesModal';
import MatchSuggestionCard from '../components/MatchSuggestionCard';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import '../AppStyles.css';

function FriendsSection({ friends }) {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [suggestedMatch, setSuggestedMatch] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🧡 Friends received by FriendsSection:", friends);
  }, [friends]);

  const handleAcceptMatch = async (match) => {
    setSuggestedMatch(null);
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || !match?.id) return;

    try {
      const senderRef = doc(db, 'users', currentUserId);
      const receiverRef = doc(db, 'users', match.id);
      await updateDoc(senderRef, {
        sentRequests: arrayUnion(match.id),
      });
      await updateDoc(receiverRef, {
        receivedRequests: arrayUnion(currentUserId),
      });
      alert(`Request sent to ${match.fullName}!`);
    } catch (error) {
      console.error('Error sending match request:', error);
      alert('Something went wrong while sending the request.');
    }
  };

  const handleSkipMatch = () => {
    setSuggestedMatch(null);
    setShowPreferencesModal(true);
  };

  return (
    <div className="section-box tall">
      <h2 className="section-title">YOUR CONNECTIONS</h2>

      <div className="friends-list">
        {Array.isArray(friends) && friends.length > 0 ? (
          friends
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
            .slice(0, 9)
            .map((friend) => (
              <FriendMiniCard
                key={friend.id}
                friend={friend}
                onClick={() => setSelectedFriend(friend)}
              />
            ))
        ) : (
          <p className="empty-state">
            You don’t have any connections yet. It’s the perfect time to connect!
          </p>
        )}
      </div>

      <div className="button-row-bottom">
        <button className="btn-orange" onClick={() => setShowPreferencesModal(true)}>
          Make a New Connection
        </button>
        <button className="btn-orange" onClick={() => navigate('/friends')}>
          Show All Connections
        </button>
      </div>

      <ProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} />

      {showPreferencesModal && (
        <MatchPreferencesModal
          onClose={() => setShowPreferencesModal(false)}
          onAcceptMatch={handleAcceptMatch}
        />
      )}

      {suggestedMatch && (
        <MatchSuggestionCard
          match={suggestedMatch}
          onAccept={handleAcceptMatch}
          onSkip={handleSkipMatch}
        />
      )}
    </div>
  );
}

export default FriendsSection;