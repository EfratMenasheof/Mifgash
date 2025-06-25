import { useState } from 'react';
import FriendCard from '../components/FriendCard';
import ProfileModal from '../components/ProfileModal';
import MatchPreferencesModal from '../components/MatchPreferencesModal';
import MatchSuggestionCard from '../components/MatchSuggestionCard';
import { findBestMatch } from '../utils/matchUtils';
import { useNavigate } from 'react-router-dom';
import '../AppStyles.css';

function FriendsSection({ friends }) {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [suggestedMatch, setSuggestedMatch] = useState(null);
  const navigate = useNavigate();

  const handleAcceptMatch = (match) => {
    setSuggestedMatch(null);
    alert(`Request sent to ${match.name}!`);
  };

  const handleSkipMatch = () => {
    setSuggestedMatch(null);
    setShowPreferencesModal(true);
  };

  return (
    <div className="section-box tall">
      <h2 className="section-title">YOUR CONNECTIONS</h2>

      {friends.length === 0 ? (
        <p className="empty-state">
          You don’t have any connections yet. It’s the perfect time to connect!
        </p>
      ) : (
        <div className="friends-list">
          {friends
            .filter(friend => friend.streak >= 3)
            .sort((a, b) => b.streak - a.streak)
            .slice(0, 4)
            .map((friend) => (
              <FriendCard key={friend.id} friend={friend} onClick={setSelectedFriend} />
            ))}
        </div>
      )}

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
          candidates={friends}
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
