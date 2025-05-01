import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { fetchVaccineGaps } from '../utils/fetchVaccineData';
import { getHelpOrganizations } from '../utils/helpOrganizations';
import { standardRegions, getSortedRegions, getCountryRegionByName, getCountryRegion, countryRegionMap } from '../utils/countryRegions';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function VaccineMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const [selectedVaccine, setSelectedVaccine] = useState('DTP3');
  const [loading, setLoading] = useState(false);
  const [vaccineData, setVaccineData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [highlightLevel, setHighlightLevel] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState({
    region: 'all',
    minCoverage: 0,
    maxCoverage: 100
  });

  // Color scale for vaccine coverage - using consistent brightness values
  const getColor = (coverage) => {
    if (coverage === undefined || coverage === null) return '#888888';
    if (coverage >= 90) return '#1a8754'; // Dark green - high coverage
    if (coverage >= 70) return '#57ba5b'; // Medium green - good coverage
    if (coverage >= 50) return '#f7b924'; // Yellow/amber - moderate coverage
    if (coverage >= 30) return '#ff8c24'; // Orange - low coverage
    return '#e63946'; // Red - critical coverage
  };

  // Check if a country matches the current filter criteria
  const matchesFilter = (country) => {
    if (!country || !country.vaccine_coverage) return false;
    
    const coverage = country.vaccine_coverage[selectedVaccine];
    
    // Filter by coverage range
    if (coverage < filterCriteria.minCoverage || coverage > filterCriteria.maxCoverage) {
      return false;
    }
    
    // Filter by region - use the new mapping if Region isn't set
    if (filterCriteria.region !== 'all') {
      // First check if the country already has a region assigned
      let countryRegion = country.Region;
      
      // If region isn't already set, try to determine it using multiple methods
      if (!countryRegion) {
        // Try by ISO3 code first (most accurate)
        if (country.ISO3) {
          countryRegion = getCountryRegion(country.ISO3);
        }
        
        // If not found, try by country name
        if (!countryRegion && country.Country) {
          countryRegion = getCountryRegionByName(country.Country);
        }
        
        // Try with name variations if still not found
        if (!countryRegion && country.Country) {
          const variations = [
            country.Country.replace(/\s+/g, ' ').trim(),
            country.Country.replace('Republic of', '').replace(/\s+/g, ' ').trim(),
            country.Country.replace('Democratic Republic of', '').replace(/\s+/g, ' ').trim(),
            country.Country.replace('The', '').replace(/\s+/g, ' ').trim(),
            country.Country.replace('Kingdom of', '').replace(/\s+/g, ' ').trim()
          ];
          
          for (const variation of variations) {
            if (countryRegionMap[variation]) {
              countryRegion = countryRegionMap[variation];
              break;
            }
          }
        }
      }
      
      // Direct check - does the determined region match the filter criteria?
      if (countryRegion !== filterCriteria.region) {
        return false;
      }
    }
    
    return true;
  };

  // Country style function
  const styleFeature = (feature) => {
    if (!feature || !feature.properties) {
      return { fillColor: '#888888', weight: 1, color: '#000000', fillOpacity: 0.5 };
    }
    
    const countryName = feature.properties.name || feature.properties.NAME || '';
    const iso = feature.properties.ISO_A3 || feature.properties.ISO3;
    
    // Base style
    const baseStyle = {
      weight: 1,
      color: '#000000',
      fillOpacity: 0.7,
      opacity: 1
    };

    // Find the country's vaccine data
    const countryData = vaccineData.find(c => 
      (c.ISO3 === iso) || 
      (c.Country && countryName && (
        c.Country.includes(countryName) || 
        countryName.includes(c.Country) ||
        (countryName.includes('United States') && c.ISO3 === 'USA') ||
        (c.Country.includes('United States') && iso === 'USA')
      ))
    );
    
    // If we have vaccine data for this country, color it based on coverage
    if (countryData && countryData.vaccine_coverage[selectedVaccine] !== undefined) {
      const coverage = countryData.vaccine_coverage[selectedVaccine];
      
      // Check if the country matches current filters
      if (!matchesFilter(countryData)) {
        // Filtered out countries are shown in white with minimal opacity
        return { ...baseStyle, fillColor: '#ffffff', fillOpacity: 0.2, weight: 0.5 };
      }
      
      return { ...baseStyle, fillColor: getColor(coverage) };
    }
    
    // For countries without vaccine data, we'll still check if they should be filtered by region
    if (filterCriteria.region !== 'all') {
      // Try to determine this country's region
      let countryRegion = null;
      
      // Try by ISO code first
      if (iso) {
        countryRegion = getCountryRegion(iso);
      }
      
      // Try by country name
      if (!countryRegion && countryName) {
        countryRegion = getCountryRegionByName(countryName);
      }
      
      // If we found a region but it doesn't match the filter, dim the country
      if (countryRegion && countryRegion !== filterCriteria.region) {
        return { ...baseStyle, fillColor: '#ffffff', fillOpacity: 0.1, weight: 0.2 };
      }
    }

    // Light gray for countries with no data, with reduced opacity
    return { ...baseStyle, fillColor: '#ffffff', fillOpacity: 0.2, weight: 0.5 };
  };

  // Apply filters and update the map
  const applyFilters = () => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.setStyle(styleFeature);
    }
  };

  // Get regions for filtering
  const getRegionsForFilter = () => {
    // If we have vaccine data, use getSortedRegions to get regions sorted by country count
    if (vaccineData.length > 0) {
      return getSortedRegions(vaccineData);
    }
    // Otherwise use the standard regions
    return standardRegions;
  };

  // Initialize map and load data
  useEffect(() => {
    setLoading(true);
    
    // Load vaccine data
    fetchVaccineGaps(2023)
      .then(data => {
        console.log('Vaccine data loaded:', data?.length || 0, 'countries');
        
        // Assign regions to countries that don't have them based on our mapping
        const dataWithRegions = data.map(country => {
          // Skip if no country data
          if (!country) return country;
          
          // If already has a region, use it
          if (country.Region && standardRegions.find(r => r.id === country.Region)) {
            return country;
          }
          
          let mappedRegion = null;
          
          // Try by ISO3 code first (most accurate)
          if (country.ISO3) {
            mappedRegion = getCountryRegion(country.ISO3);
          }
          
          // If not found, try by country name
          if (!mappedRegion && country.Country) {
            mappedRegion = getCountryRegionByName(country.Country);
          }
          
          // If still not found, try with alternate country name formats
          if (!mappedRegion && country.Country) {
            // Try common name variations
            const variations = [
              country.Country.replace(/\s+/g, ' ').trim(),
              country.Country.replace('Republic of', '').replace(/\s+/g, ' ').trim(),
              country.Country.replace('Democratic Republic of', '').replace(/\s+/g, ' ').trim(),
              country.Country.replace('The', '').replace(/\s+/g, ' ').trim(),
              country.Country.replace('Kingdom of', '').replace(/\s+/g, ' ').trim()
            ];
            
            for (const variation of variations) {
              if (countryRegionMap[variation]) {
                mappedRegion = countryRegionMap[variation];
                break;
              }
            }
          }
          
          // Default to a region if still not assigned (based on continent approximation)
          if (!mappedRegion && country.Country) {
            // Use simple string matching as last resort
            const countryName = country.Country.toLowerCase();
            if (countryName.includes('africa')) mappedRegion = 'Africa';
            else if (countryName.includes('america') || countryName.includes('brazil') || 
                    countryName.includes('canada') || countryName.includes('mexico')) 
              mappedRegion = 'Americas';
            else if (countryName.includes('asia') || countryName.includes('china') || 
                    countryName.includes('india') || countryName.includes('japan') ||
                    countryName.includes('korea'))
              mappedRegion = 'Asia-Pacific';
            else if (countryName.includes('europe') || countryName.includes('kingdom') ||
                    countryName.includes('france') || countryName.includes('germany'))
              mappedRegion = 'Europe';
            else if (countryName.includes('middle east') || countryName.includes('arab') ||
                    countryName.includes('egypt') || countryName.includes('iran') ||
                    countryName.includes('iraq') || countryName.includes('israel'))
              mappedRegion = 'Middle East & North Africa';
          }
          
          if (mappedRegion) {
            return { ...country, Region: mappedRegion };
          }
          
          return country;
        });
        
        console.log('Data with regions:', dataWithRegions.filter(c => c.Region).length, 'countries have regions assigned');
        setVaccineData(dataWithRegions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading vaccine data:', err);
        setErrorMsg('Failed to load vaccine data');
        setLoading(false);
      });
      
    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        console.log('Cleaning up map on unmount');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize the map once we have the container
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      console.log('Creating new map instance...');
      try {
        // Create the map instance
        const map = L.map(mapContainerRef.current, {
          center: [20, 0],
          zoom: 2,
          minZoom: 2,
          maxBounds: [[-90, -180], [90, 180]],
          zoomControl: false,  // Disable default zoom controls
          attributionControl: true
        });
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Save the map instance reference
        mapInstanceRef.current = map;
        console.log('Map created successfully!');
        
        // Add legend
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function() {
          const div = L.DomUtil.create('div', 'info legend');
          div.style.backgroundColor = 'white';
          div.style.padding = '10px';
          div.style.borderRadius = '5px';
          div.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
          div.style.maxWidth = '200px';
          
          div.innerHTML = `<h4 style="margin:0 0 10px 0;">Coverage Legend</h4>`;
          div.innerHTML += '<div id="legend-excellent" style="padding: 2px; cursor: pointer; border-radius: 3px;"><i style="background:#1a8754; width:18px; height:18px; display:inline-block; margin-right:8px"></i> 90%+ (Excellent) </div>';
          div.innerHTML += '<div id="legend-good" style="padding: 2px; cursor: pointer; border-radius: 3px;"><i style="background:#57ba5b; width:18px; height:18px; display:inline-block; margin-right:8px"></i> 70-90% (Good) </div>';
          div.innerHTML += '<div id="legend-moderate" style="padding: 2px; cursor: pointer; border-radius: 3px;"><i style="background:#f7b924; width:18px; height:18px; display:inline-block; margin-right:8px"></i> 50-70% (Moderate) </div>';
          div.innerHTML += '<div id="legend-low" style="padding: 2px; cursor: pointer; border-radius: 3px;"><i style="background:#ff8c24; width:18px; height:18px; display:inline-block; margin-right:8px"></i> 30-50% (Low) </div>';
          div.innerHTML += '<div id="legend-critical" style="padding: 2px; cursor: pointer; border-radius: 3px;"><i style="background:#e63946; width:18px; height:18px; display:inline-block; margin-right:8px"></i> <30% (Critical) </div>';
          div.innerHTML += '<div id="legend-no-data" style="padding: 2px; cursor: pointer; border-radius: 3px;"><i style="background:#888888; width:18px; height:18px; display:inline-block; margin-right:8px"></i> No data </div>';
          div.innerHTML += '<div id="legend-reset" style="margin-top: 8px; text-align: center; cursor: pointer; font-weight: bold; font-size: 12px; color: #555;">Reset Highlight</div>';
          div.innerHTML += '<br><small>Data source: WHO/UNICEF (2023)</small>';
          
          // Make the legend interactive after it's added to the DOM
          setTimeout(() => {
            const handleLegendClick = (level) => {
              // Clear any previous highlighting
              document.querySelectorAll('.legend div').forEach(el => {
                el.style.backgroundColor = 'transparent';
              });
              
              if (level === highlightLevel) {
                // If clicking the same level, turn off highlighting
                setHighlightLevel(null);
              } else {
                // Highlight the clicked level
                document.getElementById(`legend-${level}`).style.backgroundColor = '#f0f0f0';
                setHighlightLevel(level);
                
                // Set corresponding filter
                if (level === 'excellent') {
                  setFilterCriteria({...filterCriteria, minCoverage: 90});
                } else if (level === 'good') {
                  setFilterCriteria({...filterCriteria, minCoverage: 70, maxCoverage: 90});
                } else if (level === 'moderate') {
                  setFilterCriteria({...filterCriteria, minCoverage: 50, maxCoverage: 70});
                } else if (level === 'low') {
                  setFilterCriteria({...filterCriteria, minCoverage: 30, maxCoverage: 50});
                } else if (level === 'critical') {
                  setFilterCriteria({...filterCriteria, minCoverage: 0, maxCoverage: 30});
                }
              }
            };
            
            document.getElementById('legend-excellent').addEventListener('click', () => handleLegendClick('excellent'));
            document.getElementById('legend-good').addEventListener('click', () => handleLegendClick('good'));
            document.getElementById('legend-moderate').addEventListener('click', () => handleLegendClick('moderate'));
            document.getElementById('legend-low').addEventListener('click', () => handleLegendClick('low'));
            document.getElementById('legend-critical').addEventListener('click', () => handleLegendClick('critical'));
            document.getElementById('legend-reset').addEventListener('click', () => {
              document.querySelectorAll('.legend div').forEach(el => {
                el.style.backgroundColor = 'transparent';
              });
              setHighlightLevel(null);
              setFilterCriteria({
                region: filterCriteria.region,
                minCoverage: 0,
                maxCoverage: 100
              });
            });
          }, 100);
          
          return div;
        };
        legend.addTo(map);
      } catch (error) {
        console.error('Error creating map:', error);
        setErrorMsg('Error creating map');
      }
    }
  }, [mapContainerRef.current]);

  // Update GeoJSON data when vaccine data loads or selected vaccine changes
  useEffect(() => {
    if (!mapInstanceRef.current || vaccineData.length === 0) return;
    
    console.log('Loading GeoJSON data...');
    
    // Remove previous GeoJSON layer if it exists
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
      geoJsonLayerRef.current = null;
    }
    
    // Format popup content for each country
    const formatPercentage = (value) => {
      if (value === undefined || value === null) return 'No data';
      return `${Math.round(value)}%`;
    };

    const onEachFeature = (feature, layer) => {
      const countryName = feature.properties.name || feature.properties.NAME || '';
      const iso = feature.properties.ISO_A3 || feature.properties.ISO3;
      
      // Try to find country data
      const countryData = vaccineData.find(c => 
        (c.ISO3 === iso) || 
        (c.Country && countryName && (
          c.Country.includes(countryName) || 
          countryName.includes(c.Country) ||
          (countryName.includes('United States') && c.ISO3 === 'USA') ||
          (c.Country.includes('United States') && iso === 'USA')
        ))
      );

      if (countryData) {
        // Determine the country's region using all available methods
        let countryRegion = countryData.Region;
        
        // If region isn't already set, try to determine it
        if (!countryRegion) {
          // Try by ISO3 code first (most accurate)
          if (iso) {
            countryRegion = getCountryRegion(iso);
          } else if (countryData.ISO3) {
            countryRegion = getCountryRegion(countryData.ISO3);
          }
          
          // If not found, try by country name
          if (!countryRegion) {
            countryRegion = getCountryRegionByName(countryName) || 
                            getCountryRegionByName(countryData.Country);
          }
        }
        
        // Get organizations that can help in this region
        const helpOrgs = getHelpOrganizations(countryRegion || 'Unknown');
        
        // Get the region color from standardRegions using the resolved region
        const regionInfo = standardRegions.find(r => r.id === countryRegion) || 
                          { name: countryRegion || 'Unknown', color: '#cccccc' };
        
        // Create vaccine coverage table
        let vaccineTable = [
          `<table style="width: 100%; border-collapse: collapse;">`,
          `  <tr style="background-color: #f5f5f5;">`,
          `    <td style="padding: 3px;"><strong>DTP3:</strong></td>`,
          `    <td style="padding: 3px;">${formatPercentage(countryData.vaccine_coverage.DTP3)}</td>`,
          `  </tr>`,
          `  <tr>`,
          `    <td style="padding: 3px;"><strong>MCV1:</strong></td>`,
          `    <td style="padding: 3px;">${formatPercentage(countryData.vaccine_coverage.MCV1)}</td>`,
          `  </tr>`,
          `  <tr style="background-color: #f5f5f5;">`,
          `    <td style="padding: 3px;"><strong>Pol3:</strong></td>`,
          `    <td style="padding: 3px;">${formatPercentage(countryData.vaccine_coverage.Pol3)}</td>`,
          `  </tr>`,
          `  <tr>`,
          `    <td style="padding: 3px;"><strong>HepB3:</strong></td>`,
          `    <td style="padding: 3px;">${formatPercentage(countryData.vaccine_coverage.HepB3)}</td>`,
          `  </tr>`,
          `  <tr style="background-color: #f5f5f5;">`,
          `    <td style="padding: 3px;"><strong>Hib3:</strong></td>`,
          `    <td style="padding: 3px;">${formatPercentage(countryData.vaccine_coverage.Hib3)}</td>`,
          `  </tr>`,
          `  <tr>`,
          `    <td style="padding: 3px;"><strong>PCV3:</strong></td>`,
          `    <td style="padding: 3px;">${formatPercentage(countryData.vaccine_coverage.PCV3)}</td>`,
          `  </tr>`,
          `  <tr style="background-color: #f5f5f5;">`,
          `    <td style="padding: 3px;"><strong>RotaC:</strong></td>`,
          `    <td style="padding: 3px;">${formatPercentage(countryData.vaccine_coverage.RotaC)}</td>`,
          `  </tr>`,
          `</table>`
        ].join('\n');
        
        // Create the region badge
        const regionBadge = [
          `<div style="`,
          `  display: inline-block;`,
          `  padding: 3px 8px;`,
          `  margin-bottom: 10px;`,
          `  border-radius: 12px;`,
          `  font-size: 12px;`,
          `  font-weight: bold;`,
          `  color: white;`,
          `  background-color: ${regionInfo.color};`,
          `">`,
          `  ${regionInfo.name || countryRegion}`,
          `</div>`
        ].join('\n');
        
        // Add help organizations section
        let helpSection = [
          `<div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">`,
          `  <h4 style="margin: 0 0 8px 0; color: #2e7d32;">How to Help:</h4>`
        ].join('\n');
        
        // Regional organizations first (if available)
        if (helpOrgs.regional && helpOrgs.regional.length > 0) {
          helpSection += [
            `<div style="margin-bottom: 12px;">`,
            `  <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 12px; color: #333;">`,
            `    <span style="`,
            `      display: inline-block;`,
            `      width: 8px;`,
            `      height: 8px;`,
            `      background-color: ${regionInfo.color};`,
            `      border-radius: 50%;`,
            `      margin-right: 5px;`,
            `    "></span>`,
            `    ${regionInfo.name || countryRegion} Organizations:`,
            `  </p>`,
            `  <ul style="margin: 0; padding-left: 20px; font-size: 12px;">`
          ].join('\n');
          
          // Add regional organizations
          const regionalOrgsToShow = helpOrgs.regional.slice(0, 3);
          regionalOrgsToShow.forEach(org => {
            helpSection += [
              `    <li>`,
              `      <a href="${org.url}" target="_blank" style="color: #2e7d32;">${org.name}</a>`,
              `      <div style="font-size: 10px; color: #666; margin-bottom: 3px;">${org.description}</div>`,
              `    </li>`
            ].join('\n');
          });
          
          helpSection += [
            `  </ul>`,
            `</div>`
          ].join('\n');
        }
        
        // Add global organizations
        if (helpOrgs.global && helpOrgs.global.length > 0) {
          helpSection += [
            `<div>`,
            `  <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 12px; color: #333;">`,
            `    <span style="`,
            `      display: inline-block;`,
            `      width: 8px;`,
            `      height: 8px;`,
            `      background-color: #666;`,
            `      border-radius: 50%;`,
            `      margin-right: 5px;`,
            `    "></span>`,
            `    Global Organizations:`,
            `  </p>`,
            `  <ul style="margin: 0; padding-left: 20px; font-size: 12px;">`
          ].join('\n');
          
          // Add global organizations
          const globalOrgsToShow = helpOrgs.global.slice(0, 2);
          globalOrgsToShow.forEach(org => {
            helpSection += [
              `    <li>`,
              `      <a href="${org.url}" target="_blank" style="color: #2e7d32;">${org.name}</a>`,
              `      <div style="font-size: 10px; color: #666; margin-bottom: 3px;">${org.description}</div>`,
              `    </li>`
            ].join('\n');
          });
          
          helpSection += [
            `  </ul>`,
            `</div>`
          ].join('\n');
        }
        
        helpSection += `</div>`;
        
        // Combine everything into the final popup content
        const popupContent = [
          `<div class="country-popup" style="min-width: 250px; padding: 5px;">`,
          `  <h3 style="margin: 0 0 5px 0; color: #333; border-bottom: 2px solid ${regionInfo.color}; padding-bottom: 5px;">${countryName}</h3>`,
          `  ${regionBadge}`,
          `  <div style="margin-bottom: 15px;">`,
          `    <h4 style="margin: 5px 0; color: #666;">Vaccine Coverage (2023):</h4>`,
          `    ${vaccineTable}`,
          `  </div>`,
          `  ${helpSection}`,
          `</div>`
        ].join('\n');

        layer.bindPopup(popupContent);
      } else {
        // No data available for this country - try to get region info for the country
        let countryRegion = null;
        
        // Try to determine region from ISO code or name
        if (iso) {
          countryRegion = getCountryRegion(iso);
        }
        
        if (!countryRegion) {
          countryRegion = getCountryRegionByName(countryName);
        }
        
        // Get the region color from standardRegions
        const regionInfo = standardRegions.find(r => r.id === countryRegion) || 
                          { name: countryRegion || 'Unknown Region', color: '#cccccc' };
        
        const noDataPopup = [
          `<div>`,
          `  <h3 style="margin: 0 0 10px 0; color: #333; border-bottom: 2px solid ${regionInfo.color}; padding-bottom: 5px;">${countryName}</h3>`,
          `  <div style="`,
          `    display: inline-block;`,
          `    padding: 3px 8px;`,
          `    margin-bottom: 10px;`,
          `    border-radius: 12px;`,
          `    font-size: 12px;`,
          `    font-weight: bold;`,
          `    color: white;`,
          `    background-color: ${regionInfo.color};`,
          `  ">`,
          `    ${regionInfo.name}`,
          `  </div>`,
          `  <p>No vaccine data available</p>`,
          `  <p style="font-size: 12px;">Support global vaccine initiatives:</p>`,
          `  <ul style="font-size: 12px;">`,
          `    <li><a href="https://www.who.int/initiatives/immunization-agenda-2030" target="_blank" style="color: #2e7d32;">World Health Organization</a></li>`,
          `    <li><a href="https://www.unicef.org/immunization" target="_blank" style="color: #2e7d32;">UNICEF</a></li>`,
          `  </ul>`,
          `</div>`
        ].join('\n');
        
        layer.bindPopup(noDataPopup);
      }
    };
    
    // Fetch GeoJSON data and add to map
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch GeoJSON');
        return response.json();
      })
      .then(geojson => {
        console.log('GeoJSON loaded, adding to map...');
        geoJsonLayerRef.current = L.geoJSON(geojson, {
          style: styleFeature,
          onEachFeature: onEachFeature
        }).addTo(mapInstanceRef.current);
        
        console.log('GeoJSON added to map');
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        setErrorMsg('Failed to load map data');
      });
  }, [vaccineData, selectedVaccine]);

  // Apply filters when filter criteria changes
  useEffect(() => {
    if (geoJsonLayerRef.current) {
      applyFilters();
    }
  }, [filterCriteria]);

  // Show filter region counts
  const getRegionLabel = (region) => {
    if (region.id === 'all') return `${region.name} (${vaccineData.length})`;
    
    // Count countries that match the current vaccine filter
    const regionCount = vaccineData.filter(country => {
      if (!country) return false;
      
      // If vaccine coverage filter is active, check it
      if (country.vaccine_coverage && country.vaccine_coverage[selectedVaccine] !== undefined) {
        if (country.vaccine_coverage[selectedVaccine] < filterCriteria.minCoverage || 
            country.vaccine_coverage[selectedVaccine] > filterCriteria.maxCoverage) {
          return false;
        }
      }
      
      // Get country region using all available methods
      let countryRegion = country.Region;
      
      if (!countryRegion && country.ISO3) {
        countryRegion = getCountryRegion(country.ISO3);
      }
      
      if (!countryRegion && country.Country) {
        countryRegion = getCountryRegionByName(country.Country);
      }
      
      // If there's still no region, try once more with country variations
      if (!countryRegion && country.Country) {
        // Try common name variations
        const variations = [
          country.Country.replace(/\s+/g, ' ').trim(),
          country.Country.replace('Republic of', '').replace(/\s+/g, ' ').trim(),
          country.Country.replace('Democratic Republic of', '').replace(/\s+/g, ' ').trim(),
          country.Country.replace('The', '').replace(/\s+/g, ' ').trim()
        ];
        
        for (const variation of variations) {
          if (countryRegionMap[variation]) {
            countryRegion = countryRegionMap[variation];
            break;
          }
        }
      }
      
      return countryRegion === region.id;
    }).length;
    
    return `${region.name} (${regionCount})`;
  };

  if (errorMsg) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <h2 style={{ color: 'red' }}>Error: {errorMsg}</h2>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '10px 20px', 
            marginTop: '20px',
            backgroundColor: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Application
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Loading vaccine data...
        </div>
      )}
      
      <div 
        ref={mapContainerRef} 
        id="map-container" 
        style={{ height: '100%', width: '100%' }}
      ></div>
      
      {/* Filter button */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: showFilters ? '#4caf50' : 'white',
            color: showFilters ? 'white' : '#333',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '8px 12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            fontSize: '14px'
          }}
        >
          {showFilters ? 'Filters Active' : 'Show Filters'}
        </button>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '20px',
          background: 'white',
          padding: '15px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          zIndex: 1000,
          width: '300px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2e7d32' }}>Filter Countries</h3>
          
          {/* Coverage range filter */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Minimum Coverage Threshold: {filterCriteria.minCoverage}%
            </label>
            <div>
              {/* Color gradient bar */}
              <div style={{
                height: '10px',
                width: '100%',
                background: 'linear-gradient(to right, #e63946, #ff8c24, #f7b924, #57ba5b, #1a8754)',
                borderRadius: '5px',
                marginBottom: '5px'
              }}></div>
              <input
                id="min-coverage"
                type="range"
                min="0"
                max="100"
                step="5"
                value={filterCriteria.minCoverage}
                onChange={(e) => setFilterCriteria({
                  ...filterCriteria, 
                  minCoverage: parseInt(e.target.value)
                })}
                style={{ 
                  width: '100%',
                  margin: '0',
                  accentColor: '#2e7d32',
                  cursor: 'pointer'
                }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '12px',
                marginTop: '5px',
                color: '#555'
              }}>
                <span style={{ color: '#e63946', fontWeight: 'bold' }}>0% (Critical)</span>
                <span style={{ color: '#f7b924' }}>50%</span>
                <span style={{ color: '#1a8754', fontWeight: 'bold' }}>100% (Excellent)</span>
              </div>
            </div>
            <div style={{ 
              fontSize: '14px',
              marginTop: '10px', 
              color: '#666',
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              borderLeft: '3px solid #2e7d32'
            }}>
              Showing countries with {selectedVaccine} coverage of at least {filterCriteria.minCoverage}%
            </div>
          </div>
          
          {/* Region filter */}
          <div style={{ marginBottom: '15px' }}>
            <label 
              htmlFor="region-filter"
              style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
            >
              Region:
            </label>
            <select
              id="region-filter"
              value={filterCriteria.region}
              onChange={(e) => setFilterCriteria({...filterCriteria, region: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              {getRegionsForFilter().map(region => (
                <option key={region.id} value={region.id}>{getRegionLabel(region)}</option>
              ))}
            </select>
          </div>
          
          {/* Reset filters button */}
          <button
            onClick={() => setFilterCriteria({
              region: 'all',
              minCoverage: 0,
              maxCoverage: 100
            })}
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 12px',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
      
      {/* Vaccine selector */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <label htmlFor="vaccine-select" style={{ 
          display: 'block', 
          marginBottom: '5px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          Select Vaccine:
        </label>
        <select 
          id="vaccine-select"
          value={selectedVaccine}
          onChange={(e) => setSelectedVaccine(e.target.value)}
          style={{ 
            padding: '8px', 
            width: '100%',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="DTP3">DTP3 (Diphtheria-Tetanus-Pertussis)</option>
          <option value="MCV1">MCV1 (Measles)</option>
          <option value="Pol3">Pol3 (Polio)</option>
          <option value="HepB3">HepB3 (Hepatitis B)</option>
          <option value="Hib3">Hib3 (Hib)</option>
          <option value="PCV3">PCV3 (Pneumococcal)</option>
          <option value="RotaC">RotaC (Rotavirus)</option>
        </select>
      </div>
    </div>
  );
}
