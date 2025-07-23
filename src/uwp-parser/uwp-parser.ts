import { uwpParametersReferenceData as uwpRef } from './data';
import type { UWPDetails } from './types';

/**
 * @function getUWPParameterDescription
 * @description Helper function to find the description for a given UWP code from the reference data.
 * @param {Array<{code: string, description: string}>} paramArray - The array of parameter objects (e.g., uwpRef.starport).
 * @param {string} code - The UWP code to look up.
 * @returns {{code: string, description: string}} An object containing the code and its description, or a default if not found.
 */
function getUWPParameterDescription(
  paramArray: { code: string; description: string }[],
  code: string
): { code: string; description: string } {
  return paramArray.find((p) => p.code === code) || { code: code, description: 'Unknown' };
}

/**
 * @function validateUWPString
 * @description Validates a Universal World Profile (UWP) string against the expected format.
 * @param {string} uwpString - The UWP string to validate (e.g., "A865AB7-C N A Ag In Hi (Some Remarks)").
 * @returns {boolean} True if the UWP string is valid, otherwise false.
 */
export function validateUWPString(uwpString: string): string | false {
  if (!uwpString || typeof uwpString !== 'string') {
    console.error('Invalid UWP string provided.');
    return 'Invalid UWP string provided.';
  }

  const parts = uwpString.trim().split(' ');
  const coreUWP = parts[0];

  if (coreUWP.length < 9 || coreUWP[7] !== '-') {
    console.error("UWP string format is incorrect. Expected format like 'A865AB7-C'.");
    return "UWP string format is incorrect. Expected format like 'A865AB7-C'.";
  }

  return false;
}

/**
 * @function parseUWPString
 * @description Parses a Universal World Profile (UWP) string into a structured object with descriptions.
 * @param {string} uwpString - The UWP string to parse (e.g., "A865AB7-C N A Ag In Hi (Some Remarks)").
 * @returns {UWPDetails | null} A UWPDetails object if parsing is successful, otherwise null.
 */
export function parseUWPString(uwpString: string): UWPDetails | null {
  const isError = validateUWPString(uwpString);
  if (isError) return null;

  const parts = uwpString.trim().split(' ');
  const coreUWP = parts[0];

  const starportCode = coreUWP[0];
  const sizeCode = coreUWP[1];
  const atmosphereCode = coreUWP[2];
  const hydrographicsCode = coreUWP[3];
  const populationCode = coreUWP[4];
  const governmentCode = coreUWP[5];
  const lawLevelCode = coreUWP[6];
  const techLevelCode = coreUWP[8];

  const result: UWPDetails = {
    starport: getUWPParameterDescription(uwpRef.starport, starportCode),
    size: getUWPParameterDescription(uwpRef.size, sizeCode),
    atmosphere: getUWPParameterDescription(uwpRef.atmosphere, atmosphereCode),
    hydrographics: getUWPParameterDescription(uwpRef.hydrographics, hydrographicsCode),
    population: getUWPParameterDescription(uwpRef.population, populationCode),
    government: getUWPParameterDescription(uwpRef.government, governmentCode),
    lawLevel: getUWPParameterDescription(uwpRef.law_level, lawLevelCode),
    techLevel: getUWPParameterDescription(uwpRef.tech_level, techLevelCode),
  };

  const remainingSegments = parts.slice(1);
  let remarksStartIndex = remainingSegments.length;

  // Step 1: Find the start of remarks (assuming remarks begin with '(' or are the final unrecognized segments)
  for (let i = 0; i < remainingSegments.length; i++) {
    if (remainingSegments[i].startsWith('(')) {
      remarksStartIndex = i;
      break;
    }
  }

  // Extract remarks
  if (remarksStartIndex < remainingSegments.length) {
    result.remarks = remainingSegments.slice(remarksStartIndex).join(' ');
  }

  // Now, process the segments that are NOT remarks (these contain bases, travel zone, trade codes)
  const codeSegments = remainingSegments.slice(0, remarksStartIndex);
  const currentBases: { code: string; description: string }[] = [];
  const currentTradeCodes: { code: string; description: string }[] = [];
  let currentTravelZoneCode: string | undefined;

  const isKnownTravelZoneCode = (code: string) => uwpRef.travel_zone.some((tz) => tz.code === code);
  const isKnownBaseCode = (code: string) => uwpRef.bases.some((b) => b.code === code);
  const isKnownTradeCode = (code: string) => uwpRef.trade_codes.some((tc) => tc.code === code);

  // Parse code segments from right to left to prioritize Travel Zone and then Trade Codes
  // as they typically appear closer to the end of the non-remark section.
  for (let i = codeSegments.length - 1; i >= 0; i--) {
    const segment = codeSegments[i];

    if (!currentTravelZoneCode && segment.length === 1 && isKnownTravelZoneCode(segment)) {
      currentTravelZoneCode = segment;
      codeSegments.splice(i, 1); // Remove from array once processed
      continue;
    }

    console.log(`Processing segment: ${segment}`);

    if (segment.length === 2 && isKnownTradeCode(segment)) {
      currentTradeCodes.unshift(getUWPParameterDescription(uwpRef.trade_codes, segment)); // Unshift to maintain order
      codeSegments.splice(i, 1);
      continue;
    }
  }

  // Whatever remains in codeSegments should be bases
  for (const segment of codeSegments) {
    // Check for grouped bases like "SN" or individual bases like "N"
    // Ensure all characters in the segment are valid base codes
    if (segment.length >= 1 && segment.split('').every((char) => isKnownBaseCode(char))) {
      segment.split('').forEach((char) => {
        currentBases.push(getUWPParameterDescription(uwpRef.bases, char));
      });
    } else {
      // If after all this, something is left and it's not a known base,
      // it means our initial remark detection or code detection was flawed.
      // For robustness, add it to remarks if it couldn't be parsed.
      if (!result.remarks) result.remarks = '';
      result.remarks += (result.remarks ? ' ' : '') + segment;
    }
  }

  // Assign parsed data to result object
  if (currentBases.length > 0) {
    result.bases = currentBases;
  }
  if (currentTravelZoneCode) {
    result.travelZone = getUWPParameterDescription(uwpRef.travel_zone, currentTravelZoneCode);
  }
  if (currentTradeCodes.length > 0) {
    result.tradeCodes = currentTradeCodes;
  }

  return result;
}

// --- Example Usage ---
console.log('--- Parsing Example 1: Standard UWP ---');
const uwp1 = 'A865AB7-C';
const parsedUWP1 = parseUWPString(uwp1);
if (parsedUWP1) {
  console.log(`UWP String: "${uwp1}"`);
  console.log(JSON.stringify(parsedUWP1, null, 2));
}

console.log('\n--- Parsing Example 2: UWP with Bases and Travel Zone ---');
const uwp2 = 'B777777-7 N A'; // Starport B, Size 7, etc., Naval Base, Amber Travel Zone
const parsedUWP2 = parseUWPString(uwp2);
if (parsedUWP2) {
  console.log(`UWP String: "${uwp2}"`);
  console.log(JSON.stringify(parsedUWP2, null, 2));
}

console.log('\n--- Parsing Example 3: UWP with multiple Bases ---');
const uwp3 = 'C56876A-A SN R'; // Starport C, Scout and Naval Bases, Red Travel Zone
const parsedUWP3 = parseUWPString(uwp3);
if (parsedUWP3) {
  console.log(`UWP String: "${uwp3}"`);
  console.log(JSON.stringify(parsedUWP3, null, 2));
}

console.log('\n--- Parsing Example 4: UWP with only Bases ---');
const uwp4 = 'E410321-4 S'; // Starport E, Scout Base
const parsedUWP4 = parseUWPString(uwp4);
if (parsedUWP4) {
  console.log(`UWP String: "${uwp4}"`);
  console.log(JSON.stringify(parsedUWP4, null, 2));
}

console.log('\n--- Parsing Example 5: UWP with only Travel Zone ---');
const uwp5 = 'F000000-0 R'; // Starport F, Red Travel Zone
const parsedUWP5 = parseUWPString(uwp5);
if (parsedUWP5) {
  console.log(`UWP String: "${uwp5}"`);
  console.log(JSON.stringify(parsedUWP5, null, 2));
}

console.log('\n--- Parsing Example 6: UWP with Trade Codes and Remarks ---');
const uwp6 = 'C467345-7 Ag In Po (Major Trade Hub)'; // Trade codes: Agricultural, Industrial, Poor; Remarks
const parsedUWP6 = parseUWPString(uwp6);
if (parsedUWP6) {
  console.log(`UWP String: "${uwp6}"`);
  console.log(JSON.stringify(parsedUWP6, null, 2));
}

console.log('\n--- Parsing Example 7: UWP with Bases, Travel Zone, Trade Codes, and Remarks ---');
const uwp7 = 'B777777-7 N A Ag In (A bustling world)'; // Naval Base, Amber Travel Zone, Agricultural, Industrial trade codes, Remarks
const parsedUWP7 = parseUWPString(uwp7);
if (parsedUWP7) {
  console.log(`UWP String: "${uwp7}"`);
  console.log(JSON.stringify(parsedUWP7, null, 2));
}

console.log('\n--- Parsing Example 8: UWP with multiple Trade Codes and no bases/remarks ---');
const uwp8 = 'A888888-A Hi He Ri'; // High Pop, Heavily Settled, Rich
const parsedUWP8 = parseUWPString(uwp8);
if (parsedUWP8) {
  console.log(`UWP String: "${uwp8}"`);
  console.log(JSON.stringify(parsedUWP8, null, 2));
}
