// src/components/Navbar.jsx
import './Navbar.css';
import logo from '../assets/MIFGASH_LOGO.png';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Navbar({ onProfileClick, onAlertClick, pendingCount }) {
  const location = useLocation();
  const [uid, setUid] = useState(null);
  const [userData, setUserData] = useState(null);

  // 1) Track authentication state to get the current UID
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
        setUserData(null);
      }
    });
    return unsubAuth;
  }, []);

  // 2) When we have a UID, subscribe in real‐time to the user document
  useEffect(() => {
    if (!uid) return;
    const docRef = doc(db, 'users', uid);
    const unsubSnap = onSnapshot(docRef, snap => {
      if (snap.exists()) {
        console.log('Navbar snapshot:', snap.data());
        setUserData(snap.data());
      }
    });
    return unsubSnap;
  }, [uid]);

  // 3) Build display name and image URL (with cache‐buster)
  const displayName = userData
    ? userData.fullName ||
      [userData.firstName, userData.middleName, userData.lastName]
        .filter(Boolean)
        .join(' ')
    : 'Loading…';

  const profileImgUrl = userData?.profileImage
    ? `${userData.profileImage}?t=${Date.now()}`
    : '/Profile-pics/user.jpg';

  return (
    <div className="header-bar">
      <img src={logo} alt="Logo" className="top-left-logo" />

      <nav className="navbar">
        <ul className="nav-list">
          <li>
            <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/friends" className={`nav-link ${location.pathname === '/friends' ? 'active' : ''}`}>
              Connections
            </Link>
          </li>
          <li>
            <Link to="/lessons" className={`nav-link ${location.pathname === '/lessons' ? 'active' : ''}`}>
              Mifgashim
            </Link>
          </li>
          <li>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
              About
            </Link>
          </li>
        </ul>
      </nav>

      <div className="profile-section">
        <span className="profile-name" onClick={onProfileClick}>
          {displayName}
        </span>
        <img
          src={profileImgUrl}
          alt="Profile"
          className="user-profile-pic"
          onClick={onProfileClick}
        />
        <div
          className={`notification-bell ${pendingCount > 0 ? 'has-alert' : ''}`}
          onClick={onAlertClick}
        >
          🔔
          {pendingCount > 0 && <span className="notification-count">{pendingCount}</span>}
        </div>
      </div>
    </div>
  );
}
