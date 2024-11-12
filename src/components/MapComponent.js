import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {Icon} from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [stations, setStations] = useState([]);
  const [popupContent, setPopupContent] = useState(null);

  // Fetch the weather stations data
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_WS_API_SERVER}/ws/all`) 
      .then(response => {
        setStations(response.data);
      })
      .catch(error => {
        console.error("Error fetching the stations:", error);
      });
  }, []);

  const extractMeasurementValues = (measurement) => {
    return Object.entries(measurement)
    .filter(([key, value]) => (value !== null)||(key === "id"))
    .reduce((acc, [key, value]) => {
        acc[key] = value;  // Rebuild the object with only non-null key-value pairs
        return acc;
    }, {});
  };
  const fetchMeasurement = (station) => {
    axios.get(`${process.env.REACT_APP_WS_API_SERVER}/ws/${station.id}`)
    .then(response => {
        const data = response.data;
        const measurementValues = extractMeasurementValues(data);
        setPopupContent(
            <div>
            <h3>{station.wsName}</h3>
              <p>Site: {station.site}</p>
              <p>Portfolio: {station.portfolio}</p>
              <p>State: {station.state}</p>
              <p>Measurement:{JSON.stringify(measurementValues)}</p>
            </div>
        );
    });
  };

  return (
    <div style={{ height: '100vh' }}>
      <MapContainer center={[-33.10418, 148.07779]} zoom={5} style={{ height: '100vh', width: '100%' }}>
        {/* Add a tile layer to the map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Iterate over the stations and add markers */}
        {stations.map(station => (
          <Marker 
            key={station.id} 
            position={[parseFloat(station.latitude), parseFloat(station.longitude)]} 
            icon={new Icon({ iconUrl: '../mappin.and.ellipse.circle.svg', iconSize: [32,32] })}
            eventHandlers={{
                popupopen: () => fetchMeasurement(station), // Fetch measurement data when popup is opened
              }}
              data-testid={'marker'}
          >
            <Popup>
            {popupContent ? popupContent : <p>Loading...</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;