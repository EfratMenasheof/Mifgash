import './Navbar.css';
import logo from '../assets/MIFGASH_LOGO.png';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Navbar({ onProfileClick, onAlertClick, pendingCount }) {
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="header-bar">
      <img src={logo} alt="Logo" className="top-left-logo" />

      <nav className="navbar">
        <ul className="nav-list">
          <li>
            <Link
              to="/home"
              className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/friends"
              className={`nav-link ${location.pathname === '/friends' ? 'active' : ''}`}
            >
              Connections
            </Link>
          </li>
          <li>
            <Link
              to="/lessons"
              className={`nav-link ${location.pathname === '/lessons' ? 'active' : ''}`}
            >
              Mifgashim
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
          </li>
        </ul>
      </nav>

      <div className="profile-section">
        <span className="profile-name" onClick={onProfileClick}>
          {userData
            ? userData.fullName ||
              [userData.firstName, userData.middleName, userData.lastName]
                .filter(Boolean)
                .join(' ')
            : 'Loading...'}
        </span>
        <img
          src={userData?.profileImage || '/Profile-pics/user.jpg'}
          alt="Profile"
          className="user-profile-pic"
          onClick={onProfileClick}
        />

        <div
          className={`notification-bell ${pendingCount > 0 ? 'has-alert' : ''}`}
          onClick={onAlertClick}
        >
          🔔
          {pendingCount > 0 && (
            <span className="notification-count">{pendingCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;