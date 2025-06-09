import './ChatModal.css';
import { mockFriends } from '../data/FriendsData';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

function ChatModal({ onClose, chatHistory, setChatHistory, currentUser }) {
  const friends = mockFriends.filter(f => f.isFriend && f.id !== 'user');
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chatHistory[friends[0].id] || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [meetingDate, setMeetingDate] = useState({
    day: '',
    month: '',
    year: '2025',
    time: '',
    language: 'en'
  });

  useEffect(() => {
    setMessages(chatHistory[selectedFriend.id] || []);
  }, [selectedFriend, chatHistory]);

  const handleSend = () => {
    if (input.trim() === '') return;
    const now = new Date();
    const newMessage = {
      sender: 'user',
      text: input,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString(),
      fullDate: now.toISOString()
    };
    const updated = [...(chatHistory[selectedFriend.id] || []), newMessage];
    setMessages(updated);
    setChatHistory(prev => ({ ...prev, [selectedFriend.id]: updated }));
    setInput('');
  };

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
  };

  const handleSendMeeting = () => {
    const { day, month, year, time, language } = meetingDate;
    if (!day || month === '' || !year || !time) return;

    const fullDateStr = new Date(
  parseInt(year),
  parseInt(month),
  parseInt(day),
  parseInt(time.split(':')[0]),
  parseInt(time.split(':')[1])
);
    const formattedDate = fullDateStr.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = fullDateStr.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jerusalem'
    });

    const now = new Date();
    const userName = currentUser?.name || "You";

    const meetingMessage = {
      sender: 'user',
      type: 'meeting',
      meetingDate: `${formattedDate} at ${formattedTime}`,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString(),
      fullDate: now.toISOString(),
      status: null,
      text: `Maya wants to schedule a Mifgash!`,
      language: language
    };

    const updated = [...(chatHistory[selectedFriend.id] || []), meetingMessage];
    setMessages(updated);
    setChatHistory(prev => ({ ...prev, [selectedFriend.id]: updated }));
    setMeetingDate({ day: '', month: '', year: '2025', time: '', language: 'en' });
    setShowMeetingDialog(false);
  };

  const handleMeetingResponse = (index, status) => {
    const updated = [...(chatHistory[selectedFriend.id] || [])];
    updated[index].status = status;
    setMessages(updated);
    setChatHistory(prev => ({ ...prev, [selectedFriend.id]: updated }));
    if (status === 'accepted') triggerConfetti();
  };

  const triggerConfetti = () => {
    const myCanvas = document.createElement('canvas');
    myCanvas.style.position = 'fixed';
    myCanvas.style.top = '0';
    myCanvas.style.left = '0';
    myCanvas.style.width = '100%';
    myCanvas.style.height = '100%';
    myCanvas.style.pointerEvents = 'none';
    myCanvas.style.zIndex = '5000';
    document.body.appendChild(myCanvas);

    const myConfetti = confetti.create(myCanvas, {
      resize: true,
      useWorker: true
    });

    myConfetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      document.body.removeChild(myCanvas);
    }, 2000);
  };

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="chat-sidebar">
          <div className="chat-sidebar-topbar">
            <input
              type="text"
              className="chat-search-input"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {[...friends]
            .sort((a, b) => {
              const lastA = chatHistory[a.id]?.slice(-1)[0];
              const lastB = chatHistory[b.id]?.slice(-1)[0];
              if (!lastA && !lastB) return 0;
              if (!lastA) return 1;
              if (!lastB) return -1;
              return new Date(lastB.fullDate) - new Date(lastA.fullDate);
            })
            .filter(friend => {
              const nameMatch = friend.name.toLowerCase().includes(searchTerm.toLowerCase());
              const lastMsg = chatHistory[friend.id]?.slice(-1)[0]?.text?.toLowerCase() || '';
              return nameMatch || lastMsg.includes(searchTerm.toLowerCase());
            })
            .map(friend => {
              const lastMsg = chatHistory[friend.id]?.slice(-1)[0];
              return (
                <div
                  key={friend.id}
                  className={`chat-friend-item ${selectedFriend.id === friend.id ? 'active' : ''}`}
                  onClick={() => handleSelectFriend(friend)}
                >
                  <img src={friend.image} alt={friend.name} className="chat-friend-pic" />
                  <div className="chat-friend-info">
                    <strong>{friend.name}</strong>
                    <p className="chat-preview">{lastMsg?.text?.slice(0, 30) || 'No messages yet'}</p>
                  </div>
                  <span className="chat-time">{lastMsg ? `${lastMsg.date} ${lastMsg.time}` : ''}</span>
                </div>
              );
            })}
        </div>

        <div className="chat-window">
          <div className="chat-header-top chat-header">
            <img src={selectedFriend.image} alt={selectedFriend.name} className="chat-friend-pic" />
            <div className="chat-username">{selectedFriend.name}</div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex' }}>
                {idx === 0 || messages[idx - 1].date !== msg.date ? (
                  <div className="chat-date-divider">{msg.date}</div>
                ) : null}

                {msg.type === 'meeting' ? (
                  <div className={`meeting-card ${msg.sender === 'user' ? 'me' : 'them'}`}>
                    <strong>{msg.text}</strong><br />
📅 {msg.meetingDate.includes('T')
  ? new Date(msg.meetingDate).toLocaleString(msg.language === 'he' ? 'he-IL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jerusalem'
    })
  : msg.meetingDate}

                    {msg.sender !== 'user' && msg.status == null && (
                      <div className="meeting-actions">
                        <button onClick={() => handleMeetingResponse(idx, 'accepted')}>✅ Accept</button>
                        <button onClick={() => handleMeetingResponse(idx, 'declined')}>❌ Decline</button>
                      </div>
                    )}

                    {msg.sender !== 'user' && msg.status === 'accepted' && (
                      <p className="meeting-status">✔️ You accepted the meeting</p>
                    )}
                    {msg.sender !== 'user' && msg.status === 'declined' && (
                      <p className="meeting-status">❌ You declined the invitation</p>
                    )}

                    {msg.sender === 'user' && (
                      <p className="meeting-status">
                        {msg.status === 'accepted' && '✔️ The user accepted the meeting'}
                        {msg.status === 'declined' && '❌ The user declined the invitation'}
                        {msg.status == null && '🕗 Waiting for confirmation...'}
                      </p>
                    )}

                    <span className="chat-time-small">{msg.time}</span>
                  </div>
                ) : (
                  <div className={`chat-bubble ${msg.sender === 'user' ? 'me' : 'them'}`}>
                    {msg.text}
                    <span className="chat-time-small">{msg.time}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="icon-button send-button" onClick={handleSend} title="Send">➤</button>
            <button className="icon-button" onClick={() => setShowMeetingDialog(true)} title="Schedule a meeting">📅</button>
          </div>

          {showMeetingDialog && (
            <div className="meeting-modal-overlay" onClick={() => setShowMeetingDialog(false)}>
              <div className="meeting-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: '12px', textAlign: 'center' }}>📅 Schedule your next Mifgash</h2>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <select value={meetingDate.month} onChange={(e) => setMeetingDate({ ...meetingDate, month: e.target.value })}>
                    {["January","February","March","April","May","June","July","August","September","October","November","December"]
                      .map((month, i) => (
                        <option key={i} value={i}>{month}</option>
                    ))}
                  </select>

                  <select value={meetingDate.day} onChange={(e) => setMeetingDate({ ...meetingDate, day: e.target.value })}>
                    {[...Array(31).keys()].map(i => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>

                  <select value={meetingDate.year} onChange={(e) => setMeetingDate({ ...meetingDate, year: e.target.value })}>
                    {[2025, 2026].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="time"
                    value={meetingDate.time}
                    onChange={(e) => setMeetingDate({ ...meetingDate, time: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ marginRight: '6px' }}>Language:</label>
                  <select value={meetingDate.language} onChange={(e) => setMeetingDate({ ...meetingDate, language: e.target.value })}>
                    <option value="en">English</option>
                    <option value="he">עברית</option>
                  </select>
                </div>

                <div className="meeting-dialog-actions">
                  <button onClick={handleSendMeeting}>Send Invitation</button>
                  <button onClick={() => setShowMeetingDialog(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
