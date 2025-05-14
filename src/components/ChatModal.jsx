import './ChatModal.css';
import { mockFriends } from '../data/FriendsData';
import { useState } from 'react';
import chatData from '../data/chatData';

function ChatModal({ onClose }) {
  const friends = mockFriends.filter(f => f.isFriend && f.id !== 'user');
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [messages, setMessages] = useState(chatData[friends[0].id] || []);
  const [input, setInput] = useState('');

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setMessages(chatData[friend.id] || []);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    const newMessage = {
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="chat-sidebar">
          {friends.map(friend => (
            <div
              key={friend.id}
              className={`chat-friend-item ${selectedFriend.id === friend.id ? 'active' : ''}`}
              onClick={() => handleSelectFriend(friend)}
            >
              <img src={friend.image} alt={friend.name} className="chat-friend-pic" />
              <div className="chat-friend-info">
                <strong>{friend.name}</strong>
                <p className="chat-preview">
                  {(chatData[friend.id]?.slice(-1)[0]?.text || 'No messages yet').slice(0, 30)}
                </p>
              </div>
              <span className="chat-time">
                {chatData[friend.id]?.slice(-1)[0]?.time || ''}
              </span>
            </div>
          ))}
        </div>

        <div className="chat-window">
          <div className="chat-header">
            <img src={selectedFriend.image} alt={selectedFriend.name} />
            <span>{selectedFriend.name}</span>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender === 'user' ? 'me' : 'them'}`}>
                {msg.text}
                <span className="chat-time-small">{msg.time}</span>
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
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;