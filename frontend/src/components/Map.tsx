import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type MapProps = {
  address: string;
  position?: [number, number];
};

const theatreIcon = L.divIcon({
  className: "theatre-map-marker",
  html: '<span class="theatre-map-marker__pulse"></span><span class="theatre-map-marker__pin"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span>',
  iconSize: [42, 52],
  iconAnchor: [21, 48],
  popupAnchor: [0, -44],
});

export default function Map({ address, position = [39.7747, 64.4286] }: MapProps) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className="theatre-map"
      aria-label={`Theatre location: ${address}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={theatreIcon}>
        <Popup>
          <div className="theatre-map-popup">
            <strong>Театр</strong>
            <p>{address}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}