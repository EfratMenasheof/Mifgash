import './ProfileModal.css';
import interestsData from '../data/Interests_Categories.json';
import { mockFriends } from '../data/FriendsData';

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

  const isCurrentUser = friend.id === 'user';
  const isAlreadyFriend = friend.isFriend === true;

  const currentUser = mockFriends.find(f => f.id === 'user');
  const currentUserInterests = currentUser?.interests || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✕</button>

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
          {friend.interests.map((interest) => {
            const isShared = currentUserInterests.includes(interest);
            return (
              <div key={interest} className={`interest-tag ${isShared ? 'shared-interest' : ''}`}>
                <span className="interest-emoji">{interestEmojiMap[interest] || '✨'}</span>
                {interest}
              </div>
            );
          })}
        </div>

        {!isCurrentUser && !isAlreadyFriend && (
          <button className="send-request-button">
            Send Friend Request
          </button>
        )}

        {isCurrentUser && (
          <button className="friends-button" style={{ marginTop: '16px' }}>
            Edit Profile
          </button>
        )}

        <div className="modal-buttons">
          {!isCurrentUser && (
            <button onClick={onClose} className="friends-button">Send a Message</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
