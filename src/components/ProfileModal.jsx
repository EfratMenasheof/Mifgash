import './ProfileModal.css';

function ProfileModal({ friend, onClose }) {
  if (!friend) return null;

  // בדיקה אם המשתמש כבר חבר קיים (IDs 1–5 נחשבים כחברים)
  const isAlreadyFriend = friend.id <= 5;

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

        {!isAlreadyFriend && (
          <button className="send-request-button">
            Send Friend Request
          </button>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ProfileModal;
