import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
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
            Friends
          </Link>
        </li>
        <li>
          <Link
            to="/lessons"
            className={`nav-link ${location.pathname === '/lessons' ? 'active' : ''}`}
          >
            Lessons
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
  );
}

export default Navbar;
