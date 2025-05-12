import './App.css';
import Navbar from './components/Navbar';
import logo from './assets/mifgash_logo.png';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import FriendsPage from './pages/FriendsPage';
import LessonsPage from './pages/LessonsPage';
import AboutPage from './pages/AboutPage';

// קומפוננטת HeaderBar: לוגו, ניווט ופרופיל
function HeaderBar() {
  return (
    <div className="header-bar">
      <img src={logo} alt="Logo" className="top-left-logo" />
      <Navbar />
      <div className="profile-section">
        <span className="profile-name">Amian Schwartz</span>
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="profile-pic"
        />
      </div>
    </div>
  );
}

// אפליקציה עם ראוטינג
function App() {
  return (
    <Router>
      <HeaderBar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
