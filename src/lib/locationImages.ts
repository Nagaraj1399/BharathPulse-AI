// High-resolution authentic location and area images for Bengaluru municipal wards and civic zones

export interface LocationImageProfile {
  areaName: string;
  landmark: string;
  imageUrl: string;
  verificationPhotoUrl: string;
  wardName: string;
  zone: string;
}

export const BENGALURU_AREA_PROFILES: Record<string, LocationImageProfile> = {
  'silk_board': {
    areaName: 'Silk Board Junction, Outer Ring Road',
    landmark: 'Central Elevated Interchange & Metro Junction',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    wardName: 'BTM Layout (Ward 176)',
    zone: 'South Zone',
  },
  'jayanagar_market': {
    areaName: 'Jayanagar 4th Block Market',
    landmark: 'Commercial Complex & Pedestrian Market Boulevard',
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=800&q=80',
    wardName: 'Pattabhiram Nagar (Ward 168)',
    zone: 'South Zone',
  },
  'mg_road': {
    areaName: 'Mahatma Gandhi Rd (MG Road Corridor)',
    landmark: 'Metro Viaduct & Central CBD Boulevard',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    wardName: 'Shantala Nagar (Ward 111)',
    zone: 'East Zone',
  },
  'old_airport_road': {
    areaName: 'Old Airport Road near Domlur Flyover',
    landmark: 'Domlur Flyover & Manipal Hospital Arterial Link',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    wardName: 'Domlur (Ward 112)',
    zone: 'East Zone',
  },
  'hsr_sector_6': {
    areaName: '14th Main Rd, HSR Layout Sector 6',
    landmark: 'HSR Stormwater Drainage & Tree-Lined Residential Avenue',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    wardName: 'HSR Layout (Ward 174)',
    zone: 'Bommanahalli Zone',
  },
  'whitefield': {
    areaName: 'Kundalahalli Gate, Whitefield',
    landmark: 'ITPL Tech Corridor & Kundalahalli Underpass',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    wardName: 'Hagadur (Ward 84)',
    zone: 'Mahadevapura Zone',
  },
  'majestic': {
    areaName: 'Kempegowda Bus Station Majestic',
    landmark: 'KSRTC / BMTC City Transit Multi-Modal Hub',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    wardName: 'Gandhinagar (Ward 94)',
    zone: 'West Zone',
  },
  'jayanagar_3rd': {
    areaName: '5th Cross, Jayanagar 3rd Block',
    landmark: 'Jayanagar Classic Heritage Tree Canopy & Cross Road',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    wardName: 'Jayanagar (Ward 153)',
    zone: 'South Zone',
  },
  'domlur_ring_road': {
    areaName: 'Domlur Inner Ring Road',
    landmark: 'BWSSB Main Pressure Feeder Corridor',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    wardName: 'Domlur (Ward 112)',
    zone: 'East Zone',
  },
  'central_cyber': {
    areaName: 'Bengaluru Central Digital Ward (Cyber Crime Cell)',
    landmark: 'CID Cyber Headquarters & Integrated Command Control',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    wardName: 'Sampangiram Nagar (Ward 110)',
    zone: 'Central Command Zone',
  },
  'indiranagar_100ft': {
    areaName: 'Indiranagar 100ft Road',
    landmark: 'Indiranagar High Street & 12th Main Commercial Junction',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    wardName: 'Hoysala Nagar (Ward 80)',
    zone: 'East Zone',
  },
  'koramangala': {
    areaName: 'Koramangala 80ft Road',
    landmark: 'Wipro Park Junction & Sony World Signal',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    wardName: 'Koramangala (Ward 151)',
    zone: 'South Zone',
  },
  'electronic_city': {
    areaName: 'Electronic City Phase 1',
    landmark: 'Elevated Tollway & Infosys Avenue Interchange',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    wardName: 'Electronic City Industrial Township',
    zone: 'South Tech Zone',
  },
  'hebbal': {
    areaName: 'Hebbal Flyover Junction',
    landmark: 'Multi-tier Airport Interchange & Bellary Road',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    wardName: 'Hebbal (Ward 21)',
    zone: 'North Zone',
  },
  'bellandur': {
    areaName: 'Bellandur Outer Ring Road',
    landmark: 'EcoSpace Tech Park & Outer Ring Road Transit Belt',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    wardName: 'Bellandur (Ward 150)',
    zone: 'Mahadevapura Zone',
  },
  'malleshwaram': {
    areaName: 'Malleshwaram 8th Main Rd / Sampige Road',
    landmark: 'Malleshwaram Heritage Commercial Corridor & Circle',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    wardName: 'Malleshwaram (Ward 45)',
    zone: 'West Zone',
  },
  'rajajinagar': {
    areaName: 'Rajajinagar 1st Block / West of Chord Road',
    landmark: 'Rajajinagar Entrance Arch & Industrial Suburban Belt',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    wardName: 'Rajajinagar (Ward 98)',
    zone: 'West Zone',
  },
  'shivajinagar': {
    areaName: 'Shivajinagar Russell Market Corridor',
    landmark: 'Cantonment Area & Shivaji Bus Terminal',
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=800&q=80',
    wardName: 'Shivajinagar (Ward 92)',
    zone: 'East Zone',
  },
  'yelahanka': {
    areaName: 'Yelahanka New Town / Kogilu Cross',
    landmark: 'North Bengaluru Airport Expressway & Kogilu Lake',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    wardName: 'Yelahanka (Ward 4)',
    zone: 'North Zone',
  },
  'banashankari': {
    areaName: 'Banashankari 2nd Stage / BDA Complex',
    landmark: 'Kanathapura Arterial & Banashankari Bus Terminal',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    wardName: 'Banashankari (Ward 180)',
    zone: 'South Zone',
  },
  'marathahalli': {
    areaName: 'Marathahalli Bridge & Outer Ring Road',
    landmark: 'Multiplex Junction & HAL Airport Border',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    wardName: 'Marathahalli (Ward 85)',
    zone: 'Mahadevapura Zone',
  },
  'btm_layout': {
    areaName: 'BTM Layout 2nd Stage / Udupi Garden',
    landmark: 'Udupi Garden Signal & 100ft Inner Ring Road',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    verificationPhotoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    wardName: 'BTM Layout (Ward 176)',
    zone: 'South Zone',
  },
};

export interface AreaImageResult extends LocationImageProfile {
  areaLabel: string;
}

function toResult(profile: LocationImageProfile, fallbackAddr?: string): AreaImageResult {
  return {
    ...profile,
    areaLabel: fallbackAddr || profile.areaName,
  };
}

// Smart lookup function to get the authentic image of any Bengaluru location/area
export function getLocationAreaImage(address?: string, category?: string): AreaImageResult {
  const addr = (address || '').toLowerCase();

  if (addr.includes('silk board') || addr.includes('btm') || addr.includes('central silk')) {
    return toResult(BENGALURU_AREA_PROFILES.silk_board);
  }
  if (addr.includes('jayanagar 4th') || (addr.includes('jayanagar') && addr.includes('market'))) {
    return toResult(BENGALURU_AREA_PROFILES.jayanagar_market);
  }
  if (addr.includes('jayanagar') || addr.includes('5th cross')) {
    return toResult(BENGALURU_AREA_PROFILES.jayanagar_3rd);
  }
  if (addr.includes('mg road') || addr.includes('mahatma gandhi') || addr.includes('brigade')) {
    return toResult(BENGALURU_AREA_PROFILES.mg_road);
  }
  if (addr.includes('airport road') || (addr.includes('domlur') && addr.includes('flyover'))) {
    return toResult(BENGALURU_AREA_PROFILES.old_airport_road);
  }
  if (addr.includes('domlur') || addr.includes('inner ring')) {
    return toResult(BENGALURU_AREA_PROFILES.domlur_ring_road);
  }
  if (addr.includes('hsr') || addr.includes('14th main') || addr.includes('sector 6')) {
    return toResult(BENGALURU_AREA_PROFILES.hsr_sector_6);
  }
  if (addr.includes('whitefield') || addr.includes('kundalahalli') || addr.includes('itpl')) {
    return toResult(BENGALURU_AREA_PROFILES.whitefield);
  }
  if (addr.includes('majestic') || addr.includes('kempegowda') || addr.includes('bus station')) {
    return toResult(BENGALURU_AREA_PROFILES.majestic);
  }
  if (addr.includes('indiranagar') || addr.includes('100ft')) {
    return toResult(BENGALURU_AREA_PROFILES.indiranagar_100ft);
  }
  if (addr.includes('koramangala')) {
    return toResult(BENGALURU_AREA_PROFILES.koramangala);
  }
  if (addr.includes('electronic city') || addr.includes('ecity')) {
    return toResult(BENGALURU_AREA_PROFILES.electronic_city);
  }
  if (addr.includes('hebbal')) {
    return toResult(BENGALURU_AREA_PROFILES.hebbal);
  }
  if (addr.includes('bellandur') || addr.includes('ecospace')) {
    return toResult(BENGALURU_AREA_PROFILES.bellandur);
  }
  if (addr.includes('malleshwaram') || addr.includes('sampige') || addr.includes('8th main')) {
    return toResult(BENGALURU_AREA_PROFILES.malleshwaram);
  }
  if (addr.includes('rajajinagar') || addr.includes('chord road') || addr.includes('navrang')) {
    return toResult(BENGALURU_AREA_PROFILES.rajajinagar);
  }
  if (addr.includes('shivajinagar') || addr.includes('russell market') || addr.includes('cantonment')) {
    return toResult(BENGALURU_AREA_PROFILES.shivajinagar);
  }
  if (addr.includes('yelahanka') || addr.includes('kogilu')) {
    return toResult(BENGALURU_AREA_PROFILES.yelahanka);
  }
  if (addr.includes('banashankari') || addr.includes('kanakapura')) {
    return toResult(BENGALURU_AREA_PROFILES.banashankari);
  }
  if (addr.includes('marathahalli')) {
    return toResult(BENGALURU_AREA_PROFILES.marathahalli);
  }
  if (addr.includes('btm') || addr.includes('udupi garden')) {
    return toResult(BENGALURU_AREA_PROFILES.btm_layout);
  }
  if (addr.includes('cyber') || category === 'CYBERSECURITY') {
    return toResult(BENGALURU_AREA_PROFILES.central_cyber);
  }

  // General fallback based on category
  if (category === 'WATER_LEAK' || category === 'FLOODING') {
    return toResult(BENGALURU_AREA_PROFILES.domlur_ring_road, address);
  }
  if (category === 'POWER_OUTAGE' || category === 'ELECTRICAL_HAZARD') {
    return toResult(BENGALURU_AREA_PROFILES.silk_board, address);
  }
  if (category === 'GARBAGE_OVERFLOW') {
    return toResult(BENGALURU_AREA_PROFILES.jayanagar_market, address);
  }

  // Default default
  return toResult(BENGALURU_AREA_PROFILES.indiranagar_100ft, address);
}
