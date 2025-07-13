import React, { useEffect, useState } from "react";
import "./LessonsPage.css";
import LessonModal from "../components/LessonModal";
import CreateLessonModal from "../components/CreateLessonModal";
import LessonCard from "../components/LessonCard";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function LessonsPage() {
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 🟦 Load current user
  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  // 🟧 Fetch lessons from Firestore
  useEffect(() => {
    const fetchLessons = async () => {
      const snapshot = await getDocs(collection(db, "lessons"));
      const allLessons = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // 🟨 Filter only lessons created by current user
      const userLessons = allLessons.filter(
        lesson => lesson.createdBy === user?.uid
      );
      setLessons(userLessons);
    };

    if (user?.uid) {
      fetchLessons();
    }
  }, [user]);

  // 🟩 When a lesson is saved, update state immediately
  const handleSaveLesson = (newLesson) => {
    setLessons(prev => [...prev, newLesson]);
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
          <div className="fw-bold">You have {filteredLessons.length} lessons</div>
          <input
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
              key={lesson.id || lesson.topic}
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
      />
    </div>
  );
}

export default LessonsPage;
