import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CreateLessonModal({ show, onClose, friends, onSave }) {
  const [language, setLanguage] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [approved, setApproved] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generatedTopic, setGeneratedTopic] = useState('');

  useEffect(() => {
    if (!show) {
      setLanguage('');
      setSelectedFriendId('');
      setSuggestion('');
      setApproved(false);
      setSaved(false);
      setGeneratedTopic('');
    }
  }, [show]);

  const actualFriends = friends.filter((f) => f.isFriend);

const generateSuggestion = () => {
  const friend = friends.find((f) => f.id === Number(selectedFriendId));
  if (!friend || !language) {
    setSuggestion('⚠ נא לבחור שפה וחבר לפני יצירת רעיון לשיעור.');
    return;
  }

  const topicEnglish = friend.interests?.[0] || 'שיחה כללית';

  // מפה פשוטה של תרגום תחומי עניין
  const translations = {
    'Poetry slams': 'פואטרי סלאם',
    'Yoga': 'יוגה',
    'Going to the beach': 'חוף ים',
    'Comedy podcasts': 'פודקאסטים מצחיקים',
    'Vegan recipes': 'מתכונים טבעוניים'
  };

  const topicHebrew = translations[topicEnglish] || topicEnglish;

  let generated = '';
  if (language === 'Hebrew') {
    generated = `נושא השיעור המומלץ הוא:\n\n🗣 שיחה בנושא: ${topicHebrew}`;
  } else {
    generated = `Recommended topic:\n\n🗣 Conversation about: ${topicEnglish}`;
  }

  setSuggestion(generated);
  setGeneratedTopic(language === 'Hebrew' ? topicHebrew : topicEnglish);
  setApproved(false);
  setSaved(false);
};


  const getFullLessonContent = () => {
    return {
      topic: generatedTopic,
      language,
      recipients: [Number(selectedFriendId)],
      description: '${generatedTopic}',
      createdAt: new Date().toISOString().split('T')[0],
fullContent: `🎯 מטרות:\n- לנהל שיחה בנושא "${generatedTopic}"\n\n🧠 מילים חדשות:\n- אוצר מילים רלוונטי לנושא\n\n💬 דיאלוג:\n- דיאלוג מדומה בנושא בין המשתמש לחבר\n\n📝 תרגול:\n1. השלמת משפטים\n2. התאמה בין מושגים בעברית ואנגלית`
    };
  };

  const approveLesson = () => {
    setApproved(true);
  };

  const saveLesson = () => {
    const newLesson = getFullLessonContent();
    if (onSave) onSave(newLesson);
    setSaved(true);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>צור שיעור חדש</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form dir="rtl">
          <Form.Group className="mb-3">
            <Form.Label>בחר שפה:</Form.Label>
            <div>
              <Form.Check
                type="radio"
                inline
                label="עברית"
                value="Hebrew"
                checked={language === 'Hebrew'}
                onChange={() => setLanguage('Hebrew')}
              />
              <Form.Check
                type="radio"
                inline
                label="English"
                value="English"
                checked={language === 'English'}
                onChange={() => setLanguage('English')}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>בחר חבר:</Form.Label>
            <Form.Select
              value={selectedFriendId}
              onChange={(e) => setSelectedFriendId(e.target.value)}
            >
              <option value="">...Select a friend</option>
              {actualFriends.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-2 mb-3">
            <Button variant="primary" onClick={generateSuggestion}>
              Generate Lesson
            </Button>
            {suggestion && !approved && (
              <Button variant="success" onClick={approveLesson}>
                Approve
              </Button>
            )}
          </div>

          {suggestion && (
            <div className="p-3 bg-light border rounded mb-3" dir="rtl">
              {suggestion}
            </div>
          )}

          {approved && (
            <div className="p-3 border rounded bg-white" dir="rtl">
              <h5>🎓 מערך שיעור לדוגמה</h5>
              <p><strong>מטרות:</strong> לנהל שיחה בנושא "{generatedTopic}"</p>
              <p><strong>מילים חדשות:</strong> אוצר מילים רלוונטי לנושא</p>
              <p><strong>דיאלוג:</strong> דיאלוג מדומה בנושא בין המשתמש לחבר</p>
              <p><strong>תרגול:</strong> השלמת משפטים, התאמה בין מושגים בעברית ואנגלית</p>
              {!saved ? (
                <Button className="mt-2" variant="outline-success" onClick={saveLesson}>
                  Save this Lesson
                </Button>
              ) : (
                <div className="mt-2 text-success">✅ השיעור נשמר לרשימה שלך</div>
              )}
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateLessonModal;
