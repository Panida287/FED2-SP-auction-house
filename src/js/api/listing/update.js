import { loggedInHeaders } from "../headers";
import { API_AUCTION_LISTING } from "../constants";

/**
 * Updates an existing auction listing by ID.
 *
 * @async
 * @function updateListing
 * @param {string} id - The ID of the listing to update.
 * @param {Object} data - The updated listing data.
 * @param {string} data.title - The updated title for the listing.
 * @param {string} data.description - The updated description of the listing.
 * @param {Array<string>} [data.tags] - The updated tags for the listing.
 * @param {Array<Object>} [data.media] - The updated media array containing URLs and alt text.
 * @returns {Promise<Object>} Resolves with the updated listing data.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function updateListing(id, { title, description, tags, media }) {
  const myHeaders = await loggedInHeaders();

  try {
    const response = await fetch(`${API_AUCTION_LISTING}/${id}`, {
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
    throw new Error(error.message || "Error updating listing.");
  }
}
