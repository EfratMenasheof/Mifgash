import { useEffect, useState } from 'react';
import MifgashCard from '../components/MifgashCard';
import FriendsSection from '../components/FriendsSection';
import ProfileModal from '../components/ProfileModal';
import FriendsMap from '../components/FriendsMap';
import { fetchUserFriends } from '../utils/fetchFriends';
import CreateLessonModal from '../components/CreateLessonModal';
import { fetchUserProfile } from '../utils/fetchUserProfile';

function HomePage({ user }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const loadData = async () => {
      const profile = await fetchUserProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
      }

      const fetchedFriends = await fetchUserFriends(user.uid);
      console.log("✅ Fetched friends in HomePage:", fetchedFriends);
      const sorted = [...fetchedFriends].sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );
      setFriends(sorted.slice(0, 6));
    };

    loadData();
  }, [user?.uid, user?.friends]);           // ← הוספנו user?.friends

  if (!userProfile) {
    return <div className="text-center mt-5">Loading your profile...</div>;
  }

  return (
    <div className="container text-center">
      <h1 className="welcome-title mt-4 mb-1">
        Welcome back, {userProfile.fullName}!
      </h1>
      <h5 className="homepage-subtitle">
        Bringing people closer, one word at a time 🫱🏻‍🫲🏼
      </h5>

      <div className="row align-items-stretch gx-5 gx-md-7">
        <div className="col-md-6 ps-md-4 d-flex flex-column justify-content-start">
          <FriendsSection friends={friends} />
        </div>

        <div className="col-md-6 pe-md-4 d-flex flex-column justify-content-start">
          <div className="mb-3">
            <MifgashCard onClick={() => setShowCreateLessonModal(true)} />
          </div>
          <FriendsMap friends={friends} user={userProfile} />
        </div>
      </div>

      <ProfileModal
        friend={selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />

      {showCreateLessonModal && (
        <CreateLessonModal
          show={showCreateLessonModal}
          onClose={() => setShowCreateLessonModal(false)}
          user={userProfile}
          onSave={savedLesson => {
            console.log("✅ Lesson saved from HomePage:", savedLesson);
          }}
        />
      )}
    </div>
  );
}

export default HomePage;
