import { headers } from '../headers';
import { API_AUCTION_LISTING } from '../constants';

/**
 * Updates a listing by ID.
 *
 * @param {string} id - The ID of the listing to update.
 * @param {Object} data - The updated listing data.
 * @param {string} data.title - The updated title.
 * @param {string} data.description - The updated description.
 * @param {Array<string>} data.tags - The updated tags.
 * @param {Array<Object>} data.media - The updated media array.
 * @returns {Promise<Object>} The updated listing data.
 */
export async function updateListing(id, { title, description, tags, media }) {
  try {
    const myHeaders = await headers();

    const response = await fetch(`${API_AUCTION_LISTING}/${id}`, { // Append ID to URL
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify({
        title,
        description,
        tags,
        media,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update listing.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
}