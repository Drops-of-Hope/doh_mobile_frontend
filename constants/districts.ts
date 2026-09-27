// constants/districts.ts

export enum District {
  // Western Province
  COLOMBO = "COLOMBO",
  GAMPAHA = "GAMPAHA",
  KALUTARA = "KALUTARA",

  // Central Province
  KANDY = "KANDY",
  MATALE = "MATALE",
  NUWARA_ELIYA = "NUWARA_ELIYA",

  // Southern Province
  GALLE = "GALLE",
  MATARA = "MATARA",
  HAMBANTOTA = "HAMBANTOTA",

  // Northern Province
  JAFFNA = "JAFFNA",
  KILINOCHCHI = "KILINOCHCHI",
  MANNAR = "MANNAR",
  MULLAITIVU = "MULLAITIVU",
  VAVUNIYA = "VAVUNIYA",

  // Eastern Province
  AMPARA = "AMPARA",
  BATTICALOA = "BATTICALOA",
  TRINCOMALEE = "TRINCOMALEE",

  // North Western Province
  KURUNEGALA = "KURUNEGALA",
  PUTTALAM = "PUTTALAM",

  // North Central Province
  ANURADHAPURA = "ANURADHAPURA",
  POLONNARUWA = "POLONNARUWA",

  // Uva Province
  BADULLA = "BADULLA",
  MONARAGALA = "MONARAGALA",

  // Sabaragamuwa Province
  KEGALLE = "KEGALLE",
  RATNAPURA = "RATNAPURA",
}

// District to Province mapping
export const DISTRICT_TO_PROVINCE: { [key in District]: string } = {
  // Western Province
  [District.COLOMBO]: "Western",
  [District.GAMPAHA]: "Western",
  [District.KALUTARA]: "Western",

  // Central Province
  [District.KANDY]: "Central",
  [District.MATALE]: "Central",
  [District.NUWARA_ELIYA]: "Central",

  // Southern Province
  [District.GALLE]: "Southern",
  [District.MATARA]: "Southern",
  [District.HAMBANTOTA]: "Southern",

  // Northern Province
  [District.JAFFNA]: "Northern",
  [District.KILINOCHCHI]: "Northern",
  [District.MANNAR]: "Northern",
  [District.MULLAITIVU]: "Northern",
  [District.VAVUNIYA]: "Northern",

  // Eastern Province
  [District.AMPARA]: "Eastern",
  [District.BATTICALOA]: "Eastern",
  [District.TRINCOMALEE]: "Eastern",

  // North Western Province
  [District.KURUNEGALA]: "North Western",
  [District.PUTTALAM]: "North Western",

  // North Central Province
  [District.ANURADHAPURA]: "North Central",
  [District.POLONNARUWA]: "North Central",

  // Uva Province
  [District.BADULLA]: "Uva",
  [District.MONARAGALA]: "Uva",

  // Sabaragamuwa Province
  [District.KEGALLE]: "Sabaragamuwa",
  [District.RATNAPURA]: "Sabaragamuwa",
};

// Province to Districts mapping (useful for reverse lookups)
export const PROVINCE_TO_DISTRICTS: { [province: string]: District[] } = {
  Western: [District.COLOMBO, District.GAMPAHA, District.KALUTARA],
  Central: [District.KANDY, District.MATALE, District.NUWARA_ELIYA],
  Southern: [District.GALLE, District.MATARA, District.HAMBANTOTA],
  Northern: [
    District.JAFFNA,
    District.KILINOCHCHI,
    District.MANNAR,
    District.MULLAITIVU,
    District.VAVUNIYA,
  ],
  Eastern: [District.AMPARA, District.BATTICALOA, District.TRINCOMALEE],
  "North Western": [District.KURUNEGALA, District.PUTTALAM],
  "North Central": [District.ANURADHAPURA, District.POLONNARUWA],
  Uva: [District.BADULLA, District.MONARAGALA],
  Sabaragamuwa: [District.KEGALLE, District.RATNAPURA],
};

// All districts array (useful for iteration)
export const ALL_DISTRICTS: District[] = Object.values(District);

// All provinces array
export const ALL_PROVINCES: string[] = Object.keys(PROVINCE_TO_DISTRICTS);

// Helper functions
export const getProvinceByDistrict = (district: District): string => {
  return DISTRICT_TO_PROVINCE[district];
};

export const getDistrictsByProvince = (province: string): District[] => {
  return PROVINCE_TO_DISTRICTS[province] || [];
};

export const formatDistrictName = (district: District): string => {
  return district
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

// District display names (formatted for UI)
export const DISTRICT_DISPLAY_NAMES: { [key in District]: string } = {
  [District.COLOMBO]: "Colombo",
  [District.GAMPAHA]: "Gampaha",
  [District.KALUTARA]: "Kalutara",
  [District.KANDY]: "Kandy",
  [District.MATALE]: "Matale",
  [District.NUWARA_ELIYA]: "Nuwara Eliya",
  [District.GALLE]: "Galle",
  [District.MATARA]: "Matara",
  [District.HAMBANTOTA]: "Hambantota",
  [District.JAFFNA]: "Jaffna",
  [District.KILINOCHCHI]: "Kilinochchi",
  [District.MANNAR]: "Mannar",
  [District.MULLAITIVU]: "Mullaitivu",
  [District.VAVUNIYA]: "Vavuniya",
  [District.AMPARA]: "Ampara",
  [District.BATTICALOA]: "Batticaloa",
  [District.TRINCOMALEE]: "Trincomalee",
  [District.KURUNEGALA]: "Kurunegala",
  [District.PUTTALAM]: "Puttalam",
  [District.ANURADHAPURA]: "Anuradhapura",
  [District.POLONNARUWA]: "Polonnaruwa",
  [District.BADULLA]: "Badulla",
  [District.MONARAGALA]: "Monaragala",
  [District.KEGALLE]: "Kegalle",
  [District.RATNAPURA]: "Ratnapura",
};
