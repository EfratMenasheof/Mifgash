import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CreateLessonModal({ show, onClose, friends, onSave }) {
  const [level, setLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [approved, setApproved] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generatedTopic, setGeneratedTopic] = useState('');

  useEffect(() => {
    if (!show) {
      setLevel('');
      setLanguage('');
      setSelectedFriendId('');
      setSuggestion('');
      setApproved(false);
      setSaved(false);
      setGeneratedTopic('');
    }
  }, [show]);

  const generateSuggestion = () => {
    const friend = friends.find(f => f.id === Number(selectedFriendId));
    if (!friend) {
      setSuggestion('⚠ No friend selected.');
      return;
    }

    const topic = friend.interests?.[0] || 'General conversation';

    const generated = `בהתאם לרמת הקושי "${level}" ולשפה "${language}", נושא השיעור המומלץ הוא:\n\n🗣 שיחה בנושא: ${topic} (בהשראת תחומי העניין של ${friend.name})`;

    setSuggestion(generated);
    setGeneratedTopic(topic);
    setApproved(false);
    setSaved(false);
  };

  const getFullLessonContent = () => {
    return {
      topic: generatedTopic,
      level,
      language,
      recipients: [Number(selectedFriendId)],
      description: suggestion,
      fullContent: {
        goals: `לנהל שיחה בנושא "${generatedTopic}"`,
        words: `רשימת מילים וביטויים הקשורים ל-${generatedTopic}`,
        dialogue: `שיחה לדוגמה בין מאיה לחבר על נושא "${generatedTopic}"`,
        exercise: 'תרגול: השלמת משפטים, התאמה לתרגום, שימוש בביטויים חדשים'
      },
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

  const actualFriends = friends.filter(f => f.isFriend);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create a New Lesson</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Level</Form.Label>
            <div>
              {['Beginners', 'Medium', 'Pro'].map(lvl => (
                <Form.Check
                  type="radio"
                  inline
                  key={lvl}
                  name="level"
                  label={lvl}
                  checked={level === lvl}
                  onChange={() => setLevel(lvl)}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Language to Teach</Form.Label>
            <div>
              {['Hebrew', 'English'].map(lang => (
                <Form.Check
                  type="radio"
                  inline
                  key={lang}
                  name="language"
                  label={lang}
                  checked={language === lang}
                  onChange={() => setLanguage(lang)}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Choose a Friend</Form.Label>
            <Form.Select
              value={selectedFriendId}
              onChange={(e) => setSelectedFriendId(e.target.value)}
            >
              <option value="">Select a friend...</option>
              {actualFriends.map(friend => (
                <option key={friend.id} value={friend.id}>
                  {friend.name} (#{friend.id})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={generateSuggestion}>Generate</Button>
            {suggestion && <Button variant="outline-secondary" onClick={generateSuggestion}>Regenerate</Button>}
            {suggestion && !approved && <Button variant="success" onClick={approveLesson}>Approve</Button>}
          </div>

          {suggestion && (
            <div className="mt-3 p-3 bg-light border rounded" dir="rtl">
              {suggestion}
            </div>
          )}

          {approved && (
            <div className="mt-4 border p-3 bg-white shadow-sm rounded" dir="rtl">
              <h5>🎓 מערך שיעור לדוגמה</h5>
              <p><strong>מטרות:</strong> לנהל שיחה בנושא "{generatedTopic}"</p>
              <p><strong>מילים חדשות:</strong> רשימת מילים וביטויים הקשורים ל-{generatedTopic}</p>
              <p><strong>דיאלוג:</strong> שיחה לדוגמה בין מאיה לחבר על נושא "{generatedTopic}"</p>
              <p><strong>תרגול:</strong> השלמת משפטים, התאמה לתרגום, שימוש בביטויים חדשים</p>
              {!saved ? (
                <Button className="mt-2" variant="outline-success" onClick={saveLesson}>
                  Save this Lesson
                </Button>
              ) : (
                <div className="mt-2 text-success">✅ Lesson saved to your list!</div>
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
