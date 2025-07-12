// src/components/ScheduleMeetingModal.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./ScheduleMeetingModal.css";
import { fetchUserFriends } from "../utils/fetchFriends";

function ScheduleMeetingModal({ onClose, currentUser }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const loadFriends = async () => {
        console.log("Current user UID:", currentUser?.uid);
      const fetched = await fetchUserFriends(currentUser.uid);
      console.log("Fetched friends:", fetched);
      setFriends(fetched);
    };
    if (currentUser?.uid) {
      loadFriends();
    }
  }, [currentUser]);

  const friendOptions = friends.map((friend) => ({
    value: friend.id,
    label: friend.fullName,
    image: friend.profileImage || "https://via.placeholder.com/150",
    friendObj: friend,
  }));

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }),
  };

  const formatOptionLabel = ({ label, image }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src={image}
        alt={label}
        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
      />
      <span>{label}</span>
    </div>
  );

  const handleSendRequest = () => {
    if (!selectedFriend || !selectedDate) return;
    alert(`Meeting request sent to ${selectedFriend.label} on ${selectedDate}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          ✖
        </button>
        <h2>Select a friend to schedule a meeting</h2>

        <Select
          options={friendOptions}
          styles={customStyles}
          formatOptionLabel={formatOptionLabel}
          placeholder="Search or select a friend..."
          onChange={(option) => setSelectedFriend(option)}
          isSearchable
        />

        <h3 style={{ marginTop: "1.5rem" }}>Select date for the meeting</h3>
        <input
          type="date"
          className="date-picker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button
          className="send-request-btn"
          onClick={handleSendRequest}
          disabled={!selectedFriend || !selectedDate}
        >
          Send Meeting Request
        </button>
      </div>
    </div>
  );
}

export default ScheduleMeetingModal;