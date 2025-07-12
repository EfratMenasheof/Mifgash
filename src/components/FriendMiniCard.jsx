import './FriendMiniCard.css';

function FriendMiniCard({ friend, onClick }) {
  const getAge = (birthDateStr) => {
    if (!birthDateStr) return null;
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = getAge(friend.birthDate);
  const location = `${friend.location?.city || ''}, ${friend.location?.region || ''}, ${friend.location?.country || ''}`.replace(/, ,/g, ',').replace(/^, | ,$/g, '').trim();

  return (
    <div className="mini-card" onClick={() => onClick(friend)}>
      <img
        src={friend.profileImage || '/src/assets/defaultAvatar.png'}
        alt={friend.fullName || 'User'}
        className="mini-profile-pic"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/src/assets/defaultAvatar.png';
        }}
      />
      <div className="mini-info">
        <h4>{friend.fullName || 'Unnamed'}</h4>
        {age !== null && <p>{age} years old</p>}
        {location && <p>{location}</p>}
      </div>
    </div>
  );
}

export default FriendMiniCard;