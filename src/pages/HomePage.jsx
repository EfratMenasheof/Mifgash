import { useEffect, useState } from 'react';
import axios from 'axios';
import MifgashCard from '../components/MifgashCard';
import FriendsSection from '../components/FriendsSection';
import { mockFriends } from '../data/FriendsData';
import ProfileModal from '../components/ProfileModal';
import FriendsMap from '../components/FriendsMap';

function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const mifgashFriend = mockFriends.find(f => f.name === 'Daniel Radcliffe');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/current-user`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data); // אם אין משתמש - null
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <h2>Welcome to Mifgash!</h2>
        <a href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}>
          <button className="btn btn-primary mt-3">Login with Google</button>
        </a>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="welcome-title mt-4 mb-1">Welcome back, {user.name}!</h1>
      <h5 className="homepage-subtitle">
        Bringing people closer, one word at a time 🫱🏻‍🫲🏼
      </h5>

      <div className="row align-items-stretch gx-5 gx-md-7">
        <div className="col-md-6 ps-md-4 d-flex flex-column justify-content-start">
          <FriendsSection />
        </div>

        <div className="col-md-6 pe-md-4 d-flex flex-column justify-content-start">
          <div className="mb-3">
            <MifgashCard
              friend={mifgashFriend}
              date="May 20th, 6pm"
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