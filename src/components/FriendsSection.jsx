import './FriendsSection.css';
import { useState } from 'react';
import { mockFriends } from '../data/FriendsData';
import FriendCard from '../components/FriendCard';
import ProfileModal from '../components/ProfileModal';
import { useNavigate } from 'react-router-dom';

function FriendsSection() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const navigate = useNavigate(); // ← הוספת השורה הזו

  return (
    <div className="friends-section">
      <h2 className="section-title">YOUR Connections</h2>

      <div className="friends-list">
        {mockFriends
          .filter(friend => friend.streak >= 3)
          .sort((a, b) => b.streak - a.streak)
          .slice(0, 4)
          .map((friend) => (
            <FriendCard key={friend.id} friend={friend} onClick={setSelectedFriend} />
        ))}
      </div>

      <div className="friends-buttons">
        <button className="friends-button">Make a New Connection</button>
        <button
          className="friends-button"
          onClick={() => navigate('/friends')}
        >
          Show All Connections
        </button>
      </div>

      <ProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} />
    </div>
  );
}

export default FriendsSection;