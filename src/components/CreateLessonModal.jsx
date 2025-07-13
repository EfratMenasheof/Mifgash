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
      const uid = auth.currentUser?.uid;
      if (uid) {
        const friends = await fetchUserFriends(uid);
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
        : "a relevant cultural topic";
    }

    if (mode === "custom") {
      topicDescription = customTopic.trim();
    }

    const prompt = `
You are a creative language teacher. Create a short and simple language lesson in ${teachingLanguage} for the topic "${topicDescription}". Translate the topic into ${teachingLanguage} if needed.

Your response must follow this exact structure. Separate each section using "===":

1. Title – a short and catchy title, only in ${teachingLanguage}. Do NOT use English if ${teachingLanguage} is Hebrew, and vice versa.
===
2. Description – 1 short sentence (up to 10 words), only in ${teachingLanguage}.
===
3. Lesson Plan – write these 4 parts using ${teachingLanguage} only:

🎯 Objectives  
• Write 2 short bullet points in ${teachingLanguage}

🧠 Vocabulary  
• List 5 useful words in ${teachingLanguage}, each with its translation in parentheses:
   - If teaching ${teachingLanguage} = Hebrew → translate to English  
   - If teaching ${teachingLanguage} = English → translate to Hebrew

💬 Dialogue  
• 2 short lines of simple dialogue in ${teachingLanguage}

📝 Practice  
• 1 short sentence or question in ${teachingLanguage} for learners to complete or answer

Return plain text only, fully structured. Do NOT include explanations. The entire response must be written in ${teachingLanguage}.
`.trim();

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are a helpful and creative language lesson planner." },
            { role: "user", content: prompt },
          ],
        }),
      });

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || "Error: No lesson received.";
      const [title, description, content] = raw.split("===").map(part => part.trim());

      setGeneratedLesson({
        topic: title || topicDescription,
        description: description || topicDescription,
        fullContent: content || raw,
        recipients: mode === "friend" ? [selectedFriendId] : [],
        language: teachingLanguage,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });

      if (mode === "friend") {
        setInterestIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Groq error:", err);
      alert("❌ Failed to generate lesson.");
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

        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? "active" : ""}`}></div>
          <div className={`step-dot ${step === 2 ? "active" : ""}`}></div>
        </div>

        {step === 2 && (
          <div style={{ textAlign: "left", marginBottom: "1rem" }}>
            <button className="secondary" onClick={goBack}>← Back</button>
          </div>
        )}

        <div className="modal-body-scroll">
          {step === 1 && (
            <>
              <p className="form-label">You’ll be teaching: <strong>{teachingLanguage}</strong></p>

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
                    {realFriends.map((f) => (
                      <div
                        key={f.id}
                        className={`friend-option ${selectedFriendId === f.id ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedFriendId(f.id);
                          setInterestIndex(0);
                        }}
                      >
                        <img
  src={f.profileImage}
  alt={f.fullName}
  className="mini-profile"
/>

                        <div className="friend-name">{f.fullName}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {mode === "custom" && (
                <>
                  <label className="form-label">Enter your topic (up to 5 words):</label>
                  <input
                    type="text"
                    maxLength={40}
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
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
                  (!mode || (mode === "friend" && !selectedFriendId) || (mode === "custom" && !customTopic.trim()))
                }
              >
                {loading ? "Generating..." : "Generate Mifgash Plan"}
              </button>
            </>
          )}

          {step === 2 && generatedLesson && (
            <div className="lesson-box" dir={generatedLesson.language === "Hebrew" ? "rtl" : "ltr"}>
              <h4>{generatedLesson.topic}</h4>
              <pre>{generatedLesson.fullContent}</pre>
              {!saved ? (
                <div className="approve-actions vertical">
                  <button className="generate-button" onClick={generateLesson}>Regenerate</button>
                  <button className="save-button" onClick={saveLesson}>Save</button>
                </div>
              ) : (
                <div className="saved-message">✅ Mifgash plan saved successfully</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLessonModal;
