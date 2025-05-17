import './FriendsSection.css';
import { useState } from 'react';
import { mockFriends } from '../data/FriendsData';
import FriendCard from '../components/FriendCard';
import ProfileModal from '../components/ProfileModal';
import MatchPreferencesModal from '../components/MatchPreferencesModal';
import MatchSuggestionCard from '../components/MatchSuggestionCard';
import { findBestMatch } from '../utils/matchUtils';
import { useNavigate } from 'react-router-dom';

function FriendsSection() {
  const [friends, setFriends] = useState(mockFriends); // ← במקום mockFriends יש state דינמי
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [suggestedMatch, setSuggestedMatch] = useState(null);
  const navigate = useNavigate();

  const handleMatchSubmit = (preferences) => {
    const match = findBestMatch(preferences, friends);
    setSuggestedMatch(match || null);
  };

  const handleAcceptMatch = (match) => {
    // שליחת בקשת חיבור – הוספה ל-matchRequests של הצד השני
    setSuggestedMatch(null);
    setFriends(prevFriends =>
      prevFriends.map(f =>
        f.id === match.id
          ? {
              ...f,
              matchRequests: [...(f.matchRequests || []), 'user']
            }
          : f
      )
    );
    alert(`Request sent to ${match.name}! They'll need to approve it.`);
  };

  const handleSkipMatch = () => {
    setSuggestedMatch(null);
    setShowPreferencesModal(true);
  };

  return (
    <div className="friends-section">
      <h2 className="section-title">YOUR Connections</h2>

      <div className="friends-list">
        {friends
          .filter(friend => friend.streak >= 3)
          .sort((a, b) => b.streak - a.streak)
          .slice(0, 4)
          .map((friend) => (
            <FriendCard key={friend.id} friend={friend} onClick={setSelectedFriend} />
          ))}
      </div>

      <div className="friends-buttons">
        <button
          className="friends-button"
          onClick={() => setShowPreferencesModal(true)}
        >
          Make a New Connection
        </button>
        <button
          className="friends-button"
          onClick={() => navigate('/friends')}
        >
          Show All Connections
        </button>
      </div>

      <ProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} />

      {showPreferencesModal && (
        <MatchPreferencesModal
          onClose={() => setShowPreferencesModal(false)}
          onAcceptMatch={handleAcceptMatch}
          candidates={friends}
        />
      )}

      {suggestedMatch !== null && (
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
