import "./MatchSuggestionCard.css";

function MatchSuggestionCard({ match, onAccept, onSkip }) {
  if (!match) {
    return (
      <div className="match-card">
        <h3>No perfect match right now 😕</h3>
        <p>Try changing your preferences or check back later!</p>
        <button onClick={onSkip}>Back to Preferences</button>
      </div>
    );
  }

  return (
    <div className="match-card">
      <img src={match.image} alt={match.name} className="match-img" />
      <h3>{match.name}, {match.age}</h3>
      <p><strong>Location:</strong> {match.location.city}, {match.location.region}</p>
      <p><strong>Shared Interests:</strong> {match.sharedInterests.join(", ") || "None listed"}</p>
      <p>{match.bio}</p>
      <div className="match-buttons">
        <button onClick={() => onAccept(match)}>Connect!</button>
        <button className="secondary" onClick={onSkip}>Skip</button>
      </div>
    </div>
  );
}

export default MatchSuggestionCard;
