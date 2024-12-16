import { loggedInHeaders } from '../headers';
import { API_AUCTION_LISTING } from '../constants';

/**
 * Updates a listing by ID.
 *
 * @param {string} id - The ID of the listing to update.
 * @returns {Promise<Object>} The updated listing data.
 */
export async function deleteListing(id) {
  try {
    const myHeaders = await loggedInHeaders();

    const response = await fetch(`${API_AUCTION_LISTING}/${id}`, {
      method: "DELETE",
      headers: myHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete listing.");
    }

    // Check if there is a response body
    if (response.status === 204 || response.status === 200) {
      return; // Successful deletion, no content returned
    }

    // If there's content, return it (optional)
    return await response.json();
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
}
