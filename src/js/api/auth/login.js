import { API_AUTH_LOGIN } from "../constants";
import { headers } from "../headers";

/**
 * Logs in a user by sending credentials to the login API and stores the access token on success.
 *
 * @async
 * @param {Object} userCredentials - User's login credentials.
 * @param {string} userCredentials.email - The user's email address.
 * @param {string} userCredentials.password - The user's password.
 * @returns {Promise<Object>} Resolves with server response if successful, otherwise displays an error.
 */
export async function login({ email, password }) {
  const errorDiv = document.querySelector(".error-msg");

  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg =
        result.errors?.[0]?.message || "Unknown error occurred.";
      if (errorDiv) errorDiv.textContent = errorMsg;
      return;
    }

    if (result.data?.accessToken) {
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("userName", result.data.name);
    }

    return result;
  } catch (error) {
    console.error("Error during API login:", error);
    if (errorDiv) {
      errorDiv.textContent = "An unexpected error occurred. Please try again.";
    }
  }
}
