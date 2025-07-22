// src/components/ScheduleMeetingModal.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./ScheduleMeetingModal.css";
import { fetchUserFriends } from "../utils/fetchFriends";
import { DateTime } from "luxon";
import { getTimeZoneFromCoords } from "../utils/getTimeZoneFromCoords";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function ScheduleMeetingModal({ onClose, currentUser }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [dateError, setDateError] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadFriends = async () => {
      const fetched = await fetchUserFriends(currentUser.uid);
      setFriends(fetched);
    };
    if (currentUser?.uid) {
      loadFriends();
    }
  }, [currentUser]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!currentUser?.uid) return;
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    };
    loadUserProfile();
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

  const generateLanguageOptions = () => {
    const friendName = selectedFriend ? selectedFriend.label.split(" ")[0] : "_____";
    const userGoal = userProfile?.learningGoal?.toLowerCase().trim();

    console.log("learningGoal:", userGoal);

    if (userGoal === "english") {
      return [
        { value: "learnEnglish", label: `${friendName} will teach me English` },
        { value: "teachHebrew", label: `I will teach ${friendName} Hebrew` },
      ];
    } else if (userGoal === "hebrew") {
      return [
        { value: "learnHebrew", label: `${friendName} will teach me Hebrew` },
        { value: "teachEnglish", label: `I will teach ${friendName} English` },
      ];
    } else {
      return [{ value: "unknown", label: `Language goal not set correctly` }];
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const dt = DateTime.fromObject({ hour, minute });
        options.push({
          value: dt.toFormat("HH:mm"),
          label: dt.toFormat("hh:mm a"),
        });
      }
    }
    return options;
  };

  const goToNextStep = () => {
    if (selectedFriend && selectedDirection) {
      setStep(2);
    }
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    const today = DateTime.now().startOf("day");
    const selected = DateTime.fromISO(dateValue);

    if (selected < today) {
      setDateError("Please select a future date.");
    } else {
      setDateError("");
      setSelectedDate(dateValue);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedDate || !selectedTime || !!dateError) return;

      alert(`Meeting request sent to ${selectedFriend.label}. Waiting for confirmation.`);
    const friendId = selectedFriend.value;
    const friendName = selectedFriend.label;
    const userName = currentUser.displayName;
    const userPhoto = currentUser.photoURL || "";
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    const senderName = userData.fullName || currentUser.displayName || "Unknown User";
    const senderPhotoURL = userData.profileImage || currentUser.photoURL || "https://via.placeholder.com/100";
    const direction = selectedDirection;

    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const meetingDateTime = DateTime.fromISO(`${selectedDate}T${selectedTime}`, { zone: localZone });

    try {
      const requestRef = collection(db, "incomingRequests", friendId, "requests");

      addDoc(requestRef, {
        senderId: currentUser.uid,
        senderName: senderName,
        senderPhotoURL: senderPhotoURL,
        direction: direction,
        proposedDate: selectedDate,
        proposedTime: selectedTime,
        timestampUTC: meetingDateTime.toUTC().toISO(),
        createdAt: serverTimestamp(),
        status: "pending",
      });

      console.log("✅ Meeting request sent to:", friendId);
    } catch (err) {
      console.error("❌ Failed to send meeting request:", err);
    }

    onClose();
  };

  const getFriendTime = () => {
    if (!selectedDate || !selectedTime || !selectedFriend?.friendObj?.location?.coordinates) return "";

    const { lat, lng } = selectedFriend.friendObj.location.coordinates;
    const friendZone = getTimeZoneFromCoords(lat, lng);
    if (!friendZone) return "";

    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDateTime = DateTime.fromISO(`${selectedDate}T${selectedTime}`, { zone: localZone });
    const friendDateTime = localDateTime.setZone(friendZone);

    return `${friendDateTime.toFormat("hh:mm a")} (${friendZone})`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✕</button>
        <h2 className="modal-title">SCHEDULE A MIFGASH</h2>

        {step === 1 && (
          <>
            <h3 className="modal-subtitle">Select a friend to schedule a meeting</h3>
            <Select
              options={friendOptions}
              styles={customStyles}
              formatOptionLabel={formatOptionLabel}
              placeholder="Search or select a friend..."
              onChange={(option) => {
                setSelectedFriend(option);
                setSelectedDirection(null);
              }}
              isSearchable
            />

            <div className="radio-wrapper">
              {userProfile &&
                generateLanguageOptions().map((option) => (
                  <label key={option.value} style={{ color: !selectedFriend ? "#999" : "inherit" }}>
                    <input
                      type="radio"
                      name="language-direction"
                      value={option.value}
                      disabled={!selectedFriend}
                      checked={selectedDirection === option.value}
                      onChange={(e) => setSelectedDirection(e.target.value)}
                    />
                    {option.label}
                  </label>
                ))}
            </div>

            <button
              className="send-request-btn"
              onClick={goToNextStep}
              disabled={!selectedFriend || !selectedDirection}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="modal-subtitle">Select date and time for the meeting</h3>
            <input
              type="date"
              className="date-picker"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
            />
            {dateError && <p style={{ color: "red", fontSize: "0.9rem", marginTop: "0.5rem" }}>{dateError}</p>}

            <Select
              className="time-select"
              options={generateTimeOptions()}
              value={generateTimeOptions().find(opt => opt.value === selectedTime)}
              onChange={(option) => setSelectedTime(option.value)}
              placeholder="Select a time..."
              isSearchable={false}
              styles={{ marginTop: "1rem" }}
            />

            <div style={{ 
              marginTop: "1rem", 
              display: "flex", 
              justifyContent: "space-between", 
              gap: "1rem", 
              textAlign: "center" 
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: "bold", marginBottom: "4px" }}>Your Time</p>
                <p>{selectedTime ? selectedTime : <span style={{ color: "#999" }}>--:--</span>}</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  {selectedFriend?.label?.split(" ")[0] || "Friend"}'s Time
                </p>
                <p>{selectedTime ? getFriendTime() : <span style={{ color: "#999" }}>--:--</span>}</p>
              </div>
            </div>

            <button
              className="send-request-btn"
              onClick={handleSendRequest}
              disabled={!selectedDate || !selectedTime || !!dateError}
            >
              Send Meeting Request
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ScheduleMeetingModal;