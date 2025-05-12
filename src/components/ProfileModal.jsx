import './ProfileModal.css';

function ProfileModal({ friend, onClose }) {
  if (!friend) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={friend.image || '/Profile-pics/default.jpg'}
          onError={(e) => (e.target.src = '/Profile-pics/default.jpg')}
          alt={friend.name}
          className="profile-pic"
        />
        <h2>{friend.name}</h2>
        <p><strong>Age:</strong> {friend.age}</p>
        <p><strong>Location:</strong> {friend.location}</p>
        <p><strong>Language:</strong> {friend.language}</p>
        <p><strong>Bio:</strong> {friend.bio}</p>
        <p><strong>Interests:</strong> {friend.interests.join(', ')}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ProfileModal;