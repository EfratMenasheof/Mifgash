import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { fetchUserFriends } from "../utils/fetchFriends";
import "./CreateLessonModal.css";

function CreateLessonModal({ show, onClose, user, onSave }) {
  const [mode, setMode] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [generatedLesson, setGeneratedLesson] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [realFriends, setRealFriends] = useState([]);
  const [interestIndex, setInterestIndex] = useState(0);

  useEffect(() => {
    const fetchFriends = async () => {
      const auth = getAuth();
      if (user?.id) {
  const friends = await fetchUserFriends(user.id);
  setRealFriends(friends);
}

    };
    if (show) fetchFriends();
  }, [show]);

  useEffect(() => {
    if (!show) {
      setMode("");
      setSelectedFriendId("");
      setCustomTopic("");
      setGeneratedLesson(null);
      setStep(1);
      setSaved(false);
      setInterestIndex(0);
    }
  }, [show]);

  if (!show) return null;
  if (!user || !user.learningGoal) {
    return (
      <div className="modal-overlay">
        <div className="match-modal">
          <p style={{ textAlign: "center" }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const teachingLanguage =
    user.learningGoal === "English" ? "Hebrew" :
    user.learningGoal === "Hebrew" ? "English" : null;

  const generateLesson = async () => {
  if (!user || !user.learningGoal) {
    alert("❌ User learning goal not set. Cannot generate lesson.");
    return;
  }

  setLoading(true);
  setStep(2);
  setSaved(false);

  let topicDescription = "";
  if (mode === "friend") {
    const friend = realFriends.find((f) => f.id === selectedFriendId);
    const interests = friend?.interests || [];
    topicDescription = interests.length > 0
      ? interests[interestIndex % interests.length]
      : "נושא שקשור בתרבות ישראלית";
  }

  if (mode === "custom") {
    topicDescription = customTopic.trim();
  }

  const promptText = `
You are an expert language teacher. Your task is to create a short and beginner-friendly lesson in the language: ${teachingLanguage}.

Generate the entire lesson in ${teachingLanguage} only, using clear, simple language for beginner learners.

Please follow this exact format — and write everything in ${teachingLanguage}, including section titles, text, and examples. Do not include any English if ${teachingLanguage} is Hebrew.

---

Format:

1. Title (first line) — just the title text (no label like "Title:")
2. One-line description (second line) — also without a label
3. 🎯 Objectives section: 2 bullet points
4. 🧠 Vocabulary section: 5 words with translations
5. 💬 Dialogue section: 2 lines (Person A and Person B)
6. 📝 Practice section: 1 simple question

Use appropriate emojis for each section, bold section titles (if appropriate in ${teachingLanguage}), and make sure everything is well organized and visually clear.

Topic: ${topicDescription}
---`;

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("🔁 Gemini raw response:", data);

    if (!response.ok) {
      console.error("❌ Gemini error:", data);
      alert("❌ Failed to generate lesson. Check console.");
      return;
    }

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "שגיאה: לא התקבלה תשובה מג'מיני";
    const lines = raw
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0); // סינון שורות ריקות

    const title = lines[0] || topicDescription;
    const description = lines[1] || "";

    setGeneratedLesson({
      topic: title,
      description: description,
      fullContent: lines.slice(2).join("\n"),  // שורות מ-3 והלאה


      recipients: mode === "friend" ? [selectedFriendId] : [],
      language: teachingLanguage,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    });

    if (mode === "friend") {
      setInterestIndex((prev) => prev + 1);
    }
  } catch (err) {
    console.error("❗ Gemini request failed:", err);
    alert("❌ Gemini request failed. Check console.");
  } finally {
    setLoading(false);
  }
};



  const saveLesson = async () => {
    if (!generatedLesson) return;
    try {
      const docRef = await addDoc(collection(db, "lessons"), generatedLesson);
      const savedLesson = { ...generatedLesson, id: docRef.id };
      if (onSave) onSave(savedLesson);
      setSaved(true);
    } catch (err) {
      console.error("Firestore save error:", err);
      alert("❌ Failed to save lesson.");
    }
  };

  const goBack = () => {
    setStep(1);
    setGeneratedLesson(null);
    setSaved(false);
  };

  return (
  <div className="modal-overlay">
    <div className="match-modal">
      <button className="modal-close-button" onClick={onClose}>✕</button>
      <h2 style={{ fontSize: "1.6rem", color: "#1b1464" }}>Create a New Mifgash</h2>

      {step === 2 && (
        <div style={{ textAlign: "left", marginBottom: "1rem" }}>
          <button className="secondary" onClick={goBack}>← Back</button>
        </div>
      )}

      <div className="modal-body-scroll">
        {step === 1 && (
          <>
            <p className="lesson-helper-text">
              Create a personalized language learning experience powered by AI,
              you can create a Mifgash plan based on your connection's interests or any topic you choose!
            </p>

            <p className="form-label">
              You’ll be teaching: <strong>{teachingLanguage}</strong>
            </p>
            <label className="form-label">Choose lesson creation method:</label>
            <div className="radio-wrapper">
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="friend"
                  checked={mode === "friend"}
                  onChange={() => setMode("friend")}
                />
                Teach a friend
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="custom"
                  checked={mode === "custom"}
                  onChange={() => setMode("custom")}
                />
                Custom topic
              </label>
            </div>

            {mode === "friend" && (
              <>
                <label className="form-label">Choose a friend to teach:</label>
                <div className="friend-scroll-box">
                  {realFriends.map(f => (
                    <div
                      key={f.id}
                      className={`friend-option ${selectedFriendId === f.id ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedFriendId(f.id);
                        setInterestIndex(0);
                      }}
                    >
                      <img src={f.profileImage} alt={f.fullName} className="mini-profile" />
                      <div className="friend-name">{f.fullName}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {mode === "custom" && (
              <>
                <label className="form-label">
                  Enter your topic (up to 5 words):
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={customTopic}
                  onChange={e => setCustomTopic(e.target.value)}
                  placeholder="e.g. Israeli holidays or Hebrew slang"
                  className="search-input"
                />
              </>
            )}

            <button
              className="generate-button"
              onClick={generateLesson}
              disabled={
                loading ||
                (!mode || (mode === "friend" && !selectedFriendId) ||
                (mode === "custom" && !customTopic.trim()))
              }
            >
              {loading ? "Generating..." : "Generate Mifgash Plan"}
            </button>
          </>
        )}

        {step === 2 && generatedLesson && (
          <div
            className="lesson-box"
            dir={generatedLesson.language === "Hebrew" ? "rtl" : "ltr"}
          >
            <h4>{generatedLesson.topic}</h4>
            <pre>{generatedLesson.fullContent}</pre>
            {!saved ? (
              <div className="approve-actions vertical">
                <button className="generate-button" onClick={generateLesson}>Regenerate</button>
                <button className="save-button" onClick={saveLesson}>Save</button>
              </div>
            ) : (
              <div className="saved-message">
                ✅ Mifgash plan saved successfully ‐ check Mifgashim for all your other plans!
              </div>
            )}
          </div>
        )}
      </div>

      {/* step-indicator moved to bottom */}
      <div className="step-indicator">
        <div className={`step-dot ${step === 1 ? "active" : ""}`}></div>
        <div className={`step-dot ${step === 2 ? "active" : ""}`}></div>
      </div>
    </div>
  </div>
);

}

export default CreateLessonModal;
