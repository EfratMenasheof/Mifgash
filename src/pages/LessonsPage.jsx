import React, { useState } from 'react';
import './LessonsPage.css';
import { mockFriends } from '../data/FriendsData';
import { mockLessons } from '../data/MockLessons';
import LessonModal from '../components/LessonModal';
import CreateLessonModal from '../components/CreateLessonModal';
import LessonCard from '../components/LessonCard';

function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [lessons, setLessons] = useState(mockLessons);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveLesson = (newLesson) => {
    setLessons((prevLessons) => [...prevLessons, newLesson]);
  };

  const filteredLessons = lessons
    .filter((lesson) =>
      lesson.topic?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // sort by newest first

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
        friends={mockFriends}
        onSave={handleSaveLesson}
      />
    </div>
  );
}

export default LessonsPage;
////3////