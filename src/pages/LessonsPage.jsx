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

  const handleSaveLesson = (newLesson) => {
    setLessons((prevLessons) => [...prevLessons, newLesson]);
  };

  return (
    <div className="container mt-5">
      <h1 className="leadconnections-title">YOUR MIFGASHIM</h1>
      <h5 className="text-center mb-3">
        Keep exploring, teaching and learning!
      </h5>

      <div className="lesson-wrapper smaller">
        <div className="text-start mb-4 fw-bold">
          You have {lessons.length} lessons
        </div>

        <div className="scrollable-card-grid">
          {lessons.map((lesson) => (
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
            Create a New Lesson
          </button>
        </div>
      </div>

      <LessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />
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
