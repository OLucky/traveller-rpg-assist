/**
 * @interface UWPDetails
 * @description Represents the parsed components of a Universal World Profile (UWP) string.
 */
export interface UWPDetails {
  starport: { code: string; description: string };
  size: { code: string; description: string };
  atmosphere: { code: string; description: string };
  hydrographics: { code: string; description: string };
  population: { code: string; description: string };
  government: { code: string; description: string };
  lawLevel: { code: string; description: string };
  techLevel: { code: string; description: string };
  bases?: { code: string; description: string }[]; // Optional, as not all UWPs have bases
  travelZone?: { code: string; description: string }; // Optional
  tradeCodes?: { code: string; description: string }[]; // New: Optional, array of trade codes
  remarks?: string; // Optional
}

/**
 * @interface UWPParameterReference
 * @description Defines the structure for the UWP parameter reference data.
 */
export interface UWPParameterReference {
  starport: { code: string; description: string }[];
  size: { code: string; description: string }[];
  atmosphere: { code: string; description: string }[];
  hydrographics: { code: string; description: string }[];
  population: { code: string; description: string }[];
  government: { code: string; description: string }[];
  law_level: { code: string; description: string }[];
  tech_level: { code: string; description: string }[];
  bases: { code: string; description: string }[];
  travel_zone: { code: string; description: string }[];
  trade_codes: { code: string; description: string }[]; // Used in core UWP string parsing
  allegiances: { code: string; description: string }[]; // Not used in core UWP string, but good for reference
}
