// HomePage.jsx
import { useEffect, useState } from 'react';
import {
  getFirestore,
  doc,
  getDocs,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import FriendsSection from '../components/FriendsSection';
import MifgashCard from '../components/MifgashCard';
import FriendsMap from '../components/FriendsMap';
import ProfileModal from '../components/ProfileModal';
import CreateLessonModal from '../components/CreateLessonModal';
import { fetchUserProfile } from '../utils/fetchUserProfile';

export default function HomePage({ user }) {
  const [userProfile, setUserProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    fetchUserProfile(user.uid).then(profile => {
      if (profile) setUserProfile(profile);
    });
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);

    // כשמתעדכן השדה friends – נקרא מחדש
    const unsubscribe = onSnapshot(userRef, async snap => {
      const friendIDs = snap.data()?.friends || [];
      if (friendIDs.length === 0) {
        setFriends([]);
        return;
      }
      // הבאת כל המשתמשים
      const usersSnap = await getDocs(collection(db, 'users'));
      const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      // סינון רק החברים ומיון
      const matched = allUsers
        .filter(u => friendIDs.includes(u.id))
        .sort((a, b) => a.fullName.localeCompare(b.fullName))
        .slice(0, 6);
      setFriends(matched);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (!userProfile) {
    return <div className="text-center mt-5">Loading your profile…</div>;
  }

  return (
    <div className="container text-center">
      <h1 className="welcome-title mt-4 mb-1">
        Welcome back, {userProfile.firstName}!
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
          show
          onClose={() => setShowCreateLessonModal(false)}
          user={userProfile}
          onSave={lesson => console.log('Lesson saved:', lesson)}
        />
      )}
    </div>
  );
}
