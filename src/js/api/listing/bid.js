import { API_AUCTION_LISTING } from "../constants";
import { getIDFromURL } from "../../utilities/urlIDUtils";
import { loggedInHeaders } from "../headers";

/**
 * Places a bid on a specific auction listing.
 *
 * @async
 * @function placeBid
 * @param {number} amount - The bid amount (required).
 * @returns {Promise<Object>} A promise that resolves to the server's response or throws an error.
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
      // Throw an error with a user-friendly message from the API
      throw new Error(responseData.message || "An error occurred while placing the bid.");
    }

    return responseData; // Return successful response data
  } catch (error) {
    console.error("Error placing bid:", error.message);
    throw error; // Re-throw the error for the calling function to handle
  }
}

