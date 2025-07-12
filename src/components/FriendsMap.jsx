import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../AppStyles.css';
import ProfileModal from './ProfileModal';

function FriendsMap() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const currentUser = allUsers.find(u => u.id === uid);
      setUser(currentUser);

      const myFriends = allUsers.filter(u => currentUser?.friends?.includes(u.id));
      setFriends(myFriends);
    };

    fetchUserAndFriends();
  }, []);

  if (!user) return <div>Loading map...</div>;

  const userLocation = user.location?.coordinates;
  if (!userLocation) return <div>No location data available for your profile.</div>;

  return (
    <div className="section-box" style={{ height: '500px' }}>
      <h2 className="section-title">Connections around the world 🌎</h2>
      <div className="w-100 h-100 rounded overflow-hidden">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={2}
          scrollWheelZoom={true}
          className="w-100 h-100"
        >
          <TileLayer
            url="https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=66752847c4ba487da7a118cb871004a5"
            attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, Data &copy; OpenStreetMap contributors'
          />

          {/* User marker 🏠 */}
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'emoji-marker',
              html: `<div style="font-size: 28px;">🏠</div>`,
              iconSize: [28, 28],
              iconAnchor: [10, 36]
            })}
          >
            <Popup>You are here!</Popup>
          </Marker>

          {/* Friends markers 📍 */}
          {friends.map(friend => {
            const coords = friend.location?.coordinates;
            if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number') return null;

            return (
              <Marker
                key={friend.id}
                position={[coords.lat, coords.lng]}
                icon={L.divIcon({
                  className: 'emoji-marker',
                  html: `<div style="font-size: 28px;">📍</div>`,
                  iconSize: [28, 28],
                  iconAnchor: [10, 36],
                  popupAnchor: [8, -24]
                })}
              >
                <Popup>
                  <div
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedFriend(friend);
                      setShowProfileModal(true);
                    }}
                  >
                    {friend.profileImage && (
                      <img
                        src={friend.profileImage}
                        alt={friend.fullName}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginBottom: '10px'
                        }}
                      />
                    )}
                    <div><strong>{friend.fullName || friend.name}</strong></div>
                    <div>
                      {friend.location.city}
                      {friend.location.state ? `, ${friend.location.state}` : ''}, {friend.location.country}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {showProfileModal && selectedFriend && (
        <ProfileModal
          friend={selectedFriend}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

export default FriendsMap;
