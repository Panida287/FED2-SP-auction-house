import { headers } from "../headers";
import { API_AUCTION_LISTING } from "../constants";

/**
 * Fetches a list of auction listings with optional filtering by tag and pagination support.
 *
 * @async
 * @function readListings
 * @param {number} [limit=12] - The number of listings to fetch per page.
 * @param {number} [page=1] - The page number to fetch.
 * @param {string} [tag] - The tag to filter listings by (e.g., "Clothes", "Games").
 * @returns {Promise<Object>} A promise that resolves with the fetched listings data.
 * @throws {Error} Will throw an error if the fetch operation fails or the response is not OK.
 */
export async function readListings(limit = 12, page = 1, tag = null, sortByBids = false) {
  const myHeaders = await headers();
  const params = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    _seller: "true",
    _bids: "true",
    _active: "true", // Always fetch active listings
  });

  if (tag) {
    params.append("_tag", tag);
  }

  try {
    const response = await fetch(`${API_AUCTION_LISTING}?${params.toString()}`, {
      method: "GET",
      headers: myHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const result = await response.json();

    // Sort by bids if the flag is set
    if (sortByBids) {
      result.data.sort((a, b) => b._count.bids - a._count.bids);
    }

    return result;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}




/**
 * Fetches a single auction listing based on its ID from the URL.
 *
 * @async
 * @function readListing
 * @returns {Promise<Object>} A promise that resolves with the fetched listing data.
 * @throws {Error} Will throw an error if the fetch operation fails or the response is not OK.
 */
export async function readListing() {
  const listingID = getIDFromURL("listingID");
  const myHeaders = await headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const response = await fetch(
      `${API_AUCTION_LISTING}/${listingID}?_seller=true&_bids=true`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("API Response:", result);
    return result.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

/**
 * Fetches all auction listings created by a specific user.
 *
 * @async
 * @function readListingsByUser
 * @param {number} [limit=12] - The number of listings to fetch per page.
 * @param {number} [page=1] - The page number to fetch.
 * @param {string} username - The username of the user whose listings are to be fetched.
 * @returns {Promise<Object>} A promise that resolves with the fetched listings data.
 * @throws {Error} Will throw an error if the fetch operation fails or the response is not OK.
 */
export async function readListingsByUser(limit = 12, page = 1, username) {
  const myHeaders = await headers();

  try {
    const response = await fetch(`${API_AUCTION_LISTING}/${username}/listings`, {
      method: "GET",
      headers: myHeaders,
    });
    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      console.error(result);
      throw new Error(`Failed to fetch listings: ${result.message}`);
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

/**
 * Fetches all bids made by a specific user.
 *
 * @async
 * @function readAllBidsByUser
 * @param {number} [limit=12] - The number of bids to fetch per page.
 * @param {number} [page=1] - The page number to fetch.
 * @param {string} username - The username of the user whose bids are to be fetched.
 * @returns {Promise<Object>} A promise that resolves with the fetched bids data.
 * @throws {Error} Will throw an error if the fetch operation fails or the response is not OK.
 */
export async function readAllBidsByUser(limit = 12, page = 1, username) {
  const myHeaders = await headers();

  try {
    const response = await fetch(`${API_AUCTION_LISTING}/${username}/bids`, {
      method: "GET",
      headers: myHeaders,
    });
    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      console.error(result);
      throw new Error(`Failed to fetch bids: ${result.message}`);
    }
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }
}

/**
 * Fetches all auction wins by a specific user.
 *
 * @async
 * @function readAllWinsByUser
 * @param {number} [limit=12] - The number of wins to fetch per page.
 * @param {number} [page=1] - The page number to fetch.
 * @param {string} username - The username of the user whose wins are to be fetched.
 * @returns {Promise<Object>} A promise that resolves with the fetched wins data.
 * @throws {Error} Will throw an error if the fetch operation fails or the response is not OK.
 */
export async function readAllWinsByUser(limit = 12, page = 1, username) {
  const myHeaders = await headers();

  try {
    const response = await fetch(`${API_AUCTION_LISTING}/${username}/wins`, {
      method: "GET",
      headers: myHeaders,
    });
    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      console.error(result);
      throw new Error(`Failed to fetch wins: ${result.message}`);
    }
  } catch (error) {
    console.error("Error fetching wins:", error);
    throw error;
  }
}


/**
 * Searches listings by title or description.
 *
 * @async
 * @param {string} query - The search query.
 * @param {number} [limit=12] - The number of listings to fetch per page.
 * @param {number} [page=1] - The page number to fetch.
 * @returns {Promise<Object>} The API response containing the listings and meta data.
 */
export async function searchListings(query, limit = 12, page = 1) {
  const myHeaders = await headers();
  const params = new URLSearchParams({
    q: query,
    limit: limit.toString(),
    page: page.toString(),
  });

  try {
    const response = await fetch(`${API_AUCTION_LISTING}/search?${params.toString()}`, {
      method: "GET",
      headers: myHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to search listings: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching listings:", error);
    throw error;
  }
}