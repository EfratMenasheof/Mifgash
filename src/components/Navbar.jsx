import './Navbar.css';
import logo from '../assets/mifgash_logo.png';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ onProfileClick }) {
  const location = useLocation();

  return (
    <div className="header-bar">
      <img src={logo} alt="Logo" className="top-left-logo" />

      <nav className="navbar">
        <ul className="nav-list">
          <li>
            <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>Home</Link>
          </li>
          <li>
            <Link to="/friends" className={`nav-link ${location.pathname === '/friends' ? 'active' : ''}`}>Connections</Link>
          </li>
          <li>
            <Link to="/lessons" className={`nav-link ${location.pathname === '/lessons' ? 'active' : ''}`}>Lessons</Link>
          </li>
          <li>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          </li>
        </ul>
      </nav>

      <div className="profile-section">
        <span className="profile-name" onClick={onProfileClick}>Maya Chen</span>
        <img
          src="/Profile-pics/user.jpg"
          alt="Profile"
          className="user-profile-pic"
          onClick={onProfileClick}
        />
      </div>
    </div>
  );
}

export default Navbar;