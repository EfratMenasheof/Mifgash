import './LessonCard.css';

function LessonCard({ lesson, onClick }) {
  return (
    <div className="lesson-card" onClick={onClick}>
      <h5><strong>{lesson.topic}</strong></h5>
      <p>{lesson.description}</p>
      <small>נוצר ב־ {new Date(lesson.createdAt).toLocaleDateString()}</small>
    </div>
  );
}

export default LessonCard;
