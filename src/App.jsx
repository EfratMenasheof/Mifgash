import '../App.css';
import './AppStyles.css';
import Navbar from './components/Navbar';
import logo from './assets/MIFGASH_LOGO.png';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function AppContent({ user, setUser }) {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && (
        <div className="header-bar">
          {user && (
            <>
              <img src={logo} alt="Mifgash Logo" className="top-left-logo" />
              <Navbar
                onProfileClick={() => setSelectedFriend({ id: 'user' })}
                onAlertClick={() => setShowRequestsModal(true)}
                pendingCount={0}
              />
            </>
          )}
        </div>
      )}

      <div className="main-content">
        <Routes>
          <Route path="/register" element={<CompleteRegistration setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          {!user ? (
            <Route path="*" element={<Navigate to="/login" />} />
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

      {user && !isAuthPage && (
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
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}

export default App;