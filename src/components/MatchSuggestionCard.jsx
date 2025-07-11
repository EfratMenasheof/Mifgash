import ProfileModal from "./ProfileModal";

function MatchSuggestionCard({ match, onAccept, onSkip, onClose, onBackToPreferences }) {
  if (!match) {
    return (
      <div className="no-match-card">
        <h2>No perfect match right now 😳</h2>
        <p>Try changing your preferences or check back later!</p>
        <button className="back-button" onClick={onBackToPreferences}>
          Back to Preferences
        </button>
      </div>
    );
  }

  return (
    <ProfileModal
      friend={match}
      onClose={onClose} // ✕ סוגר את המודל בלבד
      isMatchSuggestion={true}
      onConnect={onAccept}
      onSkip={onSkip}
    />
  );
}

export default MatchSuggestionCard;
