import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { fetchUserFriends } from "../utils/fetchFriends";
import "./CreateLessonModal.css";

function CreateLessonModal({ show, onClose, user }) {
  const [mode, setMode] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [generatedLesson, setGeneratedLesson] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [realFriends, setRealFriends] = useState([]);

  const teachingLanguage = user?.learningGoal === "English" ? "Hebrew" : "English";

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
    }
  }, [show]);

  if (!show) return null;

  const generateLesson = async () => {
    if (!user?.uid) {
      alert("User not loaded yet");
      return;
    }

    setLoading(true);
    setStep(2);
    setSaved(false);

    let prompt = "";
    let topicDescription = "";

    if (mode === "friend") {
      const friend = realFriends.find((f) => f.id === selectedFriendId);
      if (!friend) {
        alert("Friend not found");
        setLoading(false);
        return;
      }

      const interests = friend.interests || [];
      const chosenInterest = interests[0] || "a topic relevant to Jewish-American youth";
      topicDescription = chosenInterest;

      prompt = `
You are a creative language teacher. Create a short and simple lesson in ${teachingLanguage} for the topic "${chosenInterest}".

🎯 Objectives – 2 short bullet points  
🧠 Vocabulary – 5 useful words in ${teachingLanguage}  
💬 Dialogue – 2 short lines of dialogue  
📝 Practice – 1 short exercise  

Only respond in ${teachingLanguage}. Return only the formatted content.`.trim();
    }

    if (mode === "custom") {
      topicDescription = customTopic.trim();
      prompt = `
You are a creative language teacher. Create a short and simple lesson in ${teachingLanguage} for the topic "${topicDescription}".

🎯 Objectives – 2 short bullet points  
🧠 Vocabulary – 5 useful words  
💬 Dialogue – 2 short lines of dialogue  
📝 Practice – 1 short exercise  

Only respond in ${teachingLanguage}. Return only the formatted content.`.trim();
    }

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
      const content = data.choices?.[0]?.message?.content || "Error: No lesson received.";

      const newLesson = {
        topic: topicDescription,
        description: topicDescription,
        fullContent: content,
        recipients: mode === "friend" ? [selectedFriendId] : [],
        language: teachingLanguage,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      };

      setGeneratedLesson(newLesson);
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
      await addDoc(collection(db, "lessons"), generatedLesson);
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
    <div className="lesson-modal-overlay">
      <div className="lesson-modal-container centered-modal">
        <button className="modal-close-button" onClick={onClose}>✕</button>
        <h2 className="modal-title">Create a New Mifgash</h2>

        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? "active" : ""}`}></div>
          <div className={`step-dot ${step === 2 ? "active" : ""}`}></div>
        </div>

        {step === 2 && (
          <div className="back-top-button-wrapper">
            <button className="back-button" onClick={goBack}>← Back</button>
          </div>
        )}

        <div className="modal-body-scroll">
          {step === 1 && (
            <>
              <p className="form-label" style={{ textAlign: "center" }}>
                You’ll be teaching: <strong>{teachingLanguage}</strong>
              </p>

              <div className="form-group">
                <label className="form-label">Choose lesson creation method:</label>
                <div className="radio-wrapper">
                  <label>
                    <input type="radio" name="mode" value="friend" checked={mode === "friend"} onChange={() => setMode("friend")} />
                    Teach a friend
                  </label>
                  <label>
                    <input type="radio" name="mode" value="custom" checked={mode === "custom"} onChange={() => setMode("custom")} />
                    Custom topic
                  </label>
                </div>
              </div>

              {mode === "friend" && (
                <div className="form-group">
                  <label className="form-label">Choose a friend to teach:</label>
                  <div className="friend-scroll-box">
                    {realFriends.map((f) => (
                      <div key={f.id} className={`friend-option ${selectedFriendId === f.id ? "selected" : ""}`} onClick={() => setSelectedFriendId(f.id)}>
                        <img src={f.profileImage} alt={f.fullName} className="friend-avatar" />
                        <div className="friend-name">{f.fullName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mode === "custom" && (
                <div className="form-group">
                  <label className="form-label">Enter your topic (up to 5 words):</label>
                  <input
                    type="text"
                    maxLength={40}
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. Israeli holidays or Hebrew slang"
                  />
                </div>
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
            <div className="lesson-box" dir={teachingLanguage === "Hebrew" ? "rtl" : "ltr"}>
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
