import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./RouteMap.css";

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const RouteMap = () => {
  const [pistas, setPistas] = useState([]);

  useEffect(() => {
    const storedPistas = localStorage.getItem("pistas");
    if (storedPistas) {
      const loadedPistas = JSON.parse(storedPistas);
      setPistas(loadedPistas.sort((a, b) => a.order - b.order));
    }
  }, []);

  const parseCoordinates = (coordString) => {
    if (!coordString || typeof coordString !== "string")
      return [6.2442, -75.5812]; // Default to Medellín center
    const parts = coordString.match(
      /(\d+\.\d+)°\s*([NS]),\s*(\d+\.\d+)°\s*([EW])/
    );
    if (!parts) return [6.2442, -75.5812]; // Default to Medellín center
    let lat = parseFloat(parts[1]);
    let lon = parseFloat(parts[3]);
    if (parts[2] === "S") lat *= -1;
    if (parts[4] === "W") lon *= -1;
    return [lat, lon];
  };

  const routeCoordinates = pistas.map((pista) =>
    parseCoordinates(pista.coordenadas)
  );

  const mapCenter =
    routeCoordinates.length > 0 ? routeCoordinates[0] : [6.2442, -75.5812];

  return (
    <div className="route-map-container">
      <h2>Mapa de la Ruta de Pistas</h2>
      <p>Este es el orden actual de las pistas en la carrera de observación.</p>
      <div className="map-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pistas.map((pista, index) => (
            <Marker
              key={pista.id}
              position={parseCoordinates(pista.coordenadas)}
            >
              <Popup>
                <b>
                  Pista #{index + 1} (ID: {pista.id})
                </b>
                <br />
                {pista.acertijo.substring(0, 50)}...
              </Popup>
            </Marker>
          ))}
          <Polyline
            pathOptions={{ color: "blue" }}
            positions={routeCoordinates}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default RouteMap;
