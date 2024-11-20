/**
 * Registers a new user by sending a POST request to the registration API.
 *
 * @async
 * @param {Object} userData - The user data object containing registration details.
 * @param {string} userData.name - The name of the user.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The password for the user's account.
 * @param {string} [userData.bio] - Optional bio for the user's profile.
 * @param {string} [userData.banner] - Optional URL for the user's profile banner image.
 * @param {string} [userData.avatar] - Optional URL for the user's profile avatar image.
 */
import { API_AUTH_REGISTER } from "../constants";

export async function register({
  name,
  email,
  password,
  repeatPassword,
  avatar,
  banner,
}) {
  const errorDiv = document.querySelector(".error-msg"); // Get the error div
  const successDiv = document.querySelector(".register-success"); // Get the success div
  errorDiv.textContent = ""; // Clear previous errors

  // Validate if passwords match
  if (password !== repeatPassword) {
    errorDiv.textContent = "Passwords do not match.";
    return; // Exit the function if validation fails
  }

  // Prepare user input
  const userInput = {
    name,
    email,
    password,
  };

  // Add avatar and banner only if they are provided and valid
  if (avatar) {
    userInput.avatar = {
      url: avatar,
      alt: `${name}'s profile picture`,
    };
  }

  if (banner) {
    userInput.banner = {
      url: banner,
      alt: `${name}'s profile banner`,
    };
  }

  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput), // Ensure `userInput` is always an object
    });

    const result = await response.json();

    if (!response.ok) {
      // Check for specific error messages in the response
      const errorMessage =
        result.errors && result.errors.length > 0
          ? result.errors[0].message
          : "Unknown error occurred.";
      errorDiv.textContent = `${errorMessage}`;
      return;
    }

    // Registration successful, display the success message
    successDiv.classList.remove("hidden"); // Remove hidden class
    successDiv.classList.add("flex"); // Add the flex class to show the success div
  } catch (error) {
    console.error("Error:", error);
    errorDiv.textContent = "An unexpected error occurred. Please try again.";
  }
}
