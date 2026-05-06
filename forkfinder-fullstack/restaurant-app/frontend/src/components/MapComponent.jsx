import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapComponent = ({ userLocation, restaurants = [], singleRestaurant }) => {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : singleRestaurant
    ? [singleRestaurant.location.coordinates[1], singleRestaurant.location.coordinates[0]]
    : [20, 0];

  const zoom = userLocation || singleRestaurant ? 14 : 2;

  return (
    <MapContainer center={center} zoom={zoom} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {singleRestaurant && (
        <Marker
          position={[
            singleRestaurant.location.coordinates[1],
            singleRestaurant.location.coordinates[0],
          ]}
        >
          <Popup>{singleRestaurant.name}</Popup>
        </Marker>
      )}

      {restaurants.map((r) =>
        r.location?.coordinates ? (
          <Marker
            key={r._id}
            position={[r.location.coordinates[1], r.location.coordinates[0]]}
          >
            <Popup>
              <strong>{r.name}</strong>
              <br />
              {r.cuisine} · {r.priceRange}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default MapComponent;
