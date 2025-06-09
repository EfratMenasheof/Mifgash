import '../App.css';
import Navbar from './components/Navbar';
import logo from './assets/MIFGASH_LOGO.png';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

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
import IncomingRequestsModal from './components/IncomingRequestsModal'; // ← חדש

function App() {
  const [friends, setFriends] = useState(mockFriends); // ← ניהול state דינמי
  const currentUser = friends.find(f => f.id === 'user');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [chatHistory, setChatHistory] = useState(chatData);

  const handleProfileClick = () => {
    setSelectedFriend(currentUser);
  };

  const handleCloseModal = () => {
    setSelectedFriend(null);
  };

  const handleOpenMessages = () => {
    setIsChatOpen(true);
    setHasNewMessage(false);
  };

  const pendingCount = friends.filter(f => f.matchRequests?.includes('user')).length;

  return (
    <Router>
      <div className="header-bar">
        <img src={logo} alt="Logo" className="top-left-logo" />
        <Navbar
          onProfileClick={handleProfileClick}
          onAlertClick={() => setShowRequestsModal(true)}
          pendingCount={pendingCount}
        />
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

      <FloatingMessageButton
        onClick={handleOpenMessages}
        hasNewMessage={hasNewMessage}
      />

      {selectedFriend && (
        <ProfileModal friend={selectedFriend} onClose={handleCloseModal} />
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
