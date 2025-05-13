import { useState } from 'react';
import './FriendsPage.css';
import { mockFriends } from '../data/FriendsData';
import FriendMiniCard from '../components/FriendMiniCard';
import ProfileModal from '../components/ProfileModal';

function FriendsPage() {
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [error, setError] = useState('');

  const handleAgeSearch = () => {
    setShowAgeFilter(true);
    setFilteredFriends([]); // מנקה תוצאות קודמות
    setError('');
  };

  const handleFilter = () => {
    const min = parseInt(ageMin);
    const max = parseInt(ageMax);

    if (isNaN(min) || isNaN(max) || min < 18 || max > 99 || min > max) {
      setError('Please enter a valid age range between 18 and 99.');
      return;
    }

    const results = mockFriends.filter(friend =>
      friend.age >= min &&
      friend.age <= max &&
      (
        (friend.location === 'Israel' && friend.language === 'English') ||
        (friend.location !== 'Israel' && friend.language === 'Hebrew')
      )
    );

    if (results.length === 0) {
      setError('No matches found. Try a different age range!');
      return;
    }

    setFilteredFriends(results);
    setError('');
    setShowAgeFilter(false);
  };

  return (
    <div className="friends-page">
      <button className="new-friend-button" onClick={handleAgeSearch}>
        Meet a new friend
      </button>

      {showAgeFilter && (
        <div className="age-filter-modal">
          <p>Choose age range (between 18–99):</p>
          <div className="age-inputs">
            <input
              type="number"
              placeholder="Min"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              min={18}
              max={99}
            />
            <input
              type="number"
              placeholder="Max"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              min={18}
              max={99}
            />
            <button className="filter-button" onClick={handleFilter}>Show Matches</button>
          </div>
          <p className="age-range-info">You can search only between ages 18 and 99.</p>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      <div className="search-results">
        {filteredFriends.map(friend => (
          <FriendMiniCard key={friend.id} friend={friend} onClick={setSelectedFriend} />
        ))}
      </div>

      <ProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} />
    </div>
  );
}

export default FriendsPage;
