// Utility for managing country region data

// Map detailed regions to our standardized regions
const mapToStandardRegion = (region, subRegion) => {
  if (!region) return null;
  
  const regionLower = region.toLowerCase();
  const subRegionLower = subRegion ? subRegion.toLowerCase() : '';
  
  // Africa regions
  if (regionLower === 'africa') {
    if (subRegionLower === 'northern africa') {
      return 'Middle East & North Africa';
    }
    return 'Africa';
  }
  
  // Americas regions
  if (regionLower === 'americas') {
    return 'Americas';
  }
  
  // Asia regions
  if (regionLower === 'asia') {
    if (subRegionLower === 'western asia') {
      return 'Middle East & North Africa';
    }
    return 'Asia-Pacific';
  }
  
  // Europe regions
  if (regionLower === 'europe') {
    return 'Europe';
  }
  
  // Oceania regions
  if (regionLower === 'oceania') {
    return 'Asia-Pacific';
  }
  
  return null;
};

// Country region mapping
export const countryRegionMap = {
  // Africa
  'Angola': 'Africa',
  'Benin': 'Africa',
  'Botswana': 'Africa',
  'Burkina Faso': 'Africa',
  'Burundi': 'Africa',
  'Cameroon': 'Africa',
  'Cape Verde': 'Africa',
  'Central African Republic': 'Africa',
  'Chad': 'Africa',
  'Comoros': 'Africa',
  'Congo': 'Africa',
  'The Democratic Republic of Congo': 'Africa',
  'Djibouti': 'Africa',
  'Equatorial Guinea': 'Africa',
  'Eritrea': 'Africa',
  'Eswatini': 'Africa',
  'Ethiopia': 'Africa',
  'Gabon': 'Africa',
  'Gambia': 'Africa',
  'Ghana': 'Africa',
  'Guinea': 'Africa',
  'Guinea-Bissau': 'Africa',
  'Ivory Coast': 'Africa',
  'Kenya': 'Africa',
  'Lesotho': 'Africa',
  'Liberia': 'Africa',
  'Madagascar': 'Africa',
  'Malawi': 'Africa',
  'Mali': 'Africa',
  'Mauritania': 'Africa',
  'Mauritius': 'Africa',
  'Mayotte': 'Africa',
  'Mozambique': 'Africa',
  'Namibia': 'Africa',
  'Niger': 'Africa',
  'Nigeria': 'Africa',
  'Reunion': 'Africa',
  'Rwanda': 'Africa',
  'Saint Helena': 'Africa',
  'Sao Tome and Principe': 'Africa',
  'Senegal': 'Africa',
  'Seychelles': 'Africa',
  'Sierra Leone': 'Africa',
  'Somalia': 'Africa',
  'South Africa': 'Africa',
  'South Sudan': 'Africa',
  'Tanzania': 'Africa',
  'Togo': 'Africa',
  'Uganda': 'Africa',
  'Zambia': 'Africa',
  'Zimbabwe': 'Africa',
  
  // Middle East & North Africa
  'Algeria': 'Middle East & North Africa',
  'Egypt': 'Middle East & North Africa',
  'Libya': 'Middle East & North Africa',
  'Morocco': 'Middle East & North Africa',
  'Sudan': 'Middle East & North Africa',
  'Tunisia': 'Middle East & North Africa',
  'Western Sahara': 'Middle East & North Africa',
  'Armenia': 'Middle East & North Africa',
  'Azerbaijan': 'Middle East & North Africa',
  'Bahrain': 'Middle East & North Africa',
  'Cyprus': 'Middle East & North Africa',
  'Georgia': 'Middle East & North Africa',
  'Iraq': 'Middle East & North Africa',
  'Israel': 'Middle East & North Africa',
  'Jordan': 'Middle East & North Africa',
  'Kuwait': 'Middle East & North Africa',
  'Lebanon': 'Middle East & North Africa',
  'Oman': 'Middle East & North Africa',
  'Palestine': 'Middle East & North Africa',
  'Qatar': 'Middle East & North Africa',
  'Saudi Arabia': 'Middle East & North Africa',
  'Syria': 'Middle East & North Africa',
  'Turkey': 'Middle East & North Africa',
  'United Arab Emirates': 'Middle East & North Africa',
  'Yemen': 'Middle East & North Africa',
  
  // Americas
  'Anguilla': 'Americas',
  'Antigua and Barbuda': 'Americas',
  'Argentina': 'Americas',
  'Aruba': 'Americas',
  'Bahamas': 'Americas',
  'Barbados': 'Americas',
  'Belize': 'Americas',
  'Bermuda': 'Americas',
  'Bolivia': 'Americas',
  'Brazil': 'Americas',
  'Canada': 'Americas',
  'Cayman Islands': 'Americas',
  'Chile': 'Americas',
  'Colombia': 'Americas',
  'Costa Rica': 'Americas',
  'Cuba': 'Americas',
  'Dominica': 'Americas',
  'Dominican Republic': 'Americas',
  'Ecuador': 'Americas',
  'El Salvador': 'Americas',
  'Falkland Islands': 'Americas',
  'French Guiana': 'Americas',
  'Greenland': 'Americas',
  'Grenada': 'Americas',
  'Guadeloupe': 'Americas',
  'Guatemala': 'Americas',
  'Guyana': 'Americas',
  'Haiti': 'Americas',
  'Honduras': 'Americas',
  'Jamaica': 'Americas',
  'Martinique': 'Americas',
  'Mexico': 'Americas',
  'Montserrat': 'Americas',
  'Netherlands Antilles': 'Americas',
  'Nicaragua': 'Americas',
  'Panama': 'Americas',
  'Paraguay': 'Americas',
  'Peru': 'Americas',
  'Puerto Rico': 'Americas',
  'Saint Kitts and Nevis': 'Americas',
  'Saint Lucia': 'Americas',
  'Saint Pierre and Miquelon': 'Americas',
  'Saint Vincent and the Grenadines': 'Americas',
  'Suriname': 'Americas',
  'Trinidad and Tobago': 'Americas',
  'Turks and Caicos Islands': 'Americas',
  'United States': 'Americas',
  'Uruguay': 'Americas',
  'Venezuela': 'Americas',
  
  // Europe
  'Albania': 'Europe',
  'Andorra': 'Europe',
  'Austria': 'Europe',
  'Belarus': 'Europe',
  'Belgium': 'Europe',
  'Bosnia and Herzegovina': 'Europe',
  'Bulgaria': 'Europe',
  'Croatia': 'Europe',
  'Czech Republic': 'Europe',
  'Denmark': 'Europe',
  'Estonia': 'Europe',
  'Faroe Islands': 'Europe',
  'Finland': 'Europe',
  'France': 'Europe',
  'Germany': 'Europe',
  'Gibraltar': 'Europe',
  'Greece': 'Europe',
  'Holy See (Vatican City State)': 'Europe',
  'Hungary': 'Europe',
  'Iceland': 'Europe',
  'Ireland': 'Europe',
  'Italy': 'Europe',
  'Latvia': 'Europe',
  'Liechtenstein': 'Europe',
  'Lithuania': 'Europe',
  'Luxembourg': 'Europe',
  'Malta': 'Europe',
  'Moldova': 'Europe',
  'Monaco': 'Europe',
  'Montenegro': 'Europe',
  'Netherlands': 'Europe',
  'North Macedonia': 'Europe',
  'Norway': 'Europe',
  'Poland': 'Europe',
  'Portugal': 'Europe',
  'Romania': 'Europe',
  'Russia': 'Europe',
  'San Marino': 'Europe',
  'Serbia': 'Europe',
  'Slovakia': 'Europe',
  'Slovenia': 'Europe',
  'Spain': 'Europe',
  'Sweden': 'Europe',
  'Switzerland': 'Europe',
  'Ukraine': 'Europe',
  'United Kingdom': 'Europe',
  
  // Asia-Pacific
  'Afghanistan': 'Asia-Pacific',
  'Australia': 'Asia-Pacific',
  'Bangladesh': 'Asia-Pacific',
  'Bhutan': 'Asia-Pacific',
  'Brunei': 'Asia-Pacific',
  'Cambodia': 'Asia-Pacific',
  'China': 'Asia-Pacific',
  'Christmas Island': 'Asia-Pacific',
  'Cocos (Keeling) Islands': 'Asia-Pacific',
  'Cook Islands': 'Asia-Pacific',
  'East Timor': 'Asia-Pacific',
  'Fiji Islands': 'Asia-Pacific',
  'French Polynesia': 'Asia-Pacific',
  'Guam': 'Asia-Pacific',
  'Hong Kong': 'Asia-Pacific',
  'India': 'Asia-Pacific',
  'Indonesia': 'Asia-Pacific',
  'Iran': 'Asia-Pacific',
  'Japan': 'Asia-Pacific',
  'Kazakhstan': 'Asia-Pacific',
  'Kiribati': 'Asia-Pacific',
  'Kyrgyzstan': 'Asia-Pacific',
  'Laos': 'Asia-Pacific',
  'Macao': 'Asia-Pacific',
  'Malaysia': 'Asia-Pacific',
  'Maldives': 'Asia-Pacific',
  'Marshall Islands': 'Asia-Pacific',
  'Micronesia, Federated States of': 'Asia-Pacific',
  'Mongolia': 'Asia-Pacific',
  'Myanmar': 'Asia-Pacific',
  'Nauru': 'Asia-Pacific',
  'Nepal': 'Asia-Pacific',
  'New Caledonia': 'Asia-Pacific',
  'New Zealand': 'Asia-Pacific',
  'Niue': 'Asia-Pacific',
  'Norfolk Island': 'Asia-Pacific',
  'North Korea': 'Asia-Pacific',
  'Northern Mariana Islands': 'Asia-Pacific',
  'Pakistan': 'Asia-Pacific',
  'Palau': 'Asia-Pacific',
  'Papua New Guinea': 'Asia-Pacific',
  'Philippines': 'Asia-Pacific',
  'Pitcairn': 'Asia-Pacific',
  'Samoa': 'Asia-Pacific',
  'Singapore': 'Asia-Pacific',
  'Solomon Islands': 'Asia-Pacific',
  'South Korea': 'Asia-Pacific',
  'Sri Lanka': 'Asia-Pacific',
  'Taiwan': 'Asia-Pacific',
  'Tajikistan': 'Asia-Pacific',
  'Thailand': 'Asia-Pacific',
  'Tokelau': 'Asia-Pacific',
  'Tonga': 'Asia-Pacific',
  'Turkmenistan': 'Asia-Pacific',
  'Tuvalu': 'Asia-Pacific',
  'Uzbekistan': 'Asia-Pacific',
  'Vanuatu': 'Asia-Pacific',
  'Vietnam': 'Asia-Pacific',
  'Wallis and Futuna': 'Asia-Pacific'
};

// ISO3 to region mapping based on UN classification data
export const iso3ToRegionMap = {
  // Africa (excluding North Africa)
  "AGO": "Africa", // Angola
  "BEN": "Africa", // Benin
  "BWA": "Africa", // Botswana
  "BFA": "Africa", // Burkina Faso
  "BDI": "Africa", // Burundi
  "CPV": "Africa", // Cabo Verde
  "CMR": "Africa", // Cameroon
  "CAF": "Africa", // Central African Republic
  "TCD": "Africa", // Chad
  "COM": "Africa", // Comoros
  "COG": "Africa", // Congo
  "COD": "Africa", // Congo, Democratic Republic of the
  "CIV": "Africa", // Côte d'Ivoire
  "DJI": "Africa", // Djibouti
  "GNQ": "Africa", // Equatorial Guinea
  "ERI": "Africa", // Eritrea
  "SWZ": "Africa", // Eswatini
  "ETH": "Africa", // Ethiopia
  "GAB": "Africa", // Gabon
  "GMB": "Africa", // Gambia
  "GHA": "Africa", // Ghana
  "GIN": "Africa", // Guinea
  "GNB": "Africa", // Guinea-Bissau
  "KEN": "Africa", // Kenya
  "LSO": "Africa", // Lesotho
  "LBR": "Africa", // Liberia
  "MDG": "Africa", // Madagascar
  "MWI": "Africa", // Malawi
  "MLI": "Africa", // Mali
  "MRT": "Africa", // Mauritania
  "MUS": "Africa", // Mauritius
  "MOZ": "Africa", // Mozambique
  "NAM": "Africa", // Namibia
  "NER": "Africa", // Niger
  "NGA": "Africa", // Nigeria
  "RWA": "Africa", // Rwanda
  "STP": "Africa", // Sao Tome and Principe
  "SEN": "Africa", // Senegal
  "SYC": "Africa", // Seychelles
  "SLE": "Africa", // Sierra Leone
  "SOM": "Africa", // Somalia
  "ZAF": "Africa", // South Africa
  "SSD": "Africa", // South Sudan
  "TZA": "Africa", // Tanzania
  "TGO": "Africa", // Togo
  "UGA": "Africa", // Uganda
  "ZMB": "Africa", // Zambia
  "ZWE": "Africa", // Zimbabwe
  "IOT": "Africa", // British Indian Ocean Territory
  "ATF": "Africa", // French Southern Territories
  "SHN": "Africa", // Saint Helena
  "MYT": "Africa", // Mayotte
  "REU": "Africa", // Réunion
  
  // Middle East & North Africa
  "DZA": "Middle East & North Africa", // Algeria
  "EGY": "Middle East & North Africa", // Egypt
  "LBY": "Middle East & North Africa", // Libya
  "MAR": "Middle East & North Africa", // Morocco
  "SDN": "Middle East & North Africa", // Sudan
  "TUN": "Middle East & North Africa", // Tunisia
  "ESH": "Middle East & North Africa", // Western Sahara
  "ARM": "Middle East & North Africa", // Armenia
  "AZE": "Middle East & North Africa", // Azerbaijan
  "BHR": "Middle East & North Africa", // Bahrain
  "CYP": "Middle East & North Africa", // Cyprus
  "GEO": "Middle East & North Africa", // Georgia
  "IRQ": "Middle East & North Africa", // Iraq
  "ISR": "Middle East & North Africa", // Israel
  "JOR": "Middle East & North Africa", // Jordan
  "KWT": "Middle East & North Africa", // Kuwait
  "LBN": "Middle East & North Africa", // Lebanon
  "OMN": "Middle East & North Africa", // Oman
  "PSE": "Middle East & North Africa", // Palestine
  "QAT": "Middle East & North Africa", // Qatar
  "SAU": "Middle East & North Africa", // Saudi Arabia
  "SYR": "Middle East & North Africa", // Syria
  "TUR": "Middle East & North Africa", // Turkey/Türkiye
  "ARE": "Middle East & North Africa", // United Arab Emirates
  "YEM": "Middle East & North Africa", // Yemen
  
  // Americas
  "AIA": "Americas", // Anguilla
  "ATG": "Americas", // Antigua and Barbuda
  "ARG": "Americas", // Argentina
  "ABW": "Americas", // Aruba
  "BHS": "Americas", // Bahamas
  "BRB": "Americas", // Barbados
  "BLZ": "Americas", // Belize
  "BMU": "Americas", // Bermuda
  "BOL": "Americas", // Bolivia
  "BES": "Americas", // Bonaire, Sint Eustatius and Saba
  "BRA": "Americas", // Brazil
  "VGB": "Americas", // British Virgin Islands
  "CAN": "Americas", // Canada
  "CYM": "Americas", // Cayman Islands
  "CHL": "Americas", // Chile
  "COL": "Americas", // Colombia
  "CRI": "Americas", // Costa Rica
  "CUB": "Americas", // Cuba
  "CUW": "Americas", // Curaçao
  "DMA": "Americas", // Dominica
  "DOM": "Americas", // Dominican Republic
  "ECU": "Americas", // Ecuador
  "SLV": "Americas", // El Salvador
  "FLK": "Americas", // Falkland Islands
  "GUF": "Americas", // French Guiana
  "GRL": "Americas", // Greenland
  "GRD": "Americas", // Grenada
  "GLP": "Americas", // Guadeloupe
  "GTM": "Americas", // Guatemala
  "GUY": "Americas", // Guyana
  "HTI": "Americas", // Haiti
  "HND": "Americas", // Honduras
  "JAM": "Americas", // Jamaica
  "MTQ": "Americas", // Martinique
  "MEX": "Americas", // Mexico
  "MSR": "Americas", // Montserrat
  "NIC": "Americas", // Nicaragua
  "PAN": "Americas", // Panama
  "PRY": "Americas", // Paraguay
  "PER": "Americas", // Peru
  "PRI": "Americas", // Puerto Rico
  "BLM": "Americas", // Saint Barthélemy
  "KNA": "Americas", // Saint Kitts and Nevis
  "LCA": "Americas", // Saint Lucia
  "MAF": "Americas", // Saint Martin
  "SPM": "Americas", // Saint Pierre and Miquelon
  "VCT": "Americas", // Saint Vincent and the Grenadines
  "SXM": "Americas", // Sint Maarten
  "SUR": "Americas", // Suriname
  "TTO": "Americas", // Trinidad and Tobago
  "TCA": "Americas", // Turks and Caicos Islands
  "USA": "Americas", // United States of America
  "URY": "Americas", // Uruguay
  "VEN": "Americas", // Venezuela
  "VIR": "Americas", // Virgin Islands (U.S.)
  
  // Europe
  "ALB": "Europe", // Albania
  "AND": "Europe", // Andorra
  "AUT": "Europe", // Austria
  "BLR": "Europe", // Belarus
  "BEL": "Europe", // Belgium
  "BIH": "Europe", // Bosnia and Herzegovina
  "BGR": "Europe", // Bulgaria
  "HRV": "Europe", // Croatia
  "CZE": "Europe", // Czechia
  "DNK": "Europe", // Denmark
  "EST": "Europe", // Estonia
  "FRO": "Europe", // Faroe Islands
  "FIN": "Europe", // Finland
  "FRA": "Europe", // France
  "DEU": "Europe", // Germany
  "GIB": "Europe", // Gibraltar
  "GRC": "Europe", // Greece
  "GGY": "Europe", // Guernsey
  "VAT": "Europe", // Holy See
  "HUN": "Europe", // Hungary
  "ISL": "Europe", // Iceland
  "IRL": "Europe", // Ireland
  "IMN": "Europe", // Isle of Man
  "ITA": "Europe", // Italy
  "JEY": "Europe", // Jersey
  "LVA": "Europe", // Latvia
  "LIE": "Europe", // Liechtenstein
  "LTU": "Europe", // Lithuania
  "LUX": "Europe", // Luxembourg
  "MLT": "Europe", // Malta
  "MDA": "Europe", // Moldova
  "MCO": "Europe", // Monaco
  "MNE": "Europe", // Montenegro
  "NLD": "Europe", // Netherlands
  "MKD": "Europe", // North Macedonia
  "NOR": "Europe", // Norway
  "POL": "Europe", // Poland
  "PRT": "Europe", // Portugal
  "ROU": "Europe", // Romania
  "RUS": "Europe", // Russian Federation
  "SMR": "Europe", // San Marino
  "SRB": "Europe", // Serbia
  "SVK": "Europe", // Slovakia
  "SVN": "Europe", // Slovenia
  "ESP": "Europe", // Spain
  "SJM": "Europe", // Svalbard and Jan Mayen
  "SWE": "Europe", // Sweden
  "CHE": "Europe", // Switzerland
  "UKR": "Europe", // Ukraine
  "GBR": "Europe", // United Kingdom
  
  // Asia-Pacific (including Southern Asia, Eastern Asia, South-eastern Asia, Central Asia, and Oceania)
  "AFG": "Asia-Pacific", // Afghanistan
  "AUS": "Asia-Pacific", // Australia
  "BGD": "Asia-Pacific", // Bangladesh
  "BTN": "Asia-Pacific", // Bhutan
  "BRN": "Asia-Pacific", // Brunei Darussalam
  "KHM": "Asia-Pacific", // Cambodia
  "CHN": "Asia-Pacific", // China
  "CXR": "Asia-Pacific", // Christmas Island
  "CCK": "Asia-Pacific", // Cocos (Keeling) Islands
  "COK": "Asia-Pacific", // Cook Islands
  "FJI": "Asia-Pacific", // Fiji
  "PYF": "Asia-Pacific", // French Polynesia
  "HMD": "Asia-Pacific", // Heard Island and McDonald Islands
  "HKG": "Asia-Pacific", // Hong Kong
  "IND": "Asia-Pacific", // India
  "IDN": "Asia-Pacific", // Indonesia
  "IRN": "Asia-Pacific", // Iran
  "JPN": "Asia-Pacific", // Japan
  "KAZ": "Asia-Pacific", // Kazakhstan
  "KIR": "Asia-Pacific", // Kiribati
  "PRK": "Asia-Pacific", // North Korea
  "KOR": "Asia-Pacific", // South Korea
  "KGZ": "Asia-Pacific", // Kyrgyzstan
  "LAO": "Asia-Pacific", // Laos
  "MAC": "Asia-Pacific", // Macao
  "MYS": "Asia-Pacific", // Malaysia
  "MDV": "Asia-Pacific", // Maldives
  "MHL": "Asia-Pacific", // Marshall Islands
  "FSM": "Asia-Pacific", // Micronesia
  "MNG": "Asia-Pacific", // Mongolia
  "MMR": "Asia-Pacific", // Myanmar
  "NRU": "Asia-Pacific", // Nauru
  "NPL": "Asia-Pacific", // Nepal
  "NCL": "Asia-Pacific", // New Caledonia
  "NZL": "Asia-Pacific", // New Zealand
  "NIU": "Asia-Pacific", // Niue
  "NFK": "Asia-Pacific", // Norfolk Island
  "MNP": "Asia-Pacific", // Northern Mariana Islands
  "PAK": "Asia-Pacific", // Pakistan
  "PLW": "Asia-Pacific", // Palau
  "PNG": "Asia-Pacific", // Papua New Guinea
  "PHL": "Asia-Pacific", // Philippines
  "PCN": "Asia-Pacific", // Pitcairn
  "WSM": "Asia-Pacific", // Samoa
  "SGP": "Asia-Pacific", // Singapore
  "SLB": "Asia-Pacific", // Solomon Islands
  "LKA": "Asia-Pacific", // Sri Lanka
  "TWN": "Asia-Pacific", // Taiwan
  "TJK": "Asia-Pacific", // Tajikistan
  "THA": "Asia-Pacific", // Thailand
  "TLS": "Asia-Pacific", // Timor-Leste
  "TKL": "Asia-Pacific", // Tokelau
  "TON": "Asia-Pacific", // Tonga
  "TKM": "Asia-Pacific", // Turkmenistan
  "TUV": "Asia-Pacific", // Tuvalu
  "UZB": "Asia-Pacific", // Uzbekistan
  "VUT": "Asia-Pacific", // Vanuatu
  "VNM": "Asia-Pacific", // Vietnam
  "WLF": "Asia-Pacific", // Wallis and Futuna
  "ASM": "Asia-Pacific", // American Samoa
  "GUM": "Asia-Pacific", // Guam
  "UMI": "Asia-Pacific"  // United States Minor Outlying Islands
};

// Full country data from UN classification
export const countryData = [
  {"name":"Afghanistan","alpha-2":"AF","alpha-3":"AFG","country-code":"004","iso_3166-2":"ISO 3166-2:AF","region":"Asia","sub-region":"Southern Asia","intermediate-region":"","region-code":"142","sub-region-code":"034","intermediate-region-code":""},
  {"name":"Åland Islands","alpha-2":"AX","alpha-3":"ALA","country-code":"248","iso_3166-2":"ISO 3166-2:AX","region":"Europe","sub-region":"Northern Europe","intermediate-region":"","region-code":"150","sub-region-code":"154","intermediate-region-code":""},
  {"name":"Albania","alpha-2":"AL","alpha-3":"ALB","country-code":"008","iso_3166-2":"ISO 3166-2:AL","region":"Europe","sub-region":"Southern Europe","intermediate-region":"","region-code":"150","sub-region-code":"039","intermediate-region-code":""},
  {"name":"Algeria","alpha-2":"DZ","alpha-3":"DZA","country-code":"012","iso_3166-2":"ISO 3166-2:DZ","region":"Africa","sub-region":"Northern Africa","intermediate-region":"","region-code":"002","sub-region-code":"015","intermediate-region-code":""},
  {"name":"American Samoa","alpha-2":"AS","alpha-3":"ASM","country-code":"016","iso_3166-2":"ISO 3166-2:AS","region":"Oceania","sub-region":"Polynesia","intermediate-region":"","region-code":"009","sub-region-code":"061","intermediate-region-code":""},
  {"name":"Andorra","alpha-2":"AD","alpha-3":"AND","country-code":"020","iso_3166-2":"ISO 3166-2:AD","region":"Europe","sub-region":"Southern Europe","intermediate-region":"","region-code":"150","sub-region-code":"039","intermediate-region-code":""},
  {"name":"Angola","alpha-2":"AO","alpha-3":"AGO","country-code":"024","iso_3166-2":"ISO 3166-2:AO","region":"Africa","sub-region":"Sub-Saharan Africa","intermediate-region":"Middle Africa","region-code":"002","sub-region-code":"202","intermediate-region-code":"017"},
  {"name":"Anguilla","alpha-2":"AI","alpha-3":"AIA","country-code":"660","iso_3166-2":"ISO 3166-2:AI","region":"Americas","sub-region":"Latin America and the Caribbean","intermediate-region":"Caribbean","region-code":"019","sub-region-code":"419","intermediate-region-code":"029"},
  {"name":"Antigua and Barbuda","alpha-2":"AG","alpha-3":"ATG","country-code":"028","iso_3166-2":"ISO 3166-2:AG","region":"Americas","sub-region":"Latin America and the Caribbean","intermediate-region":"Caribbean","region-code":"019","sub-region-code":"419","intermediate-region-code":"029"},
  {"name":"Argentina","alpha-2":"AR","alpha-3":"ARG","country-code":"032","iso_3166-2":"ISO 3166-2:AR","region":"Americas","sub-region":"Latin America and the Caribbean","intermediate-region":"South America","region-code":"019","sub-region-code":"419","intermediate-region-code":"005"},
  // More countries would be added here...
];

// Get the region for a country by ISO code
export const getCountryRegion = (iso3) => {
  if (!iso3) return null;
  
  // Direct lookup from our ISO3 mapping
  if (iso3ToRegionMap[iso3]) {
    return iso3ToRegionMap[iso3];
  }
  
  // Try alternate formats (lowercase, trimmed)
  const normalizedIso = iso3.trim().toUpperCase();
  if (iso3ToRegionMap[normalizedIso]) {
    return iso3ToRegionMap[normalizedIso];
  }
  
  // Check the country data
  const country = countryData.find(c => 
    c['alpha-3'] === iso3 || 
    c['alpha-3'] === normalizedIso
  );
  
  if (country) {
    return mapToStandardRegion(country.region, country['sub-region']);
  }
  
  return null;
};

// Get the region for a country by name
export const getCountryRegionByName = (countryName) => {
  if (!countryName) return null;
  
  // Direct lookup from our mapping
  if (countryRegionMap[countryName]) {
    return countryRegionMap[countryName];
  }
  
  // Try common name variations
  const variations = [
    countryName,
    countryName.replace(/\s+/g, ' ').trim(),
    countryName.replace('Republic of', '').replace(/\s+/g, ' ').trim(),
    countryName.replace('Democratic Republic of', '').replace(/\s+/g, ' ').trim(),
    countryName.replace('The', '').replace(/\s+/g, ' ').trim(),
    countryName.replace('Kingdom of', '').replace(/\s+/g, ' ').trim(),
    countryName.replace('State of', '').replace(/\s+/g, ' ').trim(),
    countryName.replace('Federated States of', '').replace(/\s+/g, ' ').trim(),
    countryName.replace('United States of', 'United States').replace(/\s+/g, ' ').trim()
  ];
  
  // Check all variations against the countryRegionMap
  for (const variation of variations) {
    if (countryRegionMap[variation]) {
      return countryRegionMap[variation];
    }
  }
  
  // Look in the country data
  const country = countryData.find(c => {
    return variations.some(variation => 
      c.name === variation || 
      c.name.includes(variation) ||
      variation.includes(c.name)
    );
  });
  
  if (country) {
    return mapToStandardRegion(country.region, country['sub-region']);
  }
  
  // If all else fails, try to parse the region from the name
  return mapToStandardRegion(null, null);
};

// Count countries in each region
export const countCountriesByRegion = (vaccineData) => {
  const counts = {
    'Africa': 0,
    'Americas': 0, 
    'Asia-Pacific': 0,
    'Europe': 0,
    'Middle East & North Africa': 0
  };
  
  if (!vaccineData || !Array.isArray(vaccineData)) {
    return counts; 
  }
  
  vaccineData.forEach(country => {
    if (!country) return;
    
    let region = null;
    
    // Use existing Region if available
    if (country.Region && counts[country.Region] !== undefined) {
      region = country.Region;
    } 
    // Try to get region from ISO3 code
    else if (country.ISO3) {
      region = getCountryRegion(country.ISO3);
    } 
    // Try to get region from country name
    else if (country.Country) {
      region = getCountryRegionByName(country.Country);
    }
    
    if (region && counts[region] !== undefined) {
      counts[region]++;
    }
  });
  
  return counts;
};

// Standard regions with colors
export const standardRegions = [
  { id: 'all', name: 'All Regions', color: '#cccccc' },
  { id: 'Africa', name: 'Africa', color: '#ffb347' },
  { id: 'Americas', name: 'Americas', color: '#82ca9d' },
  { id: 'Asia-Pacific', name: 'Asia-Pacific', color: '#8884d8' },
  { id: 'Europe', name: 'Europe', color: '#8dd1e1' },
  { id: 'Middle East & North Africa', name: 'Middle East & North Africa', color: '#ffc658' }
];

// Sort regions by number of countries
export const getSortedRegions = (vaccineData) => {
  const counts = countCountriesByRegion(vaccineData);
  
  // Create a copy of standardRegions
  const regionsWithCounts = standardRegions.map(region => ({
    ...region,
    count: region.id === 'all' ? vaccineData.length : counts[region.id] || 0
  }));
  
  // Sort by count (descending), keeping 'all' at the top
  return regionsWithCounts.sort((a, b) => {
    if (a.id === 'all') return -1; // Keep 'all' first
    if (b.id === 'all') return 1;
    return b.count - a.count; // Sort others by count descending
  });
}; 