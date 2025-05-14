import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function LessonModal({ lesson, onClose }) {
  if (!lesson) return null;

  return (
    <div className="custom-modal-wrapper">
      <Modal
  show={!!lesson}
  onHide={onClose}
  size="lg"
  style={{ margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  centered
>

        <Modal.Header closeButton>
          <Modal.Title>{lesson.topic}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ direction: 'rtl', textAlign: 'right' }}>
            <em>{lesson.description}</em>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary">Edit</Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LessonModal;
