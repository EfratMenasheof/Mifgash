import './App.css';
import Navbar from './components/Navbar';
import logo from './assets/mifgash_logo.png';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Pages
import HomePage from './pages/HomePage';
import FriendsPage from './pages/FriendsPage';
import LessonsPage from './pages/LessonsPage';
import AboutPage from './pages/AboutPage';

import { mockFriends } from './data/FriendsData';
import chatData from './data/chatData'; // ← נוספה השורה הזו
import ProfileModal from './components/ProfileModal';
import FloatingMessageButton from './components/FloatingMessageButton';
import ChatModal from './components/ChatModal';

function App() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const currentUser = mockFriends.find(f => f.id === 'user');

  const [chatHistory, setChatHistory] = useState(chatData); // ← שימוש בשיחות מהקובץ

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
    </Router>
  );
}

export default App;