import MifgashCard from '../components/MifgashCard';
import FriendsSection from '../components/FriendsSection';
import { mockFriends } from '../data/FriendsData';
import ProfileModal from '../components/ProfileModal';
import FriendsMap from '../components/FriendsMap';
import { useEffect, useState } from 'react';
import axios from 'axios';

function HomePage() {
  const [user, setUser] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const mifgashFriend = mockFriends.find(f => f.name === 'Daniel Radcliffe');

  useEffect(() => {
    axios.get('http://localhost:4000/api/current-user', { withCredentials: true })
      .then(res => {
        setUser(res.data); // יהיה null אם לא מחובר
      })
      .catch(err => {
        console.error('Error fetching user:', err);
      });
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-5">
        <h2>Please log in</h2>
        <a href="http://localhost:4000/auth/google">
          <button className="btn btn-primary">Login with Google</button>
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