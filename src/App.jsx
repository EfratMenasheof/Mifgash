import { useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import logo from './assets/mifgash_logo.png';
import MifgashCard from './MifgashCard.jsx';

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

// קומפוננטת App הראשית
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <HeaderBar />
      {/* בלוק של מיפגש דינמי */}
      <MifgashCard
        name="Danielle S."
        date="July 17th, 4pm"
        location="Zoom call"
        topic="You’ll learn English!"
      />
    </>
  );
}

export default App;
