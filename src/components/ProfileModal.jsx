// src/components/ProfileModal.jsx
import "./ProfileModal.css";
import interestsData from "../data/Interests_Categories.json";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../utils/fetchUserProfile";
import IsraelFlag from "../assets/israel.png";
import UsaFlag from "../assets/usa.png";

// מיפוי אימוג'ים
const interestEmojiMap = {};
Object.values(interestsData).forEach((cat) =>
  cat.items.forEach((i) => (interestEmojiMap[i.name] = i.emoji))
);

export default function ProfileModal({
  friend,
  onClose,
  isMatchSuggestion = false,
  onConnect,
  onSkip,
}) {
  // אם אין friend – לא מציגים כלום
  if (!friend) return null;

  // 1) מצבים וסטייטים
  const [meData, setMeData] = useState(undefined); // undefined=טעינה, null=אין
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const [ended, setEnded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoText, setInfoText] = useState("");
  const navigate = useNavigate();
  const isCurrentUser = friend.id === "user";

  // 2) טוען פרופיל המשתמש המחובר
  useEffect(() => {
    (async () => {
      const u = auth.currentUser;
      if (!u) {
        setMeData(null);
        return;
      }
      const profile = await fetchUserProfile(u.uid);
      setMeData(profile);
    })();
  }, []);

  // 3) guard כללי: אם עדיין בטעינת meData (ולא match-suggestion), לא מציגים
  if (!isMatchSuggestion && meData === undefined) {
    return null;
  }

  // 4) דגלים
  const isIncoming =
    !isMatchSuggestion &&
    (meData?.receivedRequests?.includes(friend.id) || false);
  const isFriend =
    !isMatchSuggestion && (meData?.friends?.includes(friend.id) || false);

  // 5) מי להציג: אם זה פרופיל עצמי – meData, אחרת data של friend
  const displayUser = isCurrentUser ? meData : friend;
  if (!displayUser) {
    return null;
  }

  // 6) חישובים להצגה
  const birthDate = displayUser.birthDate
    ? new Date(displayUser.birthDate)
    : null;
  let age = null;
  if (birthDate) {
    const diff = Date.now() - birthDate.getTime();
    age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }
  const language = displayUser.learningGoal;
  const location = displayUser.location || {};
  const locationText = [location.city, location.state, location.country]
    .filter(Boolean)
    .join(", ");

  // 7) פעולות Firebase
  const handleAccept = async () => {
    const meRef = doc(db, "users", auth.currentUser.uid);
    const themRef = doc(db, "users", friend.id);
    await updateDoc(meRef, {
      friends: arrayUnion(friend.id),
      receivedRequests: arrayRemove(friend.id),
    });
    await updateDoc(themRef, {
      friends: arrayUnion(auth.currentUser.uid),
      sentRequests: arrayRemove(auth.currentUser.uid),
    });
    onClose();
  };

  const handleDecline = async () => {
    const meRef = doc(db, "users", auth.currentUser.uid);
    const themRef = doc(db, "users", friend.id);
    await updateDoc(meRef, {
      receivedRequests: arrayRemove(friend.id),
    });
    await updateDoc(themRef, {
      sentRequests: arrayRemove(auth.currentUser.uid),
    });
    onClose();
  };

  const handleSendRequest = async () => {
    const meRef = doc(db, "users", auth.currentUser.uid);
    const themRef = doc(db, "users", friend.id);
    await updateDoc(meRef, {
      sentRequests: arrayUnion(friend.id),
    });
    await updateDoc(themRef, {
      receivedRequests: arrayUnion(auth.currentUser.uid),
    });
    onClose();
    setInfoText("✅ Friend request sent!");
    setShowInfo(true);
  };

  const doEndConnection = async () => {
    const meRef = doc(db, "users", auth.currentUser.uid);
    const themRef = doc(db, "users", friend.id);
    await updateDoc(meRef, {
      friends: arrayRemove(friend.id),
    });
    await updateDoc(themRef, {
      friends: arrayRemove(auth.currentUser.uid),
    });
  };

  const handleConfirmEnd = async () => {
    await doEndConnection();
    setConfirmingEnd(false);
    setEnded(true);
    setInfoText(
      `You and ${displayUser.fullName} are no longer connected!\nYou might find them while looking for your next match.`
    );
    setShowInfo(true);
  };
  const handleCancelEnd = () => setConfirmingEnd(false);
  const handleInfoClose = () => setShowInfo(false);

  return (
    <>
      {/* ======= חלון הפרופיל ======= */}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}>
            ✕
          </button>

          <img
            src={displayUser.profileImage}
            alt={displayUser.fullName}
            className="profile-pic"
            onError={(e) => (e.target.src = "/Profile-pics/default.jpg")}
          />

          <h2 className="Profile-title">
            {displayUser.fullName?.toUpperCase()}
          </h2>

          {age !== null && (
            <p>
              <strong>Age:</strong> {age}
            </p>
          )}
          {language && (
            <p>
              <strong>Speaks fluently:</strong>{" "}
              {language === "English" ? "Hebrew" : "English"}
            </p>
          )}
          {locationText && (
            <p>
              <strong>Location:</strong> {locationText}{" "}
              {language === "English" ? (
                <img src={IsraelFlag} alt="IL" className="flag-icon" />
              ) : (
                language === "Hebrew" && (
                  <img src={UsaFlag} alt="US" className="flag-icon" />
                )
              )}
            </p>
          )}
          {displayUser.about && (
            <p>
              <strong>Bio:</strong> {displayUser.about}
            </p>
          )}
          {displayUser.interests?.length > 0 && (
            <>
              <p>
                <strong>Interests:</strong>
              </p>
              <div className="interests-wrapper">
                {displayUser.interests.map((interest) => (
                  <div key={interest} className="interest-tag">
                    <span className="interest-emoji">
                      {interestEmojiMap[interest] || "✨"}
                    </span>
                    {interest}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="modal-buttons">
            {/* match-suggestion */}
            {isMatchSuggestion && (
              <>
                <button
                  className="friends-button"
                  onClick={() => onConnect(displayUser)}
                >
                  Connect!
                </button>
                <button className="skip-button" onClick={onSkip}>
                  Skip
                </button>
              </>
            )}

            {/* בקשה נכנסת */}
            {!isMatchSuggestion && isIncoming && (
              <>
                <button className="accept-btn" onClick={handleAccept}>
                  Accept
                </button>
                <button className="decline-btn" onClick={handleDecline}>
                  Decline
                </button>
              </>
            )}

            {/* משתמש חדש */}
            {!isMatchSuggestion &&
              !isIncoming &&
              !isFriend &&
              !isCurrentUser && (
                <>
                  <button
                    className="send-request-button"
                    onClick={handleSendRequest}
                  >
                    Send Request
                  </button>
                  <button className="skip-button" onClick={onClose}>
                    Skip
                  </button>
                </>
              )}

            {/* חבר קיים */}
            {!isMatchSuggestion && !confirmingEnd && isFriend && (
              <button
                className="end-connection-button"
                onClick={() => setConfirmingEnd(true)}
              >
                End Connection
              </button>
            )}

            {/* הפרופיל שלי */}
            {isCurrentUser && (
              <>
                <button className="edit-btn">Edit Profile</button>
                <button
                  className="logout-btn"
                  onClick={() => {
                    signOut(auth);
                    navigate("/login");
                  }}
                >
                  Log Out
                </button>
              </>
            )}

            {/* אישור סיום */}
            {!isMatchSuggestion && confirmingEnd && !ended && (
              <div className="confirm-section">
                <p className="confirm-text">
                  Are you sure you want to end your connection with{" "}
                  {displayUser.fullName}?
                </p>
                <div className="confirm-buttons">
                  <button
                    className="confirm-btn"
                    onClick={handleConfirmEnd}
                  >
                    Yes, end connection
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={handleCancelEnd}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======= חלון Info במרכז ======= */}
      {showInfo && (
        <div
          className="modal-overlay info-overlay"
          onClick={handleInfoClose}
        >
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            {infoText.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            <button
              className="info-close-btn"
              onClick={handleInfoClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
