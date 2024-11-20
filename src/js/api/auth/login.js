import { API_AUTH_LOGIN } from "../constants";
import { headers } from "../headers";

/**
 * Logs in a user by sending a POST request with email and password to the login API with API key.
 * After a successful login, the accessToken from the response is stored in local storage.
 *
 * @async
 * @param {Object} userCredentials - An object containing the user's login credentials.
 * @param {string} userCredentials.email - The user's email address.
 * @param {string} userCredentials.password - The user's password.
 *
 * @returns {Promise<Object>} A promise that resolves with the server's response in JSON format,
 * or an object containing an error message if the login fails.
 *
 * @throws {Error} Will throw an error if the API request fails or the response is not ok.
 */
export async function login({ email, password }) {
  const errorDiv = document.querySelector(".error-msg"); // Define errorDiv at the top

  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json(); // Parse the response body only once

    if (!response.ok) {
      // Check for specific error messages in the response
      const errorMsg =
        result.errors && result.errors.length > 0
          ? result.errors[0].message
          : "Unknown error occurred.";
      errorDiv.textContent = `${errorMsg}`;
      return; // Exit the function if login fails
    }

    // If successful, store the accessToken and userName in localStorage
    if (result.data?.accessToken) {
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("userName", result.data.name);
    }

    return result; // Return the result if login is successful
  } catch (error) {
    console.error("Error during API login:", error);
    if (errorDiv) {
      errorDiv.textContent = "An unexpected error occurred. Please try again.";
    }
  }
}
