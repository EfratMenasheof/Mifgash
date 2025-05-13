import { useState } from 'react';
import MifgashCard from '../components/MifgashCard';
import FriendsSection from '../components/FriendsSection';
import { mockFriends } from '../data/FriendsData'; // או איפה שהדאטה נמצא
import ProfileModal from '../components/ProfileModal';

function HomePage() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  const mifgashFriend = mockFriends.find(f => f.name === 'Daniel Radcliffe');

  return (
    <div className="homepage-container">
      <div className="side-box">
        <MifgashCard
          friend={mifgashFriend}
          date="July 17th, 4pm"
          location="Zoom call"
          topic="You’ll teach Hebrew!"
          onClick={setSelectedFriend}
        />
      </div>
      <div className="side-box">
        <FriendsSection />
      </div>

      <ProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} />
    </div>
  );
}

export default HomePage;
