import '../App.css';
import Navbar from './components/Navbar';
import logo from './assets/MIFGASH_LOGO.png';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Pages
import HomePage from './pages/HomePage';
import FriendsPage from './pages/FriendsPage';
import LessonsPage from './pages/LessonsPage';
import AboutPage from './pages/AboutPage';

import { mockFriends } from './data/FriendsData';
import chatData from './data/chatData';
import ProfileModal from './components/ProfileModal';
import FloatingMessageButton from './components/FloatingMessageButton';
import ChatModal from './components/ChatModal';
import IncomingRequestsModal from './components/IncomingRequestsModal';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState(mockFriends);
  const currentUser = friends.find(f => f.id === 'user');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [chatHistory, setChatHistory] = useState(chatData);

  useEffect(() => {
    // מחייב כל משתמש להתחבר מחדש בכל טעינה
    setUser(null);
    setLoading(false);
  }, []);

  const pendingCount = friends.filter(f => f.matchRequests?.includes('user')).length;

  if (loading) return null;

  if (!user) {
    // הצגת כפתור Login תמידית
    return (
      <div className="container text-center mt-5">
        <h2>Welcome to Mifgash!</h2>
        <button
          className="btn btn-primary mt-3"
          onClick={() =>
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`
          }
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="header-bar">
        <img src={logo} alt="Logo" className="top-left-logo" />
        <Navbar
          onProfileClick={() => setSelectedFriend(currentUser)}
          onAlertClick={() => setShowRequestsModal(true)}
          pendingCount={pendingCount}
        />
      </div>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage user={user} />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>

      <FloatingMessageButton
        onClick={() => {
          setIsChatOpen(true);
          setHasNewMessage(false);
        }}
        hasNewMessage={hasNewMessage}
      />

      {selectedFriend && (
        <ProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} />
      )}

      {isChatOpen && (
        <ChatModal
          onClose={() => setIsChatOpen(false)}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
        />
      )}

      {showRequestsModal && (
        <IncomingRequestsModal
          friends={friends}
          onAccept={(friend) => {
            setFriends(prev =>
              prev.map(f => {
                if (f.id === friend.id) {
                  return {
                    ...f,
                    isFriend: true,
                    matchRequests: f.matchRequests.filter(id => id !== 'user')
                  };
                }
                if (f.id === 'user') {
                  return {
                    ...f,
                    isFriend: true
                  };
                }
                return f;
              })
            );
            setShowRequestsModal(false);
          }}
          onClose={() => setShowRequestsModal(false)}
        />
      )}
    </Router>
  );
}

export default App;