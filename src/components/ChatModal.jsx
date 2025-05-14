import './ChatModal.css';
import { mockFriends } from '../data/FriendsData';
import { useState, useEffect } from 'react';

function ChatModal({ onClose, chatHistory, setChatHistory }) {
  const friends = mockFriends.filter(f => f.isFriend && f.id !== 'user');
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chatHistory[friends[0].id] || []);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMessages(chatHistory[selectedFriend.id] || []);
  }, [selectedFriend, chatHistory]);

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
  };

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
    setChatHistory(prev => ({
      ...prev,
      [selectedFriend.id]: updated
    }));
    setInput('');
  };

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="chat-sidebar">
          <input
            type="text"
            className="chat-search-input"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {[...friends]
            .sort((a, b) => {
              const lastA = chatHistory[a.id]?.slice(-1)[0];
              const lastB = chatHistory[b.id]?.slice(-1)[0];

              if (!lastA && !lastB) return 0;
              if (!lastA) return 1;
              if (!lastB) return -1;

              const timeA = new Date(lastA.fullDate);
              const timeB = new Date(lastB.fullDate);
              return timeB - timeA;
            })
            .filter(friend => {
              const nameMatch = friend.name.toLowerCase().includes(searchTerm.toLowerCase());
              const lastMsg = chatHistory[friend.id]?.slice(-1)[0]?.text?.toLowerCase() || '';
              const messageMatch = lastMsg.includes(searchTerm.toLowerCase());
              return nameMatch || messageMatch;
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
          <div className="chat-header">
            <img src={selectedFriend.image} alt={selectedFriend.name} />
            <span>{selectedFriend.name}</span>
          </div>

          <div className="chat-messages">
            {(() => {
              let lastDate = '';
              return messages.map((msg, idx) => {
                const showDate = msg.date !== lastDate;
                lastDate = msg.date;

                return (
                  <div key={idx}>
                    {showDate && (
                      <div className="chat-date-divider">{msg.date}</div>
                    )}
                    <div className={`chat-bubble ${msg.sender === 'user' ? 'me' : 'them'}`}>
                      {msg.text}
                      <span className="chat-time-small">{msg.time}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ChatModal;