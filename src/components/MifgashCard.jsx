function MifgashCard({ name, date, location, topic }) {
    return (
      <div className="mifgash-box">
      <div className="mifgash-title">Upcoming Mifgash</div>
      <div className="mifgash-details">
      <p>Maya, your closest Mifgash is with <a href="#">Daniel Radcliffe</a></p>
      <p>📅 July 17th, 4pm</p>
      <p>📍 Zoom call</p>
      <p>🌐 You’ll teach Hebrew!</p>
    </div>
  </div>
    );
  }
  
  export default MifgashCard;