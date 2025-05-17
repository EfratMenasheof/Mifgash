import { useState } from "react";
import "./MatchPreferencesModal.css";
import { findBestMatch } from "../utils/matchUtils";
import MatchSuggestionCard from "./MatchSuggestionCard";
import interestsData from "../data/Interests_Categories.json";
import { mockFriends } from "../data/FriendsData";

function MatchPreferencesModal({ onClose, onAcceptMatch, candidates }) {
  const [step, setStep] = useState("form");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(80);
  const [selectedTags, setSelectedTags] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [match, setMatch] = useState(null);
  const [alreadySuggested, setAlreadySuggested] = useState([]);

  const currentUser = mockFriends.find(f => f.id === 'user');
  const userInterests = currentUser?.interests || [];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const getNewMatch = (prefs, excludeIds = []) => {
    return findBestMatch(prefs, candidates.filter(c => !excludeIds.includes(c.id)));
  };

  const handleSubmit = () => {
    const preferences = { ageRange: [minAge, maxAge], interests: selectedTags };
    const best = getNewMatch(preferences);
    setMatch(best || null);
    setAlreadySuggested(best ? [best.id] : []);
    setStep("match");
  };

  const handleSkip = () => {
    const preferences = { ageRange: [minAge, maxAge], interests: selectedTags };
    const next = getNewMatch(preferences, alreadySuggested);

    if (next) {
      setMatch(next);
      setAlreadySuggested(prev => [...prev, next.id]);
    } else {
      setMatch(null);
    }
  };

  const handleAccept = (matchedFriend) => {
    onAcceptMatch(matchedFriend);
    onClose();
  };

  const calculateBackground = () => {
    const min = 18;
    const max = 80;
    const left = ((minAge - min) / (max - min)) * 100;
    const right = ((maxAge - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, #ccc ${left}%, #ffa239 ${left}%, #ffa239 ${right}%, #ccc ${right}%)`
    };
  };

  return (
    <div className="modal-overlay">
      <div className="match-modal">
        <button className="modal-close-button" onClick={onClose}>✕</button>

        {step === "form" ? (
          <>
            <h2>Let’s help you make a meaningful connection ✨</h2>

            <label>
              Preferred age range:
              <div className="dual-range-wrapper">
                <div className="range-values">
                  <span>{minAge} yrs</span>
                  <span>{maxAge} yrs</span>
                </div>
                <div className="range-slider" style={calculateBackground()}>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={minAge}
                    onChange={(e) =>
                      setMinAge(Math.min(Number(e.target.value), maxAge - 1))
                    }
                  />
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={maxAge}
                    onChange={(e) =>
                      setMaxAge(Math.max(Number(e.target.value), minAge + 1))
                    }
                  />
                </div>
              </div>
            </label>

            <label>What topics interest you?</label>
            <div className="interests-scroll">
              {Object.entries(interestsData).map(([category, { emoji, items }]) => {
                const isExpanded = expandedCategories.includes(category);

                return (
                  <div key={category} className="interest-category modern">
                    <button
                      className="category-header-modern"
                      onClick={() => toggleCategory(category)}
                    >
                      <span>{emoji} {category}</span>
                      <span className="arrow">{isExpanded ? "▾" : "▸"}</span>
                    </button>
                    <div className={`category-tags-modern ${isExpanded ? "expanded" : ""}`}>
                      {items.map(({ name, emoji }) => {
                        const isSelected = selectedTags.includes(name);
                        const isShared = userInterests.includes(name);
                        return (
                          <button
                            key={name}
                            className={`tag ${isSelected ? "selected" : ""} ${isShared ? "shared" : ""}`}
                            onClick={() => toggleTag(name)}
                          >
                            <span className="interest-emoji">{emoji}</span>
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={handleSubmit}>Find My Match</button>
            {/* <button className="secondary" onClick={onClose}>Cancel</button> */}
          </>
        ) : (
          <MatchSuggestionCard
            match={match}
            onAccept={handleAccept}
            onSkip={handleSkip}
          />
        )}
      </div>
    </div>
  );
}

export default MatchPreferencesModal;
