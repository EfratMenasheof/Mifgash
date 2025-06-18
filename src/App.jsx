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
import Login from './pages/Login';
import CompleteRegistration from './pages/CompleteRegistration';

// Components
import ProfileModal from './components/ProfileModal';
import FloatingMessageButton from './components/FloatingMessageButton';
import ChatModal from './components/ChatModal';
import IncomingRequestsModal from './components/IncomingRequestsModal';

function App() {
  const [user, setUser] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  return (
    <Router>
      <div className="header-bar">
        {user && (
          <>
            <img src={logo} alt="Mifgash Logo" className="top-left-logo" />
            <Navbar
              onProfileClick={() => setSelectedFriend(user)}
              onAlertClick={() => setShowRequestsModal(true)}
              pendingCount={0}
            />
          </>
        )}
      </div>

      <div className="main-content">
        <Routes>
          <Route path="/complete-registration" element={<CompleteRegistration setUser={setUser} />} />
          {!user ? (
            <Route path="*" element={<Login setUser={setUser} />} />
          ) : (
            <>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage user={user} />} />
              <Route path="/friends" element={<FriendsPage user={user} />} />
              <Route path="/lessons" element={<LessonsPage user={user} />} />
              <Route path="/about" element={<AboutPage />} />
            </>
          )}
        </Routes>
      </div>

      {user && (
        <>
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
              chatHistory={[]}
              setChatHistory={() => {}}
            />
          )}

          {showRequestsModal && (
            <IncomingRequestsModal
              friends={[]}
              onAccept={() => {}}
              onClose={() => setShowRequestsModal(false)}
            />
          )}
        </>
      )}
    </Router>
  );
}

export default App;
