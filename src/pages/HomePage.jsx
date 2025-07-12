import { useEffect, useState } from 'react';
import MifgashCard from '../components/MifgashCard';
import FriendsSection from '../components/FriendsSection';
import ProfileModal from '../components/ProfileModal';
import FriendsMap from '../components/FriendsMap';
import ScheduleMeetingModal from '../components/ScheduleMeetingModal';
import { fetchUserFriends } from '../utils/fetchFriends';
import FriendMiniCard from '../components/FriendMiniCard';

function HomePage({ user }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const fetched = await fetchUserFriends(user.uid);
        const sorted = [...fetched].sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        );
        setFriends(sorted); // לא מגביל ל־6 כאן כי המיון מתבצע לפי סטרייק ב-FriendsSection
      } catch (err) {
        console.error("Error fetching friends in HomePage:", err);
      }
    };
    loadFriends();
  }, [user]);

  return (
    <div className="container text-center">
      <h1 className="welcome-title mt-4 mb-1">Welcome back, {user.name}!</h1>
      <h5 className="homepage-subtitle">
        Bringing people closer, one word at a time 🫱🏻‍🫲🏼
      </h5>

      {/* כפתור לפתיחת מודל */}
      <div className="my-3">
        <button className="btn btn-warning" onClick={() => setShowScheduleModal(true)}>
          📅 Schedule a Mifgash
        </button>
      </div>

      <div className="row align-items-stretch gx-5 gx-md-7">
        <div className="col-md-6 ps-md-4 d-flex flex-column justify-content-start">
          <FriendsSection friends={friends} />
        </div>

        <div className="col-md-6 pe-md-4 d-flex flex-column justify-content-start">
          <div className="mb-3">
            <MifgashCard friend={friends[0]} onClick={setSelectedFriend} />
          </div>
          <FriendsMap friends={friends} user={user} />
        </div>
      </div>

      <ProfileModal
        friend={selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />

      {showScheduleModal && (
        <ScheduleMeetingModal
          onClose={() => setShowScheduleModal(false)}
          currentUser={user}
        />
      )}
    </div>
  );
}

export default HomePage;