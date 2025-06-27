import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import MifgashCard from '../components/MifgashCard';
import FriendsSection from '../components/FriendsSection';
import ProfileModal from '../components/ProfileModal';
import FriendsMap from '../components/FriendsMap';

function HomePage({ user }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('isFriend', '==', true)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFriends(fetched);
      } catch (err) {
        console.error('Failed to load friends:', err);
      }
    };
    fetchFriends();
  }, []);

  return (
    <div className="container text-center">
      <h1 className="welcome-title mt-4 mb-1">Welcome back, {user.name}!</h1>
      <h5 className="homepage-subtitle">
        Bringing people closer, one word at a time 🫱🏻‍🫲🏼
      </h5>

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
    </div>
  );
}

export default HomePage;
