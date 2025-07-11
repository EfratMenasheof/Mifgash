import "./FriendCardStyled.css";

function FriendCardStyled({ friend, onClick }) {
  const {
    fullName,
    profileImage,
    birthDate,
    location = {}
  } = friend;

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const today = new Date();
    const birth = new Date(birthDateString);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(birthDate);
  const locationString = [location.city, location.state, location.country].filter(Boolean).join(", ");
  const avatarToShow = profileImage || "https://via.placeholder.com/100";

  return (
    <div className="friend-card" onClick={() => onClick(friend)}>
      <img
        src={avatarToShow}
        alt={fullName || "User avatar"}
        className="friend-avatar"
      />
      {fullName && <h5 className="friend-name">{fullName}</h5>}
      {age !== null && <p className="friend-age">{age} years old</p>}
      {locationString && <p className="friend-location">{locationString}</p>}
    </div>
  );
}

export default FriendCardStyled;