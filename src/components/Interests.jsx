import { useState } from 'react';
import './Interests.css';

function Interests({ categories, selectedInterests, setSelectedInterests }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="interests-container">
      {categories.map(category => (
        <div key={category.name} className="category-section">
          <div className="category-header" onClick={() =>
            setExpandedCategory(expandedCategory === category.name ? null : category.name)
          }>
            <h3>{category.name}</h3>
            <span>{expandedCategory === category.name ? '▲' : '▼'}</span>
          </div>

          {expandedCategory === category.name && (
            <div className="interest-options">
              {category.items.map(item => (
                <button
                  key={item}
                  className={`interest-item ${selectedInterests.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Interests;