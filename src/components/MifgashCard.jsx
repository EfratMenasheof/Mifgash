import '../AppStyles.css';

function MifgashCard({ friend, date, location, topic, onClick }) {
  return (
    <div className="section-box">
      <h2 className="section-title">Upcoming Mifgash</h2>

      {friend ? (
        <div className="mt-2">
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
      ) : (
        <div className="empty-state">
  <p>No upcoming Mifgash. Start connecting and schedule your first meeting!</p>
</div>

      )}
    </div>
  );
}

export default MifgashCard;
