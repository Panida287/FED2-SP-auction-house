import { API_AUCTION_LISTING } from "../constants";
import { getIDFromURL } from "../../utilities/urlIDUtils";
import { headers } from "../headers";

/**
 * Places a bid on a specific auction listing.
 *
 * @async
 * @function placeBid
 * @param {number} amount - The bid amount (required).
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 * @throws {Error} Will throw an error if the fetch operation fails or the response is not OK.
 */
export async function placeBid(amount) {
  if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
    throw new Error("Invalid bid amount. Must be a positive number.");
  }

  const listingID = getIDFromURL("listingID");
  if (!listingID) {
    throw new Error("Invalid listing ID. Unable to place bid.");
  }

  const myHeaders = await headers();
  const requestBody = JSON.stringify({ amount });

  try {
    const response = await fetch(`${API_AUCTION_LISTING}/${listingID}/bids`, {
      method: "POST",
      headers: myHeaders,
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to place bid: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log("Bid placed successfully:", result);
    return result;
  } catch (error) {
    console.error("Error placing bid:", error);
    throw error;
  }
}
