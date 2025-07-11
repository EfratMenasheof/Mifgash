import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../AppStyles.css';

function FriendsMap({ friends, user }) {
  const userLocation = user.location || { lat: 31.7683, lng: 35.2137 };

  const formatLocation = (loc) => {
    if (!loc?.city || !loc?.country) return '';
    if (loc.country === "United States" && loc.state) {
      return `${loc.city}, ${loc.state}, USA`;
    }
    return `${loc.city}, ${loc.country}`;
  };

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

          {/* 🏠 המשתמש עצמו */}
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'emoji-marker',
              html: `<div style="font-size: 28px;">🏠</div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 28]
            })}
          >
            <Popup>You are here!</Popup>
          </Marker>

          {/* 📍 החברים */}
          {friends
            .filter(friend => friend.location?.lat && friend.location?.lng)
            .map(friend => (
              <Marker
                key={friend.id}
                position={[friend.location.lat, friend.location.lng]}
                icon={L.divIcon({
                  className: 'emoji-marker',
                  html: `<div style="font-size: 28px;">📍</div>`,
                  iconSize: [28, 28],
                  iconAnchor: [14, 28]
                })}
              >
                <Popup>
                  <strong>{friend.fullName || friend.name || 'Friend'}</strong><br />
                  {formatLocation(friend.location)}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default FriendsMap;
