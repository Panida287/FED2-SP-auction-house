import { API_PROFILES } from "../../api/constants";
import { loggedInHeaders } from "../../api/headers";

/**
 * Handles the Edit Profile functionality, including image preview, submit, and cancel.
 *
 * This function allows the user to edit their profile by updating their avatar 
 * and banner images. Users can preview the images as they input the URLs, 
 * cancel the edit operation, or submit the form to save the changes. The 
 * updated data is sent to the API via a PUT request, and upon success, 
 * the page is reloaded to reflect the changes.
 *
 * @function editProfile
 * @async
 *
 * @description
 * - Allows users to preview avatar and banner image URLs in real-time.
 * - Submits the updated avatar and banner URLs to the API when the form is submitted.
 * - Provides a cancel button to abort the editing process and reset the input fields.
 * - Reloads the page on successful profile update to reflect the changes.
 *
 * @requires API_PROFILES - The API endpoint for user profiles.
 * @requires headers - A function to generate the necessary headers for the API request.
 *
 * @throws Will throw an error if:
 * - The user is not logged in (no `userName` in localStorage).
 * - The API request fails or the server response is not OK.
 *
 * @example
 * // Initialize the Edit Profile functionality
 * editProfile();
 *
 * @returns {void}
 */
export function editProfile() {
  const editProfileContainer = document.getElementById("edit-profile-container");
  const avatarInput = document.getElementById("avatar-url");
  const avatarPreview = document.getElementById("preview-avatar");
  const bannerInput = document.getElementById("banner-url");
  const bannerPreview = document.getElementById("preview-banner");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const form = document.getElementById("edit-profile-form");

  /**
   * Updates the avatar preview when the user enters a URL.
   */
  avatarInput.addEventListener("input", () => {
    const url = avatarInput.value;
    if (url) {
      avatarPreview.src = url;
      avatarPreview.classList.remove("hidden");
    } else {
      avatarPreview.classList.add("hidden");
    }
  });

  /**
   * Updates the banner preview when the user enters a URL.
   */
  bannerInput.addEventListener("input", () => {
    const url = bannerInput.value;
    if (url) {
      bannerPreview.src = url;
      bannerPreview.classList.remove("hidden");
    } else {
      bannerPreview.classList.add("hidden");
    }
  });

  /**
   * Handles the cancel button click event.
   * - Hides the Edit Profile container.
   * - Resets the input fields and previews.
   */
  cancelBtn.addEventListener("click", () => {
    editProfileContainer.classList.add("hidden");
    avatarInput.value = "";
    bannerInput.value = "";
    avatarPreview.classList.add("hidden");
    bannerPreview.classList.add("hidden");
  });

  /**
   * Submits the updated avatar and banner data to the API.
   * - Validates the user's login status.
   * - Sends a PUT request to the API with the updated data.
   * - Displays an alert and reloads the page on success.
   *
   * @async
   * @param {Event} event - The form submission event.
   */
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const userName = localStorage.getItem("userName"); // Get the username from localStorage
    if (!userName) {
      console.error("User not logged in");
      return;
    }

    const avatarUrl = avatarInput.value;
    const bannerUrl = bannerInput.value;

    // Construct the API request body
    const requestBody = {
      avatar: avatarUrl ? { url: avatarUrl, alt: "User's Avatar" } : undefined,
      banner: bannerUrl ? { url: bannerUrl, alt: "User's Banner" } : undefined,
    };

    try {
      const myHeaders = await loggedInHeaders();
      const response = await fetch(`${API_PROFILES}/${userName}`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData.message);
        alert("Failed to update profile. Please try again.");
        return;
      }

      const result = await response.json();
      console.log("Profile updated successfully:", result);

      // Hide the Edit Profile container and reset inputs
      editProfileContainer.classList.add("hidden");
      avatarInput.value = "";
      bannerInput.value = "";
      avatarPreview.classList.add("hidden");
      bannerPreview.classList.add("hidden");

      alert("Profile updated successfully!");
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error submitting profile update:", error);
      alert("An error occurred while updating the profile.");
    }
  });
}
