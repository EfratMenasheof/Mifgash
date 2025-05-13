import './FriendsSection.css';
import { useState } from 'react';
import { mockFriends } from '../data/FriendsData';
import FriendCard from '../components/FriendCard';
import ProfileModal from '../components/ProfileModal';

function FriendsSection() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="friends-section">
      <h2 className="leadconnections-title">YOUR Connections</h2>
      <div className="friends-list">
        {mockFriends
          .filter(friend => friend.streak >= 3)       // רק סטרייק מ-3 ומעלה
          .sort((a, b) => b.streak - a.streak)        // מיון יורד לפי streak
          .slice(0, 4)                                 // רק 4 ראשונים
          .map((friend) => (
            <FriendCard key={friend.id} friend={friend} onClick={setSelectedFriend} />
        ))}
      </div>

      <div className="friends-buttons">
        <button className="friends-button">Make a New Connection</button>
        <button className="friends-button">Show All Connections</button>
      </div>

      <ProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} />
    </div>
  );
}

export default FriendsSection;
