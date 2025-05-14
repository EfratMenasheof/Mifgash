import './App.css';
import Navbar from './components/Navbar';
import logo from './assets/mifgash_logo.png';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

// Pages
import HomePage from './pages/HomePage';
import FriendsPage from './pages/FriendsPage';
import LessonsPage from './pages/LessonsPage';
import AboutPage from './pages/AboutPage';
import { mockFriends } from './data/FriendsData';
import ProfileModal from './components/ProfileModal';

// אפליקציה עם ראוטינג
function App() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const currentUser = mockFriends.find(f => f.id === 'user');

  const handleProfileClick = () => {
    setSelectedFriend(currentUser);
  };

  const handleCloseModal = () => {
    setSelectedFriend(null);
  };

  return (
    <Router>
      <div className="header-bar">
        <img src={logo} alt="Logo" className="top-left-logo" />
        <Navbar onProfileClick={handleProfileClick} />
      </div>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>

      {selectedFriend && (
        <ProfileModal friend={selectedFriend} onClose={handleCloseModal} />
      )}
    </Router>
  );
}

export default App;