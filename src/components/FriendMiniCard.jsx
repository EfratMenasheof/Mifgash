import './FriendMiniCard.css';

function FriendMiniCard({ friend, onClick }) {
  return (
    <div className="mini-card" onClick={() => onClick(friend)}>
      <img
        src={friend.image}
        alt={friend.name}
        className="mini-profile-pic"
        onError={(e) => (e.target.src = '/Profile-pics/default.jpg')}
      />
      <div className="mini-info">
        <h4>{friend.name}</h4>
        <p>{friend.age} years old</p>
        <p>{friend.location.city}, {friend.location.region}, {friend.location.country}</p>      
        </div>
    </div>
  );
}

export default FriendMiniCard;