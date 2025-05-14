import './MifgashCard.css';

function MifgashCard({ friend, date, location, topic, onClick }) {
  return (
    <div className="mifgash-box">
      <h2 className="section-title">Upcoming Mifgash</h2>
      <div className="mifgash-details">
        <p>
          Maya, your closest Mifgash is with{' '}
          <span className="link" onClick={() => onClick(friend)} style={{ cursor: 'pointer' }}>
            {friend.name}
          </span>
        </p>
        <p>📅 {date}</p>
        <p>📍 {location}</p>
        <p>🌐 {topic}</p>
      </div>
    </div>
  );
}

export default MifgashCard;
