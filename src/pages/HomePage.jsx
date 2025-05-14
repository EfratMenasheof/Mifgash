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
    <div className="container">
      {/* משפט Welcome */}
      <h1 className="welcome-title mt-4 mb-5">Welcome back, Maya!</h1>

      <div className="row align-items-stretch gx-5 gx-md-7">
        {/* שמאל – חברים */}
        <div className="col-md-6 ps-md-4 d-flex flex-column justify-content-start">
          <FriendsSection />
        </div>

        {/* ימין – מפגש מעל מפה */}
        <div className="col-md-6 pe-md-4 d-flex flex-column justify-content-start">
          <div className="mb-3">
            <MifgashCard
              friend={mifgashFriend}
              date="July 17th, 4pm"
              location="Zoom call"
              topic="You’ll teach Hebrew!"
              onClick={setSelectedFriend}
            />
          </div>
          <FriendsMap />
        </div>
      </div>

      <ProfileModal
        friend={selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />
    </div>
  );
}

export default HomePage;
