// src/components/IncomingRequestsModal.jsx
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

function IncomingRequestsModal({ onClose, onOpenProfile }) {
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
    const meRef = doc(db, "users", currentUser.uid);
    const themRef = doc(db, "users", sender.id);

    await updateDoc(meRef, {
      friends: arrayUnion(sender.id),
      receivedRequests: arrayRemove(sender.id),
    });
    await updateDoc(themRef, {
      friends: arrayUnion(currentUser.uid),
      sentRequests: arrayRemove(currentUser.uid),
    });

    const next = requests.filter((r) => r.id !== sender.id);
    setRequests(next);
    if (next.length === 0) onClose();
  };

  const handleDecline = async (sender) => {
    const meRef = doc(db, "users", currentUser.uid);
    const themRef = doc(db, "users", sender.id);

    await updateDoc(meRef, {
      receivedRequests: arrayRemove(sender.id),
    });
    await updateDoc(themRef, {
      sentRequests: arrayRemove(currentUser.uid),
    });

    const next = requests.filter((r) => r.id !== sender.id);
    setRequests(next);
    if (next.length === 0) onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="incoming-modal">
        <button className="modal-close-button" onClick={onClose}>✕</button>
        <h2>Incoming Connection Requests</h2>

        {requests.length === 0 ? (
          <p className="no-requests">No new requests right now 😊</p>
        ) : (
          <div className="request-list">
            {requests.map((user) => (
              <div className="request-card" key={user.id}>
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="request-img"
                  onClick={() => {
                    onClose();
                    onOpenProfile(user);
                  }}
                  style={{ cursor: "pointer" }}
                />
                <h3
                  onClick={() => {
                    onClose();
                    onOpenProfile(user);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {user.fullName}
                </h3>
                <div className="request-buttons">
                  <button
                    className="accept-btn"
                    onClick={() => handleAccept(user)}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleDecline(user)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IncomingRequestsModal;
