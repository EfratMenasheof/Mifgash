import "../components/FriendMiniCard.css";
import "./FriendsPage.css";
import FriendCardStyled from "../components/FriendCardStyled";
import { mockFriends } from "../data/FriendsData";
import { useState } from "react";
import ProfileModal from "../components/ProfileModal";

function FriendsPage() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  const visibleFriends = mockFriends.filter(friend => friend.isFriend === true);

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleCloseModal = () => {
    setSelectedFriend(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="leadconnections-title">YOUR CONNECTIONS</h1>
      <h5 className="text-center mb-3">
        Connections are important – keep them strong!
      </h5>

      <div className="friends-section">
        <div className="text-start mb-4 fw-bold">
          You have {visibleFriends.length} connections
        </div>

        <div className="friends-grid-container">
          <div className="friends-grid">
            {visibleFriends.map(friend => (
              <FriendCardStyled
                key={friend.id}
                friend={friend}
                onClick={handleFriendClick}
              />
            ))}
          </div>
        </div>

        <div className="friends-buttons mt-4">
          <button className="friends-button">Send Message</button>
          <button className="friends-button">Add New Friend</button>
        </div>
      </div>

      {selectedFriend && (
        <ProfileModal friend={selectedFriend} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default FriendsPage;
