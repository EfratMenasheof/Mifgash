import "./MatchSuggestionCard.css";
import interestsData from "../data/Interests_Categories.json";

function calculateAge(birthDateStr) {
  if (!birthDateStr) return null;
  const today = new Date();
  const birth = new Date(birthDateStr);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// flatten all interests for emoji lookup
const allItems = Object.values(interestsData).flatMap(c => c.items);
const findEmoji = (name) => {
  const item = allItems.find(i => i.name.toLowerCase() === name.toLowerCase());
  return item?.emoji || "";
};

function MatchSuggestionCard({ match, onAccept, onSkip, onClose }) {
  if (!match) {
    return (
      <div className="no-match-card">
        <h2>No perfect match right now 😳</h2>
        <p>Try changing your preferences or check back later!</p>
        <button className="back-button" onClick={onClose}>Back to Preferences</button>
      </div>
    );
  }

  const {
    fullName,
    birthDate,
    location = {},
    profileImage,
    learningGoal,
    interests = [],
    sharedInterests = []
  } = match;

  const age = calculateAge(birthDate);
  const name = fullName || "";
  const image = profileImage || "/default-user.png";
  const normalizedShared = sharedInterests.map(i => i.toLowerCase());

  const locationDisplay =
    location.country === "United States" && location.state
      ? `${location.city}, ${location.state}`
      : location.city || "";

  return (
    <div className="match-card detailed">
      <button className="modal-close-button" onClick={onClose}>✕</button>

      <img className="match-img-round" src={image} alt="Profile" />

      <h2>{name}{age ? `, ${age}` : ""}</h2>

      {locationDisplay && (
        <p><strong>Location:</strong> {locationDisplay}</p>
      )}

      {learningGoal && (
        <p><strong>Speaks fluently:</strong> {learningGoal}</p>
      )}

      {interests.length > 0 && (
        <div className="interest-tags">
          <strong>Interests:</strong>
          <div className="interest-list">
            {interests.slice(0, 8).map((interest, i) => (
              <span
                key={i}
                className={`interest-tag ${normalizedShared.includes(interest.toLowerCase()) ? "shared" : ""}`}
              >
                <span className="interest-emoji">{findEmoji(interest)}</span>
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="match-buttons">
        <button className="primary" onClick={() => onAccept(match)}>Connect!</button>
        <button className="secondary" onClick={onSkip}>Skip</button>
      </div>
    </div>
  );
}

export default MatchSuggestionCard;
