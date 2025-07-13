import tzlookup from "tz-lookup";

/**
 * Returns the timezone string (e.g., "Asia/Jerusalem") for given latitude & longitude.
 * @param {number} lat
 * @param {number} lng
 * @returns {string} timezone
 */
export function getTimeZoneFromCoords(lat, lng) {
  try {
    return tzlookup(lat, lng);
  } catch (err) {
    console.error("Error looking up timezone:", err);
    return null;
  }
}