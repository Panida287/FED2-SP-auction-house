/**
 * Extracts a specific ID from the URL based on the provided parameter name.
 * 
 * @param {string} idName - The name of the parameter (e.g., 'listingID') to extract from the URL.
 * @returns {string | null} - The value of the ID parameter from the URL, or null if not found.
 * 
 * @exampleUsage 
 * const listingID = getIDFromURL('listingID');
 * const authorID = getIDFromURL('authorID');

 */
export function getIDFromURL(idName) {
  const params = new URLSearchParams(window.location.search);
  return params.get(idName);
}
