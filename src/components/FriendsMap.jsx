import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockFriends } from '../data/FriendsData';
import { cityCoordinates } from '../data/CityCoordinates';
import L from 'leaflet';
import './FriendsMap.css'; // הוספה

function FriendsMap() {
  return (
    <div className="friends-map-wrapper">
      <h2 className="section-title">Connections around the world 🌎</h2>
      <div className="friends-map-container">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=66752847c4ba487da7a118cb871004a5"
            attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, Data &copy; OpenStreetMap contributors'
          />
          {mockFriends.map((friend) => {
            const key = `${friend.location.city}, ${friend.location.region}`;
            const coords = cityCoordinates[key];
            if (!coords) return null;

            return (
              <Marker
                key={friend.id}
                position={[coords.lat, coords.lng]}
                icon={L.divIcon({
                  className: 'emoji-marker',
                  html: `<div style="font-size: 28px;">${friend.id === 'user' ? '🏠' : '📍'}</div>`,
                  iconSize: [28, 28],
                  iconAnchor: [14, 28]
                })}
              >
                <Popup>
                  <strong>{friend.name}</strong><br />
                  {friend.location.city}, {friend.location.region}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default FriendsMap;