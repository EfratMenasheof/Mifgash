import React from 'react';
import './LessonModal.css';

function LessonModal({ lesson, onClose }) {
  if (!lesson) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content lesson-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        <h2 className="lesson-title-modal">{lesson.topic}</h2>
        <p style={{ direction: 'rtl', textAlign: 'right', fontStyle: 'italic' }}>
          {lesson.description}
        </p>
        <pre style={{
          whiteSpace: 'pre-wrap',
          background: '#f9f9f9',
          padding: '12px',
          borderRadius: '8px',
          fontFamily: 'inherit',
          direction: 'rtl',
          textAlign: 'right'
        }}>
          {lesson.fullContent}
        </pre>
      </div>
    </div>
  );
}

export default LessonModal;
