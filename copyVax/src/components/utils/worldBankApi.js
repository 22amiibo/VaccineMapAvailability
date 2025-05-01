// src/utils/worldBankApi.js
/**
 * Fetches immunization data from World Bank API
 * @param {string} indicator - The World Bank indicator code (e.g., 'SH.IMM.MEAS' for measles immunization)
 * @param {number} year - The year for which to fetch data
 * @returns {Promise<Array>} - Array of country data
 */
export async function fetchWorldBankVaccineData(indicator = 'SH.IMM.MEAS', year = 2021) {
    try {
      // World Bank API endpoint for immunization data
      const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?date=${year}&format=json&per_page=300`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const [metadata, data] = await response.json();
      
      // Format the data for our application
      return data.map(item => ({
        countryName: item.country.value,
        countryCode: item.countryiso3code,
        value: item.value,
        date: item.date
      })).filter(item => item.value !== null);
      
    } catch (error) {
      console.error('Error fetching World Bank data:', error);
      throw error;
    }
  }
  
  /**
   * Merges World Bank data with our existing vaccine coverage data
   * @param {Array} worldBankData - Data from World Bank API
   * @param {Array} vaccineData - Our existing vaccine data
   * @returns {Array} - Merged data
   */
  export function mergeVaccineData(worldBankData, vaccineData) {
    // Create a map of existing vaccine data by ISO3 code for quick lookup
    const vaccineMap = new Map(
      vaccineData.map(country => [country.ISO3, country])
    );
    
    // For each World Bank data point, enhance our existing data or create new entries
    return worldBankData.map(wbCountry => {
      const existingData = vaccineMap.get(wbCountry.countryCode);
      
      if (existingData) {
        // Merge with existing data
        return {
          ...existingData,
          WorldBankCoverage: wbCountry.value
        };
      } else {
        // Create new entry based on World Bank data
        return {
          Country: wbCountry.countryName,
          ISO3: wbCountry.countryCode,
          Region: "Unknown", // This would need to be determined
          DTP3_coverage: wbCountry.value, // Using World Bank value directly
          Gap: 100 - wbCountry.value,
          PrimaryBarrier: "Unknown", // This would need to be determined
          Priority: wbCountry.value >= 90 ? "Low" : wbCountry.value >= 70 ? "Medium" : "High",
          NextStepURL: `https://example.org/petition/${wbCountry.countryCode.toLowerCase()}`
        };
      }
    });
  }