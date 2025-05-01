// Organizations that help with vaccine distribution and healthcare by region

// Global organizations that work across all regions
export const globalOrganizations = [
  {
    name: "World Health Organization (WHO)",
    url: "https://www.who.int/initiatives/immunization-agenda-2030",
    description: "Leading international health agency coordinating global vaccine initiatives"
  },
  {
    name: "UNICEF",
    url: "https://www.unicef.org/immunization",
    description: "Delivers vaccines to 45% of the world's children under five years of age"
  },
  {
    name: "Gavi, the Vaccine Alliance",
    url: "https://www.gavi.org/",
    description: "Public-private partnership that helps vaccinate half the world's children"
  },
  {
    name: "PATH",
    url: "https://www.path.org/",
    description: "Global health organization focused on innovation for vaccines and immunization"
  },
  {
    name: "Médecins Sans Frontières (Doctors Without Borders)",
    url: "https://www.doctorswithoutborders.org/what-we-do/medical-issues/vaccination",
    description: "Provides emergency medical aid in crisis regions"
  }
];

// Region-specific organizations
export const regionalOrganizations = {
  "Africa": [
    {
      name: "Africa CDC",
      url: "https://africacdc.org/",
      description: "Public health agency of the African Union focused on strengthening health systems"
    },
    {
      name: "Amref Health Africa",
      url: "https://amref.org/",
      description: "Africa's leading health development organization"
    },
    {
      name: "Save the Children Africa",
      url: "https://www.savethechildren.net/",
      description: "Works to improve children's health and education across Africa"
    }
  ],
  
  "Americas": [
    {
      name: "Pan American Health Organization",
      url: "https://www.paho.org/en/topics/immunization",
      description: "Regional office of WHO for the Americas"
    },
    {
      name: "UNICEF Latin America and Caribbean",
      url: "https://www.unicef.org/lac/en",
      description: "Focused on children's health in Latin America and Caribbean"
    },
    {
      name: "Partners In Health",
      url: "https://www.pih.org/",
      description: "Provides healthcare in underserved communities in the Americas"
    }
  ],
  
  "Asia-Pacific": [
    {
      name: "Asian Development Bank Health Sector",
      url: "https://www.adb.org/what-we-do/sectors/health/main",
      description: "Supports health infrastructure in Asia and the Pacific"
    },
    {
      name: "UNICEF East Asia and Pacific",
      url: "https://www.unicef.org/eap/",
      description: "Works on children's health in East Asia and Pacific regions"
    },
    {
      name: "CARE Asia",
      url: "https://www.care-international.org/",
      description: "Humanitarian organization fighting poverty with focus on healthcare"
    }
  ],
  
  "Europe": [
    {
      name: "European Centre for Disease Prevention and Control",
      url: "https://www.ecdc.europa.eu/en/immunisation-vaccines",
      description: "EU agency aimed at strengthening Europe's defenses against infectious diseases"
    },
    {
      name: "WHO Europe",
      url: "https://www.euro.who.int/en/health-topics/disease-prevention/vaccines-and-immunization",
      description: "European branch of WHO focusing on regional vaccine initiatives"
    },
    {
      name: "Médecins du Monde",
      url: "https://www.medecinsdumonde.org/en/",
      description: "European humanitarian organization providing medical care"
    }
  ],
  
  "Middle East & North Africa": [
    {
      name: "WHO Eastern Mediterranean",
      url: "https://www.emro.who.int/vpi/vaccines-preventable-diseases/en/",
      description: "WHO regional office for the Eastern Mediterranean"
    },
    {
      name: "UNICEF Middle East and North Africa",
      url: "https://www.unicef.org/mena/health",
      description: "Children's health organization for MENA region"
    },
    {
      name: "International Medical Corps",
      url: "https://internationalmedicalcorps.org/",
      description: "Provides emergency healthcare in conflict zones"
    }
  ]
};

// Get help organizations for a specific region
export const getHelpOrganizations = (region) => {
  const regional = region && regionalOrganizations[region] 
    ? regionalOrganizations[region] 
    : [];
    
  return {
    global: globalOrganizations,
    regional: regional
  };
}; 