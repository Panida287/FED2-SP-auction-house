import { API_PROFILES } from "../constants";
import { loggedInHeaders } from "../headers";

/**
 * Fetches the profile of a specific user by username.
 *
 * @async
 * @function readProfile
 * @param {string} userName - The username of the user whose profile is to be fetched.
 * @returns {Promise<Object>} Resolves with the user's profile data.
 * @throws {Error} Throws an error if the network request fails or the response is not OK.
 */
export async function readProfile(userName) {
  const myHeaders = await loggedInHeaders();

  try {
    const response = await fetch(`${API_PROFILES}/${userName}`, {
      method: "GET",
      headers: myHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch profile.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error fetching profile.");
  }
}
