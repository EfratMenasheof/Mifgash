import '../App.css';
import './AppStyles.css';
import Navbar from './components/Navbar';
import logo from './assets/MIFGASH_LOGO.png';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';               // ← חדש
import { auth, db } from './firebase';
import { getDoc } from 'firebase/firestore';

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
  const [userDoc, setUserDoc] = useState(null);                   // ← חדש
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [incomingRequests, setIncomingRequests] = useState([]);

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // 1️⃣ live‐listener על מסמך המשתמש
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      snap => {
        if (snap.exists()) {
          setUserDoc({ uid: snap.id, ...snap.data() });
        }
      },
      err => console.error(err)
    );
    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.uid) return;
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const data = userSnap.data() || {};
      const receivedIds = data.receivedRequests || [];
      setPendingCount(receivedIds.length);
      const requestDocs = await Promise.all(receivedIds.map(id => getDoc(doc(db, 'users', id))));
      const requestUsers = requestDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
      setIncomingRequests(requestUsers);
    };
    fetchRequests();
  }, [showRequestsModal, user]);

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
                pendingCount={pendingCount}
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
              <Route path="/home" element={<HomePage user={userDoc} />} />           {/* ← pass userDoc */}
              <Route path="/friends" element={<FriendsPage user={userDoc} />} />      {/* ← pass userDoc */}
              <Route path="/lessons" element={<LessonsPage user={userDoc} />} />      {/* ← pass userDoc */}
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
            <ChatModal onClose={() => setIsChatOpen(false)} chatHistory={[]} setChatHistory={() => {}} />
          )}

          {showRequestsModal && (
            <IncomingRequestsModal
              onClose={() => setShowRequestsModal(false)}
              onOpenProfile={user => {
                setSelectedFriend(user);
                setShowRequestsModal(false);
              }}
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
