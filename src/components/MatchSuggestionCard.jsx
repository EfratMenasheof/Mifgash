import "./MatchSuggestionCard.css";

function calculateAge(birthDateStr) {
  if (!birthDateStr) return null;
  const today = new Date();
  const birth = new Date(birthDateStr);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function MatchSuggestionCard({ match, onAccept, onSkip }) {
  if (!match) {
    return (
      <div className="no-match-card">
        <h2>No perfect match right now 😳</h2>
        <p>Try changing your preferences or check back later!</p>
        <button className="back-button" onClick={onSkip}>Back to Preferences</button>
      </div>
    );
  }

  const { profilePicUrl, fullName, birthDate, location = {}, sharedInterests = [] } = match;
  const age = calculateAge(birthDate);
  const name = fullName || "";
const image = match.profilePicUrl || match.profilePicURL || "/default-user.png";

  const locationDisplay = location.country === "United States" && location.state
    ? `${location.city}, ${location.state}`
    : location.city;

  return (
    <div className="match-card">
      <img className="match-img" src={match.profileImage || ""} alt="Profile" />



      <h2>{name}{age ? `, ${age}` : ""}</h2>

      {locationDisplay && (
        <p><strong>Location:</strong> {locationDisplay}</p>
      )}

      {sharedInterests.length > 0 && (
        <p>
          <strong>Shared Interests:</strong> {sharedInterests.join(", ")}
        </p>
      )}

      <div className="match-buttons">
  <button className="primary" onClick={() => onAccept(match)}>Connect!</button>
  <button className="secondary" onClick={onSkip}>Skip</button>
</div>

    </div>
  );
}

export default MatchSuggestionCard;
