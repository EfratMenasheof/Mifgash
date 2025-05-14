import React, { useState } from 'react';
import './LessonsPage.css';
import { mockFriends } from '../data/FriendsData';
import { mockLessons } from '../data/MockLessons';
import LessonModal from '../components/LessonModal';
import CreateLessonModal from '../components/CreateLessonModal';

const levels = ['All Levels', 'Beginners', 'Medium', 'Pro'];

function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [lessons, setLessons] = useState({
    beginners: [...mockLessons.beginners],
    medium: [...mockLessons.medium],
    pro: [...mockLessons.pro]
  });

  const handleSaveLesson = (newLesson) => {
    const levelKey = newLesson.level.toLowerCase();
    const id = Date.now();
    const lessonWithId = { ...newLesson, id };
    setLessons(prev => ({
      ...prev,
      [levelKey]: [...prev[levelKey], lessonWithId]
    }));
  };

  const allLessons = [...lessons.beginners, ...lessons.medium, ...lessons.pro];

  const getLessonList = (key) => {
    const list = key === 'alllevels' ? allLessons : lessons[key];
    return list.map((lesson) => {
      let label = lesson.topic;
      if (key === 'alllevels') {
        const levelLabel = lesson.level || 'Unknown';
        label += ` (${levelLabel})`;
      }

      return (
        <li
          key={lesson.id}
          className="lesson-item"
          style={{ direction: 'rtl', textAlign: 'right' }}
          onClick={() => setSelectedLesson(lesson)}
        >
          <strong>{label}</strong> – {lesson.description}
        </li>
      );
    });
  };

  return (
    <div className="container mt-5">

      {/* MY LESSONS */}
      <div className="lesson-wrapper">
        <h2 className="lesson-title">MY LESSONS</h2>

        <div className="accordion" id="lessonLevels">
          {levels.map((level, index) => {
            const key = level.toLowerCase().replace(/\s/g, '');
            return (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                  >
                    {level}
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#lessonLevels"
                >
                  <div className="accordion-body">
                    <ul>
                      {getLessonList(key)}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-4">
          <button
            className="new-lesson-button"
            onClick={() => setShowCreateModal(true)}
          >
            Create a New Lesson
          </button>
        </div>
      </div>

      {/* מודל צפייה בשיעור */}
      <LessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />

      {/* מודל יצירת שיעור חדש */}
      <CreateLessonModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        friends={mockFriends}
        onSave={handleSaveLesson}
      />

      {/* MY ENGLISH LESSONS */}
      <div className="lesson-wrapper">
        <h2 className="lesson-title">MY ENGLISH LESSONS</h2>
        <div className="row gy-3">
          <div className="col-md-4"><div className="card p-3 bg-light text-center">Lesson A</div></div>
          <div className="col-md-4"><div className="card p-3 bg-light text-center">Lesson B</div></div>
          <div className="col-md-4"><div className="card p-3 bg-light text-center">Lesson C</div></div>
        </div>
      </div>
    </div>
  );
}

export default LessonsPage;
