import "./IncomingRequestsModal.css";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

function IncomingRequestsModal({ onClose }) {
  const [requests, setRequests] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser) return;
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();
      const receivedIds = userData?.receivedRequests || [];

      const users = await Promise.all(
        receivedIds.map(async (uid) => {
          const docSnap = await getDoc(doc(db, "users", uid));
          return { id: uid, ...docSnap.data() };
        })
      );
      setRequests(users);
    };

    fetchRequests();
  }, [currentUser]);

  const handleAccept = async (sender) => {
    const userRef = doc(db, "users", currentUser.uid);
    const senderRef = doc(db, "users", sender.id);

    await updateDoc(userRef, {
      friends: arrayUnion(sender.id),
      receivedRequests: arrayRemove(sender.id),
    });

    await updateDoc(senderRef, {
      friends: arrayUnion(currentUser.uid),
      sentRequests: arrayRemove(currentUser.uid),
    });

    const updated = requests.filter((r) => r.id !== sender.id);
    setRequests(updated);
    if (updated.length === 0) onClose();
  };

  const handleDecline = async (sender) => {
    const userRef = doc(db, "users", currentUser.uid);
    const senderRef = doc(db, "users", sender.id);

    await updateDoc(userRef, {
      receivedRequests: arrayRemove(sender.id),
    });
    await updateDoc(senderRef, {
      sentRequests: arrayRemove(currentUser.uid),
    });

    const updated = requests.filter((r) => r.id !== sender.id);
    setRequests(updated);
    if (updated.length === 0) onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="incoming-modal">
        <button className="modal-close-button" onClick={onClose}>✕</button>
        <h2>Incoming Connection Requests</h2>

        {requests.length === 0 ? (
          <p className="no-requests">No new requests right now 😊</p>
        ) : (
          requests.map((user) => (
            <div className="request-card" key={user.id}>
              <img
                src={user.profileImage}
                alt={user.fullName}
                className="request-img"
              />
              <h3>{user.fullName}</h3>
              <p>
                <strong>Location:</strong> {user.location.city}, {user.location.state && `${user.location.state}, `}{user.location.country}
              </p>
              <div className="request-buttons">
                <button className="accept-btn" onClick={() => handleAccept(user)}>Accept</button>
                <button className="decline-btn" onClick={() => handleDecline(user)}>Decline</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default IncomingRequestsModal;