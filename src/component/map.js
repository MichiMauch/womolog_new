import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const iconRetina = '/icons/bus.png';
const icon = '/icons/bus.png';
const shadow = '/icons/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  shadowAnchor: [16, 32],
});

const MapClickHandler = ({ latitude, longitude, enableClick }) => {
  useMapEvents({
    click: () => {
      if (enableClick) {
        window.open(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=13/${latitude}/${longitude}`, '_blank');
      }
    },
  });
  return null;
};

const MapComponent = ({ latitude, longitude, enableClick, fullSize, showZoomControl }) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: fullSize ? '100%' : '135px', width: fullSize ? '100%' : '135px' }}
      zoomControl={showZoomControl}
      className="map-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]} />
      {enableClick && <MapClickHandler latitude={latitude} longitude={longitude} enableClick={enableClick} />}
    </MapContainer>
  );
};


export default MapComponent;
