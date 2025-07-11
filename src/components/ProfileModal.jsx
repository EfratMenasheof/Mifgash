import './ProfileModal.css';
import interestsData from '../data/Interests_Categories.json';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import IsraelFlag from '../assets/israel.png';
import UsaFlag from '../assets/usa.png';

// אימוג'ים לתחומי עניין
const interestEmojiMap = {};
Object.values(interestsData).forEach(category => {
  category.items.forEach(item => {
    interestEmojiMap[item.name] = item.emoji;
  });
});

function ProfileModal({ friend, onClose, isMatchSuggestion = false, onConnect, onSkip }) {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [authUserData, setAuthUserData] = useState(null);
  const isCurrentUser = friend?.id === 'user';
  const isAlreadyFriend = friend?.isFriend === true;
  const navigate = useNavigate();

  useEffect(() => {
    if (isCurrentUser && auth.currentUser) {
      const fetchCurrentUser = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const formatted = {
            id: 'user',
            fullName: data.fullName,
            profileImage: data.profileImage || '/Profile-pics/default.jpg',
            birthDate: data.birthDate,
            about: data.about,
            learningGoal: data.learningGoal,
            interests: data.interests || [],
            location: {
              city: data.location?.city || '',
              state: data.location?.state || '',
              country: data.location?.country || '',
            },
          };
          setCurrentUserData(formatted);
        }
      };
      fetchCurrentUser();
    }
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

  const fullName = displayUser.fullName || "Unknown";
  const profileImage = displayUser.profileImage || "/Profile-pics/default.jpg";
  const about = displayUser.about || "";
  const interests = displayUser.interests || [];
  const language = displayUser.learningGoal;
  const location = displayUser.location || {};
  const locationText = [location.city, location.state, location.country].filter(Boolean).join(", ");

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(displayUser.birthDate);

  const currentUserInterests = isCurrentUser
    ? displayUser.interests || []
    : authUserData?.interests || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✕</button>

        <img
          src={profileImage}
          onError={(e) => (e.target.src = "/Profile-pics/default.jpg")}
          alt={fullName}
          className="profile-pic"
        />

        <h2 className="Profile-title">{fullName.toUpperCase()}</h2>
        {age && <p><strong>Age:</strong> {age}</p>}

        {language && (
          <p><strong>Speaks fluently:</strong> {language === 'English' ? 'Hebrew' : 'English'}</p>
        )}

        {locationText && (
          <p>
            <strong>Location:</strong> {locationText}{" "}
            {language === "English" ? (
              <img src={IsraelFlag} alt="IL" style={{ width: "20px", marginLeft: "6px" }} />
            ) : language === "Hebrew" ? (
              <img src={UsaFlag} alt="US" style={{ width: "20px", marginLeft: "6px" }} />
            ) : null}
          </p>
        )}

        {about && <p><strong>Bio:</strong> {about}</p>}

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

        <div className="modal-buttons">
          {isMatchSuggestion ? (
            <>
              <button className="friends-button" onClick={() => onConnect?.(displayUser)}>
                Connect!
              </button>
              <button className="logout-button" onClick={onSkip}>
                Skip
              </button>
            </>
          ) : isCurrentUser ? (
            <>
              <button className="friends-button">Edit Profile</button>
              <div className="logout-wrapper">
                <button className="logout-button" onClick={() => {
                  signOut(auth);
                  navigate("/login");
                }}>
                  Log Out
                </button>
              </div>
            </>
          ) : isAlreadyFriend ? (
            <button className="friends-button">Send a Message</button>
          ) : (
            <>
              <button className="send-request-button">Send Friend Request</button>
              <button className="friends-button">Send a Message</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
