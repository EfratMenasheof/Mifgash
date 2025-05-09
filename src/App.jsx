import { useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import logo from './assets/mifgash_logo.png';
import MifgashCard from './MifgashCard.jsx';

function HeaderBar() {
  return (
    <div className="profile-section">
  <img
    src="https://via.placeholder.com/40"
    alt="Profile"
    className="profile-pic"
  />
  <span className="profile-name">Amian Schwartz</span>
</div>
      </div>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <HeaderBar />

      {/* כפתור ספירה לדוגמה */}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

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