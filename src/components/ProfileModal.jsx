// src/components/ProfileModal.jsx
// כולל סדר תנאים מתוקן להצגת כפתור שליחת בקשת חברות,
// כניסת תנאי לקבלה/דחייה לפני השאר, ו־popups

import "./ProfileModal.css";
import interestsData from "../data/Interests_Categories.json";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import EditProfileModal from "./EditProfileModal";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../utils/fetchUserProfile";
import IsraelFlag from "../assets/israel.png";
import UsaFlag from "../assets/usa.png";

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
  if (!friend) return null;

  const [meData, setMeData] = useState(undefined);
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoText, setInfoText] = useState("");
  const navigate = useNavigate();
  const isCurrentUser = friend.id === "user";
  const [showEditModal, setShowEditModal] = useState(false);

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

  if (!isMatchSuggestion && meData === undefined) return null;

  const isIncoming =
    !isMatchSuggestion &&
    Array.isArray(meData?.receivedRequests) &&
    meData.receivedRequests.includes(friend.id);

  const isFriend =
    !isMatchSuggestion &&
    Array.isArray(meData?.friends) &&
    meData.friends.includes(friend.id);

  const displayUser = isCurrentUser ? meData : friend;
  if (!displayUser) return null;

  // חישוב גיל
  const birthDate = displayUser.birthDate ? new Date(displayUser.birthDate) : null;
  let age = null;
  if (birthDate) {
    age = Math.floor(
      (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
  }
  const language = displayUser.learningGoal;
  const location = displayUser.location || {};
  const locationText = [location.city, location.state, location.country]
    .filter(Boolean)
    .join(", ");

  // Handlers – קבלה/דחייה
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
    await updateDoc(meRef, { receivedRequests: arrayRemove(friend.id) });
    await updateDoc(themRef, { sentRequests: arrayRemove(auth.currentUser.uid) });
    onClose();
  };

  // Handler – שליחת בקשת חברות
  const handleSendRequest = async () => {
    const meRef = doc(db, "users", auth.currentUser.uid);
    const themRef = doc(db, "users", friend.id);
    await updateDoc(meRef, { sentRequests: arrayUnion(friend.id) });
    await updateDoc(themRef, { receivedRequests: arrayUnion(auth.currentUser.uid) });
    // זה ה-popup שביקשת
    setInfoText("✅ Friend request sent!");
    setShowInfo(true);
  };

  const doEndConnection = async () => {
    const meRef = doc(db, "users", auth.currentUser.uid);
    const themRef = doc(db, "users", friend.id);
    await updateDoc(meRef, { friends: arrayRemove(friend.id) });
    await updateDoc(themRef, { friends: arrayRemove(auth.currentUser.uid) });
  };

  // Handler – סיום קשר
  const handleConfirmEnd = async () => {
    await doEndConnection();
    setConfirmingEnd(false);
    // זה ה-popup של סיום קשר
    setInfoText(
      `You and ${displayUser.fullName} are no longer connected!\nYou might find them while looking for your next match.`
    );
    setShowInfo(true);
  };

  const handleCancelEnd = () => setConfirmingEnd(false);
  const handleInfoClose = () => {
    setShowInfo(false);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}>
            ✕
          </button>

          {/* תמונת פרופיל */}
          <img
            src={displayUser.profileImage || "/Profile-pics/default.jpg"}
            alt="Profile"
            className="profile-pic-background"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/Profile-pics/default.jpg";
            }}
          />

          {/* שם */}
<h1 className="Profile-title bigger-title">
  {displayUser.fullName?.toUpperCase()}
</h1>


          {/* גיל */}
          {age !== null && (
            <p>
              <strong>Age:</strong> {age}
            </p>
          )}

          {/* שפה */}
          {language && (
            <p>
              <strong>Speaks fluently:</strong>{" "}
              {language === "English" ? "Hebrew" : "English"}
            </p>
          )}

          {/* מיקום */}
          {locationText && (
            <p>
              <strong>Location:</strong> {locationText}{" "}
              <img
                src={location.country === "Israel" ? IsraelFlag : UsaFlag}
                alt={location.country === "Israel" ? "IL" : "US"}
                className="flag-icon"
              />
            </p>
          )}

          {/* ביוגרפיה */}
          {displayUser.about && (
            <p>
              <strong>Bio:</strong> {displayUser.about}
            </p>
          )}

          {/* Interests */}
          {displayUser.interests?.length > 0 && (
            <>
              <p>
                <strong>Interests:</strong>
              </p>
              <div className="interests-wrapper">
                {displayUser.interests.map((interest) => {
                  const isShared =
                    Array.isArray(meData?.interests) && meData.interests.includes(interest);
                  return (
                    <div
                      key={interest}
                      className={`interest-tag${isShared ? " shared-interest" : ""}`}
                    >
                      <span className="interest-emoji">
                        {interestEmojiMap[interest] || "✨"}
                      </span>
                      {interest}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Contact Info */}
          {isFriend && (displayUser.showEmail || displayUser.showPhone) && (
            <>
              <p>
                <strong>Contact Info:</strong>
              </p>
              {displayUser.showEmail && (
                <p>📧 {displayUser.email}</p>
              )}
              {displayUser.showPhone && (
                <p>📱 {displayUser.phone}</p>
              )}
            </>
          )}

          {/* BUTTONS */}
          <div className="modal-buttons">
            {/* INCOMING REQUEST */}
            {isIncoming && (
              <>
                <button
                  className="accept-btn"
                  onClick={handleAccept}
                >
                  Accept
                </button>
                <button
                  className="decline-btn"
                  onClick={handleDecline}
                >
                  Decline
                </button>
              </>
            )}

            {/* NEW FRIEND */}
            {!isFriend &&
              !isIncoming &&
              !isCurrentUser &&
              meData &&
              !meData.sentRequests?.includes(friend.id) &&
              !meData.receivedRequests?.includes(friend.id) && (
                <>
                  <button
                    className="send-request-button"
                    onClick={handleSendRequest}
                  >
                    Send Request
                  </button>
                  <button
                    className="skip-button"
                    onClick={onSkip}
                  >
                    Skip
                  </button>
                </>
            )}

            {/* CONFIRM END */}
            {!confirmingEnd && isFriend && (
              <button
                className="end-connection-button"
                onClick={() => setConfirmingEnd(true)}
              >
                End Connection
              </button>
            )}
            {confirmingEnd && (
              <div className="confirm-section">
                <p>Are you sure?</p>
                <button
                  className="confirm-btn"
                  onClick={handleConfirmEnd}
                >
                  End Connection
                </button>
                <button
                  className="cancel-btn"
                  onClick={handleCancelEnd}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* CURRENT USER */}
            {isCurrentUser && (
              <>
                <button
                  className="edit-btn"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Profile
                </button>
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
          </div>
        </div>
      </div>

      {/* Info-popup של REQUEST SENT או END CONNECTION */}
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          userData={meData}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
