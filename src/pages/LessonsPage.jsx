// LessonsPage.jsx
import React, { useEffect, useState } from "react";
import "./LessonsPage.css";
import LessonModal from "../components/LessonModal";
import CreateLessonModal from "../components/CreateLessonModal";
import LessonCard from "../components/LessonCard";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { fetchUserFriends } from "../utils/fetchFriends";

function LessonsPage() {
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [friends, setFriends] = useState([]);              // ← new state
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 🟦 Load full user data from Firestore in real time
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const u = { id: snap.id, ...snap.data() };
        setUser(u);
      } else {
        console.warn("User not found in Firestore:", currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🆕 As soon as we have `user`, fetch their friends
  useEffect(() => {
    if (!user?.id) return;

    const loadFriends = async () => {
      try {
        const list = await fetchUserFriends(user.id);
        setFriends(list);
        console.log("✅ Friends loaded in LessonsPage:", list);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    loadFriends();
  }, [user]);

  // 🟧 Fetch lessons for this user
  useEffect(() => {
    if (!user?.id) return;

    const fetchLessons = async () => {
      const snapshot = await getDocs(collection(db, "lessons"));
      const allLessons = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const userLessons = allLessons.filter(
        (lesson) => lesson.createdBy === user.id
      );
      setLessons(userLessons);
    };

    fetchLessons();
  }, [user]);

  // 🟩 Add new lesson immediately when saved
  const handleSaveLesson = (newLesson) => {
    setLessons((prev) => [...prev, newLesson]);
  };

  const filteredLessons = lessons
    .filter((lesson) =>
      lesson.topic?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container mt-4">
      <h1 className="leadconnections-title">YOUR MIFGASHIM</h1>
      <h5 className="mifgash-subtitle">
        From dialogue to connection – every mifgash matters ✨
      </h5>

      <div className="lesson-wrapper smaller">
        <div className="d-flex justify-content-between align-items-center mb-0">
          <div className="fw-bold">
            You have {filteredLessons.length} lessons
          </div>
          <input
            id="searchTerm"
            name="searchTerm"
            type="text"
            className="form-control search-input"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="scrollable-card-grid">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => setSelectedLesson(lesson)}
            />
          ))}
        </div>

        <div className="text-center mt-4 fixed-button-container">
          <button
            className="new-lesson-button"
            onClick={() => setShowCreateModal(true)}
          >
            Create a New Mifgash
          </button>
        </div>
      </div>

      <LessonModal
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
      />
      <CreateLessonModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        user={user}
        onSave={handleSaveLesson}
        /* now you also have `friends` in this component,
           so if you ever want to pass them down:
           friends={friends}
        */
      />
    </div>
  );
}

export default LessonsPage;
