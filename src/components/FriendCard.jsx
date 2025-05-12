import './FriendCard.css';

function FriendCard({ friend, onClick }) {
  return (
    <div className="friend-card" onClick={() => onClick(friend)}>
      <div className="profile-pic-container">
        <img
          src={friend.image || `/Profile-pics/default.jpg`}
          onError={(e) => (e.target.src = '/Profile-pics/default.jpg')}
          alt={friend.name}
          className="profile-pic"
        />
        {friend.streak >= 3 && <span className="fire-emoji">🔥</span>}
      </div>
      <div className="friend-name">{friend.name}</div>
      {friend.streak >= 3 && (
        <div className="streak-text">{friend.streak} Weekly Streak!</div>
      )}
    </div>
  );
}

export default FriendCard;