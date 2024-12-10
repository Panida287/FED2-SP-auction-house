import { API_PROFILES} from "../constants";
import { loggedInHeaders } from "../headers";

/**
 * Fetch a specific user's profile by username.
 * 
 * This function sends a GET request to retrieve a user's profile data by their username.
 * 
 * @async
 * @param {string} userName - The username of the profile to be retrieved.
 * @returns {Promise<Object>} A promise that resolves with the user's profile data, or throws an error if the request fails.
 * 
 * @throws Will throw an error if the network request fails or the server response is not ok.
 */

export async function readProfile(userName) {
    const myHeaders = await loggedInHeaders();

    try {
        const response = await fetch(`${API_PROFILES}/${userName}`, {
            method: "GET",
            headers: myHeaders,
        });
        const result = await response.json();

        if (response.ok) {
            return result;
        } else {
            console.error(result);
            throw new Error(`Failed to fetch profile: ${result.message}`);
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}
