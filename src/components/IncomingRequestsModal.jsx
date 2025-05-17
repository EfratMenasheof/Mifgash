import './IncomingRequestsModal.css';

function IncomingRequestsModal({ friends, onAccept, onClose }) {
  const requests = friends.filter(friend =>
    friend.matchRequests?.includes('user')
  );

  return (
    <div className="modal-overlay">
      <div className="match-modal">
        <button className="modal-close-button" onClick={onClose}>✕</button>
        <h2>Incoming Match Requests</h2>

        {requests.length === 0 ? (
          <p>No new requests right now 😊</p>
        ) : (
          requests.map(friend => (
            <div key={friend.id} className="request-card">
              <img src={friend.image} alt={friend.name} className="match-img" />
              <h4>{friend.name}, {friend.age}</h4>
              <p><strong>Location:</strong> {friend.location.city}, {friend.location.country}</p>
              <div className="match-buttons">
                <button onClick={() => onAccept(friend)}>Accept</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default IncomingRequestsModal;
