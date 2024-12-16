import { loggedInHeaders } from "../headers";
import { API_AUCTION_LISTING } from "../constants";

/**
 * Deletes a listing by its ID.
 *
 * @async
 * @param {string} id - The ID of the listing to delete.
 * @returns {Promise<void | Object>} Resolves with no content if deletion is successful, or optional response data.
 * @throws {Error} Throws an error if the deletion request fails.
 */
export async function deleteListing(id) {
  const myHeaders = await loggedInHeaders();

  try {
    const response = await fetch(`${API_AUCTION_LISTING}/${id}`, {
      method: "DELETE",
      headers: myHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete listing.");
    }

    // If successful but no content is returned
    if (response.status === 204) {
      return;
    }

    // Return response body if any content is provided
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred while deleting the listing.");
  }
}
