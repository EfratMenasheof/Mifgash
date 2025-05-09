import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
      <li><a href="#home" className="nav-link active">Home</a></li>        <li><a href="#friends" className="nav-link">Friends</a></li>
        <li><a href="#lessons" className="nav-link">Lessons</a></li>
        <li><a href="#about" className="nav-link">About</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
