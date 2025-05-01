// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VaccineMap from './components/VaccineMap';
import CountryDetail from './pages/CountryDetail';
import 'leaflet/dist/leaflet.css';
import './App.css';

export default function App() {
  return (
    <div className="app-container full-width">
      <div className="map-view">
        <Routes>
          <Route path="/" element={<VaccineMap />} />
          <Route path="/country/:countryCode" element={<CountryDetail />} />
        </Routes>
      </div>
    </div>
  );
}
