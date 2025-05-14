import './FloatingMessageButton.css';

function FloatingMessageButton({ onClick, hasNewMessage }) {
    return (
      <button className={`floating-msg-btn ${hasNewMessage ? 'has-new' : ''}`} onClick={onClick}>
        💬
      </button>
    );
  }

export default FloatingMessageButton;