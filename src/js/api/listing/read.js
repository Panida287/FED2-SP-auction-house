import { headers, loggedInHeaders } from "../headers";
import { API_AUCTION_LISTING, API_PROFILES } from "../constants";
import { getIDFromURL } from "../../utilities/urlIDUtils";

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
export async function readListings(tag = null, sortByBids = false, sortByEnding = false) {
  const myHeaders = await headers();
  const params = new URLSearchParams({
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

    if (sortByBids) {
      // Sort by number of bids (descending)
      result.data.sort((a, b) => b._count.bids - a._count.bids);
    } else if (sortByEnding) {
      // Sort by ending date (end soon first)
      result.data.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
    } else {
      // Sort by creation date (newest first)
      result.data.sort((a, b) => new Date(b.created) - new Date(a.created));
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
/* eslint-disable no-unused-vars */
export async function readListingsByUser(limit = 12, page = 1, username) {
  const myHeaders = await headers();
/* eslint-enable no-unused-vars */
  try {
    const response = await fetch(`${API_PROFILES}/${username}/listings`, {
      method: "GET",
      headers: myHeaders,
    });
    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      throw new Error(`Failed to fetch listings: ${result.message}`);
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

/**
 * Fetches all bids or wins made by a specific user.
 *
 * @async
 * @function readUserBidsWins
 * @param {string} type - The type of data to fetch (`bids` or `wins`).
 * @param {number} [limit=12] - The number of items to fetch per page.
 * @param {number} [page=1] - The page number to fetch.
 * @param {string} username - The username of the user whose data is to be fetched.
 * @returns {Promise<Object>} A promise that resolves with the fetched data.
 * @throws {Error} Will throw an error if the fetch operation fails or the response is not OK.
 */
export async function readUserBidsWins(type, limit = 12, page = 1, username) {
  const myHeaders = await loggedInHeaders();

  const params = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    _listings: "true", // Add the `_listings=true` flag
  });

  try {
    const response = await fetch(
      `${API_PROFILES}/${username}/${type}?${params.toString()}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    );

    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      throw new Error(`Failed to fetch ${type}: ${result.message}`);
    }
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
}

/**
 * Searches listings for a specific query.
 *
 * @async
 * @function searchListings
 * @param {string} query - The search query.
 * @returns {Promise<Object>} A promise that resolves with the filtered listings data.
 * @throws {Error} Will throw an error if the fetch operation fails or the response is not OK.
 */
export async function searchListings(query) {
  const myHeaders = await headers();
  const params = new URLSearchParams({
    _bids: "true",
    _seller: "true",
    _active: "true",
  });

  try {
    const response = await fetch(`${API_AUCTION_LISTING}?${params.toString()}`, {
      method: "GET",
      headers: myHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to search listings: ${response.statusText}`);
    }

    const result = await response.json();

    // Escape and sanitize query
    const sanitizedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Create a regex with word boundaries to match the exact word
    const regex = new RegExp(`\\b${sanitizedQuery}\\b`, "i"); // Match whole word only

    // Filter results based on title or description and exclude ended listings
    const filteredData = result.data.filter((listing) => {
      const matchesTitle = regex.test(listing.title);
      const matchesDescription = regex.test(listing.description);
      const isActive = new Date(listing.endsAt) > new Date();

      return (matchesTitle || matchesDescription) && isActive;
    });

    return { data: filteredData };
  } catch (error) {
    console.error("Error searching listings:", error);
    throw error;
  }
}
