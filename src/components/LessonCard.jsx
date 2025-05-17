import './LessonCard.css';

function LessonCard({ lesson, onClick }) {
  const formattedDate = new Date(lesson.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="lesson-card" onClick={onClick}>
      <h5><strong>{lesson.topic}</strong></h5>
      <p>{lesson.description}</p>
      <small>Created at {formattedDate}</small>
    </div>
  );
}

export default LessonCard;
