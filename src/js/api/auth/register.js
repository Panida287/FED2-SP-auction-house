import { API_AUTH_REGISTER } from "../constants";

/**
 * Registers a new user by sending a POST request to the registration API.
 *
 * @async
 * @param {Object} userData - The user data object containing registration details.
 * @param {string} userData.name - The name of the user.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The password for the user's account.
 * @param {string} userData.repeatPassword - The repeated password for confirmation.
 * @param {string} [userData.avatar] - Optional URL for the user's profile avatar image.
 * @param {string} [userData.banner] - Optional URL for the user's profile banner image.
 * @returns {Promise<void>} Resolves if registration is successful, otherwise handles errors.
 */
export async function register({
  name,
  email,
  password,
  repeatPassword,
  avatar,
  banner,
}) {
  const errorDiv = document.querySelector(".error-msg");
  const successDiv = document.querySelector(".register-success");

  errorDiv.textContent = "";

  if (password !== repeatPassword) {
    errorDiv.textContent = "Passwords do not match.";
    return;
  }

  const userInput = {
    name,
    email,
    password,
    ...(avatar && {
      avatar: {
        url: avatar,
        alt: `${name}'s profile picture`,
      },
    }),
    ...(banner && {
      banner: {
        url: banner,
        alt: `${name}'s profile banner`,
      },
    }),
  };

  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage =
        result.errors?.[0]?.message || "Unknown error occurred.";
      errorDiv.textContent = errorMessage;
      return;
    }

    successDiv.classList.remove("hidden");
    successDiv.classList.add("flex");
  } catch {
    errorDiv.textContent = "An unexpected error occurred. Please try again.";
  }
}
