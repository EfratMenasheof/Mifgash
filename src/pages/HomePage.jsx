import { useState } from 'react';
import MifgashCard from '../components/MifgashCard';
import FriendsSection from '../components/FriendsSection';
import { mockFriends } from '../data/FriendsData';
import ProfileModal from '../components/ProfileModal';
import FriendsMap from '../components/FriendsMap';

function HomePage() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const mifgashFriend = mockFriends.find(f => f.name === 'Daniel Radcliffe');

  return (
    <div className="main-layout">
      <div className="left-side">
        <MifgashCard
          friend={mifgashFriend}
          date="July 17th, 4pm"
          location="Zoom call"
          topic="You’ll teach Hebrew!"
          onClick={setSelectedFriend}
        />
        <FriendsSection />
      </div>

      <div className="right-side">
        <FriendsMap />
      </div>

      <ProfileModal
        friend={selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />
    </div>
  );
}

export default HomePage;