import './ProfileModal.css';
import interestsData from '../data/Interests_Categories.json';
import { mockFriends } from '../data/FriendsData';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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
  const [currentUserData, setCurrentUserData] = useState(null);
  const [authUserData, setAuthUserData] = useState(null);
  const isCurrentUser = friend?.id === 'user';
  const isAlreadyFriend = friend?.isFriend === true;
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (isCurrentUser && auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const formatted = {
            id: 'user',
            name:
              data.fullName ||
              [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ') ||
              'Unnamed',
            image: data.profileImage || '/Profile-pics/default.jpg',
            age: calculateAge(data.birthDate),
            location: {
              city: data.city || '',
              region: data.state || '',
              country: data.country || '',
            },
            language: data.learningGoal,
            bio: data.about,
            interests: data.interests || [],
            isFriend: false,
          };
          setCurrentUserData(formatted);
        }
      }
    };

    fetchCurrentUser();
  }, [isCurrentUser]);

  useEffect(() => {
    const fetchAuthUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAuthUserData(docSnap.data());
        }
      }
    };

    fetchAuthUserData();
  }, []);

  const displayUser = isCurrentUser ? currentUserData : friend;
  if (!displayUser) return null;

  const location = displayUser.location || { city: '', region: '', country: '' };
  const interests = displayUser.interests || [];

  let currentUserInterests = [];
  if (isCurrentUser) {
    currentUserInterests = displayUser?.interests || [];
  } else {
    currentUserInterests = authUserData?.interests || [];
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✕</button>

        <img
          src={displayUser.image || '/Profile-pics/default.jpg'}
          onError={(e) => (e.target.src = '/Profile-pics/default.jpg')}
          alt={displayUser.name}
          className="profile-pic"
        />
        <h2 className="Profile-title">{displayUser.name}</h2>

        {displayUser.age && <p><strong>Age:</strong> {displayUser.age}</p>}

        {(location.city || location.region || location.country) && (
          <p>
            <strong>Location:</strong> {location.city}, {location.region}, {location.country}{" "}
            {location.country && countryToFlag(location.country === 'USA' ? 'US' : location.country)}
          </p>
        )}

        {displayUser.language && (
          <p><strong>Speaks fluently:</strong> {displayUser.language === 'English' ? 'Hebrew' : 'English'}</p>
        )}

        {displayUser.bio && (
          <p><strong>Bio:</strong> {displayUser.bio}</p>
        )}

        <p><strong>Interests:</strong></p>
        <div className="interests-wrapper">
          {interests.map((interest) => {
            const isShared = currentUserInterests.includes(interest);
            return (
              <div key={interest} className={`interest-tag ${isShared ? 'shared-interest' : ''}`}>
                <span className="interest-emoji">{interestEmojiMap[interest] || '✨'}</span>
                {interest}
              </div>
            );
          })}
        </div>

        {isCurrentUser && (
          <>
            <div className="modal-buttons">
              <button className="friends-button">
                Edit Profile
              </button>
            </div>
            <div className="logout-wrapper">
              <button className="logout-button" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </>
        )}

        {!isCurrentUser && !isAlreadyFriend && (
          <button className="send-request-button">
            Send Friend Request
          </button>
        )}

        {!isCurrentUser && (
          <div className="modal-buttons">
            <button onClick={onClose} className="friends-button">Send a Message</button>
          </div>
        )}
      </div>
    </div>
  );
}

function calculateAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const diff = Date.now() - birth.getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return age;
}

export default ProfileModal;