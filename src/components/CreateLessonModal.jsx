import React, { useState, useEffect } from 'react';
import './CreateLessonModal.css';

function CreateLessonModal({ show, onClose, friends, onSave }) {
  const [language, setLanguage] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [lessonIndex, setLessonIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [step, setStep] = useState(1);

  const sampleLessons = [
    {
      topic: 'פואטרי סלאם',
      description: 'ניתוח פואטרי סלאם ישראלי',
      fullContent: `🎯 מטרות:\n- להיחשף לעולם הפואטרי סלאם\n- לתרגל הבעה בעל פה\n\n🧠 מילים חדשות:\n- במה, קהל, שיר, רגש, קצב\n\n💬 דיאלוג:\n- המשתמש משתף שיר קצר עם החבר, החבר מגיב ומספר מה הבין\n\n📝 תרגול:\n1. כתיבת שורת פתיחה לשיר אישי\n2. תרגום מילים בסיסיות לעברית`
    },
    {
      topic: 'ארוחות שישי',
      description: 'שיח על מנהגי ומסורות שבת',
      fullContent: `🎯 מטרות:\n- לדבר על מסורות ערב שבת\n- ללמוד מילים שקשורות לאוכל, משפחה ומנהגים\n\n🧠 מילים חדשות:\n- חלה, נרות, קידוש, דג, סלטים\n\n💬 דיאלוג:\n- שיחה בין שני חברים על איך נראית אצלם ארוחת שבת\n\n📝 תרגול:\n1. תיאור תמונה של שולחן שבת\n2. השלמת משפטים לפי מנהגים שונים`
    }
  ];

  useEffect(() => {
    if (!show) {
      setLanguage('');
      setSelectedFriendId('');
      setSaved(false);
      setLessonIndex(0);
      setHasGeneratedOnce(false);
      setStep(1);
    }
  }, [show]);

  if (!show) return null;

  const actualFriends = friends.filter((f) => f.isFriend);

  const generateSuggestion = () => {
    setSaved(false);
    setHasGeneratedOnce(true);
    setLessonIndex((prev) => (prev + 1) % sampleLessons.length);
    setStep(2);
  };

  const goBack = () => {
    setStep(1);
    setSaved(false);
  };

  const currentLesson = sampleLessons[lessonIndex];

  const saveLesson = () => {
  const newLesson = {
    topic: currentLesson.topic, // תמיד בעברית
    language,
    recipients: [Number(selectedFriendId)],
    description: `${currentLesson.description}`, // גם תמיד בעברית
    createdAt: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    fullContent: currentLesson.fullContent // גם בעברית
  };

  if (onSave) onSave(newLesson);
  setSaved(true);
};


  return (
    <div className="lesson-modal-overlay">
      <div className="lesson-modal-container wide centered-modal">
        <button className="modal-close-button" onClick={onClose}>✕</button>
        <h2 className="modal-title">CREATE A NEW MIFGASH</h2>

        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step === 2 ? 'active' : ''}`}></div>
        </div>

        {step === 2 && (
          <div className="back-top-button-wrapper">
            <button type="button" className="back-button" onClick={goBack}>← Back</button>
          </div>
        )}

        <div className="modal-body-scroll">
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">Choose a Language:</label>
                <label><input type="radio" name="lang" value="Hebrew" checked={language === 'Hebrew'} onChange={() => setLanguage('Hebrew')} /> Hebrew</label>
                <label><input type="radio" name="lang" value="English" checked={language === 'English'} onChange={() => setLanguage('English')} /> English</label>
              </div>

              <div className="form-group">
                <label className="form-label">Choose a Connection:</label>
                <div className="friend-scroll-box">
                  {actualFriends.map((f) => (
                    <div
                      key={f.id}
                      className={`friend-option ${selectedFriendId === f.id.toString() ? 'selected' : ''}`}
                      onClick={() => setSelectedFriendId(f.id.toString())}
                    >
                      <img src={f.image} alt={f.name} className="friend-avatar" />
                      <div className="friend-name">{f.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="generate-button" onClick={generateSuggestion} disabled={!language || !selectedFriendId}>
                Generate Mifgash Plan
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="lesson-box" dir="rtl">
                <h4>🎓 מערך שיעור בנושא: {currentLesson.topic}</h4>
                <pre>{currentLesson.fullContent}</pre>
                {!saved ? (
                  <div className="approve-actions vertical">
                    <button type="button" className="generate-button" onClick={generateSuggestion}>Regenerate</button>
                    <button type="button" className="save-button" onClick={saveLesson}>Save</button>
                  </div>
                ) : (
                  <div className="saved-message">✅ Mifgash plan saved successfully</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLessonModal;
