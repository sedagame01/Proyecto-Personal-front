import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- CONSTANTES ---
const MAP_STYLE = { height: "100%", width: "100%", minHeight: "400px" }; 
const SPAIN_CENTER = [40.4637, -3.7492];

// controla la camara
function RecenterMap({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (!center) return;


        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();

        const isSameLat = Math.abs(currentCenter.lat - center[0]) < 0.0001;
        const isSameLng = Math.abs(currentCenter.lng - center[1]) < 0.0001;
        const isSameZoom = currentZoom === zoom;

        // SOLO movemos el mapa si es realmente necesario para evitar bucle infinito 
        if (!isSameLat || !isSameLng || !isSameZoom) {
            map.setView(center, zoom);
        }

   
    }, [center[0], center[1], zoom, map]); 

    return null;
}

export default function MyMap({ markers = [] }) {
    
    // Calculamos centro y zoom
    const { mapCenter, zoom } = useMemo(() => {
        if (markers && markers.length > 0) {
            // Centrar en el primer marcador
            return { mapCenter: markers[0].position, zoom: 9 };
        }
        return { mapCenter: SPAIN_CENTER, zoom: 5 };
    }, [markers]);

    return (
        <div style={{ height: "400px", width: "100%", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
            <MapContainer 
                center={SPAIN_CENTER} 
                zoom={5} 
                scrollWheelZoom={false}
                style={MAP_STYLE}
                // Key estática para evitar que el mapa se destruya y recree 
                key="main-map-container"
            >
                <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />
                
                
                <RecenterMap center={mapCenter} zoom={zoom} />
                
                
                {markers.map((marker) => (
                    <Marker 
                        
                        // Evita usar Math.random() en la key
                        key={marker.id || `${marker.position[0]}-${marker.position[1]}`} 
                        position={marker.position}
                    >
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <strong>{marker.name}</strong>
                                <br/>
                                <span style={{ fontSize: '0.9em', color: '#666' }}>
                                    {marker.province}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}