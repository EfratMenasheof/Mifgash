function MifgashCard({ name, date, location, topic }) {
    return (
      <div className="mifgash-box">
        <p>
          Maya, your closest Mifgash is with{' '}
          <a href="#" className="link">{name}</a>
        </p>
        <div className="mifgash-detail">
          <span>📅 {date}</span>
        </div>
        <div className="mifgash-detail">
          <span>📍 {location}</span>
        </div>
        <div className="mifgash-detail">
          <span>🌐 {topic}</span>
        </div>
      </div>
    );
  }
  
  export default MifgashCard;