import './FriendCardStyled.css';
import FriendMiniCard from './FriendMiniCard';

function FriendCardStyled({ friend, onClick }) {
  return (
    <div className="friend-card-wrapper" onClick={() => onClick(friend)}>
      <FriendMiniCard friend={friend} onClick={onClick} />
    </div>
  );
}

export default FriendCardStyled;