import { API_AUCTION_LISTING } from "../constants";
import { getIDFromURL } from "../../utilities/urlIDUtils";
import { loggedInHeaders } from "../headers";

/**
 * Places a bid on a specific auction listing.
 *
 * @async
 * @param {number} amount - The bid amount (required).
 * @returns {Promise<Object>} Resolves to the server's response if successful.
 * @throws {Error} Throws an error if the API request fails or returns an error.
 */
export async function placeBid(amount) {
  const listingID = getIDFromURL("listingID");
  const myHeaders = await loggedInHeaders();
  const requestBody = JSON.stringify({ amount });

  try {
    const response = await fetch(`${API_AUCTION_LISTING}/${listingID}/bids`, {
      method: "POST",
      headers: myHeaders,
      body: requestBody,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to place the bid.");
    }

    return responseData;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred while placing the bid.");
  }
}
