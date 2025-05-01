import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { scaleLinear } from 'd3-scale';
import { useNavigate } from 'react-router-dom';
import { fetchVaccineGaps } from '../utils/fetchVaccineData';
import geoJsonData from '../data/tempGeoJson.json';
import MapResizeHandler from './MapResizeHandler';

export default function WorldMap({ filters }) {
  const navigate = useNavigate();
  const { region, coverageRange, showConflictOnly } = filters;
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVaccineGaps(2023)
      .then(data => {
        console.log('💉 fetched vaccine data entries:', data.length, data.slice(0,5));
        setCountryData(data);
      })
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading map data…</div>;
  }

  // Filter based on sidebar controls
  const filtered = countryData.filter(c =>
    (region === 'All' || c.Region === region) &&
    c.DTP3_coverage >= coverageRange[0] &&
    c.DTP3_coverage <= coverageRange[1] &&
    (!showConflictOnly || c.Gap > 0)
  );

  const colorScaleFn = scaleLinear().domain([0, 100]).range(['red', 'green']);

  // Choropleth styling
  const style = feature => {
    const c = filtered.find(d => d.ISO3 === feature.properties.ISO_A3);
    return {
      fillColor: c 
        ? colorScaleFn(c.DTP3_coverage) 
        : 'transparent',
      weight: c ? 1 : 0,
      color: c ? 'white' : 'none',
      fillOpacity: c ? 0.7 : 0
    };
  };

  // Popups and click handler
  const onEach = (feature, layer) => {
    const c = filtered.find(d => d.ISO3 === feature.properties.ISO_A3);
    if (!c) return;
    layer.bindPopup(
      `<strong>${c.Country}</strong><br/>
       Coverage: ${c.DTP3_coverage}% (Gap: ${c.Gap}%)<br/>
       Barrier: ${c.PrimaryBarrier}<br/>
       <a href="${c.NextStepURL}" target="_blank">Take Action</a>`
    );
    layer.on('click', () => navigate(`/country/${c.ISO3}`));
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
    >
      <MapResizeHandler />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={geoJsonData} style={style} onEachFeature={onEach} />
    </MapContainer>
  );
}
