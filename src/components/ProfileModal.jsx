import './ProfileModal.css';
import interestsData from '../data/Interests_Categories.json';

// מיפוי של תחומי עניין -> אימוג'י מתוך הקובץ
const interestEmojiMap = {};
Object.values(interestsData).forEach(category => {
  category.items.forEach(item => {
    interestEmojiMap[item.name] = item.emoji;
  });
});

function countryToFlag(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

function ProfileModal({ friend, onClose }) {
  if (!friend) return null;

  const isAlreadyFriend = friend.isFriend === true;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={friend.image || '/Profile-pics/default.jpg'}
          onError={(e) => (e.target.src = '/Profile-pics/default.jpg')}
          alt={friend.name}
          className="profile-pic"
        />
        <h2 className="Profile-title">{friend.name}</h2>
        <p><strong>Age:</strong> {friend.age}</p>
        <p><strong>Location:</strong> {friend.location.city}, {friend.location.region}, {friend.location.country} {countryToFlag(friend.location.country === 'USA' ? 'US' : friend.location.country)}</p>
        <p><strong>Language:</strong> {friend.language}</p>
        <p><strong>Bio:</strong> {friend.bio}</p>

        <p><strong>Interests:</strong></p>
        <div className="interests-wrapper">
          {friend.interests.map((interest) => (
            <div key={interest} className="interest-tag">
              <span className="interest-emoji">{interestEmojiMap[interest] || '✨'}</span>
              {interest}
            </div>
          ))}
        </div>

        {!isAlreadyFriend && (
          <button className="send-request-button">
            Send Friend Request
          </button>
        )}

        <div className="modal-buttons">
          <button onClick={onClose} className="friends-button">Close</button>
          <button onClick={onClose} className="friends-button">Send a Message</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;