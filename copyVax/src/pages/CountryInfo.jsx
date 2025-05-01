import React from 'react';

export default function CountryInfo({ country }) {
  return (
    <div>
      <h1>{country.Country}</h1>
      <p>Status: {country.Status}</p>
      <p>Democracy Score: {country.DemocracyScore}</p>
      <p>Conflict Incidents: {country.ConflictIncidents}</p>
    </div>
  );
}
