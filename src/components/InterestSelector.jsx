import { useState } from "react";
import interestsData from "../data/Interests_Categories.json";
import "./InterestSelector.css";

function InterestSelector({ selectedInterests, setSelectedInterests }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleInterest = (interestName) => {
    if (selectedInterests.includes(interestName)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interestName));
    } else {
      setSelectedInterests([...selectedInterests, interestName]);
    }
  };

  return (
    <div className="interest-selector">
      {Object.entries(interestsData).map(([category, { emoji, items }]) => (
        <div key={category} className="category-block">
          <div
            className="category-title"
            onClick={() => setExpandedCategory(category === expandedCategory ? null : category)}
          >
            {emoji} {category}
          </div>

          <div className={`interest-items ${expandedCategory === category ? "expanded" : "collapsed"}`}>
            {items.map(({ name, emoji }) => {
              const isSelected = selectedInterests.includes(name);
              return (
                <div
                  key={name}
                  className={`interest-tag ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleInterest(name)}
                >
                  {emoji} {name}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default InterestSelector;