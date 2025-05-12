import './FriendsSection.css';

const friends = [
  { name: 'Danielle S.', streak: 5 },
  { name: 'Zach L.', streak: 2 },
  { name: 'Ellie S.', streak: 0 },
  { name: 'James A.', streak: 0 },
];

function FriendsSection() {
  return (
    <div className="friends-section">
      <div className="friends-list">
        {friends.map((friend, index) => (
          <div key={index} className="friend-card">
            <div className="profile-pic-container">
              <div className="profile-circle"></div>
              {friend.streak > 0 && <span className="fire-emoji">🔥</span>}
            </div>
            <div className="friend-name">{friend.name}</div>
            {friend.streak > 0 && (
              <div className="streak-text">{friend.streak} Day Streak!</div>
            )}
          </div>
        ))}
      </div>

      <div className="friends-buttons">
        <button className="friends-button">Meet a new friend</button>
        <button className="friends-button">Show all friends</button>
      </div>
    </div>
  );
}

export default FriendsSection;