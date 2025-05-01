import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchVaccineGaps } from '../utils/fetchVaccineData';

export default function CountryDetail() {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`Loading detail for country: ${countryCode}`);
    fetchVaccineGaps(2023)
      .then(data => {
        const found = data.find(c => c.ISO3 === countryCode);
        if (found) {
          console.log(`Found country data: ${found.Country}`);
          setCountry(found);
        } else {
          console.warn(`No data found for country code: ${countryCode}`);
          setError(`No data found for country code: ${countryCode}`);
        }
      })
      .catch(err => {
        console.error('Error fetching country data:', err);
        setError('Failed to load country data');
      })
      .finally(() => setLoading(false));
  }, [countryCode]);

  if (loading) return (
    <div className="detail-view" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <p style={{ fontSize: '18px' }}>Loading country data...</p>
    </div>
  );
  
  if (error || !country) return (
    <div className="detail-view" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ 
          textDecoration: 'none', 
          color: '#333',
          display: 'inline-flex',
          alignItems: 'center',
          fontWeight: 'bold'
        }}>
          ← Back to Map
        </Link>
      </div>
      <p style={{ color: 'red', fontSize: '18px' }}>{error || 'Country not found'}</p>
    </div>
  );

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return 'No data';
    return `${Math.round(value)}%`;
  };

  return (
    <div className="detail-view" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ 
          textDecoration: 'none', 
          color: '#333',
          display: 'inline-flex',
          alignItems: 'center',
          fontWeight: 'bold'
        }}>
          ← Back to Map
        </Link>
      </div>
      
      <h1 style={{ 
        color: '#2e7d32', 
        borderBottom: '2px solid #4caf50',
        paddingBottom: '10px',
        marginBottom: '20px'
      }}>
        {country.Country}
      </h1>
      
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>
        <strong>Region:</strong> {country.Region || 'Unknown'}
      </p>
      
      <h2 style={{ color: '#555', marginBottom: '15px' }}>Vaccine Coverage (2023)</h2>
      
      <div className="vaccine-coverage" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '30px'
      }}>
        {Object.entries(country.vaccine_coverage || {}).map(([vaccine, value]) => (
          <div key={vaccine} style={{ 
            padding: '15px',
            borderRadius: '5px',
            backgroundColor: value >= 70 ? '#e8f5e9' : value >= 50 ? '#fff8e1' : '#ffebee',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{vaccine}</h3>
            <p style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              margin: 0,
              color: value >= 70 ? '#2e7d32' : value >= 50 ? '#ff8f00' : '#c62828'
            }}>
              {formatPercentage(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
