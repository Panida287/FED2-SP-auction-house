import { headers } from '../headers';
import { API_AUCTION_LISTING } from '../constants';

/**
 * Creates a new listing by sending a POST request to the API.
 *
 * @async
 * @param {Object} listingData - The data for the new listing.
 * @param {string} listingData.title - The title of the listing (required).
 * @param {string} listingData.description - The description of the listing (required).
 * @param {Array<string>} [listingData.tags] - Optional tags for the listing.
 * @param {Array<Object>} [listingData.media] - Optional media array containing URLs and alt text.
 * @param {string} listingData.endsAt - The auction end date and time in ISO 8601 format (required).
 * @returns {Promise<Object>} The response from the API.
 * @throws {Error} Will throw an error if the API request fails.
 */
export async function createListing({ title, description, tags, media, endsAt }) {
  try {
    const myHeaders = await headers();

    const response = await fetch(API_AUCTION_LISTING, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        title,
        description,
        tags,
        media,
        endsAt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create listing.");
    }

    return await response.json();
    
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
}


